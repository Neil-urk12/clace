<script setup lang="ts">
import { ClockIcon, MapPinIcon, CheckCircle2Icon, BookIcon } from 'lucide-vue-next';
import type { SharedEventItem } from '@/types/event'; // Corrected import path
import { computed } from 'vue';

interface Props {
  activity?: SharedEventItem;
  loading?: boolean;
}
const props = defineProps<Props>();

const getStatusIcon = (status?: SharedEventItem['status']) => {
  if (status === 'Completed' || status === 'Graded' || status === 'Submitted') {
    return CheckCircle2Icon;
  }
  return null;
};

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};
</script>

<template>
  <div class="event-card" :class="[activity?.type?.toLowerCase(), { 'skeleton': loading }]">
    <template v-if="loading">
      <div class="card-image-container">
        <div class="skeleton-box skeleton-image"></div>
      </div>
      <div class="card-content">
        <div class="title-status-row">
          <div class="skeleton-box skeleton-title"></div>
          <div class="skeleton-box skeleton-status"></div>
        </div>
        <div class="skeleton-box skeleton-details"></div>
        <div class="activity-info">
          <div class="skeleton-box skeleton-detail-item"></div>
          <div class="skeleton-box skeleton-detail-item"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="card-image-container">
        <img
          v-if="activity?.imageUrl"
          :src="activity.imageUrl"
          :alt="activity.title"
          class="activity-image"
        />
        <div v-else class="activity-image-placeholder">
          <span>{{ activity?.type }}</span>
        </div>
        <div v-if="activity?.type" class="image-overlay-type">
          {{ activity.type }}
        </div>
      </div>
      <div class="card-content">
        <div class="title-status-row">
          <h3 class="activity-title">{{ activity?.title }}</h3>
          <component
            v-if="getStatusIcon(activity?.status)"
            :is="getStatusIcon(activity?.status)"
            class="status-icon"
            :class="{
              'status-icon-completed':
                activity?.status === 'Completed' ||
                activity?.status === 'Graded' ||
                activity?.status === 'Submitted',
            }"
            :size="20"
          />
        </div>
        <p v-if="activity?.description" class="activity-details-text">
          {{ activity.description }}
        </p>

        <div class="activity-info">
          <div v-if="activity?.location" class="detail-item">
            <MapPinIcon :size="16" class="detail-icon" />
            <span>{{ activity.location }}</span>
          </div>
          <div v-if="activity?.subject" class="detail-item">
            <BookIcon :size="16" class="detail-icon" />
            <span>{{ activity.subject }}</span>
          </div>
          <div v-else-if="activity?.course" class="detail-item">
            <BookIcon :size="16" class="detail-icon" />
            <span>{{ activity.course }}</span>
          </div>
          <div v-if="activity?.startDate" class="detail-item">
            <ClockIcon :size="16" class="detail-icon" />
            <span>{{ formatDate(activity.startDate) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.event-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.event-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed, #a855f7);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.15);
}

.event-card:hover::before {
  opacity: 1;
}

.card-image-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  overflow: hidden;
}

.activity-image,
.activity-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .activity-image {
  transform: scale(1.05);
}

.activity-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.image-overlay-type {
  position: absolute;
  color: white;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(124, 58, 237, 0.9));
  backdrop-filter: blur(10px);
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
  bottom: 0.75rem;
  right: 0.75rem;
  text-transform: capitalize;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.title-status-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.activity-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-right: 0.5rem;
  flex-grow: 1;
  line-height: 1.3;
  background: linear-gradient(135deg, #1f2937, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.status-icon-completed {
  color: #10b981;
  filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3));
}

.activity-details-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.activity-info {
  margin-top: auto;
  padding-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

.detail-item:hover {
  color: #4f46e5;
}

.detail-item span {
  line-height: 1.3;
  font-weight: 500;
}

.detail-icon {
  color: #4f46e5;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.detail-item:hover .detail-icon {
  opacity: 1;
}

/* Card type variations */
.event-card.assignment {
  border-left: 4px solid #f59e0b;
}

.event-card.exam {
  border-left: 4px solid #ef4444;
}

.event-card.lecture {
  border-left: 4px solid #3b82f6;
}

.event-card.event {
  border-left: 4px solid #10b981;
}

.skeleton {
  pointer-events: none;
  opacity: 0.7;
}

.skeleton-box {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 6px;
}

.skeleton-image {
  width: 100%;
  height: 160px;
  margin-bottom: 1rem;
}

.skeleton-title {
  width: 60%;
  height: 22px;
  margin-bottom: 0.75rem;
}

.skeleton-status {
  width: 32px;
  height: 22px;
  margin-left: 0.5rem;
}

.skeleton-details {
  width: 90%;
  height: 16px;
  margin-bottom: 1rem;
}

.skeleton-detail-item {
  width: 60%;
  height: 14px;
  margin-bottom: 0.5rem;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
