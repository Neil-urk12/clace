<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import EventFilterTabs from "@/components/Dashboard/EventFilterTabs.vue";
import EventCard from "@/components/Dashboard/EventCard.vue";
import { useEventStore } from "../stores/eventStore";
import { type SharedEventItem } from "../types/event";

const eventStore = useEventStore();

// Skeleton loading state
const loading = ref(true);

onMounted(async () => {
  // Simulate loading for demonstration, replace with real loading logic
  await new Promise(resolve => setTimeout(resolve, 1200));
  loading.value = false;
});

// Use computed properties directly from the store
const activePrimaryFilter = computed(() => eventStore.activePrimaryFilter);
const activeSecondaryFilter = computed(() => eventStore.activeSecondaryFilter);
const filteredActivities = computed(() => eventStore.filteredEvents); // Use the store's filteredEvents
const secondaryFilterCounts = computed(() => eventStore.secondaryFilterCounts); // Use the store's counts

// Use actions directly from the store
const handlePrimaryFilterChange = (newFilter: 'Upcoming' | 'Recent') => {
  eventStore.setActivePrimaryFilter(newFilter);
};

const handleSecondaryFilterChange = (newFilter: string) => {
  eventStore.setActiveSecondaryFilter(newFilter);
};
</script>

<template>
  <div class="dashboard-view">
    <EventFilterTabs
      :active-primary-filter="activePrimaryFilter"
      :active-secondary-filter="activeSecondaryFilter"
      :secondary-counts="secondaryFilterCounts"
      @primary-filter-changed="handlePrimaryFilterChange"
      @secondary-filter-changed="handleSecondaryFilterChange"
      :loading="loading"
    />
    <div class="activity-grid">
      <template v-if="loading">
        <EventCard v-for="i in 3" :key="i" :loading="true" />
      </template>
      <template v-else>
        <EventCard
          v-for="activity in filteredActivities"
          :key="activity.id"
          :activity="activity"
        />
        <p v-if="filteredActivities.length === 0" class="no-activities-message">
          No activities found for the selected filter.
        </p>
      </template>
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
