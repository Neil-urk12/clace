<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CalendarLayout from './CalendarLayout.vue'
import type { SharedEventItem } from '../../types/event'

const currentView = ref<'month' | 'week' | 'day'>('month')

// Sample events data
const events = ref<SharedEventItem[]>([
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync',
    startDate: new Date(2025, 4, 15, 10, 0), // May 15, 2025 10:00 AM
    endDate: new Date(2025, 4, 15, 11, 0),
    allDay: false,
    type: 'ClassSession',
    color: '#3b82f6',
    status: 'Scheduled'
  },
  {
    id: '2',
    title: 'Project Deadline',
    description: 'Final project submission',
    startDate: new Date(2025, 4, 20, 23, 59), // May 20, 2025
    allDay: true,
    type: 'Assignment',
    color: '#ef4444',
    status: 'Pending'
  },
  {
    id: '3',
    title: 'Birthday Party',
    description: 'John\'s birthday celebration',
    startDate: new Date(2025, 4, 25, 18, 0), // May 25, 2025 6:00 PM
    endDate: new Date(2025, 4, 25, 22, 0),
    allDay: false,
    type: 'GeneralActivity',
    color: '#10b981',
    status: 'Scheduled'
  },
  {
    id: '4',
    title: 'Study Session',
    description: 'Prepare for upcoming exam',
    startDate: new Date(2025, 4, 12, 14, 0), // May 12, 2025 2:00 PM
    endDate: new Date(2025, 4, 12, 17, 0),
    allDay: false,
    type: 'Reminder',
    color: '#f59e0b',
    status: 'Scheduled'
  },
  {
    id: '5',
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    startDate: new Date(2025, 4, 8, 9, 30), // May 8, 2025 9:30 AM
    endDate: new Date(2025, 4, 8, 10, 30),
    allDay: false,
    type: 'Reminder',
    color: '#8b5cf6',
    status: 'Scheduled'
  },
  {
    id: '6',
    title: 'Conference Workshop',
    description: 'AI & Machine Learning Workshop',
    startDate: new Date(2025, 4, 30, 9, 0), // May 30, 2025
    endDate: new Date(2025, 4, 30, 17, 0),
    allDay: false,
    type: 'ClassSession',
    color: '#06b6d4',
    status: 'Scheduled'
  }
])

const selectedEvent = ref<SharedEventItem | null>(null)
const showEventModal = ref(false)

const handleEventClick = (event: SharedEventItem) => {
  selectedEvent.value = event
  showEventModal.value = true
}

const handleDateClick = (date: Date) => {
  console.log('Date clicked:', date)
}

const handleViewChange = (view: 'month' | 'week' | 'day') => {
  currentView.value = view
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

onMounted(() => {
  // You could load events from an API here
  console.log('Calendar demo mounted with', events.value.length, 'events')
})
</script>

<template>
  <div class="calendar-demo">
    <!-- Header -->
    <header class="demo-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="demo-title">Calendar with Mini Sidebar</h1>
          <p class="demo-subtitle">A modern calendar interface with navigation sidebar</p>
        </div>
        
        <div class="header-controls">
          <div class="view-selector">
            <button 
              :class="['view-button', { active: currentView === 'month' }]"
              @click="handleViewChange('month')"
            >
              Month
            </button>
            <button 
              :class="['view-button', { active: currentView === 'week' }]"
              @click="handleViewChange('week')"
            >
              Week
            </button>
            <button 
              :class="['view-button', { active: currentView === 'day' }]"
              @click="handleViewChange('day')"
            >
              Day
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Calendar Layout -->
    <div class="calendar-container">
      <CalendarLayout
        :events="events"
        :view="currentView"
        @event-click="handleEventClick"
        @date-click="handleDateClick"
        @view-change="handleViewChange"
      />
    </div>

    <!-- Event Modal -->
    <div v-if="showEventModal" class="modal-overlay" @click="closeEventModal">
      <div class="event-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedEvent?.title }}</h3>
          <button class="close-button" @click="closeEventModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div v-if="selectedEvent?.description" class="event-detail">
            <strong>Description:</strong>
            <p>{{ selectedEvent.description }}</p>
          </div>
          
          <div class="event-detail">
            <strong>Date:</strong>
            <p>{{ selectedEvent?.startDate.toLocaleDateString() }}</p>
          </div>
          
          <div v-if="!selectedEvent?.allDay" class="event-detail">
            <strong>Time:</strong>
            <p>
              {{ selectedEvent?.startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) }}
              -
              {{ selectedEvent?.endDate?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) }}
            </p>
          </div>
          
          <div class="event-detail">
            <strong>Type:</strong>
            <span class="event-type" :style="{ color: selectedEvent?.color }">
              {{ selectedEvent?.type }}
            </span>
          </div>
          
          <div class="event-detail">
            <strong>Status:</strong>
            <span class="event-status">{{ selectedEvent?.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-demo {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f172a;
  color: #e2e8f0;
}

.demo-header {
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  flex: 1;
}

.demo-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #f1f5f9;
}

.demo-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-selector {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.view-button {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.view-button:last-child {
  border-right: none;
}

.view-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.view-button.active {
  background: #3b82f6;
  color: white;
}

.calendar-container {
  flex: 1;
  overflow: hidden;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.event-modal {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #f1f5f9;
}

.close-button {
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
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
}

.event-detail {
  margin-bottom: 1rem;
}

.event-detail:last-child {
  margin-bottom: 0;
}

.event-detail strong {
  display: block;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.event-detail p {
  margin: 0;
  color: #e2e8f0;
  line-height: 1.5;
}

.event-type {
  font-weight: 600;
  text-transform: capitalize;
}

.event-status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-left {
    text-align: center;
  }

  .demo-title {
    font-size: 1.25rem;
  }

  .view-selector {
    justify-content: center;
  }

  .event-modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }

  .modal-header,
  .modal-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .demo-title {
    font-size: 1.125rem;
  }

  .demo-subtitle {
    font-size: 0.8rem;
  }

  .view-button {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>