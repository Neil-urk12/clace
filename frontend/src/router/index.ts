import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import { useAuthStore } from "../stores/authStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "landing",
          component: () => import("../views/LandingPage.vue"),
        },
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("../views/DashboardView.vue"),
        },
        {
          path: "/calendar",
          name: "calendar",
          component: () => import("../views/CalendarView.vue"),
          // component: () => import("../components/Calendar/CalendarDemo.vue"),
          // component: () =>
          //   import("../components/Calendar/MobileCalendarDemo.vue"),
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("../views/ProfileView.vue"),
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/AuthView.vue"),
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const protectedRoutes = ["/dashboard", "/calendar", "/profile", "/admin"];
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route));

  // Check if the route is protected and user is not authenticated
  if (isProtectedRoute && !authStore.isAuthenticated) {
    next({ name: "landing" }); // Redirect to landing page
  } else {
    next(); // Continue navigation
  }
});

export default router;
