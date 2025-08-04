<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Smartphone, Tablet, Monitor } from 'lucide-vue-next'
import CalendarMain from './CalendarMain.vue'

const deviceView = ref<'mobile' | 'tablet' | 'desktop'>('mobile')
const showDemo = ref(true)

const deviceClass = computed(() => ({
  'demo-mobile': deviceView.value === 'mobile',
  'demo-tablet': deviceView.value === 'tablet',
  'demo-desktop': deviceView.value === 'desktop'
}))

const deviceIcon = computed(() => {
  switch (deviceView.value) {
    case 'mobile': return Smartphone
    case 'tablet': return Tablet
    default: return Monitor
  }
})
</script>

<template>
  <div class="mobile-calendar-demo">
    <div class="demo-header">
      <h1 class="demo-title">
        <Calendar :size="32" />
        Mobile Calendar Demo
      </h1>
      <p class="demo-description">
        Experience the responsive 7-day calendar layout optimized for mobile devices
      </p>
      
      <div class="device-controls">
        <button 
          v-for="device in (['mobile', 'tablet', 'desktop'] as const)"
          :key="device"
          @click="deviceView = device"
          :class="['device-btn', { active: deviceView === device }]"
        >
          <component 
            :is="device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor" 
            :size="20" 
          />
          {{ device.charAt(0).toUpperCase() + device.slice(1) }}
        </button>
      </div>
    </div>

    <div class="demo-container" :class="deviceClass">
      <div class="device-frame">
        <div class="device-screen">
          <CalendarMain v-if="showDemo" />
        </div>
        
        <div class="device-info">
          <div class="info-badge">
            <component :is="deviceIcon" :size="16" />
            {{ deviceView.charAt(0).toUpperCase() + deviceView.slice(1) }} View
          </div>
          
          <div class="features-list">
            <div v-if="deviceView === 'mobile'" class="feature-item">
              <div class="feature-dot mobile-color"></div>
              <span>Dot view for events</span>
            </div>
            <div v-if="deviceView === 'tablet'" class="feature-item">
              <div class="feature-dot tablet-color"></div>
              <span>Compact event rectangles</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot universal-color"></div>
              <span>7-day responsive grid</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot gradient-color"></div>
              <span>Gradient navigation header</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-features">
      <h2>Key Mobile Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>Responsive Layout</h3>
          <p>Adapts from desktop month view to mobile 7-day column layout</p>
        </div>
        <div class="feature-card">
          <h3>Event Visualization</h3>
          <p>Smart event display: text rectangles on tablet, dots on mobile</p>
        </div>
        <div class="feature-card">
          <h3>Touch Optimized</h3>
          <p>Large touch targets and smooth animations for mobile interaction</p>
        </div>
        <div class="feature-card">
          <h3>Visual Appeal</h3>
          <p>Gradient headers, rounded corners, and modern design aesthetics</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-calendar-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.demo-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.demo-description {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.device-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.device-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.device-btn:hover {
  background: #f8fafc;
  color: #1e293b;
}

.device-btn.active {
  background: #6366f1;
  color: white;
}

.demo-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 3rem;
}

.device-frame {
  background: white;
  border-radius: 2rem;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.demo-mobile .device-frame {
  width: 375px;
  min-height: 667px;
}

.demo-tablet .device-frame {
  width: 768px;
  min-height: 600px;
}

.demo-desktop .device-frame {
  width: 1024px;
  min-height: 600px;
}

.device-screen {
  background: #f8fafc;
  border-radius: 1rem;
  overflow: hidden;
  height: 500px;
  position: relative;
}

.device-info {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 500;
  color: #475569;
  justify-content: center;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.feature-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.mobile-color {
  background: #ef4444;
}

.tablet-color {
  background: #3b82f6;
}

.universal-color {
  background: #10b981;
}

.gradient-color {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.demo-features {
  text-align: center;
}

.demo-features h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .mobile-calendar-demo {
    padding: 1rem;
  }

  .demo-title {
    font-size: 2rem;
  }

  .demo-container {
    overflow-x: auto;
  }

  .demo-mobile .device-frame,
  .demo-tablet .device-frame,
  .demo-desktop .device-frame {
    width: 100%;
    max-width: 375px;
  }

  .device-controls {
    flex-direction: column;
    max-width: 200px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>