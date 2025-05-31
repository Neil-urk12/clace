<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { useRouter } from "vue-router";
import {
  X,
  CalendarDays,
  Settings,
  LayoutDashboard,
  UserRound,
  Users,
  Info,
  Copy,
} from "lucide-vue-next";
import { useEventStore } from "../../stores/eventStore";
import { useCalendarStore } from "../../stores/calendarStore";
import type { SharedEventItem } from "../../types/event";

const MiniCalendar = defineAsyncComponent(() => import("./MiniCalendar.vue"));
const ActivityFilterButtons = defineAsyncComponent(() =>
  import("./ActivityFilterButtons.vue")
);
const router = useRouter();

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
const calendarStore = useCalendarStore();

const showMembersPopup = ref(false);
const showCalendarInfoPopup = ref(false);
const copySuccess = ref(false);

const toggleMembersPopup = () => {
  showMembersPopup.value = !showMembersPopup.value;
};

const handleClassInfoClick = () => {
  showCalendarInfoPopup.value = !showCalendarInfoPopup.value;
};

const copyCalendarId = () => {
  if (calendarStore.calendar?.calendar_id) {
    navigator.clipboard.writeText(calendarStore.calendar.calendar_id)
      .then(() => {
        copySuccess.value = true;
        setTimeout(() => {
          copySuccess.value = false;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }
};

const upcomingEventsToList = computed(() => {
  return eventStore.upcomingEvents.slice(0, 5);
});

const recentEventsToList = computed(() => {
  return eventStore.recentEvents.slice(0, 5);
});

const displayedEvents = computed(() => {
  return eventStore.activePrimaryFilter === "Upcoming"
    ? upcomingEventsToList.value
    : recentEventsToList.value;
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

const selectActivityFilter = (filter: "Upcoming" | "Recent") => {
  eventStore.setActivePrimaryFilter(filter);
};
</script>

<template>
  <div :class="['sidebar', { 'sidebar-open': isOpen }]">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <div class="sidebar-upper">
          <h2 class="sidebar-title" @click="router.push('/')">Clace</h2>
          <button @click="handleToggleSidebar" class="sidebar-toggle-x-btn">
            <X :size="20" />
          </button>
        </div>
        <div class="sidebar-lower">
          <div class="sidebar-nav">
            <button
              class="nav-button"
              title="Dashboard"
              @click="router.push('/dashboard')"
            >
              <LayoutDashboard :size="18" />
            </button>
            <button
              class="nav-button"
              title="Calendar"
              @click="router.push('/calendar')"
            >
              <CalendarDays :size="20" />
            </button>
            <button class="nav-button" title="Settings">
              <Settings :size="20" />
            </button>
            <button
              class="nav-button"
              title="Profile"
              @click="router.push('/profile')"
            >
              <UserRound :size="20" />
            </button>
            <button
              class="nav-button"
              @click="toggleMembersPopup"
              title="Class Members"
            >
              <Users :size="20" />
            </button>
            <button
              class="nav-button"
              @click="handleClassInfoClick"
              title="Class Information"
            >
              <Info :size="20" />
            </button>
          </div>
        </div>
      </div>

      <teleport to="body">
        <div v-if="showMembersPopup" class="members-popup">
          <h3>Class Members</h3>
          <p>List of class members will go here.</p>
        </div>

        <div v-if="showCalendarInfoPopup" class="calendar-info-popup">
          <div class="popup-header">
            <h3>Class Calendar Information</h3>
            <button @click="showCalendarInfoPopup = false" class="close-btn">
              <X :size="18" />
            </button>
          </div>
          
          <div class="info-section">
            <h4>Calendar Name</h4>
            <p>{{ calendarStore.calendarName }}</p>
          </div>
          
          <div class="info-section">
            <h4>Calendar ID</h4>
            <div class="copy-section">
              <p class="calendar-id">{{ calendarStore.calendar?.calendar_id }}</p>
              <button @click="copyCalendarId" class="copy-btn" :class="{ 'copied': copySuccess }">
                <Copy :size="16" />
                <span v-if="copySuccess">Copied!</span>
              </button>
            </div>
          </div>
          
          <div class="info-section">
            <h4>Join Code</h4>
            <p class="join-code">{{ calendarStore.joinCode }}</p>
          </div>
          
          <div class="info-section">
            <h4>Creator</h4>
            <p>{{ calendarStore.isCreator ? 'You are the creator' : 'Another user' }}</p>
          </div>
        </div>
      </teleport>

      <div class="mini-calendar-section">
        <MiniCalendar
          :current-date="props.currentDateForMiniCalendar"
          :events="props.allEventsForMiniCalendar"
          @date-select="handleMiniDateSelect"
          @month-change="handleMiniMonthChange"
        />
      </div>

      <div class="activity-events-section">
        <ActivityFilterButtons
          :activePrimaryFilter="eventStore.activePrimaryFilter"
          @selectActivityFilter="selectActivityFilter"
        />
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
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar.sidebar-open {
  transform: translateX(0);
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

.sidebar-content {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
}

.members-popup, .calendar-info-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 300px;
}

.popup-header {
  margin-top: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #7c3aed;
  margin-bottom: 0.75rem;
}

.members-popup p {
  font-size: 0.9rem;
  color: #6366f1;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  gap: 1rem;
}

.sidebar-nav {
  display: flex;
  gap: 0.75rem;
}

.nav-button {
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #3730a3;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.nav-button::before {
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

.nav-button:hover::before {
  left: 100%;
}

.sidebar-lower {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.sidebar-description {
  margin: 0;
  font-size: 0.875rem;
  color: #6366f1;
}

@media (max-width: 480px) {
  .nav-button {
    padding: 0.4rem;
  }
  .sidebar-nav {
    gap: 0.5rem;
  }
  .sidebar-description {
    font-size: 0.75rem;
  }
}

.sidebar-upper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar-upper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.sidebar-lower {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-x-btn {
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

.sidebar-toggle-x-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #3730a3;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.sidebar-toggle-x-btn::before {
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

.sidebar-toggle-x-btn:hover::before {
  left: 100%;
}

.mini-calendar-section {
  flex-shrink: 0;
}

.activity-events-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.primary-filter-group {
  display: flex;
  gap: 0.5rem;
  background: rgba(236, 239, 241, 0.8);
  border-radius: 0.75rem;
  padding: 0.375rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.events-list {
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #667eea transparent;
  padding-right: 0.5rem;
  flex-grow: 1;
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

.event-color-indicator {
  width: 4px;
  height: 100%;
  min-height: 40px;
  border-radius: 2px;
  flex-shrink: 0;
  align-self: stretch;
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

@media (max-width: 768px) {
  .sidebar {
    width: 300px;
  }
  .sidebar-content {
    padding: 0.8rem;
    gap: 1rem;
  }
  .events-list {
    max-height: 250px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 240px;
  }
  .sidebar-content {
    padding: 0.8rem 0.6rem;
    gap: 0.8rem;
  }
  .events-list {
    max-height: 200px;
  }
  .event-item {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  .event-title {
   font-size: 0.9rem;
  }
  .event-time, .event-course {
   font-size: 0.7rem;
  }
 }

 @media (max-height: 700px) {
  .sidebar-content {
    padding: 0.8rem 0.6rem;
    gap: 0.8rem;
  }
  .events-list {
    max-height: 200px;
  }
}

@media (max-height: 600px) {
  .sidebar {
    width: 200px;
  }
  .sidebar-content {
    padding: 0.4rem 0.3rem;
    gap: 0.4rem;
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
   font-size: 0.9rem;
  }
  .event-time, .event-course {
   font-size: 0.7rem;
  }
 }
</style>
