<script setup lang="ts">
import { ref } from 'vue';

// FAQ items
const faqItems = ref([
  {
    question: 'How secure is the platform?',
    answer: 'We use industry-standard encryption and security practices to ensure your data is always protected. Our servers are regularly audited for security compliance.'
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'We don\'t have a mobile app yet, but our web application is built as a progressive web app and works well on mobile devices.'
  },
  {
    question: 'How many users can I add to my account?',
    answer: 'Our plans are designed to scale with your needs, from small classrooms to entire school districts.'
  }
]);

const activeFaqIndex = ref<number | null>(null);

const toggleFaq = (index: number) => {
  if (activeFaqIndex.value === index) {
    activeFaqIndex.value = null
  } else {
    activeFaqIndex.value = index
  }
};
</script>

<template>
  <section id="faq" class="faq">
    <div class="section-header">
      <h2>Frequently Asked Questions</h2>
      <p>Everything you need to know about ClassCal</p>
    </div>
    <div class="faq-container">
      <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
        <div class="faq-question-wrapper" @click="toggleFaq(index)">
          <h3>{{ item.question }}</h3>
          <span class="faq-indicator">{{ activeFaqIndex === index ? '-' : '+' }}</span>
        </div>
        <transition name="faq-toggle">
          <div v-if="activeFaqIndex === index" class="faq-answer">
            <p>{{ item.answer }}</p>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* FAQ section styles */
.faq {
  padding: 5rem 5%;
  background-color: white;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem 0; /* Vertical padding for the clickable area */
}

.faq-question-wrapper h3 {
  font-size: 1.3rem; /* Original h3 font-size */
  color: #1f2937;    /* Original h3 color */
  margin: 0;          /* Reset margin, spacing handled by wrapper */
  flex-grow: 1;       /* Allow question text to take available space */
}

.faq-indicator {
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 1rem; /* Space between question text and indicator */
  color: #4f46e5;   /* Primary color, similar to buttons */
  transition: transform 0.2s ease-in-out;
}

.faq-answer {
  overflow: hidden; /* Necessary for max-height transition */
}

.faq-answer p {
  color: #6b7280; /* Original p color */
  padding: 0.5rem 0 1rem 0; /* Padding around the answer text */
  margin: 0;        /* Reset default paragraph margins */
}

/* Transition for accordion content */
.faq-toggle-enter-active {
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out 0.05s; /* Delay opacity slightly */
  max-height: 300px; /* Adjust if FAQ answers can be much longer */
}
.faq-toggle-leave-active {
  transition: max-height 0.3s ease-in, opacity 0.2s ease-in;
  max-height: 300px; /* Must be same as enter-active for smooth transition */
}
.faq-toggle-enter-from,
.faq-toggle-leave-to {
  max-height: 0;
  opacity: 0;
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
