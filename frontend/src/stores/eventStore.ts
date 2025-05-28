import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SharedEventItem } from '../types/event';

export const useEventStore = defineStore('eventStore', () => {
  
  const events = ref<SharedEventItem[]>([
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
    },
    {
      id: 'sample-event-3',
      title: 'Quiz 2',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7, 14, 0), 
      allDay: false,
      type: 'Quiz',
      subject: 'Data Structures',
      course: 'CS201',
      status: 'Scheduled',
      location: 'Room 101',
      color: '#f97316' 
    },
    {
      id: 'sample-event-4',
      title: 'Past Project Meeting',
      description: 'Discussed initial phase of Project Gamma.',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2, 14, 0), 
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2, 15, 0),   
      allDay: false,
      type: 'ClassSession',
      subject: 'Project Gamma',
      course: 'CS600',
      status: 'Completed',
      location: 'Online Conference Room',
      color: '#a855f7' 
    },
     {
      id: 'sample-event-5',
      title: 'Past Assignment Due',
      description: 'Submission for Assignment 1.',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 10, 23, 59), 
      allDay: true,
      type: 'Assignment',
      subject: 'Data Structures',
      course: 'CS201',
      status: 'Completed',
      color: '#22c55e' 
    }
  ]);

  const activePrimaryFilter = ref<'Upcoming' | 'Recent'>('Upcoming');
  const activeSecondaryFilter = ref<string>('All'); 
  const searchQuery = ref<string>(''); 

  
  const getStartOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const isToday = (date: Date): boolean => {
    const today = getStartOfDay(new Date());
    return getStartOfDay(date).getTime() === today.getTime();
  };

   const isEarlierToday = (eventDate: Date, referenceDate: Date = new Date()): boolean => {
    
    return getStartOfDay(eventDate).getTime() === getStartOfDay(referenceDate).getTime() &&
           new Date(eventDate).getTime() < referenceDate.getTime();
  };

  const isNextWeek = (date: Date): boolean => {
    const today = getStartOfDay(new Date());
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + ((7 - today.getDay()) % 7) );
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

  const isPastWeek = (eventDate: Date, referenceDate: Date = new Date()): boolean => {
    const today = getStartOfDay(referenceDate);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    return getStartOfDay(eventDate).getTime() >= oneWeekAgo.getTime() &&
           getStartOfDay(eventDate).getTime() < today.getTime();
  };

  const isPastMonth = (eventDate: Date, referenceDate: Date = new Date()): boolean => {
    const today = getStartOfDay(referenceDate);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    return getStartOfDay(eventDate).getTime() >= oneMonthAgo.getTime() &&
           getStartOfDay(eventDate).getTime() < today.getTime();
  };


  
  const getEventById = computed(() => (id: string): SharedEventItem | undefined => {
    return events.value.find(event => event.id === id);
  });

  const allEvents = computed((): SharedEventItem[] => {
    return events.value;
  });

  const upcomingEvents = computed((): SharedEventItem[] => {
    const now = new Date();
    
    return events.value
      .filter(event => event.startDate.getTime() >= getStartOfDay(now).getTime()) 
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  });

   const recentEvents = computed((): SharedEventItem[] => {
    const now = new Date();
     
    return events.value
      .filter(event => event.startDate.getTime() < getStartOfDay(now).getTime() || isEarlierToday(event.startDate, now))
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()); 
  });


  const filteredEvents = computed((): SharedEventItem[] => {
    const now = new Date();
    const source = activePrimaryFilter.value === 'Upcoming' ? upcomingEvents.value : recentEvents.value;
    const query = searchQuery.value.toLowerCase();

    
    let filteredBySecondary = source;
    if (activePrimaryFilter.value === 'Upcoming') {
      switch (activeSecondaryFilter.value) {
        case 'Today':
          filteredBySecondary = source.filter((activity) => isToday(activity.startDate));
          break;
        case 'NextWeek':
          filteredBySecondary = source.filter((activity) => isNextWeek(activity.startDate));
          break;
        case 'NextMonth':
          filteredBySecondary = source.filter((activity) => isNextMonth(activity.startDate));
          break;
        case 'All':
        default:
          filteredBySecondary = source; 
      }
    } else { 
      switch (activeSecondaryFilter.value) {
        case 'EarlierToday':
          filteredBySecondary = source.filter((activity) => isEarlierToday(activity.startDate, now));
          break;
        case 'PastWeek':
          filteredBySecondary = source.filter((activity) => isPastWeek(activity.startDate, now));
          break;
        case 'PastMonth':
          filteredBySecondary = source.filter((activity) => isPastMonth(activity.startDate, now));
          break;
        case 'All':
        default:
          filteredBySecondary = source; 
      }
    }

    
    if (query) {
      return filteredBySecondary.filter(event =>
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.subject && event.subject.toLowerCase().includes(query)) ||
        (event.course && event.course.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query)) ||
        event.type.toLowerCase().includes(query) ||
        (event.status && event.status.toLowerCase().includes(query))
      );
    } else {
      return filteredBySecondary;
    }
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
      PastMonth: 0
    };

    if (activePrimaryFilter.value === 'Upcoming') {
      return {
        ...defaultCounts,
        All: upcomingSource.length,
        Today: upcomingSource.filter((activity) => isToday(activity.startDate)).length,
        NextWeek: upcomingSource.filter((activity) => isNextWeek(activity.startDate)).length,
        NextMonth: upcomingSource.filter((activity) => isNextMonth(activity.startDate)).length,
      };
    } else { 
      return {
        ...defaultCounts,
        All: recentSource.length,
        EarlierToday: recentSource.filter((activity) => isEarlierToday(activity.startDate, now)).length,
        PastWeek: recentSource.filter((activity) => isPastWeek(activity.startDate, now)).length,
        PastMonth: recentSource.filter((activity) => isPastMonth(activity.startDate, now)).length,
      };
    }
  });

  
  function addEvent(eventData: Omit<SharedEventItem, 'id'>) {
    const newEvent: SharedEventItem = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9), 
    };
    events.value.push(newEvent);
  }

  function updateEvent(updatedEvent: SharedEventItem) {
    const index = events.value.findIndex(event => event.id === updatedEvent.id);
    if (index !== -1) {
      events.value[index] = updatedEvent;
    }
  }

  function deleteEvent(eventId: string) {
    events.value = events.value.filter(event => event.id !== eventId);
  }

  function loadEvents(sampleEvents?: SharedEventItem[]) { 
    if (sampleEvents) {
      events.value = sampleEvents;
    } else {
      const now = new Date();
      events.value = [
        {
          id: 'sample-event-1',
          title: 'Team Sync Meeting',
          description: 'Weekly team synchronization meeting.',
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0), 
          endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),   
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
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 23, 59), 
          allDay: true,
          type: 'Project',
          subject: 'Project Beta',
          course: 'CS501',
          status: 'Pending',
          color: '#ef4444'
        },
         {
          id: 'sample-event-3',
          title: 'Quiz 2',
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 14, 0), 
          allDay: false,
          type: 'Quiz',
          subject: 'Data Structures',
          course: 'CS201',
          status: 'Scheduled',
          location: 'Room 101',
          color: '#f97316' 
        },
        {
          id: 'sample-event-4',
          title: 'Past Project Meeting',
          description: 'Discussed initial phase of Project Gamma.',
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 14, 0), 
          endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 15, 0),   
          allDay: false,
          type: 'ClassSession',
          subject: 'Project Gamma',
          course: 'CS600',
          status: 'Completed',
          location: 'Online Conference Room',
          color: '#a855f7' 
        },
        {
          id: 'sample-event-5',
          title: 'Past Assignment Due',
          description: 'Submission for Assignment 1.',
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10, 23, 59), 
          allDay: true,
          type: 'Assignment',
          subject: 'Data Structures',
          course: 'CS201',
          status: 'Completed',
          color: '#22c55e' 
        }
      ];
    }
  }

  function setEvents(newEvents: SharedEventItem[]) {
    events.value = newEvents;
  }

  function setSearchQuery(query: string) { 
    searchQuery.value = query;
  }

  function setActivePrimaryFilter(filter: 'Upcoming' | 'Recent') {
    activePrimaryFilter.value = filter;
    activeSecondaryFilter.value = 'All'; 
  }

  function setActiveSecondaryFilter(filter: string) {
    activeSecondaryFilter.value = filter;
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
  };
});
