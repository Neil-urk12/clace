import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SharedEventItem } from "../types/event";
import { EventService } from "../services/eventService";

/**
 * @typedef {'Upcoming' | 'Recent'} PrimaryFilter
 * @typedef {'All' | 'Today' | 'NextWeek' | 'NextMonth' | 'EarlierToday' | 'PastWeek' | 'PastMonth'} SecondaryFilter
 */

/**
 * Pinia store for managing events.
 *
 * @returns {object} The event store with its state, getters, and actions.
 */
export const useEventStore = defineStore("eventStore", () => {
  /**
   * Reactive reference to an array of shared event items.
   * @type {import('../types/event').SharedEventItem[]}
   */
  const events = ref<SharedEventItem[]>([
    {
      id: "sample-event-1",
      title: "Team Sync Meeting",
      description: "Weekly team synchronization meeting.",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1,
        10,
        0,
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1,
        11,
        0,
      ),
      allDay: false,
      type: "ClassSession",
      subject: "Project Alpha",
      course: "CS500",
      status: "Scheduled",
      location: "Online Conference Room",
      color: "#3b82f6",
    },
    {
      id: "sample-event-2",
      title: "Project Deadline",
      description: "Final submission for Project Beta.",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 3,
        23,
        59,
      ),
      allDay: true,
      type: "Project",
      subject: "Project Beta",
      course: "CS501",
      status: "Pending",
      color: "#ef4444",
    },
    {
      id: "sample-event-3",
      title: "Quiz 2",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 7,
        14,
        0,
      ),
      allDay: false,
      type: "Quiz",
      subject: "Data Structures",
      course: "CS201",
      status: "Scheduled",
      location: "Room 101",
      color: "#f97316",
    },
    {
      id: "sample-event-7",
      title: "Project Deadline gyat",
      description: "Final submission for Project Beta.",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 3,
        23,
        59,
      ),
      allDay: true,
      type: "Project",
      subject: "Project Gyat",
      course: "CS5012",
      status: "Pending",
      color: "#ef4444",
    },
    {
      id: "sample-event-21",
      title: "Project Deadline",
      description: "Final submission for Project Beta.",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 3,
        23,
        59,
      ),
      allDay: true,
      type: "Project",
      subject: "Project Sigma",
      course: "CS501",
      status: "Pending",
      color: "#ef4444",
    },
    {
      id: "sample-event-4",
      title: "Past Project Meeting",
      description: "Discussed initial phase of Project Gamma.",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 2,
        14,
        0,
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 2,
        15,
        0,
      ),
      allDay: false,
      type: "ClassSession",
      subject: "Project Gamma",
      course: "CS600",
      status: "Completed",
      location: "Online Conference Room",
      color: "#a855f7",
    },
    {
      id: "sample-event-5",
      title: "Past Assignment Due",
      description: "Submission for Assignment 1.",
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 10,
        23,
        59,
      ),
      allDay: true,
      type: "Assignment",
      subject: "Data Structures",
      course: "CS201",
      status: "Completed",
      color: "#22c55e",
    },
  ]);

  /**
   * Reactive reference for the active primary filter ('Upcoming' or 'Recent').
   * @type {PrimaryFilter}
   */
  const activePrimaryFilter = ref<"Upcoming" | "Recent">("Upcoming");
  /**
   * Reactive reference for the active secondary filter (e.g., 'All', 'Today', 'NextWeek').
   * @type {SecondaryFilter}
   */
  const activeSecondaryFilter = ref<string>("All");
  /**
   * Reactive reference for the search query string.
   * @type {string}
   */
  const searchQuery = ref<string>("");

  /**
   * Returns a new Date object set to the start of the day (00:00:00:000) for the given date.
   * @param {Date} date - The date to get the start of the day for.
   * @returns {Date} A new Date object representing the start of the day.
   */
  const getStartOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  /**
   * Checks if the given date is today.
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is today, false otherwise.
   */
  const isToday = (date: Date): boolean => {
    const today = getStartOfDay(new Date());
    return getStartOfDay(date).getTime() === today.getTime();
  };

  /**
   * Checks if the event date is earlier than the reference date but on the same day.
   * @param {Date} eventDate - The event date to check.
   * @param {Date} [referenceDate=new Date()] - The reference date (defaults to current date).
   * @returns {boolean} True if the event date is earlier today, false otherwise.
   */
  const isEarlierToday = (
    eventDate: Date,
    referenceDate: Date = new Date(),
  ): boolean => {
    return (
      getStartOfDay(eventDate).getTime() ===
        getStartOfDay(referenceDate).getTime() &&
      new Date(eventDate).getTime() < referenceDate.getTime()
    );
  };

  /**
   * Checks if the given date falls within the next calendar week (Sunday to Saturday) relative to today.
   * The "next week" starts on the first Sunday after the current week's Saturday.
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is in the next week, false otherwise.
   */
  const isNextWeek = (date: Date): boolean => {
    const today = getStartOfDay(new Date());
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + ((7 - today.getDay()) % 7));
    if (nextWeekStart.getTime() <= today.getTime()) {
      nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    }

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    const eventDate = getStartOfDay(date);
    return (
      eventDate.getTime() >= nextWeekStart.getTime() &&
      eventDate.getTime() <= nextWeekEnd.getTime()
    );
  };

  /**
   * Checks if the given date falls within the next calendar month.
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is in the next month, false otherwise.
   */
  const isNextMonth = (date: Date): boolean => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let nextMonthValue;
    let yearOfNextMonth;

    if (currentMonth === 11) {
      nextMonthValue = 0;
      yearOfNextMonth = currentYear + 1;
    } else {
      nextMonthValue = currentMonth + 1;
      yearOfNextMonth = currentYear;
    }

    const eventDate = getStartOfDay(date);
    return (
      eventDate.getMonth() === nextMonthValue &&
      eventDate.getFullYear() === yearOfNextMonth
    );
  };

  /**
   * Checks if the event date falls within the past week (7 days prior to reference date, excluding reference date).
   * @param {Date} eventDate - The event date to check.
   * @param {Date} [referenceDate=new Date()] - The reference date (defaults to current date).
   * @returns {boolean} True if the event date is in the past week, false otherwise.
   */
  const isPastWeek = (
    eventDate: Date,
    referenceDate: Date = new Date(),
  ): boolean => {
    const today = getStartOfDay(referenceDate);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    return (
      getStartOfDay(eventDate).getTime() >= oneWeekAgo.getTime() &&
      getStartOfDay(eventDate).getTime() < today.getTime()
    );
  };

  /**
   * Checks if the event date falls within the past month (relative to reference date, excluding reference date).
   * @param {Date} eventDate - The event date to check.
   * @param {Date} [referenceDate=new Date()] - The reference date (defaults to current date).
   * @returns {boolean} True if the event date is in the past month, false otherwise.
   */
  const isPastMonth = (
    eventDate: Date,
    referenceDate: Date = new Date(),
  ): boolean => {
    const today = getStartOfDay(referenceDate);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return (
      getStartOfDay(eventDate).getTime() >= oneMonthAgo.getTime() &&
      getStartOfDay(eventDate).getTime() < today.getTime()
    );
  };

  /**
   * Computed property that returns a function to find an event by its ID.
   * @returns {(id: string) => import('../types/event').SharedEventItem | undefined} A function that takes an event ID and returns the matching event or undefined.
   */
  const getEventById = computed(
    () =>
      (id: string): SharedEventItem | undefined => {
        return events.value.find((event) => event.id === id);
      },
  );

  /**
   * Computed property that returns all events.
   * @returns {import('../types/event').SharedEventItem[]} An array of all events.
   */
  const allEvents = computed((): SharedEventItem[] => {
    return events.value;
  });

  /**
   * Computed property that returns events scheduled from today onwards, sorted by start date.
   * @returns {import('../types/event').SharedEventItem[]} An array of upcoming events.
   */
  const upcomingEvents = computed((): SharedEventItem[] => {
    const now = new Date();

    return events.value
      .filter(
        (event) => event.startDate.getTime() >= getStartOfDay(now).getTime(),
      )
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  });

  /**
   * Computed property that returns events that have already started or are earlier today, sorted by start date in descending order.
   * @returns {import('../types/event').SharedEventItem[]} An array of recent events.
   */
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

  /**
   * Computed property that returns events filtered by primary filter (Upcoming/Recent),
   * secondary filter (e.g., Today, NextWeek, PastMonth), and search query.
   * @returns {import('../types/event').SharedEventItem[]} An array of filtered events.
   */
  const filteredEvents = computed((): SharedEventItem[] => {
    const now = new Date();
    const source =
      activePrimaryFilter.value === "Upcoming"
        ? upcomingEvents.value
        : recentEvents.value;
    const query = searchQuery.value.toLowerCase();

    let filteredBySecondary = source;
    if (activePrimaryFilter.value === "Upcoming") {
      switch (activeSecondaryFilter.value) {
        case "Today":
          filteredBySecondary = source.filter((activity) =>
            isToday(activity.startDate),
          );
          break;
        case "NextWeek":
          filteredBySecondary = source.filter((activity) =>
            isNextWeek(activity.startDate),
          );
          break;
        case "NextMonth":
          filteredBySecondary = source.filter((activity) =>
            isNextMonth(activity.startDate),
          );
          break;
        case "All":
        default:
          filteredBySecondary = source;
      }
    } else {
      switch (activeSecondaryFilter.value) {
        case "EarlierToday":
          filteredBySecondary = source.filter((activity) =>
            isEarlierToday(activity.startDate, now),
          );
          break;
        case "PastWeek":
          filteredBySecondary = source.filter((activity) =>
            isPastWeek(activity.startDate, now),
          );
          break;
        case "PastMonth":
          filteredBySecondary = source.filter((activity) =>
            isPastMonth(activity.startDate, now),
          );
          break;
        case "All":
        default:
          filteredBySecondary = source;
      }
    }

    if (query) {
      return filteredBySecondary.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.description &&
            event.description.toLowerCase().includes(query)) ||
          (event.subject && event.subject.toLowerCase().includes(query)) ||
          (event.course && event.course.toLowerCase().includes(query)) ||
          (event.location && event.location.toLowerCase().includes(query)) ||
          event.type.toLowerCase().includes(query) ||
          (event.status && event.status.toLowerCase().includes(query)),
      );
    } else {
      return filteredBySecondary;
    }
  });

  /**
   * Computed property that calculates the counts for each secondary filter based on the active primary filter.
   * @returns {object} An object containing counts for 'All', 'Today', 'NextWeek', 'NextMonth', 'EarlierToday', 'PastWeek', 'PastMonth'.
   */
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
        Today: upcomingSource.filter((activity) => isToday(activity.startDate))
          .length,
        NextWeek: upcomingSource.filter((activity) =>
          isNextWeek(activity.startDate),
        ).length,
        NextMonth: upcomingSource.filter((activity) =>
          isNextMonth(activity.startDate),
        ).length,
      };
    } else {
      return {
        ...defaultCounts,
        All: recentSource.length,
        EarlierToday: recentSource.filter((activity) =>
          isEarlierToday(activity.startDate, now),
        ).length,
        PastWeek: recentSource.filter((activity) =>
          isPastWeek(activity.startDate, now),
        ).length,
        PastMonth: recentSource.filter((activity) =>
          isPastMonth(activity.startDate, now),
        ).length,
      };
    }
  });

  /**
   * Adds a new event to the store via API and updates local state.
   * @param {Omit<import('../types/event').SharedEventItem, 'id'>} eventData - The event data without an ID.
   */
  async function addEvent(eventData: Omit<SharedEventItem, "id">) {
    try {
      const newEvent = await EventService.createEvent(eventData);
      events.value.push(newEvent);
      return newEvent;
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  }

  /**
   * Updates an existing event in the store via API and updates local state.
   * @param {import('../types/event').SharedEventItem} updatedEvent - The updated event object.
   */
  async function updateEvent(updatedEvent: SharedEventItem) {
    try {
      const updated = await EventService.updateEvent(updatedEvent);
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

  /**
   * Deletes an event from the store by its ID via API and updates local state.
   * @param {string} eventId - The ID of the event to delete.
   */
  async function deleteEvent(eventId: string) {
    try {
      await EventService.deleteEvent(eventId);
      events.value = events.value.filter((event) => event.id !== eventId);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }

  /**
   * Loads events from the API or uses provided sample events.
   * @param {import('../types/event').SharedEventItem[]} [sampleEvents] - Optional array of events to load instead of fetching from API.
   * @param {boolean} [useSampleData=false] - Whether to use sample data instead of API.
   */
  async function loadEvents(sampleEvents?: SharedEventItem[], useSampleData: boolean = false) {
    try {
      if (sampleEvents) {
        events.value = sampleEvents;
      } else if (useSampleData) {
        // Load default sample events for development/testing
        const now = new Date();
        events.value = [
          {
            id: "sample-event-1",
            title: "Team Sync Meeting",
            description: "Weekly team synchronization meeting.",
            startDate: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 1,
              10,
              0,
            ),
            endDate: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 1,
              11,
              0,
            ),
            allDay: false,
            type: "ClassSession",
            subject: "Project Alpha",
            course: "CS500",
            status: "Scheduled",
            location: "Online Conference Room",
            color: "#3b82f6",
          },
          {
            id: "sample-event-2",
            title: "Project Deadline",
            description: "Final submission for Project Beta.",
            startDate: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 3,
              23,
              59,
            ),
            allDay: true,
            type: "Project",
            subject: "Project Beta",
            course: "CS501",
            status: "Pending",
            color: "#ef4444",
          },
          {
            id: "sample-event-3",
            title: "Quiz 2",
            startDate: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 7,
              14,
              0,
            ),
            allDay: false,
            type: "Quiz",
            subject: "Data Structures",
            course: "CS201",
            status: "Scheduled",
            location: "Room 101",
            color: "#f97316",
          },
          {
            id: "sample-event-4",
            title: "Past Project Meeting",
            description: "Discussed initial phase of Project Gamma.",
            startDate: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 2,
              14,
              0,
            ),
            endDate: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 2,
              15,
              0,
            ),
            allDay: false,
            type: "ClassSession",
            subject: "Project Gamma",
            course: "CS600",
            status: "Completed",
            location: "Online Conference Room",
            color: "#a855f7",
          },
          {
            id: "sample-event-5",
            title: "Past Assignment Due",
            description: "Submission for Assignment 1.",
            startDate: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 10,
              23,
              59,
            ),
            allDay: true,
            type: "Assignment",
            subject: "Data Structures",
            course: "CS201",
            status: "Completed",
            color: "#22c55e",
          },
        ];
      } else {
        // Fetch events from API
        const fetchedEvents = await EventService.getAllEvents();
        events.value = fetchedEvents;
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      // Fallback to empty array or show error state
      events.value = [];
      throw error;
    }
  }

  /**
   * Replaces all current events in the store with a new array of events.
   * @param {import('../types/event').SharedEventItem[]} newEvents - The new array of events to set.
   */
  function setEvents(newEvents: SharedEventItem[]) {
    events.value = newEvents;
  }

  /**
   * Sets the search query string.
   * @param {string} query - The search query.
   */
  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  /**
   * Sets the active primary filter and resets the secondary filter to 'All'.
   * @param {PrimaryFilter} filter - The primary filter to set ('Upcoming' or 'Recent').
   */
  function setActivePrimaryFilter(filter: "Upcoming" | "Recent") {
    activePrimaryFilter.value = filter;
    activeSecondaryFilter.value = "All";
  }

  /**
   * Sets the active secondary filter.
   * @param {SecondaryFilter} filter - The secondary filter to set (e.g., 'All', 'Today', 'NextWeek').
   */
  function setActiveSecondaryFilter(filter: string) {
    activeSecondaryFilter.value = filter;
  }

  /**
   * Refreshes events from the API.
   */
  async function refreshEvents() {
    try {
      const fetchedEvents = await EventService.getAllEvents();
      events.value = fetchedEvents;
      return fetchedEvents;
    } catch (error) {
      console.error('Failed to refresh events:', error);
      throw error;
    }
  }

  /**
   * Syncs events with external sources via API.
   */
  async function syncEvents() {
    try {
      const syncedEvents = await EventService.syncEvents();
      events.value = syncedEvents;
      return syncedEvents;
    } catch (error) {
      console.error('Failed to sync events:', error);
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
    setEvents,
    setSearchQuery,
    setActivePrimaryFilter,
    setActiveSecondaryFilter,
    refreshEvents,
    syncEvents,
  };
});
