<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: '',
    validator: (value: string) => ['', 'large'].includes(value)
  }
});

const emit = defineEmits(['click']);

const buttonClass = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    props.size ? `btn-${props.size}` : ''
  ].filter(Boolean).join(' ');
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <button :class="buttonClass" @click="handleClick">
    {{ text }}
  </button>
</template>


<style scoped>
.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  border: 1px solid transparent;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

/* Variant Styles - these could be global or defined here */
.btn-primary {
  background-color: #4f46e5; /* Tailwind indigo-600 */
  color: white;
  border-color: #4f46e5;
}

.btn-primary:hover {
  background-color: #4338ca; /* Tailwind indigo-700 */
  border-color: #4338ca;
}

.btn-secondary {
  background-color: #e5e7eb; /* Tailwind gray-200 */
  color: #374151; /* Tailwind gray-700 */
  border-color: #e5e7eb;
}

.btn-secondary:hover {
  background-color: #d1d5db; /* Tailwind gray-300 */
  border-color: #d1d5db;
}

.btn-outline {
  background-color: transparent;
  color: #4f46e5; /* Tailwind indigo-600 */
  border-color: #4f46e5;
}

.btn-outline:hover {
  background-color: rgba(79, 70, 229, 0.1); /* Light indigo background */
  color: #4338ca; /* Tailwind indigo-700 */
}

/* Size Styles */
.btn-large {
  padding: 12px 24px;
  font-size: 1.125rem;
}
</style>
