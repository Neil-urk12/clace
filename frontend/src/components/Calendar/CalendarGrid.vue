<script setup lang="ts">
import { computed } from 'vue'
import type { SharedEventItem } from '../../types/event' 
import CalendarEventComponent from './CalendarEvent.vue'

interface Props {
  currentDate: Date
  viewMode: 'month' | 'week' | 'day'
  events: SharedEventItem[] 
}

interface Emits {
  (e: 'date-click', date: Date): void
  (e: 'event-click', event: SharedEventItem): void 
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthDays = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  startDate.setHours(12, 0, 0, 0); 
  
  const days: Date[] = []
  const current = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const weekDaysComputed = computed(() => {
  const currentViewDate = new Date(props.currentDate); 
  const dayOfWeek = currentViewDate.getDay(); 

  currentViewDate.setDate(currentViewDate.getDate() - dayOfWeek); 
  const days: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(
      currentViewDate.getFullYear(),
      currentViewDate.getMonth(),
      currentViewDate.getDate() + i,
      12, 0, 0, 0 
    );
    days.push(dayDate);
  }
  
  return days
})

const dayHours = computed(() => {
  const hours: Date[] = []
  for (let i = 0; i < 24; i++) {
    const hour = new Date(props.currentDate)
    hour.setHours(i, 0, 0, 0)
    hours.push(hour)
  }
  return hours
})

const getEventsForDate = (date: Date) => {
  return props.events.filter(event => {
    const eventDate = new Date(event.startDate)
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    )
  })
}

const getEventsForHour = (date: Date, hour: number) => {
  return props.events.filter(event => {
    const eventDate = new Date(event.startDate)
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate() &&
      eventDate.getHours() === hour &&
      !event.allDay
    )
  })
}

const getAllDayEvents = (date: Date) => {
  return props.events.filter(event => {
    const eventDate = new Date(event.startDate)
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate() &&
      event.allDay
    )
  })
}

const isToday = (date: Date) => {
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

const isCurrentMonth = (date: Date) => {
  return (
    date.getFullYear() === props.currentDate.getFullYear() &&
    date.getMonth() === props.currentDate.getMonth()
  )
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true
  })
}

const handleDateClick = (date: Date) => {
  emit('date-click', date)
}

const handleEventClick = (event: SharedEventItem) => { // Updated parameter type
  emit('event-click', event)
}
</script>

<template>
  <div class="calendar-grid" :class="`view-${viewMode}`">
    <!-- Month View -->
    <div v-if="viewMode === 'month'" class="month-view">
      <!-- Week day headers -->
      <div class="week-header">
        <div v-for="day in weekDays" :key="day" class="day-header">
          {{ day }}
        </div>
      </div>
      
      <!-- Month grid -->
      <div class="month-grid">
        <div
          v-for="date in monthDays"
          :key="date.toISOString()"
          :class="[
            'day-cell',
            {
              'today': isToday(date),
              'other-month': !isCurrentMonth(date)
            }
          ]"
          @click="handleDateClick(date)"
        >
          <div class="day-number">{{ date.getDate() }}</div>
          <div class="day-events">
            <CalendarEventComponent
              v-for="event in getEventsForDate(date).slice(0, 3)"
              :key="event.id"
              :event="event"
              :compact="true"
              :class="{ 'dot-view': getEventsForDate(date).length > 2 }"
              :title="event.title"
              @click="handleEventClick(event)"
            />
            <div
              v-if="getEventsForDate(date).length > 3"
              class="more-events"
            >
              +{{ getEventsForDate(date).length - 3 }} more
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Week View -->
    <div v-if="viewMode === 'week'" class="week-view">
      <div class="week-header">
        <div class="time-header"></div>
        <div
          v-for="date in weekDaysComputed"
          :key="date.toISOString()"
          :class="['day-header', { 'today': isToday(date) }]"
        >
          <div class="day-name">{{ date.toLocaleDateString('en-US', { weekday: 'short' }) }}</div>
          <div class="day-date">{{ date.getDate() }}</div>
        </div>
      </div>

      <!-- All-day events -->
      <div class="all-day-section">
        <div class="all-day-label">All Day</div>
        <div class="all-day-grid">
          <div
            v-for="date in weekDaysComputed"
            :key="`allday-${date.toISOString()}`"
            class="all-day-cell"
            @click="handleDateClick(date)"
          >
            <CalendarEventComponent
              v-for="event in getAllDayEvents(date)"
              :key="event.id"
              :event="event"
              :compact="true"
              :title="event.title"
              @click="handleEventClick(event)"
            />
          </div>
        </div>
      </div>

      <!-- Time grid -->
      <div class="time-grid">
        <div
          v-for="hour in dayHours"
          :key="hour.toISOString()"
          class="hour-row"
        >
          <div class="time-label">{{ formatTime(hour) }}</div>
          <div
            v-for="date in weekDaysComputed"
            :key="`${date.toISOString()}-${hour.getHours()}`"
            class="hour-cell"
            @click="handleDateClick(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour.getHours()))"
          >
            <CalendarEventComponent
              v-for="event in getEventsForHour(date, hour.getHours())"
              :key="event.id"
              :event="event"
              :title="event.title"
              @click="handleEventClick(event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Day View -->
    <div v-if="viewMode === 'day'" class="day-view">
      <div class="day-header">
        <h2>{{ currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}</h2>
      </div>

      <!-- All-day events -->
      <div class="all-day-section">
        <div class="all-day-label">All Day</div>
        <div class="all-day-events">
          <CalendarEventComponent
            v-for="event in getAllDayEvents(currentDate)"
            :key="event.id"
            :event="event"
            :title="event.title"
            @click="handleEventClick(event)"
          />
        </div>
      </div>

      <!-- Time slots -->
      <div class="time-slots">
        <div
          v-for="hour in dayHours"
          :key="hour.toISOString()"
          class="time-slot"
          @click="handleDateClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour.getHours()))"
        >
          <div class="time-label">{{ formatTime(hour) }}</div>
          <div class="time-content">
            <CalendarEventComponent
              v-for="event in getEventsForHour(currentDate, hour.getHours())"
              :key="event.id"
              :event="event"
              :title="event.title"
              @click="handleEventClick(event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-grid {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  border-radius: 20px;
  overflow: hidden;
}

/* Month View */
.month-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  color: #4c1d95;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.day-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.day-header:hover::before {
  opacity: 1;
}

.day-header:last-child {
  border-right: none;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  flex: 1;
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.day-cell {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 120px;
}

.day-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  opacity: 0;
  transition: opacity 0.3s;
}

.day-cell:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.day-cell:hover::before {
  opacity: 1;
}

.day-cell.today {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: #667eea;
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.3);
}

.day-cell.today .day-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
}

.day-cell.other-month {
  background: rgba(255, 255, 255, 0.4);
  color: #9ca3af;
}

.day-cell.other-month .day-number {
  opacity: 0.5;
}

.day-number {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
  z-index: 1;
  position: relative;
}

.day-events {
  padding: 0 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  overflow: hidden;
  z-index: 1;
  position: relative;
}

.more-events {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-align: center;
  padding: 0.25rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
  margin-top: 0.25rem;
}

/* Week View */
.week-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.week-view .week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.time-header {
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.week-view .day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.week-view .day-header.today {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: #667eea;
}

.day-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.day-date {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-top: 0.25rem;
}

.all-day-section {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  min-height: 60px;
}

.all-day-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.all-day-grid {
  display: contents;
}

.all-day-cell {
  padding: 0.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.05);
}

.all-day-cell:hover {
  background: rgba(102, 126, 234, 0.1);
}

.time-grid {
  flex: 1;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.hour-row {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  min-height: 60px;
}

.time-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.hour-cell {
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.05);
}

.hour-cell:hover {
  background: rgba(102, 126, 234, 0.1);
}

/* Day View */
.day-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.day-view .day-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.day-view .day-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.day-view .all-day-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.all-day-events {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
}

.time-slots {
  flex: 1;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.time-slot {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  min-height: 80px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.time-slot:hover {
  background: rgba(102, 126, 234, 0.05);
}

.time-slot .time-label {
  width: 80px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.time-content {
  flex: 1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
}

/* Responsive Design */
@media (max-width: 768px) {
  .calendar-grid {
    border-radius: 12px;
  }

  .month-view {
    font-size: 0.875rem;
  }

  .week-header {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  }

  .day-header {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .month-grid {
    gap: 0.5px;
  }

  .day-cell {
    min-height: 80px;
    background: rgba(255, 255, 255, 0.9);
  }

  .day-cell:hover {
    transform: none;
    box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
  }

  .day-cell.today {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%);
  }

  .day-cell.today .day-number {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.875rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    box-shadow: 0 2px 10px 0 rgba(102, 126, 234, 0.4);
  }

  .day-cell.other-month {
    background: rgba(255, 255, 255, 0.5);
  }

  .day-cell.other-month .day-number {
    opacity: 0.4;
  }

  .day-number {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .day-events {
    padding: 0 0.5rem 0.5rem;
    gap: 0.125rem;
  }

  .more-events {
    font-size: 0.625rem;
    padding: 0.125rem 0.25rem;
    border-radius: 4px;
    background: rgba(102, 126, 234, 0.15);
  }

  .week-view .week-header,
  .all-day-section,
  .hour-row {
    grid-template-columns: 60px repeat(7, 1fr);
  }

  .time-label {
    font-size: 0.625rem;
  }

  .time-slot .time-label {
    width: 60px;
  }

  .hour-row {
    min-height: 50px;
  }

  .time-slot {
    min-height: 60px;
  }
}

@media (max-width: 480px) {
  .day-header {
    padding: 0.5rem 0.25rem;
    font-size: 0.625rem;
  }

  .day-cell {
    min-height: 60px;
  }

  .day-number {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }

  .day-cell.today .day-number {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }

  .more-events {
    font-size: 0.5rem;
    padding: 0.1rem 0.2rem;
  }

  .day-view .day-header h2 {
    font-size: 1.25rem;
  }

  .day-events {
    padding: 0 0.375rem 0.375rem;
    gap: 0.1rem;
  }

  .day-events .calendar-event {
    font-size: 0.5rem;
    padding: 0.1rem 0.2rem;
    border-radius: 3px;
    min-height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .day-events .calendar-event .event-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .day-events .calendar-event.compact {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    padding: 0;
    margin: 0.5px auto;
    border: none;
    min-height: 6px;
  }

  .day-events .calendar-event.compact .event-content {
    display: none;
  }
}

/* Enhanced Mobile Responsive Grid */
@media (max-width: 768px) {
  .calendar-grid {
    border-radius: 12px;
    overflow: hidden;
  }

  .week-header {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  }

  .month-grid {
    background: rgba(255, 255, 255, 0.05);
  }

  /* Hide weekends on mobile for better space utilization */
  .day-header:nth-child(7),
  .day-header:nth-child(1) {
    display: none;
  }

  .day-cell:nth-child(7n),
  .day-cell:nth-child(7n-6) {
    display: none;
  }

  /* Adjust grid for 5 columns (Mon-Fri) */
  .week-header {
    grid-template-columns: repeat(5, 1fr);
  }

  .month-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .day-events {
    padding: 0 0.25rem 0.25rem;
    gap: 0.1rem;
  }

  .day-events .calendar-event.compact {
    font-size: 0.4rem;
    padding: 0.05rem 0.1rem;
    border-radius: 2px;
    min-height: 12px;
    margin: 0.1rem 0;
    background: linear-gradient(135deg, var(--event-color, #667eea), var(--event-color-dark, #5a67d8));
  }

  .day-events .calendar-event.compact .event-content {
    text-align: center;
    font-weight: 500;
  }

  .day-events .calendar-event.compact:hover::after {
    content: attr(title);
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.75rem;
    z-index: 1000;
    white-space: nowrap;
    max-width: 80vw;
    text-overflow: ellipsis;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.3);
  }
}
</style>
