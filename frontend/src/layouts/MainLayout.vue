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
}

header {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 1000;
}

main {
  width: 100%;
  flex: 1;
}

main.with-bottom-nav {
  padding-bottom: 80px;
}

/* Mobile adjustments */
@media (max-width: 767px) {
  main.with-bottom-nav {
    padding-bottom: 90px;
  }
}

/* Mobile first approach - base styles are for mobile */
/* Then we add styles for larger screens */
@media (min-width: 768px) {
  .container {
    max-width: 100%;
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0;
  }
}
</style>