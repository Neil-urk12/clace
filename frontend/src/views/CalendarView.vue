<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    List,
    Grid3x3,
    Menu,
} from "lucide-vue-next";
const CalendarGrid = defineAsyncComponent(() => import("../components/Calendar/CalendarGrid.vue"));
const EventModal = defineAsyncComponent(() => import("../components/Calendar/EventModal.vue"));
const CalendarSidebar = defineAsyncComponent(() => import("../components/Calendar/CalendarSidebar.vue"));
import BaseButton from "../components/Global/BaseButton.vue";
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
    currentDate.value = new Date(date);
    highlightedDate.value = date;
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
    eventStore.addEvent(eventData as Omit<SharedEventItem, "id">);
    showEventModal.value = false;
    selectedEvent.value = null;
    selectedDate.value = null;
};

const handleUpdateEvent = (eventData: Partial<SharedEventItem>) => {
    if (eventData.id) {
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

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
        closeModal();
    } else if (event.key === "n" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        isCreatingEvent.value = true;
        showEventModal.value = true;
    }
};

onMounted(async () => {
    window.addEventListener("keydown", handleKeyPress);
    
    // Load events from API for production use
    try {
        await eventStore.loadEvents();
    } catch (error) {
        console.warn('Failed to load events:', error);
    }
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyPress);
});
</script>

<template>
    <div class="calendar-view">
        <!-- Sidebar -->
        <CalendarSidebar :is-open="sidebarOpen" :current-date-for-mini-calendar="currentDate"
            :all-events-for-mini-calendar="eventsFromStore" @toggle="toggleSidebar"
            @mini-calendar-date-select="handleMiniCalendarDateSelect"
            @mini-calendar-month-change="handleMiniCalendarMonthChange" @list-event-click="handleEventClick" />

        <!-- Sidebar Overlay (mobile) -->
        <!-- Sidebar Overlay (only covers main content) -->
        <div v-if="sidebarOpen" class="sidebar-overlay visible" @click="toggleSidebar"></div>

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
                        <button @click="viewMode = 'month'" :class="['view-btn', { active: viewMode === 'month' }]">
                            <Grid3x3 :size="16" />
                            Month
                        </button>
                        <button @click="viewMode = 'week'" :class="['view-btn', { active: viewMode === 'week' }]">
                            <List :size="16" />
                            Week
                        </button>
                        <button @click="viewMode = 'day'" :class="['view-btn', { active: viewMode === 'day' }]">
                            <CalendarIcon :size="16" />
                            Day
                        </button>
                    </div>
                </div>

                <div class="header-right desktop-only">
                    <BaseButton @click="
                        isCreatingEvent = true;
                    showEventModal = true;
                    " design="gradient-primary" size="large" :icon-left="Plus" class="create-event-btn">
                        <span class="create-text">Create Event</span>
                    </BaseButton>
                </div>
            </div>

            <!-- Calendar Content -->
            <div class="calendar-content">
                <CalendarGrid :current-date="currentDate" :view-mode="viewMode" :events="eventsFromStore"
                    :highlighted-date="highlightedDate" @date-click="handleDateClick" @event-click="handleEventClick" />
            </div>

            <!-- Event Modal -->
            <EventModal v-show="showEventModal" :show="showEventModal" :event="selectedEvent"
                :is-creating="isCreatingEvent" :selected-date="selectedDate" @create="handleCreateEvent"
                @update="handleUpdateEvent" @delete="handleDeleteEvent" @close="closeModal" />
        </div>

        <!-- Floating Create Button (mobile & tablet) -->
        <div class="floating-create-btn-container">
            <BaseButton @click="
                isCreatingEvent = true;
            showEventModal = true;
            " design="gradient-primary" size="large" :icon-left="Plus" class="floating-create-btn">
                <span class="create-text-schedule">Schedule</span>
            </BaseButton>
        </div>
    </div>
</template>

<style scoped lang="css">
.calendar-view {
    display: flex;
    height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;
    position: relative;
}

.calendar-view::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
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
    transition: opacity 0.3s ease;
    opacity: 0;
}

.sidebar-overlay.visible {
    opacity: 1;
}

/* Main Content */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 0;
    height: 100vh;
    overflow: hidden;
}

/* Sidebar behavior for different screen sizes */
.main-content.sidebar-expanded {
    margin-left: 320px;
}

/* Medium screens - make sidebar an overlay */
@media (max-width: 1280px) and (min-width: 1025px) {
    .main-content.sidebar-expanded {
        margin-left: 0;
    }

    .sidebar-overlay {
        display: block;
        z-index: 998;
        /* Below the sidebar (z-index 1001) but above other content */
        left: 320px;
        /* Start after the sidebar width */
    }
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
    min-height: 80px;
}

.calendar-header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05));
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
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent);
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
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.1));
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

.create-text {
    display: inline;
}

.calendar-content {
    padding: 1.5rem;
    position: relative;
    z-index: 1;
    min-height: 0;
    overflow: hidden;
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

/* Desktop-specific styles - ensure full height utilization */
@media (min-width: 1025px) {
    .floating-create-btn-container {
        display: none;
        /* Hide floating button on desktop */
    }

    .create-event-btn {
        display: flex !important;
        /* Show header button on desktop */
    }

    .calendar-view {
        height: 100vh;
        overflow: hidden;
    }

    .main-content {
        height: 100vh;
        overflow: hidden;
    }

    .calendar-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .calendar-content::before {
        top: 0.5rem;
        left: 0.5rem;
        right: 0.5rem;
        bottom: 0.5rem;
    }
}

/* Tablet and Mobile Design */
@media (max-width: 1024px) {
    .calendar-view {
        min-height: calc(100vh - 50px);
        height: auto;
    }

    .main-content {
        min-height: calc(100vh - 50px);
        /* height: auto; */
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
        z-index: 998;
        /* Below the sidebar (z-index 1001) but above other content */
        left: 300px;
        /* Start after the sidebar width for tablet */
    }

    .calendar-header {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.75rem;
        padding: 1rem 0.75rem;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        min-height: auto;
    }



    @media (max-width: 768px) {
        .calendar-header {
            flex-direction: column;
        }
    }

    .sidebar-toggle-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #4c1d95;
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 0.5rem;
    }

    .sidebar-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        color: #3730a3;
    }

    .calendar-header::before {
        background: linear-gradient(135deg,
                rgba(255, 255, 255, 0.2),
                rgba(255, 255, 255, 0.1));
    }

    .header-left {
        order: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex: 2;
        min-width: 0;
    }

    .header-center {
        order: 2;
        flex: 1;
        justify-content: center;
        min-width: 0;
    }

    @media (max-width: 768px) {
        .header-left {
            width: 100%;
            justify-content: space-between;
        }

        .header-center {
            order: 3;
            width: 100%;
        }
    }

    .header-right {
        order: 2;
        width: auto;
        justify-content: flex-end;
        position: relative;
        top: auto;
        right: auto;
    }

    .nav-controls {
        display: flex;
        gap: 0.5rem;
    }

    .nav-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #4c1d95;
        width: 2rem;
        height: 2rem;
    }

    .nav-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        color: #3730a3;
    }

    .today-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
    }

    .today-btn:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.6);
    }

    .current-date {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
        flex: 1;
        margin: 0 1rem;
    }

    .create-text {
        display: none;
    }

    .create-event-btn {
        display: none !important;
    }

    /* Floating create button for mobile and tablet */
    .floating-create-btn-container {
        display: flex;
        position: fixed;
        bottom: 130px;
        /* Position above the bottom nav */
        right: 20px;
        z-index: 500;
    }

    .floating-create-btn {
        background: white !important;
        color: #667eea !important;
        border: 2px solid #667eea !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        width: auto !important;
        height: 56px !important;
        border-radius: 28px !important;
        padding: 0 1.5rem !important;
        gap: 0.5rem;
    }

    .floating-create-btn:hover {
        background: #f8fafc !important;
        color: #5a67d8 !important;
        border-color: #5a67d8 !important;
        transform: scale(1.1);
    }

    .floating-create-btn svg {
        color: #667eea !important;
    }

    .floating-create-btn:hover svg {
        color: #5a67d8 !important;
    }

    .create-text-schedule {
        display: inline;
    }

    .view-controls {
        width: 100%;
        justify-content: space-around;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.3rem;
        align-items: center;
    }

    .view-btn {
        /* flex: 1; */
        justify-content: center;
        /* color: rgba(255, 255, 255, 0.8); */
        /* font-size: 0.8rem; */
        /* padding: 0.5rem 1rem; */
        /* WTF KA NONSENSE ANING CSS */
        /* gap: 10px; */
    }

    .view-btn:hover {
        color: #4c1d95;
    }

    .view-btn.active {
        background: rgba(255, 255, 255, 0.9);
        color: #4c1d95;
        box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    }

    .calendar-content {
        padding: 1rem;
        background: transparent;
        /* flex: 1; */
        overflow: auto;
    }

    .calendar-content::before {
        top: 0.5rem;
        left: 0.5rem;
        right: 0.5rem;
        bottom: 0.5rem;
        border-radius: 16px;
    }

    /* Mobile specific adjustments */
    @media (max-width: 480px) {
        .sidebar-overlay {
            left: 240px;
            /* Start after the sidebar width for mobile */
        }

        .calendar-view {
            min-height: calc(100vh - 80px);
        }

        .main-content {
            min-height: calc(100vh - 80px);
        }

        .sidebar {
            width: 240px;
        }

        .sidebar-content {
            padding: 1rem 0.75rem;
            gap: 1rem;
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
            background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 0 0.5rem;
        }

        .floating-create-btn {
            height: 48px !important;
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
}</style>
