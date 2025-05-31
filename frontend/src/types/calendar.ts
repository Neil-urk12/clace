export interface Calendar {
  id?: string;
  calendar_id?: string;
  calendar_name: string;
  creator_user_id: string;
  join_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCalendarPayload {
  calendar_name: string;
  creator_user_id: string;
}

export interface CalendarResponse {
  success: boolean;
  calendar?: Calendar;
  message?: string;
}
