<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  X,
  Calendar,
  Clock,
  Type,
  FileText,
  Palette,
  Trash2,
  Tag,
  BookOpen,
  CheckSquare,
  MapPin,
  Image,
} from "lucide-vue-next";
import BaseButton from "@/components/Global/BaseButton.vue";
import type { SharedEventItem } from "@/types/event";

interface Props {
  show: boolean;
  event?: SharedEventItem | null;
  isCreating: boolean;
  selectedDate?: Date | null;
}

interface Emits {
  (e: "create", eventData: Omit<SharedEventItem, "id">): void;
  (e: "update", eventData: Partial<SharedEventItem>): void;
  (e: "delete", eventId: string): void;
  (e: "close"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref({
  title: "",
  description: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  color: "#3b82f6",
  allDay: false,
  type: "GeneralActivity" as SharedEventItem["type"],
  subject: "",
  course: "",
  status: "Scheduled" as SharedEventItem["status"],
  location: "",
  imageUrl: "",
});

const colorOptions = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
  "#6b7280",
];

const isValid = computed(() => {
  return (
    formData.value.title.trim() !== "" &&
    formData.value.startDate !== "" &&
    (formData.value.allDay || formData.value.startTime !== "") &&
    formData.value.endDate !== "" &&
    (formData.value.allDay || formData.value.endTime !== "")
  );
});

const modalTitle = computed(() => {
  if (props.isCreating) return "Create New Event";
  return "Edit Event";
});

const initializeForm = () => {
  if (props.event && !props.isCreating) {
    formData.value = {
      title: props.event.title,
      description: props.event.description || "",
      startDate: formatDateForInput(new Date(props.event.startDate)),
      startTime: formatTimeForInput(new Date(props.event.startDate)),
      endDate: props.event.endDate
        ? formatDateForInput(new Date(props.event.endDate))
        : "",
      endTime: props.event.endDate
        ? formatTimeForInput(new Date(props.event.endDate))
        : "",
      color: props.event.color || "#3b82f6",
      allDay: props.event.allDay || false,
      type: props.event.type || "GeneralActivity",
      subject: props.event.subject || "",
      course: props.event.course || "",
      status: props.event.status || "Scheduled",
      location: props.event.location || "",
      imageUrl: props.event.imageUrl || "",
    };
  } else {
    const now = new Date();
    const defaultDate = props.selectedDate || now;
    const startTime = new Date(defaultDate);
    startTime.setMinutes(0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);

    formData.value = {
      title: "",
      description: "",
      startDate: formatDateForInput(defaultDate),
      startTime: formatTimeForInput(startTime),
      endDate: formatDateForInput(defaultDate),
      endTime: formatTimeForInput(endTime),
      color: "#3b82f6",
      allDay: false,
      type: "GeneralActivity",
      subject: "",
      course: "",
      status: "Scheduled",
      location: "",
      imageUrl: "",
    };
  }
};

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const formatTimeForInput = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

const parseDateTime = (dateStr: string, timeStr: string): Date => {
  if (!timeStr) {
    return new Date(dateStr + "T00:00:00");
  }
  return new Date(dateStr + "T" + timeStr + ":00");
};

const handleSubmit = () => {
  if (!isValid.value) return;

  const startDateTime = parseDateTime(
    formData.value.startDate,
    formData.value.startTime,
  );
  const endDateTime = parseDateTime(
    formData.value.endDate,
    formData.value.endTime,
  );

  const eventDataPayload: Omit<SharedEventItem, "id"> = {
    title: formData.value.title.trim(),
    description: formData.value.description.trim(),
    startDate: startDateTime,
    endDate: endDateTime,
    color: formData.value.color,
    allDay: formData.value.allDay,
    type: formData.value.type,
    subject: formData.value.subject?.trim() || undefined,
    course: formData.value.course?.trim() || undefined,
    status: formData.value.status,
    location: formData.value.location?.trim() || undefined,
    imageUrl: formData.value.imageUrl?.trim() || undefined,
  };

  if (props.isCreating) {
    emit("create", eventDataPayload);
  } else if (props.event?.id) {
    emit("update", { ...eventDataPayload, id: props.event.id });
  }
};

const handleDelete = () => {
  if (props.event && !props.isCreating) {
    if (confirm("Are you sure you want to delete this event?")) {
      emit("delete", props.event.id);
    }
  }
};

const handleClose = () => {
  emit("close");
};

const handleAllDayChange = () => {
  if (formData.value.allDay) {
    // Set times to full day
    formData.value.startTime = "00:00";
    formData.value.endTime = "23:59";
  }
};

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      initializeForm();
    }
  },
);

const titleInput = ref<HTMLInputElement>();

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        titleInput.value?.focus();
      }, 100);
    }
  },
);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    handleClose();
  } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    handleSubmit();
  }
};

onMounted(() => {
  initializeForm();
});
</script>

<template>
  <div
    v-if="show"
    class="modal-overlay"
    @click="handleClose"
    @keydown="handleKeydown"
  >
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ modalTitle }}</h2>
        <BaseButton @click="handleClose" design="icon-only">
          <X :size="20" />
        </BaseButton>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="title" class="form-label">
            <Type :size="16" />
            Event Title
          </label>
          <input
            id="title"
            ref="titleInput"
            v-model="formData.title"
            type="text"
            class="form-input"
            placeholder="Enter event title"
            required
          />
        </div>

        <div class="form-group">
          <label for="description" class="form-label">
            <FileText :size="16" />
            Description
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-textarea"
            placeholder="Enter event description (optional)"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="activityType" class="form-label">
            <Tag :size="16" />
            Activity Type
          </label>
          <select id="activityType" v-model="formData.type" class="form-input">
            <option value="GeneralActivity">General Activity</option>
            <option value="Assignment">Assignment</option>
            <option value="Quiz">Quiz</option>
            <option value="Project">Project</option>
            <option value="Reminder">Reminder</option>
            <option value="ClassSession">Class Session</option>
            <option value="Exam">Exam</option>
          </select>
        </div>

        <div class="form-group">
          <label for="subject" class="form-label">
            <BookOpen :size="16" />
            Subject
          </label>
          <input
            id="subject"
            v-model="formData.subject"
            type="text"
            class="form-input"
            placeholder="e.g., Mathematics, History"
          />
        </div>

        <div class="form-group">
          <label for="course" class="form-label">
            <BookOpen :size="16" />
            Course
          </label>
          <input
            id="course"
            v-model="formData.course"
            type="text"
            class="form-input"
            placeholder="e.g., MATH101, HIST202"
          />
        </div>

        <div class="form-group">
          <label for="status" class="form-label">
            <CheckSquare :size="16" />
            Status
          </label>
          <select id="status" v-model="formData.status" class="form-input">
            <option value="Scheduled">Scheduled</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Submitted">Submitted</option>
            <option value="Graded">Graded</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div class="form-group">
          <label for="location" class="form-label">
            <MapPin :size="16" />
            Location
          </label>
          <input
            id="location"
            v-model="formData.location"
            type="text"
            class="form-input"
            placeholder="e.g., Room 101, Online"
          />
        </div>

        <div class="form-group">
          <label for="imageUrl" class="form-label">
            <Image :size="16" />
            Image URL
          </label>
          <input
            id="imageUrl"
            v-model="formData.imageUrl"
            type="url"
            class="form-input"
            placeholder="https://example.com/image.png"
          />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="formData.allDay"
              type="checkbox"
              class="checkbox-input"
              @change="handleAllDayChange"
            />
            <span class="checkbox-custom"></span>
            All Day Event
          </label>
        </div>

        <div class="datetime-grid">
          <div class="form-group">
            <label for="startDate" class="form-label">
              <Calendar :size="16" />
              Start Date
            </label>
            <input
              id="startDate"
              v-model="formData.startDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <div v-if="!formData.allDay" class="form-group">
            <label for="startTime" class="form-label">
              <Clock :size="16" />
              Start Time
            </label>
            <input
              id="startTime"
              v-model="formData.startTime"
              type="time"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="endDate" class="form-label">
              <Calendar :size="16" />
              End Date
            </label>
            <input
              id="endDate"
              v-model="formData.endDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <div v-if="!formData.allDay" class="form-group">
            <label for="endTime" class="form-label">
              <Clock :size="16" />
              End Time
            </label>
            <input
              id="endTime"
              v-model="formData.endTime"
              type="time"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <Palette :size="16" />
            Event Color
          </label>
          <div class="color-grid">
            <button
              v-for="color in colorOptions"
              :key="color"
              type="button"
              :class="['color-option', { selected: formData.color === color }]"
              :style="{ backgroundColor: color }"
              @click="formData.color = color"
            >
              <span v-if="formData.color === color" class="color-check">✓</span>
            </button>
          </div>
        </div>

        <div class="form-actions">
          <div class="actions-left">
            <BaseButton
              v-if="!isCreating"
              type="button"
              @click="handleDelete"
              design="gradient-danger"
            >
              <Trash2 :size="16" />
              Delete
            </BaseButton>
          </div>
          <div class="actions-right">
            <BaseButton type="button" @click="handleClose" design="secondary">
              Cancel
            </BaseButton>
            <BaseButton type="submit" :disabled="!isValid" design="gradient-primary">
              {{ isCreating ? "Create Event" : "Update Event" }}
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.23s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-radius: inherit;
  pointer-events: none;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  position: relative;
  z-index: 2;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-form {
  padding: 0 2rem 2rem;
  position: relative;
  z-index: 2;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #4c1d95;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 0.9rem;
  color: #374151;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.95);
  border-color: #667eea;
  box-shadow:
    0 0 0 3px rgba(102, 126, 234, 0.2),
    0 4px 15px 0 rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  font-weight: 600;
  color: #4c1d95;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-label:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
  transform: scale(1.05);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.datetime-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.color-option {
  width: 3rem;
  height: 3rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.color-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.color-option:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 8px 25px 0 rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.color-option:hover::before {
  opacity: 1;
}

.color-option.selected {
  border-color: #4c1d95;
  box-shadow:
    0 0 0 3px rgba(255, 255, 255, 0.8),
    0 0 0 5px #4c1d95,
    0 8px 25px 0 rgba(76, 29, 149, 0.3);
  transform: translateY(-3px) scale(1.15);
}

.color-check {
  color: white;
  font-weight: bold;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  z-index: 2;
  position: relative;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.actions-left,
.actions-right {
  display: flex;
  gap: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    margin: 0;
    border-radius: 16px 16px 0 0;
    max-height: calc(100vh - 90px); /* Account for bottom navigation */
    padding-bottom: 90px; /* Ensure content is not obscured by bottom nav */
    animation: slideUpMobile 0.24s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideUpMobile {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    padding: 1.5rem 1.5rem 0;
    padding-bottom: 1rem;
  }

  .modal-form {
    padding: 0 1.5rem calc(1.5rem + 90px); /* Add padding for bottom nav */
  }

  .datetime-grid {
    grid-template-columns: 1fr;
  }

  .color-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }

  .color-option {
    width: 2.5rem;
    height: 2.5rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .actions-left,
  .actions-right {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    border-radius: 12px 12px 0 0;
    max-height: calc(100vh - 90px); /* Re-apply for smaller screens */
    padding-bottom: 90px; /* Re-apply for smaller screens */
  }

  .modal-header {
    padding: 1.25rem 1.25rem 0;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }

  .modal-form {
    padding: 0 1.25rem calc(1.25rem + 90px); /* Add padding for bottom nav */
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .form-input,
  .form-textarea {
    padding: 0.875rem;
    font-size: 0.875rem;
  }

  .color-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .color-option {
    width: 2.25rem;
    height: 2.25rem;
  }

  .delete-btn,
  .cancel-btn,
  .submit-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.875rem;
  }
}
</style>
