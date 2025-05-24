<script setup lang="ts">
import SearchBar from "./SearchBar.vue";

const handleSearch = (query: string) => {
  console.log("Searching for:", query);
  // Implement search functionality here
};
</script>

<template>
  <nav class="header">
    <div class="header-container">
      <!-- Top row with logo on left, search in middle (large screens), and icons on right -->
      <div class="top-row">
        <div class="logo">
          <h1 class="logo-text">Clace</h1>
        </div>

        <div class="icon-group">
          <!-- Search bar for large screens -->
          <div class="search-large">
            <SearchBar @search="handleSearch" />
          </div>

          <button class="action-button" aria-label="Calendar">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
          <button class="action-button" aria-label="Profile">
            <!-- <svg
              width="20"
              height="20"
              fill="gray"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
              />
            </svg> -->
            <svg
              fill="gray"
              version="1.1"
              id="Capa_1"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 45.532 45.532"
              xml:space="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path
                    d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765 S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53 c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012 c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592 c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
                  ></path>
                </g>
              </g>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search bar for mobile/default -->
      <div class="search-row">
        <SearchBar @search="handleSearch" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.logo {
  display: flex;
  justify-content: flex-start;
}

.icon-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 600;
  color: #4f46e5;
  margin: 0;
  letter-spacing: -0.025em;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  cursor: pointer;
}

.search-row {
  width: 100%;
}

.search-large {
  display: none;
  max-width: 300px;
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
  color: #4f46e5;
}

@media (min-width: 1024px) {
  .search-large {
    display: block;
  }

  .search-row {
    display: none;
  }

  .top-row {
    justify-content: space-between;
  }

  .icon-group {
    gap: 1rem;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 1rem;
    gap: 0.75rem;
  }

  .logo-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }
}
</style>
