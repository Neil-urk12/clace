<template>
  <div class="primary-filter-group">
    <button
      :class="[
        'primary-filter-button',
        { active: activePrimaryFilter === 'Upcoming' },
      ]"
      @click="selectActivityFilter('Upcoming')"
    >
      Upcoming
    </button>
    <button
      :class="[
        'primary-filter-button',
        { active: activePrimaryFilter === 'Recent' },
      ]"
      @click="selectActivityFilter('Recent')"
    >
      Recent
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activePrimaryFilter: "Upcoming" | "Recent";
}

defineProps<Props>();

interface Emits {
  (e: "selectActivityFilter", filter: "Upcoming" | "Recent"): void;
}

const emit = defineEmits<Emits>();

const selectActivityFilter = (filter: "Upcoming" | "Recent") => {
  emit("selectActivityFilter", filter);
};
</script>

<style scoped>
.primary-filter-group {
  display: flex;
  gap: 0.5rem;
  background: rgba(236, 239, 241, 0.8);
  border-radius: 0.75rem;
  padding: 0.375rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.primary-filter-button {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #4c1d95;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  flex-grow: 1;
  text-align: center;
}

.primary-filter-button:hover {
  background-color: rgba(102, 126, 234, 0.1); /* Light purple on hover */
  color: #3730a3; /* Darker purple text on hover */
}

.primary-filter-button.active {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
</style>
