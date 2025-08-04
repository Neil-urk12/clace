<script setup lang="ts">
import { ref, computed } from "vue";
import CalendarGrid from "./CalendarGrid.vue";
import MiniCalendar from "./MiniCalendar.vue";
import type { SharedEventItem } from "../../types/event";

interface Props {
  events?: SharedEventItem[];
  view?: "month" | "week" | "day";
}

interface Emits {
  (e: "event-click", event: SharedEventItem): void;
  (e: "date-click", date: Date): void;
  (e: "view-change", view: "month" | "week" | "day"): void;
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [] as SharedEventItem[],
  view: "month",
});

const emit = defineEmits<Emits>();

const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const sidebarCollapsed = ref(false);

const handleDateSelect = (date: Date) => {
  selectedDate.value = date;
  currentDate.value = date;
  emit("date-click", date);
};

const handleMonthChange = (date: Date) => {
  currentDate.value = date;
};

const handleEventClick = (event: SharedEventItem) => {
  emit("event-click", event);
};

const handleDateClick = (date: Date) => {
  selectedDate.value = date;
  emit("date-click", date);
};

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const filteredEvents = computed(() => {
  // Filter events for the current month view
  const currentMonth = currentDate.value.getMonth();
  const currentYear = currentDate.value.getFullYear();

  return props.events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  });
});
</script>

<template>
  <div class="calendar-layout">
    <!-- Sidebar -->
    <div :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-header">
        <button
          class="sidebar-toggle"
          @click="toggleSidebar"
          :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path v-if="sidebarCollapsed" d="m9 18 6-6-6-6" />
            <path v-else d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h2 v-if="!sidebarCollapsed" class="sidebar-title">Calendar</h2>
      </div>

      <div v-if="!sidebarCollapsed" class="sidebar-content">
        <!-- Mini Calendar -->
        <MiniCalendar
          :current-date="selectedDate"
          :events="props.events"
          @date-select="handleDateSelect"
          @month-change="handleMonthChange"
        />

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h4 class="section-title">Quick Actions</h4>
          <div class="action-buttons">
            <button class="action-button primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 5v14m7-7H5" />
              </svg>
              New Event
            </button>
            <button class="action-button">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                />
              </svg>
              View All
            </button>
          </div>
        </div>

        <!-- Calendar List -->
        <div class="calendar-list">
          <h4 class="section-title">My Calendars</h4>
          <div class="calendar-items">
            <label class="calendar-item">
              <input type="checkbox" checked />
              <span
                class="calendar-color"
                style="background-color: #3b82f6"
              ></span>
              <span class="calendar-name">Personal</span>
            </label>
            <label class="calendar-item">
              <input type="checkbox" checked />
              <span
                class="calendar-color"
                style="background-color: #10b981"
              ></span>
              <span class="calendar-name">Work</span>
            </label>
            <label class="calendar-item">
              <input type="checkbox" checked />
              <span
                class="calendar-color"
                style="background-color: #f59e0b"
              ></span>
              <span class="calendar-name">Events</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <CalendarGrid
        :current-date="currentDate"
        :events="filteredEvents"
        :view-mode="props.view"
        :highlighted-date="selectedDate"
        @event-click="handleEventClick"
        @date-click="handleDateClick"
      />
    </div>
  </div>
</template>

<style scoped>
.calendar-layout {
  display: flex;
  height: 100%;
  background: #0f172a;
  color: #e2e8f0;
}

.sidebar {
  width: 320px;
  background: rgba(15, 23, 42, 0.8);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 0.75rem;
}

.sidebar-toggle {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #f1f5f9;
  white-space: nowrap;
}

.sidebar-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-button.primary {
  background: #3b82f6;
  border-color: #2563eb;
  color: white;
}

.action-button.primary:hover {
  background: #2563eb;
  border-color: #1d4ed8;
}

.calendar-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.calendar-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.calendar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
  padding: 0.5rem;
}

.calendar-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.calendar-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  cursor: pointer;
}

.calendar-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.calendar-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e8f0;
}

.main-content {
  flex: 1;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 280px;
  }

  .sidebar.collapsed {
    width: 50px;
  }
}

@media (max-width: 768px) {
  .calendar-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .sidebar.collapsed {
    width: 100%;
    height: 60px;
  }

  .sidebar-content {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.75rem;
  }

  .main-content {
    flex: 1;
    height: auto;
  }
}

@media (max-width: 480px) {
  .sidebar-header {
    padding: 0.75rem;
  }

  .sidebar-title {
    font-size: 1.125rem;
  }

  .action-button {
    padding: 0.625rem 0.75rem;
    font-size: 0.8rem;
  }

  .calendar-item {
    padding: 0.375rem;
  }

  .calendar-name {
    font-size: 0.8rem;
  }
}
</style>
