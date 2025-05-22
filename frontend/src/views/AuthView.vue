<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const features = [
  {
    title: 'Smart Scheduling',
    description: 'Intelligently organize your class schedules, assignments, and exams in one place.',
    icon: '📅'
  },
  {
    title: 'Secure',
    description: 'Your data is protected with industry-standard encryption and security practices.',
    icon: '🔒'
  },
  {
    title: 'Real-time Collaboration',
    description: 'Share calendars with students, teachers, and staff for better coordination.',
    icon: '👥'
  }
]

const handleSubmit = (e: Event) => {
  e.preventDefault()
  router.push('/dashboard')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-window">
      <div class="left-panel">
        <div class="backdrop-content">
          <img src="/logo.svg" alt="Logo" class="logo" />
          <h1>Welcome to Clace</h1>
          <p class="subtitle">Your All-in-One Educational Calendar Solution</p>

          <div class="features">
            <div v-for="(feature, index) in features" :key="index" class="feature">
              <span class="feature-icon">{{ feature.icon }}</span>
              <div class="feature-content">
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <h2>Login</h2>
        <form @submit="handleSubmit">
          <div class="form-group">
            <label>Email Address</label>
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input
                type="checkbox"
                v-model="rememberMe"
              />
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password">Forgot your password?</a>
          </div>

          <button type="submit" class="login-button">Login</button>

          <div class="divider">
            <span>or</span>
          </div>

          <button type="button" class="github-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign In with GitHub
          </button>

          <p class="signup-prompt">
            Don't have an account? <a href="#" class="sign-up-link">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3f 100%);
  padding: 2rem;
}

.auth-window {
  display: flex;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.left-panel {
  flex: 1;
  background: rgba(248, 249, 250, 0.67);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  position: relative;
  backdrop-filter: blur(8px);
}

.backdrop-content {
  position: relative;
  z-index: 1;
}

.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 2rem;
}

.left-panel h1 {
  font-size: 2rem;
  color: #1a1f36;
  margin-bottom: 1rem;
}

.subtitle {
  color: #697386;
  margin-bottom: 3rem;
  line-height: 1.5;
}

.features {
  display: flex;
  flex-direction: column;
}

.feature {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.feature:hover {
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 1.5rem;
  background: white;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.feature-content h3 {
  color: #1a1f36;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.feature-content p {
  color: #697386;
  font-size: 0.9rem;
  line-height: 1.5;
}

.right-panel {
  flex: 1;
  padding: 3rem;
  background: white;
}

.right-panel h2 {
  color: #1a1f36;
  font-size: 1.75rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #1a1f36;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #10b981;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #697386;
}

.forgot-password {
  color: #10b981;
  text-decoration: none;
  font-size: 0.9rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background: #059669;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: #e5e7eb;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #697386;
  font-size: 0.9rem;
}

.github-button {
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #1a1f36;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.github-button:hover {
  background: #e5e7eb;
}

.signup-prompt {
  text-align: center;
  margin-top: 2rem;
  color: #697386;
  font-size: 0.9rem;
}

.sign-up-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 768px) {
  .auth-window {
    flex-direction: column;
  }

  .left-panel {
    padding: 2rem;
  }

  .right-panel {
    padding: 2rem;
  }
}
</style>
