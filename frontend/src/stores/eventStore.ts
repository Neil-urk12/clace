import { defineStore } from 'pinia';
import type { SharedEventItem } from '@/types/event'; // Adjusted import path

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    events: [
      {
        id: 'sample-event-1',
        title: 'Team Sync Meeting',
        description: 'Weekly team synchronization meeting.',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 10, 0), // Tomorrow 10 AM
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 11, 0),   // Tomorrow 11 AM
        allDay: false,
        type: 'ClassSession',
        subject: 'Project Alpha',
        course: 'CS500',
        status: 'Scheduled',
        location: 'Online Conference Room',
        color: '#3b82f6' // Blue
      },
      {
        id: 'sample-event-2',
        title: 'Project Deadline',
        description: 'Final submission for Project Beta.',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 23, 59), // 3 days from now, end of day
        allDay: true,
        type: 'Project',
        subject: 'Project Beta',
        course: 'CS501',
        status: 'Pending',
        color: '#ef4444' // Red
      },
      {
        id: 'sample-event-3',
        title: 'Quiz 2',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7, 14, 0), // Next week, 2 PM
        allDay: false,
        type: 'Quiz',
        subject: 'Data Structures',
        course: 'CS201',
        status: 'Scheduled',
        location: 'Room 101',
        color: '#f97316' // Orange
      }
    ] as SharedEventItem[],
  }),
  getters: {
    getEventById: (state) => (id: string): SharedEventItem | undefined => {
      return state.events.find(event => event.id === id);
    },
    allEvents: (state): SharedEventItem[] => {
      return state.events;
    },
    upcomingEvents: (state): SharedEventItem[] => {
      const now = new Date();
      return state.events
        .filter(event => event.startDate >= now)
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    },
    eventsToday: (state): SharedEventItem[] => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return state.events.filter(event => event.startDate >= today && event.startDate < tomorrow);
    },
    eventsNextWeek: (state): SharedEventItem[] => {
      const today = new Date();
      const nextWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()) % 7 + 1);
      nextWeekStart.setHours(0,0,0,0);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
      return state.events.filter(event => event.startDate >= nextWeekStart && event.startDate < nextWeekEnd);
    },
    eventsNextMonth: (state): SharedEventItem[] => {
        const today = new Date();
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        nextMonthStart.setHours(0,0,0,0);
        const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 1);
        return state.events.filter(event => event.startDate >= nextMonthStart && event.startDate < nextMonthEnd);
    }
  },
  actions: {
    addEvent(eventData: Omit<SharedEventItem, 'id'>) {
      const newEvent: SharedEventItem = {
        ...eventData,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // More unique ID
      };
      this.events.push(newEvent);
    },
    updateEvent(updatedEvent: SharedEventItem) {
      const index = this.events.findIndex(event => event.id === updatedEvent.id);
      if (index !== -1) {
        this.events[index] = updatedEvent;
      }
    },
    deleteEvent(eventId: string) {
      this.events = this.events.filter(event => event.id !== eventId);
    },
    loadEvents(sampleEvents?: SharedEventItem[]) { // Allow passing sample events for testing or initial load
      if (sampleEvents) {
        this.events = sampleEvents;
      } else {
        // For now, re-initialize with the default sample data if no specific events are passed.
        // In a real app, this might fetch from a backend or localStorage.
        this.events = [
          {
            id: 'sample-event-1',
            title: 'Team Sync Meeting',
            description: 'Weekly team synchronization meeting.',
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 10, 0),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 11, 0),
            allDay: false,
            type: 'ClassSession',
            subject: 'Project Alpha',
            course: 'CS500',
            status: 'Scheduled',
            location: 'Online Conference Room',
            color: '#3b82f6'
          },
          {
            id: 'sample-event-2',
            title: 'Project Deadline',
            description: 'Final submission for Project Beta.',
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 23, 59),
            allDay: true,
            type: 'Project',
            subject: 'Project Beta',
            course: 'CS501',
            status: 'Pending',
            color: '#ef4444'
          }
        ];
      }
    },
    setEvents(events: SharedEventItem[]) {
      this.events = events;
    },
  },
});
