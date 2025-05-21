<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/Global/BaseButton.vue';

// Navigation links
const navLinks = ref([
  { text: 'Features', href: '#features' },
  { text: 'How It Works', href: '#how-it-works' },
  { text: 'FAQ', href: '#faq' },
  { text: 'Contact', href: '#contact' }
]);

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

// How it works steps
const steps = ref([
  {
    title: 'Sign Up',
    description: 'Create your account in seconds and set up your school profile.',
    icon: '1️⃣'
  },
  {
    title: 'Import Data',
    description: 'Easily import existing schedules or create new ones from scratch.',
    icon: '2️⃣'
  },
  {
    title: 'Customize',
    description: 'Tailor the calendar to fit your institution\'s specific needs and branding.',
    icon: '3️⃣'
  },
  {
    title: 'Share & Collaborate',
    description: 'Invite staff and students to view and interact with your calendars.',
    icon: '4️⃣'
  }
]);

// FAQ items
const faqItems = ref([
  {
    question: 'How secure is the platform?',
    answer: 'We use industry-standard encryption and security practices to ensure your data is always protected. Our servers are regularly audited for security compliance.'
  },
  {
    question: 'Can I integrate with other school management systems?',
    answer: 'Yes! Our API allows for seamless integration with popular LMS platforms, student information systems, and other educational tools.'
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Absolutely. Our mobile apps for iOS and Android provide the same great experience on the go, with push notifications for important events.'
  },
  {
    question: 'How many users can I add to my account?',
    answer: 'Our plans are designed to scale with your needs, from small classrooms to entire school districts.'
  }
]);
</script>

<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="logo">Clace</div>
      <div class="nav-links">
        <a v-for="(link, index) in navLinks" :key="index" :href="link.href">{{ link.text }}</a>
      </div>
      <div class="auth-buttons">
        <BaseButton text="Log In" variant="secondary" />
        <BaseButton text="Sign Up Free" variant="primary" />
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Simplify School Scheduling</h1>
        <p>The all-in-one calendar solution designed for educational institutions</p>
        <div class="cta-buttons">
          <BaseButton text="Get Started For Free" variant="primary" size="large" />
          <BaseButton text="Watch Demo" variant="outline" />
        </div>
      </div>
      <div class="hero-image">
        <img src="@/assets/calendar-preview.svg" alt="Calendar Preview" />
      </div>
    </section>

    <!-- Features Section -->
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

    <!-- How It Works Section -->
    <section id="how-it-works" class="how-it-works">
      <div class="section-header">
        <h2>How It Works</h2>
        <p>Get up and running in minutes</p>
      </div>
      <div class="steps-container">
        <div v-for="(step, index) in steps" :key="index" class="step-card">
          <div class="step-icon">{{ step.icon }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq">
      <div class="section-header">
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know about ClassCal</p>
      </div>
      <div class="faq-container">
        <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
          <h3>{{ item.question }}</h3>
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-content">
        <h2>Ready to transform your school scheduling?</h2>
        <p>Join thousands of educational institutions already using ClassCal</p>
        <BaseButton text="Start Your Free Trial" variant="primary" size="large" />
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>ClassCal</h3>
          <p>Making educational scheduling simple, efficient, and collaborative.</p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} ClassCal. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* General styles */
.landing-page {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #333;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  line-height: 1.2;
}

/* Navbar styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #4f46e5;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

/* Hero section */
.hero {
  display: flex;
  align-items: center;
  padding: 5rem 5%;
  background-color: #f9fafb;
  min-height: 80vh;
}

.hero-content {
  flex: 1;
  padding-right: 3rem;
}

.hero-content h1 {
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.hero-content p {
  font-size: 1.25rem;
  color: #4b5563;
  margin-bottom: 2.5rem;
  max-width: 80%;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Section styles */
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
  font-size: 1.2rem;
  color: #6b7280;
}

/* Features section */
.features {
  padding: 5rem 5%;
  background-color: white;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.feature-card p {
  color: #6b7280;
}

/* How it works section */
.how-it-works {
  padding: 5rem 5%;
  background-color: #f9fafb;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.step-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.step-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #4f46e5;
}

.step-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.step-card p {
  color: #6b7280;
}

/* FAQ section */
.faq {
  padding: 5rem 5%;
  background-color: white;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.faq-item p {
  color: #6b7280;
}

/* CTA section */
.cta {
  padding: 5rem 5%;
  background-color: #4f46e5;
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: white;
}

.cta p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Footer */
.footer {
  padding: 5rem 5% 2rem;
  background-color: #1f2937;
  color: #e5e7eb;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-col h3, .footer-col h4 {
  color: white;
  margin-bottom: 1.5rem;
}

.footer-col h3 {
  font-size: 1.5rem;
}

.footer-col p {
  margin-bottom: 1.5rem;
  color: #9ca3af;
}

.footer-col ul {
  list-style: none;
  padding-left: 0;
}

.footer-col ul li {
  margin-bottom: 0.5rem;
}

.footer-col ul li a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-col ul li a:hover {
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #374151;
  color: #9ca3af;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 3rem 5%;
  }

  .hero-content {
    padding-right: 0;
    margin-bottom: 3rem;
  }

  .hero-content p {
    max-width: 100%;
  }

  .cta-buttons {
    justify-content: center;
  }

  .feature-grid, .steps-container {
    grid-template-columns: 1fr;
  }

  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 5%;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .auth-buttons {
    width: 100%;
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
