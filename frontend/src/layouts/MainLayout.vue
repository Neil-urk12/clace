<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
const AppHeader = defineAsyncComponent(
  () => import("../components/Global/AppHeader.vue"),
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

const hiddenRoutes: string[] = ["/auth", "/"];

function isHiddenRoute(): boolean {
  const route = useRoute().path;
  return hiddenRoutes.includes(route);
}
</script>

<template>
  <div class="container" :class="{ mobile: isMobile }">
    <header>
      <AppHeader v-if="!isHiddenRoute()" />
    </header>
    <main>
      <RouterView />
    </main>
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
}

header {
  width: 100%;
}

main {
  width: 100%;
  flex: 1;
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
