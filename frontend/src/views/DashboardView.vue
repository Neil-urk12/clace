<script setup lang="ts">
import { ref, computed } from "vue";
import EventFilterTabs from "@/components/Dashboard/EventFilterTabs.vue";
import EventCard from "@/components/Dashboard/EventCard.vue";
import { useEventStore } from "../stores/eventStore";
import { type SharedEventItem } from "../types/event";

const eventStore = useEventStore();

// Placeholder - replace with actual store logic for recent events
const recentActivitiesPlaceholder = computed((): SharedEventItem[] => {
  // Example: Filter events from a hypothetical allEvents list in the store
  // or fetch specifically recent ones.
  // For now, let's return a few past events for testing.
  const now = new Date();
  return [
    // Add some sample past event data here if your store doesn't provide it yet
    // { id: 'r1', title: 'Past Event 1', startDate: new Date(now.setDate(now.getDate() - 5)), type: 'Event' },
    // { id: 'r2', title: 'Past Quiz', startDate: new Date(now.setDate(now.getDate() - 15)), type: 'Quiz' },
  ];
});

const getEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

const isPastDay = (eventDate: Date, referenceDate: Date = new Date()): boolean => {
  // Checks if the event was yesterday or earlier
  return getStartOfDay(eventDate).getTime() < getStartOfDay(referenceDate).getTime();
};

const isEarlierToday = (eventDate: Date, referenceDate: Date = new Date()): boolean => {
  // Checks if the event was earlier today (but not future)
  return getStartOfDay(eventDate).getTime() === getStartOfDay(referenceDate).getTime() &&
         new Date(eventDate).getTime() < referenceDate.getTime();
};

const isPastWeek = (eventDate: Date, referenceDate: Date = new Date()): boolean => {
  const today = getStartOfDay(referenceDate);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  // Event should be on or after oneWeekAgo and before today
  return getStartOfDay(eventDate).getTime() >= oneWeekAgo.getTime() &&
         getStartOfDay(eventDate).getTime() < today.getTime();
};

const isPastMonth = (eventDate: Date, referenceDate: Date = new Date()): boolean => {
  const today = getStartOfDay(referenceDate);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  // Event should be on or after oneMonthAgo and before today
  return getStartOfDay(eventDate).getTime() >= oneMonthAgo.getTime() &&
         getStartOfDay(eventDate).getTime() < today.getTime();
};

const activeSecondaryFilter = ref<string>('All'); // Was activeFilter
// Use a computed property to get events from the store.
// const activities = computed(() => eventStore.upcomingEvents);
const currentEventSource = computed((): SharedEventItem[] => {
  if (activePrimaryFilter.value === 'Upcoming') {
    return eventStore.upcomingEvents; // Assuming this gets future/today events
  } else {
    // Replace with your actual recent events source from the store
    return recentActivitiesPlaceholder.value; // Or eventStore.recentEvents
  }
});
const activePrimaryFilter = ref<'Upcoming' | 'Recent'>('Upcoming'); // Default to 'Upcoming'


const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const isToday = (date: Date): boolean => {
  const today = getStartOfDay(new Date());
  return getStartOfDay(date).getTime() === today.getTime();
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

const filteredActivities = computed(() => {
  const now = new Date();
  const source = currentEventSource.value;

  if (activePrimaryFilter.value === 'Upcoming') {
    switch (activeSecondaryFilter.value) {
      case 'Today':
        return source.filter((activity) => isToday(activity.startDate));
      case 'NextWeek':
        return source.filter((activity) => isNextWeek(activity.startDate));
      case 'NextMonth':
        return source.filter((activity) => isNextMonth(activity.startDate));
      case 'All':
      default:
        // Ensure "All" for upcoming still only shows future/today
        return source.filter(
          (activity) => activity.startDate.getTime() >= getStartOfDay(now).getTime()
        );
    }
  } else { // 'Recent'
    switch (activeSecondaryFilter.value) {
      case 'EarlierToday': // New filter value for recent
        return source.filter((activity) => isEarlierToday(activity.startDate, now) || (isToday(activity.startDate) && activity.startDate.getTime() < now.getTime()));
      case 'PastWeek':   // New filter value for recent
        return source.filter((activity) => isPastWeek(activity.startDate, now));
      case 'PastMonth':  // New filter value for recent
        return source.filter((activity) => isPastMonth(activity.startDate, now));
      case 'All':
      default:
        // Ensure "All" for recent only shows past events
        return source.filter(
          (activity) => activity.startDate.getTime() < getStartOfDay(now).getTime() || isEarlierToday(activity.startDate, now)
        );
    }
  }
});

// const filteredActivities = computed(() => {
//   const now = new Date();
//   const currentActivities: SharedEventItem[] = activities.value;

//   switch (activeFilter.value) {
//     case "Today":
//       return currentActivities.filter((activity) => isToday(activity.startDate));
//     case "NextWeek":
//       return currentActivities.filter((activity) => isNextWeek(activity.startDate));
//     case "NextMonth":
//       return currentActivities.filter((activity) => isNextMonth(activity.startDate));
//     case "All":
//     default:
//       return currentActivities.filter(
//         (activity) =>
//           activity.startDate.getTime() >= getStartOfDay(now).getTime(),
//       );
//   }
// });

// const filterCounts = computed(() => {
//   const now = new Date();
//   const upcomingActivitiesBase: SharedEventItem[] = activities.value.filter(
//     (activity) => activity.startDate.getTime() >= getStartOfDay(now).getTime(),
//   );

//   return {
//     All: upcomingActivitiesBase.length,
//     Today: upcomingActivitiesBase.filter((activity) => isToday(activity.startDate))
//       .length,
//     NextWeek: upcomingActivitiesBase.filter((activity) =>
//       isNextWeek(activity.startDate),
//     ).length,
//     NextMonth: upcomingActivitiesBase.filter((activity) =>
//       isNextMonth(activity.startDate),
//     ).length,
//   };
// });

const secondaryFilterCounts = computed(() => {
  const now = new Date();
  const source = currentEventSource.value;

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
    const upcomingSource = source.filter(
      (activity) => activity.startDate.getTime() >= getStartOfDay(now).getTime()
    );
    return {
      ...defaultCounts,
      All: upcomingSource.length,
      Today: upcomingSource.filter((activity) => isToday(activity.startDate)).length,
      NextWeek: upcomingSource.filter((activity) => isNextWeek(activity.startDate)).length,
      NextMonth: upcomingSource.filter((activity) => isNextMonth(activity.startDate)).length,
    };
  } else { // 'Recent'
     const recentSource = source.filter(
        (activity) => activity.startDate.getTime() < getStartOfDay(now).getTime() || isEarlierToday(activity.startDate, now)
     );
    return {
      ...defaultCounts,
      All: recentSource.length,
      EarlierToday: recentSource.filter((activity) => isEarlierToday(activity.startDate, now) || (isToday(activity.startDate) && activity.startDate.getTime() < now.getTime())).length,
      PastWeek: recentSource.filter((activity) => isPastWeek(activity.startDate, now)).length,
      PastMonth: recentSource.filter((activity) => isPastMonth(activity.startDate, now)).length,
    };
  }
});

// function handleFilterChange(newFilter: string) {
//   activeFilter.value = newFilter;
// }
function handlePrimaryFilterChange(newFilter: 'Upcoming' | 'Recent') {
  activePrimaryFilter.value = newFilter;
  activeSecondaryFilter.value = 'All'; // Reset secondary filter to 'All'
}

function handleSecondaryFilterChange(newFilter: string) {
  activeSecondaryFilter.value = newFilter;
}
</script>

<template>
  <div class="dashboard-view">

    <!-- <EventFilterTabs
      :counts="filterCounts"
      :active-filter="activeFilter"
      @filter-changed="handleFilterChange"
    /> -->
    <EventFilterTabs
      :active-primary-filter="activePrimaryFilter"
      :active-secondary-filter="activeSecondaryFilter"
      :secondary-counts="secondaryFilterCounts"
      @primary-filter-changed="handlePrimaryFilterChange"
      @secondary-filter-changed="handleSecondaryFilterChange"
    />

    <div class="activity-grid">
      <EventCard
        v-for="activity in filteredActivities"
        :key="activity.id"
        :activity="activity"
      />
      <p v-if="filteredActivities.length === 0" class="no-activities-message">
        No activities found for the selected filter.
      </p>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  padding: 1rem;
  max-width: 1300px;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}



.online-indicator {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 2rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.activity-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.no-activities-message {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  padding: 3rem 2rem;
  font-style: italic;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.1rem;
}

@media (min-width: 768px) {
  .dashboard-view {
    padding: 1.5rem;
  }
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-view {
    padding: 2rem;
  }
  .activity-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1400px) {
  .activity-grid {
    gap: 2rem;
  }
}


/* Mobile bottom navigation spacing */
@media (max-width: 767px) {
  .dashboard-view {
    padding-bottom: 100px;
  }
}
</style>
