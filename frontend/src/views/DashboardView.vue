<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from "vue";
import EventFilterTabs from "@/components/Dashboard/EventFilterTabs.vue";
import EventCard from "@/components/Dashboard/EventCard.vue";

interface ActivityItem {
  id: string | number;
  title: string;
  type: "Assignment" | "Quiz" | "Project" | "Reminder" | "ClassSession" | "Exam";
  subject?: string;
  dueDate: { day: string; month: string; year?: number; time?: string };
  details?: string;
  status?: "Pending" | "InProgress" | "Completed" | "Submitted" | "Graded" | "Overdue";
  course?: string;
  location?: string;
  imageUrl?: string;
  activityDateObject: Date;
}

function getMonthNumber(monthName: string): number {
  const months: { [key: string]: number } = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };
  return months[monthName.toUpperCase()] ?? 0;
}

function parseActivityDate(activity: Omit<ActivityItem, "activityDateObject">): Date {
  const day = parseInt(activity.dueDate.day, 10);
  const month = getMonthNumber(activity.dueDate.month);
  const year = activity.dueDate.year ?? new Date().getFullYear();

  let hours = 0;
  let minutes = 0;

  if (activity.dueDate.time) {
    const timeParts = activity.dueDate.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeParts) {
      hours = parseInt(timeParts[1], 10);
      minutes = parseInt(timeParts[2], 10);
      if (timeParts[3]) {
        const ampm = timeParts[3].toUpperCase();
        if (ampm === "PM" && hours < 12) {
          hours += 12;
        } else if (ampm === "AM" && hours === 12) {
          hours = 0;
        }
      }
    }
  }
  return new Date(year, month, day, hours, minutes);
}

const rawSampleActivities: Omit<ActivityItem, "activityDateObject">[] = [
  {
    id: "cs-algo-hw1",
    title: "Algorithm Analysis Homework 1",
    type: "Assignment",
    subject: "Computer Science",
    dueDate: { day: "28", month: "MAY", year: 2025, time: "11:59 PM" },
    details: "Analyze time complexity for given sorting algorithms. Implement one in Python.",
    status: "Pending",
    course: "CS301",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "cs-db-quiz2",
    title: "Database Systems Quiz 2",
    type: "Quiz",
    subject: "Computer Science",
    dueDate: { day: "02", month: "JUN", year: 2025, time: "10:00 AM" },
    details: "Quiz covering SQL joins, normalization, and transaction management.",
    status: "Pending",
    course: "CS340",
    location: "Online via ProctorU",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "cs-se-project-milestone1",
    title: "Software Engineering Project Milestone 1",
    type: "Project",
    subject: "Computer Science",
    dueDate: { day: "10", month: "JUN", year: 2025 },
    details: "Submit initial project proposal and requirements specification document.",
    status: "InProgress",
    course: "CS405",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "cs-os-exam-prep",
    title: "Operating Systems Midterm Exam",
    type: "Exam",
    subject: "Computer Science",
    dueDate: { day: "17", month: "JUN", year: 2025, time: "02:00 PM" },
    details: "Midterm covering process management, memory management, and file systems.",
    status: "Pending",
    course: "CS350",
    location: "Lecture Hall C",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "cs-net-lab2",
    title: "Networking Lab 2: TCP/IP",
    type: "Assignment",
    subject: "Computer Science",
    dueDate: { day: "20", month: "JUN", year: 2025, time: "05:00 PM" },
    details: "Implement a simple client-server application using TCP sockets.",
    status: "Pending",
    course: "CS450",
    location: "Networking Lab (Room 101)",
    imageUrl: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "cs-ai-reading",
    title: "AI Ethics Reading Discussion",
    type: "ClassSession",
    subject: "Computer Science",
    dueDate: { day: "22", month: "JUN", year: 2025, time: "11:00 AM" },
    details: "Discuss chapter 3 of 'The Age of Spiritual Machines'. Prepare talking points.",
    status: "Pending",
    course: "CS560",
    location: "Seminar Room B",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "cs-compiler-project-final",
    title: "Compiler Design Project Final Submission",
    type: "Project",
    subject: "Computer Science",
    dueDate: { day: "30", month: "JUN", year: 2025 },
    details: "Final submission of the compiler project, including documentation and test cases.",
    status: "InProgress",
    course: "CS430",
    imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60",
  }
];

const sampleActivities: ActivityItem[] = rawSampleActivities.map((activity) => ({
  ...activity,
  activityDateObject: parseActivityDate(activity),
}));

const activeFilter = ref("All");
const activities = ref<ActivityItem[]>(sampleActivities);

const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const isToday = (date: Date): boolean => {
  const today = getStartOfDay(new Date());
  return getStartOfDay(date).getTime() === today.getTime();
};

const isNextWeek = (date: Date): boolean => {
  const today = getStartOfDay(new Date());
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + ((7 - today.getDay()) % 7));
  if (nextWeekStart.getTime() <= today.getTime()) {
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  }
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

  const eventDate = getStartOfDay(date);
  return (
    eventDate.getTime() >= nextWeekStart.getTime() &&
    eventDate.getTime() <= nextWeekEnd.getTime()
  );
};

const isNextMonth = (date: Date): boolean => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let nextMonth;
  let yearOfNextMonth;

  if (currentMonth === 11) {
    nextMonth = 0;
    yearOfNextMonth = currentYear + 1;
  } else {
    nextMonth = currentMonth + 1;
    yearOfNextMonth = currentYear;
  }

  const eventDate = getStartOfDay(date);
  return (
    eventDate.getMonth() === nextMonth &&
    eventDate.getFullYear() === yearOfNextMonth
  );
};

const filteredActivities = computed(() => {
  const now = new Date();
  switch (activeFilter.value) {
    case "Today":
      return activities.value.filter((activity) => isToday(activity.activityDateObject));
    case "NextWeek":
      return activities.value.filter((activity) => isNextWeek(activity.activityDateObject));
    case "NextMonth":
      return activities.value.filter((activity) => isNextMonth(activity.activityDateObject));
    case "All":
    default:
      return activities.value.filter(
        (activity) =>
          activity.activityDateObject.getTime() >= getStartOfDay(now).getTime(),
      );
  }
});

const filterCounts = computed(() => {
  const now = new Date();
  const upcomingActivities = activities.value.filter(
    (activity) => activity.activityDateObject.getTime() >= getStartOfDay(now).getTime(),
  );

  return {
    All: upcomingActivities.length,
    Today: upcomingActivities.filter((activity) => isToday(activity.activityDateObject))
      .length,
    NextWeek: upcomingActivities.filter((activity) =>
      isNextWeek(activity.activityDateObject),
    ).length,
    NextMonth: upcomingActivities.filter((activity) =>
      isNextMonth(activity.activityDateObject),
    ).length,
  };
});

function handleFilterChange(newFilter: string) {
  activeFilter.value = newFilter;
}
</script>

<template>
  <div class="dashboard-view">
    <div class="header-section">
      <h2 class="upcoming-activities-title">Upcoming Activities</h2>
      <span class="online-indicator">● 1 online</span>
    </div>

    <EventFilterTabs
      :counts="filterCounts"
      :active-filter="activeFilter"
      @filter-changed="handleFilterChange"
    />

    <div class="activity-grid">
      <EventCard
        v-for="activity in filteredActivities"
        :key="activity.id"
        :activity="activity"
      />
      <p v-if="filteredActivities.length === 0" class="no-activities-message">
        No activities found for the selected filter.
      </p>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  padding: 1rem;
  max-width: 1300px;
  margin: 0 auto;
  box-sizing: border-box;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.upcoming-activities-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.online-indicator {
  font-size: 0.875rem;
  color: #10b981;
}

.activity-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.no-activities-message {
  text-align: center;
  color: #6b7280;
  padding: 2rem;
  font-style: italic;
}

@media (min-width: 768px) {
  .dashboard-view {
    padding: 1.5rem;
  }
  .header-section {
    margin-bottom: 1.5rem;
  }
  .upcoming-activities-title {
    font-size: 1.75rem;
  }
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-view {
    padding: 2rem;
  }
  .upcoming-activities-title {
    font-size: 2rem;
  }
  .activity-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1400px) {
  .activity-grid {
    gap: 2rem;
  }
}
</style>
