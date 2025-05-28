<script setup lang="ts">
import { ref } from "vue";
import { useEventStore } from "@/stores/eventStore";

const eventStore = useEventStore();
const searchQuery = ref(eventStore.searchQuery);
</script>

<template>
  <div class="search-container">
    <div class="search-wrapper">
      <svg
        class="search-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="M21 21l-4.35-4.35"></path>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search events by keyword..."
        class="search-input"
        @input="eventStore.setSearchQuery(searchQuery)"
      />
    </div>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  z-index: 1;
  pointer-events: none;
  width: 16px;
  height: 16px;
}

.search-input {
  width: 100%;
  max-width: 800px;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: 2px solid #4338ca;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #ffffff;
  transition: all 0.3s ease;
  outline: none;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.search-input:focus {
  border-color: #312e81;
  box-shadow:
    0 0 0 3px rgba(79, 70, 229, 0.3),
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #4338ca 0%, #5b21b6 100%);
  transform: translateY(-1px);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}


@media (min-width: 1024px) {
  .search-input {
    max-width: 500px;
    padding: 0.5rem 0.75rem 0.5rem 2rem;
    font-size: 0.8rem;
    min-width: 350px;
  }

  .search-icon {
    left: 0.5rem;
    width: 14px;
    height: 14px;
  }
}


@media (max-width: 768px) {
  .search-input {
    font-size: 0.875rem;
    padding: 0.625rem 1rem 0.625rem 2.5rem;
  }

  .search-icon {
    left: 0.75rem;
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .search-input {
    font-size: 0.875rem;
    padding: 0.5rem 0.875rem 0.5rem 2.25rem;
  }

  .search-icon {
    left: 0.625rem;
    width: 14px;
    height: 14px;
  }
}
</style>
