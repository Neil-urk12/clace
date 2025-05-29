<script setup lang="ts">
import { computed } from 'vue';

interface BaseButtonProps {
  type?: 'button' | 'submit' | 'reset';
  design?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'icon-only' | 'gradient-primary' | 'gradient-danger';
  size?: '' | 'large';
  disabled?: boolean;
  iconLeft?: object;
  iconRight?: object;
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  type: 'button',
  design: 'primary',
  size: '',
  disabled: false,
  iconLeft: undefined,
  iconRight: undefined
});

const emit = defineEmits(['click']);

const buttonClass = computed(() => {
  return [
    'btn',
    `btn-${props.design}`,
    props.size ? `btn-${props.size}` : ''
  ].filter(Boolean).join(' ');
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <button :type="type" :class="buttonClass" @click="handleClick" :disabled="disabled">
    <component v-if="iconLeft" :is="iconLeft" class="btn-icon-left" />
    <slot></slot>
    <component v-if="iconRight" :is="iconRight" class="btn-icon-right" />
  </button>
</template>


<style scoped>
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

/* Variant Styles - these could be global or defined here */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #4c1d95;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #3730a3;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background: transparent;
  color: #4c1d95;
  border: 1px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.5);
  color: #3730a3;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.15);
}

/* Size Styles */
.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  border-radius: 16px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Focus Styles */
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.4), 0 4px 15px 0 rgba(0, 0, 0, 0.1);
}

.btn:focus:not(:focus-visible) {
  box-shadow: none;
}

/* New Design Styles */
.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px 0 rgba(239, 68, 68, 0.4);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(239, 68, 68, 0.6);
}

.btn-ghost {
  background: transparent;
  color: #4c1d95;
  border: none;
  backdrop-filter: blur(10px);
}

.btn-ghost:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #3730a3;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.1);
}

.btn-icon-only {
  padding: 0.5rem;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #4c1d95;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
}

.btn-icon-only:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #3730a3;
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.15);
}

.btn-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
}

.btn-gradient-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.6);
}

.btn-gradient-primary:active {
  background: linear-gradient(135deg, #4338ca 0%, #5b21b6 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
}

.btn-gradient-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px 0 rgba(239, 68, 68, 0.4);
}

.btn-gradient-danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(239, 68, 68, 0.6);
}

.btn-gradient-danger:active {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px 0 rgba(239, 68, 68, 0.4);
}

/* Button with icon alignment */
.btn svg {
  width: 1.25em;
  height: 1.25em;
}

.btn-icon-left {
  margin-right: 0.5rem;
}

.btn-icon-right {
  margin-left: 0.5rem;
}
</style>
