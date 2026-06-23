import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SharedEventItem } from "../types/event";
import { eventService } from "../services/eventService";
import {
  getStartOfDay,
  isEarlierToday,
  isNextMonth,
  isNextWeek,
  isPastMonth,
  isPastWeek,
  isToday,
} from "../events/datePredicates";
import { applyEventFilters, type EventPrimaryFilter } from "../events/filter";

/**
 * Pinia store for managing events.
 *
 * Date math and filter dispatch live in `@/events/datePredicates` and
 * `@/events/filter`. This store wires reactive state to those pure functions.
 *
 * @returns {object} The event store with its state, getters, and actions.
 */
export const useEventStore = defineStore("eventStore", () => {
  const events = ref<SharedEventItem[]>([]);
  const activePrimaryFilter = ref<EventPrimaryFilter>("Upcoming");
  const activeSecondaryFilter = ref<string>("All");
  const searchQuery = ref<string>("");

  const getEventById = computed(
    () =>
      (id: string): SharedEventItem | undefined => {
        return events.value.find((event) => event.id === id);
      },
  );

  const allEvents = computed((): SharedEventItem[] => {
    return events.value;
  });

  const upcomingEvents = computed((): SharedEventItem[] => {
    const now = new Date();
    return events.value
      .filter(
        (event) => event.startDate.getTime() >= getStartOfDay(now).getTime(),
      )
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  });

  const recentEvents = computed((): SharedEventItem[] => {
    const now = new Date();
    return events.value
      .filter(
        (event) =>
          event.startDate.getTime() < getStartOfDay(now).getTime() ||
          isEarlierToday(event.startDate, now),
      )
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  });

  const filteredEvents = computed((): SharedEventItem[] => {
    const source =
      activePrimaryFilter.value === "Upcoming"
        ? upcomingEvents.value
        : recentEvents.value;
    return applyEventFilters(
      source,
      activePrimaryFilter.value,
      activeSecondaryFilter.value,
      searchQuery.value,
    );
  });

  const secondaryFilterCounts = computed(() => {
    const now = new Date();
    const upcomingSource = upcomingEvents.value;
    const recentSource = recentEvents.value;

    const defaultCounts = {
      All: 0,
      Today: 0,
      NextWeek: 0,
      NextMonth: 0,
      EarlierToday: 0,
      PastWeek: 0,
      PastMonth: 0,
    };

    if (activePrimaryFilter.value === "Upcoming") {
      return {
        ...defaultCounts,
        All: upcomingSource.length,
        Today: upcomingSource.filter((e) => isToday(e.startDate, now)).length,
        NextWeek: upcomingSource.filter((e) => isNextWeek(e.startDate, now)).length,
        NextMonth: upcomingSource.filter((e) => isNextMonth(e.startDate, now)).length,
      };
    }
    return {
      ...defaultCounts,
      All: recentSource.length,
      EarlierToday: recentSource.filter((e) => isEarlierToday(e.startDate, now)).length,
      PastWeek: recentSource.filter((e) => isPastWeek(e.startDate, now)).length,
      PastMonth: recentSource.filter((e) => isPastMonth(e.startDate, now)).length,
    };
  });

  async function addEvent(eventData: Omit<SharedEventItem, "id">) {
    try {
      const newEvent = await eventService.createEvent(eventData);
      events.value.push(newEvent);
      return newEvent;
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  }

  async function updateEvent(updatedEvent: SharedEventItem) {
    try {
      const updated = await eventService.updateEvent(updatedEvent);
      const index = events.value.findIndex(
        (event) => event.id === updatedEvent.id,
      );
      if (index !== -1) {
        events.value[index] = updated;
      }
      return updated;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  }

  async function deleteEvent(eventId: string) {
    try {
      await eventService.deleteEvent(eventId);
      events.value = events.value.filter((event) => event.id !== eventId);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }

  /** Loads events from the API. */
  async function loadEvents() {
    try {
      const fetchedEvents = await eventService.getAllEvents();
      events.value = fetchedEvents;
    } catch (error) {
      console.error('Failed to load events:', error);
      events.value = [];
      throw error;
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function setActivePrimaryFilter(filter: EventPrimaryFilter) {
    activePrimaryFilter.value = filter;
    activeSecondaryFilter.value = "All";
  }

  function setActiveSecondaryFilter(filter: string) {
    activeSecondaryFilter.value = filter;
  }

  /** Refreshes events from the API. */
  async function refreshEvents() {
    try {
      const fetchedEvents = await eventService.getAllEvents();
      events.value = fetchedEvents;
      return fetchedEvents;
    } catch (error) {
      console.error('Failed to refresh events:', error);
      throw error;
    }
  }

  return {
    events,
    activePrimaryFilter,
    activeSecondaryFilter,
    searchQuery,

    getEventById,
    allEvents,
    upcomingEvents,
    recentEvents,
    filteredEvents,
    secondaryFilterCounts,

    addEvent,
    updateEvent,
    deleteEvent,
    loadEvents,
    setSearchQuery,
    setActivePrimaryFilter,
    setActiveSecondaryFilter,
    refreshEvents,
  };
});
