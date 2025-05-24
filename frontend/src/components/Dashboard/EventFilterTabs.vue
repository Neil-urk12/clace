<script setup lang="ts">

interface Props {
  counts: { All: number; Today: number; NextWeek: number; NextMonth: number; };
  activeFilter: string;
}

defineProps<Props>();
const emit = defineEmits(['filter-changed']);
type FilterValue = 'All' | 'Today' | 'NextWeek' | 'NextMonth';
const filters = [
  { label: 'All', value: 'All' as FilterValue }, { label: 'Today', value: 'Today' as FilterValue },
  { label: 'Next Week', value: 'NextWeek' as FilterValue }, { label: 'Next Month', value: 'NextMonth' as FilterValue },
];
function selectFilter(filterValue: FilterValue) { emit('filter-changed', filterValue); }
</script>

<template>
  <div class="filter-tabs">
    <button
      v-for="filter in filters" :key="filter.value"
      :class="{ active: activeFilter === filter.value }"
      @click="selectFilter(filter.value)" class="filter-tab"
    >
      {{ filter.label }}
      <span class="count">{{ counts[filter.value] }}</span>
    </button>
  </div>
</template>

<style scoped>
.filter-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; overflow-x: auto; padding-bottom: 0.5rem; }
.filter-tab {
  padding: 0.5rem 1rem; border: 1px solid #e5e7eb; border-radius: 1.5rem;
  background-color: #f9fafb; color: #374151; font-size: 0.875rem;
  cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
}
.filter-tab:hover { background-color: #f3f4f6; }
.filter-tab.active { background-color: #1f2937; color: #ffffff; border-color: #1f2937; }
.count { margin-left: 0.25rem; font-size: 0.75rem; background-color: rgba(0,0,0,0.1); padding: 0.1rem 0.3rem; border-radius: 0.5rem; }
.filter-tab.active .count { background-color: rgba(255,255,255,0.2); }
@media (min-width: 768px) {
  .filter-tabs { overflow-x: visible; }
  .filter-tab { font-size: 0.9rem; }
}
</style>
