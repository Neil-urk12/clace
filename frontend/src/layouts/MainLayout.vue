<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";

const AppHeader = defineAsyncComponent(
  () => import("../components/Global/AppHeader.vue"),
);
const BottomNavigation = defineAsyncComponent(
  () => import("../components/Global/BottomNavigation.vue"),
);

const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});

const hiddenRoutes: string[] = ["/auth", "/", "/calendar"];
const mobileOnlyRoutes: string[] = ["/dashboard", "/calendar", "/profile"];

function isHiddenRoute(): boolean {
  const route = useRoute().path;
  return hiddenRoutes.includes(route);
}

function shouldShowBottomNav(): boolean {
  const route = useRoute().path;
  return mobileOnlyRoutes.includes(route);
}
</script>

<template>
  <div class="container" :class="{ mobile: isMobile }">
    <!-- Background elements -->
    <div class="background-wrapper">
      <div class="gradient-bg"></div>
      <div class="geometric-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
      <div class="grid-pattern"></div>
    </div>

    <header>
      <AppHeader v-if="!isHiddenRoute()" />
    </header>
    <main :class="{ 'with-bottom-nav': shouldShowBottomNav() && isMobile }">
      <RouterView />
    </main>
    <BottomNavigation v-if="shouldShowBottomNav() && isMobile" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  min-height: 100vh;
  position: relative;
  /* overflow-x: hidden; */
}

/* Background Wrapper */
.background-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

/* Main Gradient Background */
.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #4f46e5 0%,
    #6366f1 25%,
    #8b5cf6 50%,
    #a855f7 75%,
    #c084fc 100%
  );
  opacity: 0.95;
}

/* Geometric Shapes */
.geometric-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
  animation-delay: -5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 20%;
  left: 10%;
  animation-delay: -10s;
  border-radius: 20px;
}

.shape-4 {
  width: 250px;
  height: 250px;
  bottom: 20%;
  right: 15%;
  animation-delay: -15s;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 0;
}

/* Grid Pattern Overlay */
.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
      circle at 1px 1px,
      rgba(255, 255, 255, 0.15) 1px,
      transparent 0
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px, 50px 50px, 50px 50px;
  opacity: 0.3;
}

/* Float Animation */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(30px) rotate(240deg);
  }
}

header {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

main {
  width: 100%;
  flex: 1;
  position: relative;
  z-index: 1;
}

main.with-bottom-nav {
  padding-bottom: 80px;
}

/* Mobile adjustments */
@media (max-width: 767px) {
  main.with-bottom-nav {
    padding-bottom: 90px;
  }

  .shape-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -100px;
  }

  .shape-2 {
    width: 150px;
    height: 150px;
    bottom: -75px;
    left: -75px;
  }

  .shape-3 {
    width: 100px;
    height: 100px;
  }

  .shape-4 {
    width: 180px;
    height: 180px;
  }

  .grid-pattern {
    background-size: 30px 30px, 30px 30px, 30px 30px;
  }
}

/* Tablet and Desktop */
@media (min-width: 768px) {
  .container {
    max-width: 100%;
    padding: 0;
  }

  .shape-1 {
    width: 400px;
    height: 400px;
    top: -200px;
    right: -200px;
  }

  .shape-2 {
    width: 300px;
    height: 300px;
    bottom: -150px;
    left: -150px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0;
  }

  .grid-pattern {
    background-size: 60px 60px, 60px 60px, 60px 60px;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .shape {
    animation: none;
  }
}
</style>
