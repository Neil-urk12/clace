<script setup lang="ts">
import { ref } from 'vue';

// Features data
const features = ref([
  {
    title: 'Smart Scheduling',
    description: 'Intelligently organize your class schedules, assignments, and exams in one place.',
    icon: '📅'
  },
  {
    title: 'Real-time Collaboration',
    description: 'Share calendars with students, teachers, and staff for better coordination.',
    icon: '👥'
  },
  {
    title: 'Automated Reminders',
    description: 'Never miss important deadlines with customizable notification settings.',
    icon: '🔔'
  },
  {
    title: 'Resource Management',
    description: 'Efficiently allocate classrooms, labs, and equipment to avoid conflicts.',
    icon: '🏫'
  },
  {
    title: 'Secure',
    description: 'Your data is protected with industry-standard encryption and security practices.',
    icon: '🔒'
  },
  {
    title: 'Customizable',
    description: 'Tailor the calendar to fit your institution\'s specific needs and branding.',
    icon: '🎨'
  }
]);
</script>

<template>
  <section id="features" class="features">
    <div class="section-header">
      <h2>Features That Make a Difference</h2>
      <p>Designed specifically for educational institutions</p>
    </div>
    <div class="feature-grid">
      <div v-for="(feature, index) in features" :key="index" class="feature-card">
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Features section styles */
.features {
  padding: 5rem 5%;
  background-color: #f9fafb; /* Light grey background for contrast */
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem; /* Increased icon size */
  margin-bottom: 1.5rem; /* Increased margin */
  color: #4f46e5; /* Primary color for icons */
}

.feature-card h3 {
  font-size: 1.5rem; /* Consistent heading size */
  margin-bottom: 1rem;
  color: #1f2937; /* Dark grey for heading */
}

.feature-card p {
  color: #6b7280; /* Medium grey for text */
  font-size: 0.95rem; /* Slightly adjusted font size */
}

/* Section header styles (duplicated for component independence) */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.section-header p {
  font-size: 1.1rem;
  color: #6b7280;
}
</style>
