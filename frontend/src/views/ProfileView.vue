<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/api/placeholder/150/150',
  role: 'Student',
  joinDate: 'January 2024'
})

const preferences = ref({
  notifications: true,
  darkMode: false,
  language: 'English'
})

const toggleNotifications = () => {
  preferences.value.notifications = !preferences.value.notifications
}

const toggleDarkMode = () => {
  preferences.value.darkMode = !preferences.value.darkMode
}
</script>

<template>
  <div class="profile-view">
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar-section">
          <img :src="user.avatar" :alt="user.name" class="avatar" />
          <button class="edit-avatar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="user-info">
          <h1 class="user-name">{{ user.name }}</h1>
          <p class="user-email">{{ user.email }}</p>
          <p class="user-role">{{ user.role }}</p>
          <p class="join-date">Member since {{ user.joinDate }}</p>
        </div>
      </div>

      <!-- Profile Sections -->
      <div class="profile-sections">
        <!-- Account Settings -->
        <div class="section">
          <h2 class="section-title">Account Settings</h2>
          <div class="setting-item">
            <div class="setting-info">
              <h3>Personal Information</h3>
              <p>Update your name, email, and other details</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>Password</h3>
              <p>Change your password</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Preferences -->
        <div class="section">
          <h2 class="section-title">Preferences</h2>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>Notifications</h3>
              <p>Receive email notifications about events</p>
            </div>
            <button 
              class="toggle-switch"
              :class="{ active: preferences.notifications }"
              @click="toggleNotifications"
            >
              <span class="toggle-slider"></span>
            </button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>Dark Mode</h3>
              <p>Switch between light and dark themes</p>
            </div>
            <button 
              class="toggle-switch"
              :class="{ active: preferences.darkMode }"
              @click="toggleDarkMode"
            >
              <span class="toggle-slider"></span>
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Language</h3>
              <p>{{ preferences.language }}</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Support -->
        <div class="section">
          <h2 class="section-title">Support</h2>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>Help Center</h3>
              <p>Get help and support</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>Contact Us</h3>
              <p>Reach out to our support team</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Sign Out -->
        <div class="section">
          <button class="sign-out-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: #f9fafb;
  padding: 20px;
  padding-bottom: 100px; /* Space for bottom navigation */
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.avatar-section {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-avatar-btn:hover {
  background: #3730a3;
}

.user-info {
  text-align: center;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.user-email {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.user-role {
  font-size: 14px;
  color: #4f46e5;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.join-date {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h3 {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  margin: 0 0 4px 0;
}

.setting-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.setting-action {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
}

.setting-action:hover {
  color: #4f46e5;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 24px;
  background: #d1d5db;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-switch.active {
  background: #4f46e5;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-switch.active .toggle-slider {
  transform: translateX(24px);
}

.sign-out-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.sign-out-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* Mobile Responsive */
/* Mobile bottom navigation spacing */
@media (max-width: 767px) {
  .profile-view {
    padding: 16px;
    padding-bottom: 120px;
  }

  .profile-container {
    max-width: 100%;
  }

  .profile-header {
    padding: 20px;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .user-name {
    font-size: 22px;
  }

  .section {
    padding: 20px;
  }

  .setting-item {
    padding: 12px 0;
  }
}

@media (max-width: 480px) {
  .profile-view {
    padding: 12px;
  }

  .profile-header {
    padding: 16px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .user-name {
    font-size: 20px;
  }

  .section {
    padding: 16px;
  }

  .section-title {
    font-size: 16px;
  }
}
</style>