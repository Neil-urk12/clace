<script setup lang="ts">
import { computed } from 'vue'
import type { SharedEventItem } from '../../types/event' // Updated import

interface Props {
  event: SharedEventItem // Updated prop type
  compact?: boolean
}

interface Emits {
  (e: 'click', event: SharedEventItem): void // Updated emit type
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const emit = defineEmits<Emits>()

const eventStyle = computed(() => {
  const baseColor = props.event.color || '#3b82f6'
  const colorMap: Record<string, { bg: string; border: string; shadow: string }> = {
    '#3b82f6': { 
      bg: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', 
      border: '#1e40af',
      shadow: 'rgba(59, 130, 246, 0.4)'
    },
    '#ef4444': { 
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
      border: '#dc2626',
      shadow: 'rgba(239, 68, 68, 0.4)'
    },
    '#10b981': { 
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
      border: '#059669',
      shadow: 'rgba(16, 185, 129, 0.4)'
    },
    '#f59e0b': { 
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
      border: '#d97706',
      shadow: 'rgba(245, 158, 11, 0.4)'
    },
    '#8b5cf6': { 
      bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
      border: '#7c3aed',
      shadow: 'rgba(139, 92, 246, 0.4)'
    },
    '#06b6d4': { 
      bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', 
      border: '#0891b2',
      shadow: 'rgba(6, 182, 212, 0.4)'
    }
  }

  const colors = colorMap[baseColor] || {
    bg: `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}dd 100%)`,
    border: baseColor,
    shadow: `${baseColor}66`
  }

  return {
    background: colors.bg,
    borderColor: colors.border,
    '--shadow-color': colors.shadow
  }
})

const formattedTime = computed(() => {
  if (props.event.allDay) {
    return 'All Day'
  }
  
  const start = props.event.startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  
  if (!props.event.endDate) {
    return start
  }
  
  const end = props.event.endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  
  return `${start} - ${end}`
})

const handleClick = (event: Event) => {
  event.stopPropagation()
  emit('click', props.event)
}
</script>

<template>
  <div
    :class="[
      'calendar-event',
      {
        'compact': compact,
        'all-day': event.allDay
      }
    ]"
    :style="eventStyle"
    :title="event.title"
    @click="handleClick"
  >
    <div class="event-content">
      <div class="event-title">{{ event.title }}</div>
      <div v-if="!compact && !event.allDay" class="event-time">
        {{ formattedTime }}
      </div>
      <div v-if="!compact && event.description" class="event-description">
        {{ event.description }}
      </div>
    </div>
    <div class="event-shine"></div>
  </div>
</template>

<style scoped>
.calendar-event {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  font-size: 0.8rem;
  line-height: 1.3;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px 0 var(--shadow-color, rgba(59, 130, 246, 0.4));
}

.calendar-event::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.calendar-event:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px 0 var(--shadow-color, rgba(59, 130, 246, 0.6));
  border-color: rgba(255, 255, 255, 0.4);
}

.calendar-event:hover::before {
  opacity: 1;
}

.calendar-event:active {
  transform: translateY(-1px) scale(1.01);
  transition: all 0.1s;
}

.calendar-event.compact {
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 6px;
  min-height: 20px;
  line-height: 1.2;
  box-shadow: 0 2px 8px 0 var(--shadow-color, rgba(59, 130, 246, 0.3));
}

.calendar-event.compact:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 4px 15px 0 var(--shadow-color, rgba(59, 130, 246, 0.5));
}

.calendar-event.all-day {
  background: linear-gradient(135deg, var(--bg-color, #3b82f6) 0%, var(--bg-color, #3b82f6) 100%);
  border-left: 4px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px 8px 8px 8px;
  position: relative;
}

.calendar-event.all-day::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  pointer-events: none;
}

.event-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  z-index: 2;
}

.event-title {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.event-time {
  font-size: 0.7rem;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.event-description {
  font-size: 0.7rem;
  opacity: 0.85;
  line-height: 1.4;
  max-height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.event-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.calendar-event:hover .event-shine {
  left: 100%;
}

.compact .event-content {
  gap: 0;
}

.compact .event-title {
  font-size: inherit;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .calendar-event {
    font-size: 0.7rem;
    padding: 0.375rem 0.5rem;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 var(--shadow-color, rgba(59, 130, 246, 0.3));
  }

  .calendar-event:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 4px 15px 0 var(--shadow-color, rgba(59, 130, 246, 0.5));
  }

  .calendar-event.compact {
    font-size: 0.6rem;
    padding: 0.2rem 0.375rem;
    border-radius: 4px;
    min-height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .compact .event-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-weight: 600;
  }

  .event-time,
  .event-description {
    font-size: 0.6rem;
  }

  /* Dot view for very compact displays */
  .calendar-event.compact.dot-view {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    padding: 0;
    margin: 2px auto;
    border: 2px solid rgba(255, 255, 255, 0.3);
    min-height: 10px;
    box-shadow: 0 2px 6px 0 var(--shadow-color, rgba(59, 130, 246, 0.4));
    position: relative;
  }

  .calendar-event.compact.dot-view::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }

  .calendar-event.compact.dot-view .event-content {
    display: none;
  }

  .calendar-event.compact.dot-view:hover {
    transform: scale(1.3);
    box-shadow: 0 4px 12px 0 var(--shadow-color, rgba(59, 130, 246, 0.6));
  }
}

@media (max-width: 480px) {
  .calendar-event {
    font-size: 0.6rem;
    padding: 0.25rem 0.375rem;
    border-radius: 4px;
  }

  .calendar-event.compact {
    font-size: 0.55rem;
    padding: 0.15rem 0.25rem;
    min-height: 14px;
  }

  .event-title {
    max-width: 100%;
    font-weight: 600;
  }

  /* Ultra-compact dot view */
  .calendar-event.compact {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    padding: 0;
    margin: 1px auto;
    border: 1px solid rgba(255, 255, 255, 0.4);
    min-height: 8px;
    box-shadow: 0 1px 4px 0 var(--shadow-color, rgba(59, 130, 246, 0.4));
  }

  .calendar-event.compact .event-content {
    display: none;
  }

  .calendar-event.compact:hover {
    transform: scale(1.25);
    box-shadow: 0 2px 8px 0 var(--shadow-color, rgba(59, 130, 246, 0.6));
  }

  .calendar-event.compact::after {
    content: attr(title);
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.95);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    font-size: 0.8rem;
    z-index: 1000;
    white-space: nowrap;
    max-width: 90vw;
    text-overflow: ellipsis;
    overflow: hidden;
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .calendar-event.compact:hover::after {
    opacity: 1;
  }
}

/* Enhanced color variations with gradients */
.calendar-event[style*="#ef4444"] {
  --shadow-color: rgba(239, 68, 68, 0.4);
}

.calendar-event[style*="#10b981"] {
  --shadow-color: rgba(16, 185, 129, 0.4);
}

.calendar-event[style*="#f59e0b"] {
  --shadow-color: rgba(245, 158, 11, 0.4);
}

.calendar-event[style*="#8b5cf6"] {
  --shadow-color: rgba(139, 92, 246, 0.4);
}

.calendar-event[style*="#06b6d4"] {
  --shadow-color: rgba(6, 182, 212, 0.4);
}
</style>
