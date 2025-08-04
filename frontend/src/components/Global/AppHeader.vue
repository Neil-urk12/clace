<script setup lang="ts">
import { defineAsyncComponent, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LayoutDashboard, UserRound, LogOut, Info } from "lucide-vue-next";
import { useAuthStore } from "@/stores/authStore";
import { useCalendarStore } from "@/stores/calendarStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const calendarStore = useCalendarStore();
const SearchBar = defineAsyncComponent(() => import("@/components/Global/SearchBar.vue"));
const CalendarIcon = defineAsyncComponent(() => import("../Global/EmptyCalendarIcon.vue"));

const handleSearch = (query: string) => {
  console.log("Searching for:", query);
};
const hiddenRoutes: string[] = ["/profile"];

const isProfileRoute = computed(() => {
  return route.path === "/profile";
});

const hasJoinedClass = computed(() => {
  return authStore.hasJoinedClass;
});

const calendarId = computed(() => {
  return calendarStore.calendar?.calendar_id || '';
});

const showCalendarInfo = ref(false);

const toggleCalendarInfo = () => {
  showCalendarInfo.value = !showCalendarInfo.value;
};

function isHiddenRoute(): boolean {
  return hiddenRoutes.includes(route.path);
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
          
          <!-- Calendar Info Button -->
          <button 
            v-if="hasJoinedClass && calendarId"
            class="action-button" 
            aria-label="Calendar Info" 
            @click="toggleCalendarInfo"
          >
            <Info :size="20" />
          </button>
          
          <!-- Calendar ID Popup -->
          <div v-if="showCalendarInfo" class="calendar-info-popup">
            <h3>Class Calendar ID</h3>
            <p class="calendar-id">{{ calendarId }}</p>
            <p class="calendar-name">{{ calendarStore.calendarName }}</p>
            <p class="join-code">Join Code: {{ calendarStore.joinCode }}</p>
          </div>

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

.calendar-info-popup {
  position: absolute;
  top: 60px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 250px;
}

.calendar-info-popup h3 {
  margin-top: 0;
  color: #4f46e5;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.calendar-id {
  font-family: monospace;
  background: rgba(79, 70, 229, 0.1);
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  word-break: break-all;
  margin-bottom: 0.5rem;
  color: #4f46e5;
}

.calendar-name {
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 0.5rem;
}

.join-code {
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  display: inline-block;
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
