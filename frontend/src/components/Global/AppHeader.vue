<script setup lang="ts">
import { defineAsyncComponent, computed  } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LayoutDashboard, UserRound, LogOut } from "lucide-vue-next";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
const SearchBar = defineAsyncComponent(() => import("@/components/Global/SearchBar.vue"));
const CalendarIcon = defineAsyncComponent(() => import("../Global/EmptyCalendarIcon.vue"));

const handleSearch = (query: string) => {
  console.log("Searching for:", query);
};
const hiddenRoutes: string[] = ["/profile"];

const isProfileRoute = computed(() => {
  return useRoute().path === "/profile";
});

const hasJoinedClass = computed(() => {
  return authStore.hasJoinedClass;
});

function isHiddenRoute(): boolean {
  const route = useRoute().path;
  return hiddenRoutes.includes(route);
}
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
          <SearchBar v-if="!isHiddenRoute" @search="handleSearch" />
          
          <button
            v-if="isProfileRoute"
            class="action-button"
            aria-label="Dashboard"
            @click="router.push('/dashboard')"
          >
            <LayoutDashboard :size="20" />
          </button>

          <!-- Only show calendar and profile icons if user has joined a class -->
          <button 
            v-if="hasJoinedClass"
            class="action-button" 
            aria-label="Calendar" 
            @click="router.push('/calendar')"
          >
            <CalendarIcon />
          </button>
          
          <button 
            v-if="hasJoinedClass"
            class="action-button" 
            aria-label="Profile" 
            @click="router.push('/profile')"
          >
            <UserRound :size="20" />
          </button>

          <!-- Show sign out button if user has not joined a class -->
          <button 
            v-if="!hasJoinedClass && authStore.isAuthenticated"
            class="action-button sign-out-button" 
            aria-label="Sign Out" 
            @click="authStore.logout().then(() => router.push('/'))"
          >
            <LogOut :size="20" />
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

  .search-row {
    display: none;
  }

  .top-row {
    justify-content: space-between;
  }

  .icon-group {
    gap: 1rem;
  }

  .icon-group .search-container {
    display: flex; /* Show search bar in icon group on desktop */
  }
}

@media (max-width: 1023px) {
  .icon-group .search-container {
    display: none; /* Hide search bar in icon group on mobile */
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 1rem;
    gap: 0.75rem;
  }

  .top-row {
    justify-content: space-between;
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
