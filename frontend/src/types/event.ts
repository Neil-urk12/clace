// In frontend/src/types/event.ts
export interface SharedEventItem {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  allDay: boolean;
  type: "Assignment" | "Quiz" | "Project" | "Reminder" | "ClassSession" | "Exam" | "GeneralActivity";
  subject?: string;
  course?: string;
  status?: "Pending" | "InProgress" | "Completed" | "Submitted" | "Graded" | "Overdue" | "Scheduled";
  location?: string;
  imageUrl?: string;
  color?: string;
}
