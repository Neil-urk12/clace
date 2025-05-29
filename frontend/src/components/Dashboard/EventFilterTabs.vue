<script setup lang="ts">
import { computed } from 'vue';
import ActivityFilterButtons from '../Calendar/ActivityFilterButtons.vue';
interface Props {
  secondaryCounts: Record<string, number>;
  activePrimaryFilter: 'Upcoming' | 'Recent';
  activeSecondaryFilter: string;
}
const props = defineProps<Props>();

const emit = defineEmits(['primary-filter-changed', 'secondary-filter-changed']);

type SecondaryFilterValue = 'All' | 'Today' | 'NextWeek' | 'NextMonth' | 'EarlierToday' | 'PastWeek' | 'PastMonth';

const currentSecondaryFilters = computed(() => {
  if (props.activePrimaryFilter === 'Upcoming') {
    return [
      { label: 'All', value: 'All' as SecondaryFilterValue },
      { label: 'Today', value: 'Today' as SecondaryFilterValue },
      { label: 'Next Week', value: 'NextWeek' as SecondaryFilterValue },
      { label: 'Next Month', value: 'NextMonth' as SecondaryFilterValue },
    ];
  } else {
    return [
      { label: 'All', value: 'All' as SecondaryFilterValue },
      { label: 'Earlier Today', value: 'EarlierToday' as SecondaryFilterValue },
      { label: 'Past Week', value: 'PastWeek' as SecondaryFilterValue },
      { label: 'Past Month', value: 'PastMonth' as SecondaryFilterValue },
    ];
  }
});

function selectPrimaryFilter(filterValue: 'Upcoming' | 'Recent') {
  emit('primary-filter-changed', filterValue);
}

function selectSecondaryFilter(filterValue: SecondaryFilterValue) {
  emit('secondary-filter-changed', filterValue);
}
</script>

<template>
  <div class="combined-filters-container">
    <ActivityFilterButtons
      :activePrimaryFilter="activePrimaryFilter"
      @selectActivityFilter="selectPrimaryFilter"
    />

    <div class="secondary-filter-tabs">
      <button
        v-for="sFilter in currentSecondaryFilters"
        :key="sFilter.value"
        :class="{ active: activeSecondaryFilter === sFilter.value }"
        @click="selectSecondaryFilter(sFilter.value)"
        class="filter-tab"
      >
        {{ sFilter.label }}
        <span v-if="secondaryCounts[sFilter.value] !== undefined" class="count">
          {{ secondaryCounts[sFilter.value] }}
        </span>
      </button>
    </div>
  </div>
</template>


<style scoped>
.filter-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.filter-tab {
  padding: 0.6rem 1rem;
  border: 2px solid rgba(79, 70, 229, 0.2);
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #4f46e5;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.filter-tab::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.filter-tab:hover::before {
  left: 100%;
}

.filter-tab:hover {
  background: rgba(79, 70, 229, 0.1);
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);
}

.filter-tab.active {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3),
    0 4px 12px rgba(124, 58, 237, 0.2);
}

.filter-tab.active:hover {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.4),
    0 6px 16px rgba(124, 58, 237, 0.3);
}

.count {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(79, 70, 229, 0.15);
  color: #4f46e5;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.filter-tab.active .count {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-tab:hover .count {
  background: rgba(79, 70, 229, 0.2);
  transform: scale(1.05);
}

.filter-tab.active:hover .count {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

@media (max-width: 767px) {
  .filter-tabs {
    gap: 0.4rem;
    padding: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .filter-tabs::-webkit-scrollbar {
    display: none;
  }

  .filter-tab {
    padding: 0.3rem 0.75rem;
    font-size: 0.5rem;
  }
  .count {
    margin-left: 0.25rem;
    font-size: 0.65rem;
    padding: 0.1rem 0.3rem;
  }
}

@media (min-width: 768px) {
  .filter-tabs {
    overflow-x: visible;
    padding: 1.25rem;
  }
  .filter-tab {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }
}

@media (min-width: 1024px) {
  .filter-tabs {
    gap: 1rem;
  }
}


.combined-filters-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.primary-filter-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.primary-filter-button {
  padding: 0.6rem 1rem;
  border: 2px solid rgba(79, 70, 229, 0.2);
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #4f46e5;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
  flex-grow: 1;
  text-align: center;
}

.primary-filter-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}
.primary-filter-button:hover::before {
  left: 100%;
}

.primary-filter-button:hover {
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);
}

.primary-filter-button.active {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3), 0 4px 12px rgba(124, 58, 237, 0.2);
}

.primary-filter-button.active:hover {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.4),
    0 6px 16px rgba(124, 58, 237, 0.3);
}

.primary-filter-button.active:hover {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.4),
    0 6px 16px rgba(124, 58, 237, 0.3);
}

.secondary-filter-tabs {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow-x: auto;
}


@media (min-width: 768px) {
  .combined-filters-container {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  .primary-filter-group {
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .secondary-filter-tabs {
    padding: 0.5rem;
    flex-grow: 1;
    overflow-x: visible;
  }
}
</style>
