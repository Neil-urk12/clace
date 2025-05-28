<script setup lang="ts">
import { ref, computed } from "vue";
import EventFilterTabs from "@/components/Dashboard/EventFilterTabs.vue";
import EventCard from "@/components/Dashboard/EventCard.vue";
import { useEventStore } from "../stores/eventStore";
import { type SharedEventItem } from "../types/event";

const eventStore = useEventStore();

const activeFilter = ref("All");
// Use a computed property to get events from the store.
const activities = computed(() => eventStore.upcomingEvents);

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
  const currentActivities: SharedEventItem[] = activities.value;

  switch (activeFilter.value) {
    case "Today":
      return currentActivities.filter((activity) => isToday(activity.startDate));
    case "NextWeek":
      return currentActivities.filter((activity) => isNextWeek(activity.startDate));
    case "NextMonth":
      return currentActivities.filter((activity) => isNextMonth(activity.startDate));
    case "All":
    default:
      return currentActivities.filter(
        (activity) =>
          activity.startDate.getTime() >= getStartOfDay(now).getTime(),
      );
  }
});

const filterCounts = computed(() => {
  const now = new Date();
  const upcomingActivitiesBase: SharedEventItem[] = activities.value.filter(
    (activity) => activity.startDate.getTime() >= getStartOfDay(now).getTime(),
  );

  return {
    All: upcomingActivitiesBase.length,
    Today: upcomingActivitiesBase.filter((activity) => isToday(activity.startDate))
      .length,
    NextWeek: upcomingActivitiesBase.filter((activity) =>
      isNextWeek(activity.startDate),
    ).length,
    NextMonth: upcomingActivitiesBase.filter((activity) =>
      isNextMonth(activity.startDate),
    ).length,
  };
});

function handleFilterChange(newFilter: string) {
  activeFilter.value = newFilter;
}
</script>

<template>
  <div class="dashboard-view">
    <div class="header-section">
      <h2 class="upcoming-activities-title">Upcoming Activities</h2>
      <!-- <span class="online-indicator">● 1 online</span> -->
    </div>

    <EventFilterTabs
      :counts="filterCounts"
      :active-filter="activeFilter"
      @filter-changed="handleFilterChange"
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.upcoming-activities-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
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
  .header-section {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
  }
  .upcoming-activities-title {
    font-size: 1.75rem;
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
  .upcoming-activities-title {
    font-size: 2rem;
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

@media (max-width: 767px) {
  .upcoming-activities-title {
    font-size: 1.1rem;
  }
}

/* Mobile bottom navigation spacing */
@media (max-width: 767px) {
  .dashboard-view {
    padding-bottom: 100px;
  }
}
</style>
