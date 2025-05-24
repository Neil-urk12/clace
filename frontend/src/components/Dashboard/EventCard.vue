<script setup lang="ts">
import { ClockIcon, MapPinIcon, CheckCircle2Icon, BookIcon } from 'lucide-vue-next';

interface ActivityItem {
  id: string | number;
  title: string;
  type: 'Assignment' | 'Quiz' | 'Project' | 'Reminder' | 'ClassSession' | 'Exam';
  subject?: string;
  dueDate: { day: string; month: string; year?: number; time?: string };
  details?: string;
  status?: 'Pending' | 'InProgress' | 'Completed' | 'Submitted' | 'Graded' | 'Overdue';
  course?: string;
  location?: string;
  imageUrl?: string;
  activityDateObject: Date;
}

interface Props {
  activity: ActivityItem;
}
defineProps<Props>();

const getStatusIcon = (status?: ActivityItem['status']) => {
  if (status === 'Completed' || status === 'Graded' || status === 'Submitted') {
    return CheckCircle2Icon;
  }
  return null;
};
</script>

<template>
  <div class="activity-card">
    <div class="card-image-container">
      <img v-if="activity.imageUrl" :src="activity.imageUrl" :alt="activity.title" class="activity-image" />
      <div v-else class="activity-image-placeholder">
        <span>{{ activity.type }}</span>
      </div>
      <div class="date-badge">
        <span class="day">{{ activity.dueDate.day }}</span>
        <span class="month">{{ activity.dueDate.month }}</span>
      </div>
      <div v-if="activity.type" class="image-overlay-type">{{ activity.type }}</div>
    </div>
    <div class="card-content">
      <div class="title-status-row">
        <h3 class="activity-title">{{ activity.title }}</h3>
        <component
          v-if="getStatusIcon(activity.status)"
          :is="getStatusIcon(activity.status)"
          class="status-icon"
          :class="{ 'status-icon-completed': activity.status === 'Completed' || activity.status === 'Graded' || activity.status === 'Submitted'}"
          :size="20"
        />
      </div>
      <p v-if="activity.details" class="activity-details-text">{{ activity.details }}</p>

      <div class="activity-info">
        <div v-if="activity.dueDate.time" class="detail-item">
          <ClockIcon :size="16" class="detail-icon" /> <span>{{ activity.dueDate.time }}</span>
        </div>
        <div v-if="activity.location" class="detail-item">
          <MapPinIcon :size="16" class="detail-icon" /> <span>{{ activity.location }}</span>
        </div>
        <div v-if="activity.subject" class="detail-item">
          <BookIcon :size="16" class="detail-icon" /> <span>{{ activity.subject }}</span>
        </div>
         <div v-else-if="activity.course" class="detail-item">
          <BookIcon :size="16" class="detail-icon" /> <span>{{ activity.course }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-image-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background-color: #e5e7eb;
}

.activity-image, .activity-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.activity-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.date-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  z-index: 1;
}

.date-badge .day {
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  line-height: 1.1;
}

.date-badge .month {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #4b5563;
  line-height: 1.1;
}

.image-overlay-type {
  position: absolute;
  color: white;
  background-color: rgba(0,0,0,0.6);
  padding: 0.25rem 0.6rem;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  z-index: 1;
  bottom: 0.75rem;
  right: 0.75rem;
  text-transform: capitalize;
}

.card-content {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.title-status-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.activity-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-right: 0.5rem;
  flex-grow: 1;
  line-height: 1.3;
}

.status-icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.status-icon-completed {
  color: #10b981;
}


.activity-details-text {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.activity-info {
  margin-top: auto;
  padding-top: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.detail-item span {
  line-height: 1.3;
}

.detail-icon {
  color: #9ca3af;
  flex-shrink: 0;
}
</style>
