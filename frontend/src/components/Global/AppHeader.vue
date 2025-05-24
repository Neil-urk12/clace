<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // Implement search functionality here
  }
}
</script>

<template>
  <nav class="header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <h1 class="logo-text">Clace</h1>
      </div>

      <!-- Search Bar -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search events by keyword..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- Right Icon -->
      <div class="header-actions">
        <button class="action-button" aria-label="RSS Feed">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="1"></circle>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  height: 4rem;
  gap: 2rem;
}

.logo {
  display: flex;
  justify-content: flex-start;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  letter-spacing: -0.025em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  cursor: pointer;
}

.search-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 2rem;
  font-size: 0.95rem;
  background-color: #ffffff;
  color: #374151;
  transition: all 0.2s ease;
  outline: none;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-container {
    grid-template-columns: auto 1fr auto;
    padding: 0 1rem;
    gap: 1rem;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .search-input {
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    gap: 0.75rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .search-input {
    font-size: 0.875rem;
    padding: 0.5rem 0.875rem;
  }
}
</style>