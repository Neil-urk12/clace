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
      <!-- Profile Header with improved layout -->
      <div class="profile-header">
        <div class="header-content">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img :src="user.avatar" :alt="user.name" class="avatar" />
              <button class="edit-avatar-btn" title="Change profile picture">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ user.name }}</h1>
            <p class="user-email">{{ user.email }}</p>
            <div class="user-meta">
              <span class="user-role">{{ user.role }}</span>
              <span class="dot-separator">•</span>
              <span class="join-date">Member since {{ user.joinDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Sections with improved cards -->
      <div class="profile-sections">
        <!-- Account Settings -->
        <div class="section">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Account Settings
          </h2>
          <div class="setting-item hover-effect">
            <div class="setting-info">
              <h3>Personal Information</h3>
              <p>Update your name, email, and other details</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          
          <div class="setting-item hover-effect">
            <div class="setting-info">
              <h3>Password</h3>
              <p>Change your password</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Preferences -->
        <div class="section">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Preferences
          </h2>
          
          <div class="setting-item hover-effect">
            <div class="setting-info">
              <h3>Notifications</h3>
              <p>Receive email notifications about events</p>
            </div>
            <button 
              class="toggle-switch"
              :class="{ active: preferences.notifications }"
              @click="toggleNotifications"
              role="switch"
              :aria-checked="preferences.notifications"
            >
              <span class="toggle-slider"></span>
            </button>
          </div>
          
          <div class="setting-item hover-effect">
            <div class="setting-info">
              <h3>Dark Mode</h3>
              <p>Switch between light and dark themes</p>
            </div>
            <button 
              class="toggle-switch" 
              :class="{ active: preferences.darkMode }"
              @click="toggleDarkMode"
              role="switch"
              :aria-checked="preferences.darkMode"
            >
              <span class="toggle-slider"></span>
            </button>
          </div>

          <div class="setting-item hover-effect">
            <div class="setting-info">
              <h3>Language</h3>
              <p>{{ preferences.language }}</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Support -->
        <div class="section">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Support
          </h2>
          
          <div class="setting-item hover-effect">
            <div class="setting-info">
              <h3>Help Center</h3>
              <p>Get help and support</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          
          <div class="setting-item hover-effect">
            <div class="setting-info">
              <h3>Contact Us</h3>
              <p>Reach out to our support team</p>
            </div>
            <button class="setting-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Sign Out -->
        <div class="section sign-out-section">
          <button class="sign-out-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
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
  height: 100vh;
  background: #f8fafc;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
}

.profile-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 20px 80px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-header {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid rgba(229, 231, 235, 0.5);
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 100%;
}

@media (max-width: 767px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
}

.profile-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 15px 20px -5px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.02);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.edit-avatar-btn:hover {
  background: #4338ca;
  transform: scale(1.1);
}

.user-info {
  text-align: left;
  flex: 1;
}

@media (max-width: 767px) {
  .user-info {
    text-align: center;
  }
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.user-email {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 767px) {
  .user-meta {
    justify-content: center;
  }
}

.user-role {
  font-size: 14px;
  color: #4f46e5;
  font-weight: 600;
  padding: 4px 12px;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 12px;
}

.dot-separator {
  color: #cbd5e1;
}

.join-date {
  font-size: 14px;
  color: #94a3b8;
}

.profile-sections {
  display: grid;
  gap: 24px;
  width: 100%;
  flex: 1;
  grid-template-columns: 1fr;
}

.section {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.5);
  width: 100%;
}

.sign-out-section {
  grid-column: 1 / -1;
}

.section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title svg {
  color: #4f46e5;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin: 0 -16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.setting-item.hover-effect:hover {
  background: #f8fafc;
}

.setting-info h3 {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.setting-info p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.setting-action {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.setting-action:hover {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
}

.toggle-switch {
  position: relative;
  width: 52px;
  height: 28px;
  background: #e2e8f0;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: #4f46e5;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-switch.active .toggle-slider {
  transform: translateX(24px);
}

.toggle-switch:hover {
  opacity: 0.9;
}

.sign-out-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sign-out-btn:hover {
  background: #fecaca;
  border-color: #fca5a5;
  transform: translateY(-1px);
}

.sign-out-btn svg {
  transition: transform 0.2s ease;
}

.sign-out-btn:hover svg {
  transform: translateX(2px);
}

/* Mobile Responsive */
@media (min-width: 768px) {
  .profile-sections {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: min-content;
  }
}

@media (min-width: 1200px) {
  .profile-sections {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 767px) {
  .profile-container {
    padding: 20px 16px;
  }

  .profile-header {
    padding: 24px;
    border-radius: 20px;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .user-name {
    font-size: 24px;
  }

  .section {
    padding: 24px;
  }

  .setting-item {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 16px 12px;
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

  .section-title {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .user-meta {
    flex-direction: column;
    gap: 4px;
  }

  .dot-separator {
    display: none;
  }
}
</style>
