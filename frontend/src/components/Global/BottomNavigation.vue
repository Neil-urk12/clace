<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    ariaLabel: 'Navigate to Dashboard'
  },
  {
    name: 'Calendar',
    path: '/calendar',
    icon: 'calendar',
    ariaLabel: 'Navigate to Calendar'
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: 'profile',
    ariaLabel: 'Navigate to Profile'
  }
]

const isActive = (path: string) => {
  return route.path === path
}

const navigateTo = (path: string) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
  router.push(path)
}
</script>

<template>
  <nav class="bottom-navigation" role="navigation" aria-label="Main navigation">
    <button 
      v-for="item in navigationItems" 
      :key="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      :aria-label="item.ariaLabel"
      :aria-current="isActive(item.path) ? 'page' : undefined"
      type="button"
      @click="navigateTo(item.path)"
    >
      <div class="nav-icon" :aria-hidden="true">
        <svg v-if="item.icon === 'dashboard'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
        </svg>
        <svg v-else-if="item.icon === 'calendar'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
        </svg>
        <svg v-else-if="item.icon === 'profile'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
        </svg>
      </div>
      <span class="nav-label">{{ item.name }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #6b7280;
  min-width: 60px;
  position: relative;
  overflow: hidden;
  background: none;
  border: none;
  font: inherit;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-50%, -50%);
}

.nav-item:hover::before {
  width: 100%;
  height: 100%;
}

.nav-item:hover {
  color: #4f46e5;
  transform: translateY(-2px);
}

.nav-item:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.nav-item:focus:not(:focus-visible) {
  outline: none;
}

.nav-item.active {
  color: #4f46e5;
  background-color: #eef2ff;
  transform: translateY(-1px);
}

.nav-item.active::before {
  width: 100%;
  height: 100%;
  background: rgba(79, 70, 229, 0.15);
}

.nav-icon {
  margin-bottom: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15) rotateY(5deg);
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(79, 70, 229, 0.3));
}

.nav-item:active .nav-icon {
  transform: scale(0.95);
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.nav-item.active .nav-label {
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(79, 70, 229, 0.1);
}

.nav-item:hover .nav-label {
  transform: translateY(-1px);
}

@media (min-width: 768px) {
  .bottom-navigation {
    display: none;
  }
}

@media (max-width: 320px) {
  .bottom-navigation {
    padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
  }
  
  .nav-item {
    padding: 6px 8px;
    min-width: 50px;
  }
  
  .nav-label {
    font-size: 11px;
  }
  
  .nav-icon svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .nav-item {
    min-height: 48px;
    padding: 8px 10px;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  .bottom-navigation {
    padding: 4px 0 calc(4px + env(safe-area-inset-bottom));
  }
  
  .nav-item {
    padding: 4px 8px;
  }
  
  .nav-icon {
    margin-bottom: 2px;
  }
  
  .nav-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .nav-label {
    font-size: 10px;
  }
}
</style>
