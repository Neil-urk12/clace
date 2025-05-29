<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";
import MiniCalendar from "./MiniCalendar.vue";
import { useEventStore } from "../../stores/eventStore";
import type { SharedEventItem } from "../../types/event";

interface Props {
  isOpen: boolean;
  currentDateForMiniCalendar: Date;
  allEventsForMiniCalendar: SharedEventItem[];
}

const props = defineProps<Props>();

interface Emits {
  (e: "toggle"): void;
  (e: "mini-calendar-date-select", date: Date): void;
  (e: "mini-calendar-month-change", date: Date): void;
  (e: "list-event-click", event: SharedEventItem): void;
}

const emit = defineEmits<Emits>();

const eventStore = useEventStore();

const upcomingEventsToList = computed(() => {
  // Display top 5 upcoming events from the store
  return eventStore.upcomingEvents.slice(0, 5);
});

const recentEventsToList = computed(() => {
  // Display top 5 recent events from the store
  return eventStore.recentEvents.slice(0, 5);
});

const displayedEvents = computed(() => {
  return eventStore.activePrimaryFilter === 'Upcoming' ? upcomingEventsToList.value : recentEventsToList.value;
});

const handleMiniDateSelect = (date: Date) => {
  emit("mini-calendar-date-select", date);
};

const handleMiniMonthChange = (date: Date) => {
  emit("mini-calendar-month-change", date);
};

const handleEventItemClick = (event: SharedEventItem) => {
  emit("list-event-click", event);
};

const handleToggleSidebar = () => {
  emit("toggle");
};

const selectActivityFilter = (filter: 'Upcoming' | 'Recent') => {
  eventStore.setActivePrimaryFilter(filter);
};
</script>

<template>
  <div :class="['sidebar', { 'sidebar-open': isOpen }]">
    <div class="sidebar-content">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <h2 class="sidebar-title">Calendar</h2>
        <button @click="handleToggleSidebar" class="sidebar-toggle-x-btn">
          <X :size="20" />
        </button>
      </div>

      <!-- Mini Calendar -->
      <div class="mini-calendar-section">
        <MiniCalendar
          :current-date="props.currentDateForMiniCalendar"
          :events="props.allEventsForMiniCalendar"
          @date-select="handleMiniDateSelect"
          @month-change="handleMiniMonthChange"
        />
      </div>

      <!-- Activity Events Section -->
      <div class="activity-events-section">
        <div class="primary-filter-group">
          <button
            :class="['primary-filter-button', { active: eventStore.activePrimaryFilter === 'Upcoming' }]"
            @click="selectActivityFilter('Upcoming')"
          >
            Upcoming
          </button>
          <button
            :class="['primary-filter-button', { active: eventStore.activePrimaryFilter === 'Recent' }]"
            @click="selectActivityFilter('Recent')"
          >
            Recent
          </button>
        </div>
        <div class="events-list">
          <div
            v-for="event in displayedEvents"
            :key="event.id"
            :class="['event-item', `event-${event.type?.toLowerCase()}`]"
            @click="handleEventItemClick(event)"
          >
            <div
              class="event-color-indicator"
              :style="{ backgroundColor: event.color || '#3b82f6' }"
            ></div>
            <div class="event-details">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-time">
                {{
                  event.allDay
                    ? "All day"
                    : new Date(event.startDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                }}
              </div>
              <div v-if="event.course" class="event-course">
                {{ event.course }}
              </div>
            </div>
          </div>
          <div v-if="displayedEvents.length === 0" class="no-events">
            No {{ eventStore.activePrimaryFilter.toLowerCase() }} events
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar::-webkit-scrollbar { width: 6px; }
.sidebar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.sidebar::-webkit-scrollbar-thumb { background: rgba(102, 126, 234, 0.3); border-radius: 10px; transition: all 0.2s; }
.sidebar::-webkit-scrollbar-thumb:hover { background: rgba(102, 126, 234, 0.5); }

.sidebar-content { padding: 2rem 1.5rem; height: 100%; display: flex; flex-direction: column; gap: 2rem; position: relative; }
.sidebar-content::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)); border-radius: inherit; pointer-events: none; z-index: -1; }

.sidebar-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid rgba(102, 126, 234, 0.2); }
.sidebar-title { font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }

.sidebar-toggle-x-btn { background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 12px; color: #4c1d95; padding: 0.5rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1); position: relative; overflow: hidden; }
.sidebar-toggle-x-btn:hover { background: rgba(255, 255, 255, 0.3); color: #3730a3; border-color: rgba(255, 255, 255, 0.5); transform: translateY(-2px); box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15); }
.sidebar-toggle-x-btn::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent); transition: left 0.5s; }
.sidebar-toggle-x-btn:hover::before { left: 100%; }

.mini-calendar-section { flex-shrink: 0; }

.activity-events-section { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

.primary-filter-group {
  display: flex;
  gap: 0.5rem;
  background: rgba(236, 239, 241, 0.8); /* Light gray, slightly transparent */
  border-radius: 0.75rem; /* Rounded corners for the group */
  padding: 0.375rem; /* Padding inside the group */
  margin-bottom: 1rem; /* Space below the filter group */
  border: 1px solid rgba(102, 126, 234, 0.2); /* Subtle border */
}

.primary-filter-button {
  padding: 0.5rem 0.75rem; /* Padding inside buttons */
  border: none;
  border-radius: 0.5rem; /* Rounded corners for buttons */
  background-color: transparent;
  color: #4c1d95; /* Default text color */
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  flex-grow: 1; /* Make buttons take equal space */
  text-align: center;
}

.primary-filter-button:hover {
  background-color: rgba(102, 126, 234, 0.1); /* Light purple on hover */
  color: #3730a3; /* Darker purple text on hover */
}

.primary-filter-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Gradient for active */
  color: #ffffff; /* White text for active */
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); /* Subtle shadow for active */
}

.events-list { display: flex; flex-direction: column; gap: 0.75rem; max-height: 300px; overflow-y: auto; padding-right: 0.5rem; flex-grow: 1; }
.events-list::-webkit-scrollbar { width: 4px; }
.events-list::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.events-list::-webkit-scrollbar-thumb { background: rgba(102, 126, 234, 0.3); border-radius: 10px; }
.events-list::-webkit-scrollbar-thumb:hover { background: rgba(102, 126, 234, 0.5); }

.event-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 12px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1); position: relative; overflow: hidden; }
.event-item:hover { background: rgba(255, 255, 255, 0.4); border-color: rgba(255, 255, 255, 0.5); transform: translateY(-2px); box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15); }
.event-item::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)); border-radius: inherit; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
.event-item:hover::before { opacity: 1; }

.event-color-indicator { width: 4px; height: 100%; min-height: 40px; border-radius: 2px; flex-shrink: 0; align-self: stretch; }
.event-details { flex: 1; min-width: 0; }
.event-title { font-size: 0.875rem; font-weight: 600; color: #4c1d95; margin-bottom: 0.25rem; line-height: 1.2; }
.event-time { font-size: 0.75rem; color: #6366f1; margin-bottom: 0.25rem; }
.event-course { font-size: 0.75rem; color: #7c3aed; font-weight: 500; }
.no-events { text-align: center; color: #6366f1; font-size: 0.875rem; padding: 2rem 1rem; }

@media (max-width: 768px) {
  .sidebar { width: 300px; }
  .sidebar-content { padding: 1.5rem 1rem; gap: 1.5rem; }
  .events-list { max-height: 250px; }
}

@media (max-width: 480px) {
  .sidebar { width: 240px; }
  .sidebar-content { padding: 1rem 0.75rem; gap: 1rem; }
  .events-list { max-height: 200px; }
  .event-item { padding: 0.5rem; gap: 0.5rem; }
  .event-title { font-size: 0.8rem; }
  .event-time, .event-course { font-size: 0.7rem; }
  .primary-filter-button { font-size: 0.8rem; padding: 0.4rem 0.6rem; }
}

@media (max-height: 700px) {
  .sidebar-content { padding: 1rem 0.75rem; gap: 1rem; }
  .events-list { max-height: 200px; }
}

@media (max-height: 600px) {
  .sidebar { width: 200px; }
  .sidebar-content { padding: 0.5rem 0.375rem; gap: 0.5rem; }
  .sidebar-title { font-size: 1rem; }
  .events-list { max-height: 100px; }
  .event-item { padding: 0.25rem 0.375rem; gap: 0.25rem; }
  .event-title { font-size: 0.625rem; }
  .event-time, .event-course { font-size: 0.5rem; }
  .primary-filter-button { font-size: 0.75rem; padding: 0.3rem 0.5rem; }
}
</style>
