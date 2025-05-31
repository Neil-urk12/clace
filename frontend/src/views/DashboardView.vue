<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import EventFilterTabs from "@/components/Dashboard/EventFilterTabs.vue";
import EventCard from "@/components/Dashboard/EventCard.vue";
import { useEventStore } from "../stores/eventStore";
import { useAuthStore } from "../stores/authStore";
import { useCalendarStore } from "../stores/calendarStore";

const router = useRouter();
const eventStore = useEventStore();
const authStore = useAuthStore();
const calendarStore = useCalendarStore();

const loading = ref(true);
const showDashboard = ref(false);
const showClassIdForm = ref(false);
const showPresidentForm = ref(false);
const showPresidentLoading = ref(false);
const classId = ref('');
const classIdSubmitted = ref(false);
const classIdError = ref('');
const calendarName = ref('');
const calendarNameError = ref('');

onMounted(async () => {
  // Initialize all states to false
  showDashboard.value = false;
  showClassIdForm.value = false;
  showPresidentForm.value = false;
  showPresidentLoading.value = false;
  
  // Initialize auth if needed
  if (!authStore.isAuthenticated || !authStore.user) {
    await authStore.initializeAuth();
  }
  
  console.log('User after initialization:', authStore.user);
  console.log('Is class president:', authStore.user?.is_class_president);

  if (authStore.user) {
    // Try to load the user's calendar
    const calendarResult = await calendarStore.loadUserCalendar();
    
    if (calendarResult.success) {
      // User has a calendar, show dashboard and load events
      authStore.setHasJoinedClass(true);
      showDashboard.value = true;
      
      // Load events from API for production use
      try {
        await eventStore.loadEvents();
      } catch (error) {
        console.warn('Failed to load events:', error);
      }
    } else {
      // User doesn't have a calendar
      if (authStore.user.is_class_president) {
        // Class presidents should create their own calendar
        showPresidentForm.value = true;
      } else {
        // Regular students need to join an existing calendar
        if (authStore.hasJoinedClass) {
          showDashboard.value = true;
          
          // Load events from API
          try {
            await eventStore.loadEvents();
          } catch (error) {
            console.warn('Failed to load events:', error);
          }
        } else {
          showClassIdForm.value = true;
        }
      }
    }
  } else {
    // Not authenticated - redirect to login
    router.push('/auth');
    return;
  }
  
  loading.value = false;
});


const submitClassId = async () => {
  if (!classId.value.trim()) {
    classIdError.value = 'Please enter a valid class ID';
    return;
  }
  
  classIdError.value = '';
  loading.value = true;
  
  try {
    const result = await calendarStore.joinCalendarByCode(classId.value);
    
    if (result.success) {
      classIdSubmitted.value = true;
      authStore.setHasJoinedClass(true);
      showClassIdForm.value = false;
      showDashboard.value = true;
      
      // Load events from API for the joined calendar
      try {
        await eventStore.loadEvents();
      } catch (error) {
        console.warn('Failed to load events:', error);
      }
    } else {
      throw new Error(result.message || 'Failed to join calendar');
    }
  } catch (error: any) {
    classIdError.value = error.message || 'Invalid class ID. Please try again.';
  } finally {
    loading.value = false;
  }
};

const submitCalendarName = async () => {
  if (!calendarName.value.trim()) {
    calendarNameError.value = 'Please enter a name for your class calendar';
    return;
  }
  
  calendarNameError.value = '';
  loading.value = true;
  showPresidentLoading.value = true;
  showPresidentForm.value = false;
  
  try {
    const result = await calendarStore.createCalendar(calendarName.value);
    
    if (result.success) {
      showPresidentLoading.value = false;
      showDashboard.value = true;
      
      // Load events from API for the newly created calendar
      try {
        await eventStore.loadEvents();
      } catch (error) {
        console.warn('Failed to load events:', error);
      }
    } else {
      throw new Error(result.message || 'Failed to create calendar');
    }
  } catch (error: any) {
    calendarNameError.value = error.message || 'Failed to create calendar. Please try again.';
    showPresidentForm.value = true;
    showPresidentLoading.value = false;
  } finally {
    loading.value = false;
  }
};


const activePrimaryFilter = computed(() => eventStore.activePrimaryFilter);
const activeSecondaryFilter = computed(() => eventStore.activeSecondaryFilter);
const filteredActivities = computed(() => eventStore.filteredEvents);
const secondaryFilterCounts = computed(() => eventStore.secondaryFilterCounts);


const handlePrimaryFilterChange = (newFilter: 'Upcoming' | 'Recent') => {
  eventStore.setActivePrimaryFilter(newFilter);
};

const handleSecondaryFilterChange = (newFilter: string) => {
  eventStore.setActiveSecondaryFilter(newFilter);
};
</script>

<template>
  <div class="dashboard-view">

    <div v-if="showPresidentForm" class="role-screen president-form">
      <div class="form-container">
        <h2>Create Your Class Calendar</h2>
        <p>As a class president, please name your class calendar:</p>
        
        <div class="input-group">
          <input 
            type="text" 
            v-model="calendarName" 
            placeholder="Enter calendar name" 
            :disabled="loading"
            @keyup.enter="submitCalendarName"
          />
          <button 
            @click="submitCalendarName" 
            :disabled="loading" 
            class="submit-btn"
          >
            <span v-if="!loading">Create Calendar</span>
            <span v-else>Creating...</span>
          </button>
        </div>
        
        <p v-if="calendarNameError" class="error-message">{{ calendarNameError }}</p>
      </div>
    </div>

    <div v-else-if="showPresidentLoading" class="role-screen president-loading">
      <div class="loading-animation">
        <div class="spinner"></div>
      </div>
      <h2>Generating Your Class Calendar</h2>
      <p>Please wait while we set up your class calendar...</p>
    </div>
    

    <div v-else-if="showClassIdForm" class="role-screen student-form">
      <div class="form-container">
        <h2>Welcome to Clace!</h2>
        <p>Please enter your class ID to join:</p>
        
        <div class="input-group">
          <input 
            type="text" 
            v-model="classId" 
            placeholder="Enter class ID" 
            :disabled="loading"
            @keyup.enter="submitClassId"
          />
          <button 
            @click="submitClassId" 
            :disabled="loading" 
            class="submit-btn"
          >
            <span v-if="!loading">Join Class</span>
            <span v-else>Joining...</span>
          </button>
        </div>
        
        <p v-if="classIdError" class="error-message">{{ classIdError }}</p>
      </div>
    </div>
    

    <template v-else-if="showDashboard">
      <EventFilterTabs
        :active-primary-filter="activePrimaryFilter"
        :active-secondary-filter="activeSecondaryFilter"
        :secondary-counts="secondaryFilterCounts"
        @primary-filter-changed="handlePrimaryFilterChange"
        @secondary-filter-changed="handleSecondaryFilterChange"
        :loading="loading"
      />
      <div class="activity-grid">
        <template v-if="loading">
          <EventCard v-for="i in 3" :key="i" :loading="true" />
        </template>
        <template v-else>
          <EventCard
            v-for="activity in filteredActivities"
            :key="activity.id"
            :activity="{
              ...activity,
              startDate: activity.startDate instanceof Date ? activity.startDate : new Date(activity.startDate),
              endDate: activity.endDate instanceof Date ? activity.endDate : activity.endDate ? new Date(activity.endDate) : undefined
            }"
          />
          <div v-if="filteredActivities.length === 0" class="no-activities-message">
            <div class="empty-state">
              <div class="empty-icon">📅</div>
              <h3>No events scheduled yet</h3>
              <p>Get started by creating your first event</p>
              <router-link to="/calendar" class="calendar-link">
                Go to calendar to schedule something
              </router-link>
            </div>
          </div>
        </template>
      </div>
    </template>
    

    <div v-else class="role-screen loading-screen">
      <div class="loading-animation">
        <div class="spinner"></div>
      </div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  padding: 1rem;
  max-width: 1300px;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
  min-height: 80vh;
}

.role-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
}

.president-loading h2,
.student-form h2,
.president-form h2 {
  margin-bottom: 1rem;
  font-size: 1.75rem;
  color: #fff;
}

.president-loading p,
.student-form p,
.president-form p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.loading-animation {
  margin-bottom: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #10b981;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 500px;
}

.input-group {
  display: flex;
  margin: 1.5rem 0;
}

.input-group input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem 0 0 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
}

.input-group .submit-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0 0.5rem 0.5rem 0;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.input-group .submit-btn:hover {
  background: #0d9668;
}

.input-group .submit-btn:disabled {
  background: #0d966880;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  margin-top: 0.5rem;
}

.online-indicator {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 2rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.activity-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.no-activities-message {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.empty-state h3 {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
}

.calendar-link {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
  margin-top: 0.5rem;
}

.calendar-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.6);
  text-decoration: none;
  color: white;
}

@media (min-width: 768px) {
  .dashboard-view {
    padding: 1.5rem;
  }
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-view {
    padding: 2rem;
  }
  .activity-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1400px) {
  .activity-grid {
    gap: 2rem;
  }
}


/* Mobile bottom navigation spacing */
@media (max-width: 767px) {
  .dashboard-view {
    padding-bottom: 100px;
  }
}
</style>
