<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const primaryColor = '#4f46e5'; // Defined primary color

const daysInMonth = ref<number[]>([]);
const currentMonthName = ref('');
const currentYear = ref(0);
const highlightedDay = ref(0);
let interval: number | undefined;

const generateCalendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // Current month

  currentMonthName.value = new Date(year, month).toLocaleString('en-US', { month: 'long' });
  currentYear.value = year;

  const days = new Date(year, month + 1, 0).getDate(); // Get number of days in current month
  daysInMonth.value = Array.from({ length: days }, (_, i) => i + 1);

  // Start highlighting from a random day to make it dynamic
  highlightedDay.value = Math.floor(Math.random() * days) + 1;
};

const startAnimation = () => {
  interval = setInterval(() => {
    highlightedDay.value = (highlightedDay.value % daysInMonth.value.length) + 1;
  }, 1500); // Change highlighted day every 1.5 seconds
};

onMounted(() => {
  generateCalendar();
  startAnimation();
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<template>
  <div class="animated-calendar">
    <div class="calendar-header">
      <span class="month-year">{{ currentMonthName }} {{ currentYear }}</span>
    </div>
    <div class="calendar-grid">
      <div class="day-name">Mon</div>
      <div class="day-name">Tue</div>
      <div class="day-name">Wed</div>
      <div class="day-name">Thu</div>
      <div class="day-name">Fri</div>
      <div class="day-name">Sat</div>
      <div class="day-name">Sun</div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        :class="['calendar-day', { 'highlighted': day === highlightedDay }]"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.animated-calendar {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  transform: scale(0.95); /* Slightly smaller to fit better */
  opacity: 0.98;
  animation: float 3s ease-in-out infinite;
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.month-year {
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  text-align: center;
}

.day-name {
  font-weight: 600;
  color: #666;
  padding: 8px 0;
  font-size: 0.9rem;
}

.calendar-day {
  padding: 12px 0;
  border-radius: 8px;
  font-weight: 500;
  color: #555;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-size: 1.1rem;
}

.calendar-day.highlighted {
  background-color: v-bind(primaryColor); /* Use primary color */
  color: white;
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(v-bind(primaryColor), 0.4);
  z-index: 1;
}

/* Floating animation */
@keyframes float {
  0% {
    transform: translateY(0px) scale(0.95);
  }
  50% {
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    transform: translateY(0px) scale(0.95);
  }
}

/* Event indicator (optional, for future enhancement) */
.calendar-day::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: transparent;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.calendar-day.highlighted::after {
  background-color: white;
}
</style>
