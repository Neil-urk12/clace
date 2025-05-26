<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List,
  Grid3x3,
} from "lucide-vue-next";
import CalendarGrid from '../components/Calendar/CalendarGrid.vue';
import EventModal from '../components/Calendar/EventModal.vue';
import { useEventStore } from '../stores/eventStore';
import type { SharedEventItem } from '../types/event';

const eventStore = useEventStore();

const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);
const viewMode = ref<"month" | "week" | "day">("month");
const showEventModal = ref(false);
const selectedEvent = ref<SharedEventItem | null>(null);
const isCreatingEvent = ref(false);

const eventsFromStore = computed(() => eventStore.allEvents);

const currentMonth = computed(() =>
  currentDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
);

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
  eventStore.addEvent(eventData as Omit<SharedEventItem, 'id'>);
  showEventModal.value = false;
  selectedEvent.value = null;
  selectedDate.value = null;
};

const handleUpdateEvent = (eventData: Partial<SharedEventItem>) => {
  if (eventData.id) { // Ensure id is present for update
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
    <!-- Calendar Header -->
    <div class="calendar-header">
      <div class="header-left">
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
</template>

<style scoped>
.calendar-view {
  display: flex;
  flex-direction: column;
  height: calc(100vh - -68px);
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  position: relative;
}

.calendar-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
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
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
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
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
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
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
  flex: 1;
  overflow: hidden;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
}

.calendar-content::before {
  content: '';
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

/* Responsive Design */
@media (max-width: 768px) {
  .calendar-view {
    height: calc(100vh - 50px);
  }

  .calendar-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .calendar-header::before {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
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

@media (max-width: 480px) {
  .calendar-header {
    padding: 0.75rem 0.5rem;
    gap: 0.5rem;
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
</style>
