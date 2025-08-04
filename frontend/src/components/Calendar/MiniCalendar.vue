<script setup lang="ts">
import { computed, ref } from "vue";
import type { SharedEventItem } from "../../types/event";

interface Props {
  currentDate: Date;
  events?: SharedEventItem[];
}

interface Emits {
  (e: "date-select", date: Date): void;
  (e: "month-change", date: Date): void;
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
});

const emit = defineEmits<Emits>();

const viewDate = ref(new Date(props.currentDate));

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const currentMonth = computed(() => monthNames[viewDate.value.getMonth()]);
const currentYear = computed(() => viewDate.value.getFullYear());

const monthDays = computed(() => {
  const year = viewDate.value.getFullYear();
  const month = viewDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const current = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
      isToday: isToday(current),
      isSelected: isSameDay(current, props.currentDate),
      hasEvents: hasEventsOnDate(current),
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
});

const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const hasEventsOnDate = (date: Date): boolean => {
  return props.events.some((event) => {
    const eventStart = new Date(event.startDate);
    if (event.allDay) {
      return isSameDay(eventStart, date);
    }
    return isSameDay(eventStart, date);
  });
};

const previousMonth = () => {
  const newDate = new Date(viewDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  viewDate.value = newDate;
  emit("month-change", newDate);
};

const nextMonth = () => {
  const newDate = new Date(viewDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  viewDate.value = newDate;
  emit("month-change", newDate);
};

const selectDate = (date: Date) => {
  emit("date-select", date);
};

const goToToday = () => {
  const today = new Date();
  viewDate.value = today;
  emit("date-select", today);
  emit("month-change", today);
};
</script>

<template>
  <div class="mini-calendar">
    <div class="mini-calendar-header">
      <button
        class="nav-button"
        @click="previousMonth"
        :aria-label="'Previous month'"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>

      <div class="month-year">
        <h3 class="month-name">{{ currentMonth }}</h3>
        <span class="year">{{ currentYear }}</span>
      </div>

      <button class="nav-button" @click="nextMonth" :aria-label="'Next month'">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>
    </div>

    <div class="week-headers">
      <div v-for="day in weekDays" :key="day" class="week-header">
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid">
      <button
        v-for="day in monthDays"
        :key="day.date.toISOString()"
        :class="[
          'day-cell',
          {
            'other-month': !day.isCurrentMonth,
            today: day.isToday,
            selected: day.isSelected,
            'has-events': day.hasEvents,
          },
        ]"
        @click="selectDate(day.date)"
        :aria-label="day.date.toLocaleDateString()"
      >
        <span class="day-number">{{ day.date.getDate() }}</span>
        <div v-if="day.hasEvents" class="event-indicator"></div>
      </button>
    </div>

    <!-- <div class="mini-calendar-footer">
      <button class="today-button" @click="goToToday">Today</button>
    </div> -->
  </div>
</template>

<style scoped>
.mini-calendar {
  width: 280px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  color: #4c1d95;
  position: relative;
}

.mini-calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 0.25rem;
}

.nav-button {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #4c1d95;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #3730a3;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.month-year {
  text-align: center;
  flex: 1;
}

.month-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.year {
  font-size: 0.75rem;
  color: #6366f1;
  font-weight: 600;
}

.week-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 0.5rem;
}

.week-header {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #7c3aed;
  padding: 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-cell {
  position: relative;
  aspect-ratio: 1;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4c1d95;
  min-height: 32px;
}

.day-cell:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
}

.day-cell.other-month {
  color: rgba(76, 29, 149, 0.4);
}

.day-cell.other-month:hover {
  color: rgba(76, 29, 149, 0.6);
}

.day-cell.today {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
}

.day-cell.today:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: scale(1.05);
  box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.6);
}

.day-cell.selected {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid #667eea;
  color: #4c1d95;
  font-weight: 600;
}

.day-cell.selected:hover {
  background: rgba(102, 126, 234, 0.3);
}

.day-number {
  position: relative;
  z-index: 2;
}

.event-indicator {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 4px;
  height: 4px;
  background: #7c3aed;
  border-radius: 50%;
  z-index: 1;
}

.day-cell.today .event-indicator {
  background: rgba(255, 255, 255, 0.9);
}

.day-cell.has-events {
  position: relative;
}

.mini-calendar-footer {
  margin-top: 1rem;
  text-align: center;
}

.today-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.today-button:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.6);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .mini-calendar {
    width: 240px;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .month-name {
    font-size: 0.9rem;
    background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .year {
    font-size: 0.7rem;
    color: #6366f1;
  }

  .day-cell {
    min-height: 28px;
    font-size: 0.7rem;
    color: #4c1d95;
  }

  .week-header {
    font-size: 0.65rem;
    padding: 0.375rem 0;
    color: #7c3aed;
  }

  .nav-button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #4c1d95;
  }

  .nav-button:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #3730a3;
  }

  .today-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
  }

  .today-button:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.6);
  }
}

@media (max-width: 480px) {
  .mini-calendar {
    width: 200px;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .day-cell {
    min-height: 24px;
    font-size: 0.65rem;
    color: #4c1d95;
  }

  .day-cell.other-month {
    color: rgba(76, 29, 149, 0.4);
  }

  .day-cell.today {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
  }

  .event-indicator {
    width: 3px;
    height: 3px;
    bottom: 2px;
    right: 2px;
    background: #7c3aed;
  }

  .month-name {
    background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .year {
    color: #6366f1;
  }

  .week-header {
    color: #7c3aed;
  }

  .nav-button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #4c1d95;
  }

  .today-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
  }
}
</style>
