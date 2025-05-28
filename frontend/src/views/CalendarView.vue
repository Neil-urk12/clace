<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List,
  Grid3x3,
  Menu,
  X,
} from "lucide-vue-next";
import CalendarGrid from "../components/Calendar/CalendarGrid.vue";
import EventModal from "../components/Calendar/EventModal.vue";
import MiniCalendar from "../components/Calendar/MiniCalendar.vue";
import { useEventStore } from "../stores/eventStore";
import type { SharedEventItem } from "../types/event";

const eventStore = useEventStore();

const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);
const highlightedDate = ref<Date | null>(null);
const viewMode = ref<"month" | "week" | "day">("month");
const showEventModal = ref(false);
const selectedEvent = ref<SharedEventItem | null>(null);
const isCreatingEvent = ref(false);
const sidebarOpen = ref(false);

const eventsFromStore = computed(() => eventStore.allEvents);

const upcomingEvents = computed(() => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return eventsFromStore.value
    .filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate >= today && eventDate <= nextWeek;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, 5);
});

const currentMonth = computed(() =>
  currentDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleMiniCalendarDateSelect = (date: Date) => {
  // Update the main calendar's view date if necessary
  currentDate.value = new Date(date);
  // Set the date to be highlighted in the main grid
  highlightedDate.value = date;
  // Do NOT open the modal when clicking a date in the mini calendar
  // selectedDate.value = date; // Keep selectedDate for modal creation triggered elsewhere
  isCreatingEvent.value = false;
  showEventModal.value = false;
};

const handleMiniCalendarMonthChange = (date: Date) => {
  currentDate.value = new Date(date);
};

const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  if (viewMode.value === "month") {
    newDate.setMonth(newDate.getMonth() - 1);
  } else if (viewMode.value === "week") {
    newDate.setDate(newDate.getDate() - 7);
  } else {
    newDate.setDate(newDate.getDate() - 1);
  }
  currentDate.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  if (viewMode.value === "month") {
    newDate.setMonth(newDate.getMonth() + 1);
  } else if (viewMode.value === "week") {
    newDate.setDate(newDate.getDate() + 7);
  } else {
    newDate.setDate(newDate.getDate() + 1);
  }
  currentDate.value = newDate;
};

const goToToday = () => {
  currentDate.value = new Date();
};

const handleDateClick = (date: Date) => {
  selectedDate.value = date;
  isCreatingEvent.value = true;
  showEventModal.value = true;
};

const handleEventClick = (event: SharedEventItem) => {
  selectedEvent.value = event;
  isCreatingEvent.value = false;
  showEventModal.value = true;
};

const handleCreateEvent = (eventData: Partial<SharedEventItem>) => {
  // Assuming eventData from modal is Omit<SharedEventItem, 'id'> or can be cast
  eventStore.addEvent(eventData as Omit<SharedEventItem, "id">);
  showEventModal.value = false;
  selectedEvent.value = null;
  selectedDate.value = null;
};

const handleUpdateEvent = (eventData: Partial<SharedEventItem>) => {
  if (eventData.id) {
    // Ensure id is present for update
    eventStore.updateEvent(eventData as SharedEventItem);
  }
  showEventModal.value = false;
  selectedEvent.value = null;
};

const handleDeleteEvent = (eventId: string) => {
  eventStore.deleteEvent(eventId);
  showEventModal.value = false;
  selectedEvent.value = null;
};

const closeModal = () => {
  showEventModal.value = false;
  selectedEvent.value = null;
  selectedDate.value = null;
  isCreatingEvent.value = false;
};

// Keyboard shortcuts
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeModal();
  } else if (event.key === "n" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    isCreatingEvent.value = true;
    showEventModal.value = true;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

<template>
  <div class="calendar-view">
    <!-- Sidebar -->
    <div :class="['sidebar', { 'sidebar-open': sidebarOpen }]">
      <div class="sidebar-content">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <h2 class="sidebar-title">Calendar</h2>
          <button @click="toggleSidebar" class="sidebar-toggle">
            <X :size="20" />
          </button>
        </div>

        <!-- Mini Calendar -->
        <div class="mini-calendar-section">
          <MiniCalendar
            :current-date="currentDate"
            :events="eventsFromStore"
            @date-select="handleMiniCalendarDateSelect"
            @month-change="handleMiniCalendarMonthChange"
          />
        </div>

        <!-- Upcoming Events -->
        <div class="upcoming-events-section">
          <h3 class="section-title">Upcoming Events</h3>
          <div class="events-list">
            <div
              v-for="event in upcomingEvents"
              :key="event.id"
              :class="['event-item', `event-${event.type?.toLowerCase()}`]"
              @click="handleEventClick(event)"
            >
              <div
                class="event-color"
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
            <div v-if="upcomingEvents.length === 0" class="no-events">
              No upcoming events
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="toggleSidebar"
    ></div>

    <!-- Main Content -->
    <div :class="['main-content', { 'sidebar-expanded': sidebarOpen }]">
      <!-- Calendar Header -->
      <div class="calendar-header">
        <div class="header-left">
          <button @click="toggleSidebar" class="sidebar-toggle-btn">
            <Menu :size="20" />
          </button>
          <button @click="goToToday" class="today-btn">Today</button>
          <div class="nav-controls">
            <button @click="previousMonth" class="nav-btn">
              <ChevronLeft :size="20" />
            </button>
            <button @click="nextMonth" class="nav-btn">
              <ChevronRight :size="20" />
            </button>
          </div>
          <h1 class="current-date">{{ currentMonth }}</h1>
        </div>

        <div class="header-center">
          <div class="view-controls">
            <button
              @click="viewMode = 'month'"
              :class="['view-btn', { active: viewMode === 'month' }]"
            >
              <Grid3x3 :size="16" />
              Month
            </button>
            <button
              @click="viewMode = 'week'"
              :class="['view-btn', { active: viewMode === 'week' }]"
            >
              <List :size="16" />
              Week
            </button>
            <button
              @click="viewMode = 'day'"
              :class="['view-btn', { active: viewMode === 'day' }]"
            >
              <CalendarIcon :size="16" />
              Day
            </button>
          </div>
        </div>

        <div class="header-right">
          <button
            @click="
              isCreatingEvent = true;
              showEventModal = true;
            "
            class="create-btn"
          >
            <Plus :size="20" />
            <span class="create-text">Create Event</span>
          </button>
        </div>
      </div>

      <!-- Calendar Content -->
      <div class="calendar-content">
        <CalendarGrid
          :current-date="currentDate"
          :view-mode="viewMode"
          :events="eventsFromStore"
          :highlighted-date="highlightedDate"
          @date-click="handleDateClick"
          @event-click="handleEventClick"
        />
      </div>

      <!-- Event Modal -->
      <EventModal
        v-show="showEventModal"
        :show="showEventModal"
        :event="selectedEvent"
        :is-creating="isCreatingEvent"
        :selected-date="selectedDate"
        @create="handleCreateEvent"
        @update="handleUpdateEvent"
        @delete="handleDeleteEvent"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<style scoped>
.calendar-view {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  position: relative;
}

/* Mobile bottom navigation spacing */
@media (max-width: 767px) {
  .calendar-view {
    min-height: calc(100vh - 80px);
    height: auto;
  }
}

.calendar-view::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

/* Sidebar Styles */
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

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 10px;
  transition: all 0.2s;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

.sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar-content {
  padding: 2rem 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
}

.sidebar-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #4c1d95;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #3730a3;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.sidebar-toggle::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.sidebar-toggle:hover::before {
  left: 100%;
}

.mini-calendar-section {
  flex-shrink: 0;
}

.upcoming-events-section {
  flex: 1;
  overflow: hidden;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.events-list::-webkit-scrollbar {
  width: 4px;
}

.events-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.events-list::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 10px;
}

.events-list::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.event-item:hover {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.event-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.event-item:hover::before {
  opacity: 1;
}

.event-color {
  width: 4px;
  height: 100%;
  min-height: 40px;
  border-radius: 2px;
  flex-shrink: 0;
}

.event-details {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4c1d95;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.event-time {
  font-size: 0.75rem;
  color: #6366f1;
  margin-bottom: 0.25rem;
}

.event-course {
  font-size: 0.75rem;
  color: #7c3aed;
  font-weight: 500;
}

.no-events {
  text-align: center;
  color: #6366f1;
  font-size: 0.875rem;
  padding: 2rem 1rem;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;
  min-height: 100vh;
  overflow: hidden;
}

.main-content.sidebar-expanded {
  margin-left: 320px;
}

.sidebar-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #4c1d95;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
  margin-right: 1rem;
}

.sidebar-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #3730a3;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.calendar-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: inherit;
  pointer-events: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-center {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.today-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.today-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.today-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.6);
}

.today-btn:hover::before {
  left: 100%;
}

.nav-controls {
  display: flex;
  gap: 0.25rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #4c1d95;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #3730a3;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.current-date {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-controls {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 0.375rem;
  gap: 0.25rem;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  color: rgba(76, 29, 149, 0.7);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.view-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.view-btn:hover {
  color: #4c1d95;
  transform: translateY(-1px);
}

.view-btn:hover::before {
  opacity: 1;
}

.view-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #4c1d95;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.view-btn.active::before {
  opacity: 0;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 16px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px 0 rgba(16, 185, 129, 0.4);
  position: relative;
  overflow: hidden;
}

.create-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.create-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px 0 rgba(16, 185, 129, 0.6);
}

.create-btn:hover::before {
  left: 100%;
}

.calendar-content {
  overflow: hidden;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
  min-height: 0;
}

.calendar-content::before {
  content: "";
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
  z-index: -1;
}

/* Tablet and Mobile Design - Use overlay for better UX on smaller screens */
/* This ensures the sidebar doesn't push content on tablets (768px-1024px) */
@media (max-width: 1024px) {
  .calendar-view {
    min-height: calc(100vh - 50px);
    height: auto;
  }

  .sidebar {
    width: 300px;
    z-index: 1001;
  }

  .sidebar-content {
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }

  .main-content.sidebar-expanded {
    margin-left: 0;
  }

  .sidebar-overlay {
    display: block;
    z-index: 1000;
  }

  .calendar-header {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .sidebar-toggle-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 0.5rem;
  }

  .sidebar-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }

  .sidebar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  /* Ensure smooth overlay transition on tablets */
  .sidebar-overlay {
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  .sidebar-title {
    background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sidebar-toggle {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #4c1d95;
  }

  .sidebar-toggle:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #3730a3;
    border-color: rgba(255, 255, 255, 0.5);
  }

  .section-title {
    background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .event-item {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .event-item:hover {
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .event-title {
    color: #4c1d95;
  }

  .event-time {
    color: #6366f1;
  }

  .event-course {
    color: #7c3aed;
  }

  .no-events {
    color: #6366f1;
  }

  .calendar-header::before {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.1)
    );
  }

  .header-left {
    order: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .header-center {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .header-right {
    order: 2;
    width: 100%;
    justify-content: flex-end;
    position: absolute;
    top: 1rem;
    right: 0.75rem;
  }

  .nav-controls {
    display: flex;
    gap: 0.5rem;
  }

  .nav-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    width: 2rem;
    height: 2rem;
  }

  .nav-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .today-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .today-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .current-date {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    text-align: center;
    flex: 1;
    margin: 0 1rem;
  }

  .create-text {
    display: none;
  }

  .create-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .create-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .view-controls {
    width: 100%;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .view-btn {
    flex: 1;
    justify-content: center;
    color: rgba(255, 255, 255, 0.8);
  }

  .view-btn:hover {
    color: white;
  }

  .view-btn.active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .calendar-content {
    padding: 1rem;
    background: transparent;
  }

  .calendar-content::before {
    top: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    border-radius: 16px;
  }
}

/* Tablet specific optimizations (769px to 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 320px;
  }

  .sidebar-content {
    padding: 2rem 1.5rem;
    gap: 2rem;
  }

  .events-list {
    max-height: 350px;
  }
}

/* Small mobile specific adjustments */
@media (max-width: 480px) {
  .sidebar {
    width: 240px;
  }

  .sidebar-content {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }

  .events-list {
    max-height: 200px;
  }

  .event-item {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .event-title {
    font-size: 0.8rem;
  }

  .event-time,
  .event-course {
    font-size: 0.7rem;
  }

  .calendar-header {
    padding: 0.75rem 0.5rem;
    gap: 0.5rem;
  }

  .sidebar-toggle-btn {
    width: 2rem;
    height: 2rem;
    margin-right: 0.25rem;
  }

  .header-left {
    justify-content: space-between;
    align-items: center;
  }

  .nav-controls {
    gap: 0.25rem;
  }

  .nav-btn {
    width: 1.75rem;
    height: 1.75rem;
  }

  .today-btn {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }

  .current-date {
    font-size: 1.25rem;
    margin: 0 0.5rem;
  }

  .create-btn {
    width: 2rem;
    height: 2rem;
  }

  .view-btn {
    padding: 0.375rem 0.25rem;
    font-size: 0.75rem;
  }

  .calendar-content {
    padding: 0.75rem;
    background: transparent;
  }

  .calendar-content::before {
    top: 0.25rem;
    left: 0.25rem;
    right: 0.25rem;
    bottom: 0.25rem;
    border-radius: 12px;
  }
}

/* Height-based responsive design for landscape and short screens */
@media (max-height: 700px) {
  .calendar-view {
    min-height: 100vh;
    height: auto;
    overflow-y: auto;
  }

  .sidebar {
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-content {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }

  .mini-calendar-section {
    flex-shrink: 0;
  }

  .upcoming-events-section {
    flex: 1;
    min-height: 0;
  }

  .events-list {
    max-height: 200px;
    overflow-y: auto;
  }

  .calendar-header {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .calendar-content {
    overflow: hidden;
    padding: 0.75rem;
    margin: 0.5rem;
  }

  .main-content {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .nav-btn {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }

  .today-btn {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }

  .current-date {
    font-size: 1.25rem;
  }

  .create-btn {
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }

  .view-btn {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
}

@media (max-height: 500px) {
  .calendar-header {
    padding: 0.5rem 0.75rem;
    min-height: 2.5rem;
  }

  .sidebar-content {
    padding: 0.75rem 0.5rem;
    gap: 0.75rem;
  }

  .events-list {
    max-height: 150px;
  }

  .event-item {
    padding: 0.375rem 0.5rem;
    gap: 0.375rem;
  }

  .event-title {
    font-size: 0.75rem;
  }

  .event-time,
  .event-course {
    font-size: 0.625rem;
  }

  .section-title {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .nav-btn {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.625rem;
  }

  .today-btn {
    padding: 0.25rem 0.375rem;
    font-size: 0.625rem;
  }

  .current-date {
    font-size: 1rem;
  }

  .create-btn {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }

  .view-btn {
    padding: 0.25rem 0.375rem;
    font-size: 0.625rem;
  }

  .calendar-content {
    padding: 0.375rem;
    margin: 0.0625rem;
  }

  .calendar-content::before {
    top: 0.0625rem;
    left: 0.0625rem;
    right: 0.0625rem;
    bottom: 0.0625rem;
    border-radius: 8px;
  }
}

@media (max-height: 600px) {
  .calendar-header {
    padding: 0.75rem 1rem;
    min-height: 3rem;
  }

  .sidebar {
    width: 200px;
  }

  .sidebar-content {
    padding: 0.5rem 0.375rem;
    gap: 0.5rem;
  }

  .sidebar-title {
    font-size: 1rem;
  }

  .events-list {
    max-height: 100px;
  }

  .event-item {
    padding: 0.25rem 0.375rem;
    gap: 0.25rem;
  }

  .event-title {
    font-size: 0.625rem;
  }

  .event-time,
  .event-course {
    font-size: 0.5rem;
  }

  .section-title {
    font-size: 0.75rem;
    margin-bottom: 0.375rem;
  }

  .nav-btn {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.5rem;
  }

  .today-btn {
    padding: 0.125rem 0.25rem;
    font-size: 0.5rem;
  }

  .current-date {
    font-size: 0.875rem;
    margin: 0 0.25rem;
  }

  .create-btn {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.625rem;
  }

  .view-btn {
    padding: 0.125rem 0.25rem;
    font-size: 0.5rem;
  }

  .calendar-content {
    padding: 0.375rem;
    margin: 0.125rem;
  }
}

/* Combined width and height responsive for very small screens */
@media (max-width: 480px) and (max-height: 600px) {
  .calendar-view {
    font-size: 0.875rem;
  }

  .sidebar {
    width: 180px;
  }

  .sidebar-content {
    padding: 0.5rem 0.25rem;
    gap: 0.5rem;
  }

  .calendar-header {
    padding: 0.375rem 0.25rem;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .header-left {
    order: 1;
    width: 100%;
    justify-content: space-between;
  }

  .header-center {
    order: 3;
    width: 100%;
    margin-top: 0.25rem;
  }

  .header-right {
    order: 2;
    position: static;
    width: auto;
  }

  .nav-controls {
    gap: 0.125rem;
  }

  .current-date {
    font-size: 0.75rem;
    margin: 0;
  }

  .view-controls {
    margin-top: 0.25rem;
  }

  .events-list {
    max-height: 80px;
  }

  .event-item {
    padding: 0.125rem 0.25rem;
    gap: 0.125rem;
  }

  .calendar-content {
    padding: 0.25rem;
    margin: 0.125rem;
  }

  .calendar-content::before {
    top: 0.0625rem;
    left: 0.0625rem;
    right: 0.0625rem;
    bottom: 0.0625rem;
    border-radius: 6px;
  }
}

@media (max-width: 768px) and (max-height: 500px) {
  .calendar-header {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0.5rem;
  }

  .header-left {
    order: 1;
    width: auto;
    flex: 0 0 auto;
  }

  .header-center {
    order: 2;
    width: auto;
    flex: 1;
    margin: 0 0.5rem;
  }

  .header-right {
    order: 3;
    width: auto;
    flex: 0 0 auto;
    position: static;
  }

  .view-controls {
    order: 4;
    width: 100%;
    margin-top: 0.25rem;
  }

  .current-date {
    font-size: 0.75rem;
    text-align: center;
  }
}
</style>
