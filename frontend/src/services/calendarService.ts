import { apiClient } from '@/api/client';
import { NotFoundError } from '@/api/errors';
import type { Calendar, CreateCalendarPayload } from '@/types/calendar';

/**
 * Returns the calendar unwrapped. Methods that semantically represent
 * "look up by ID; absent is a valid result" return null via typed catch —
 * the apiClient throws NotFoundError on 404; the service converts that to null.
 */
export const calendarService = {
  async createCalendar(payload: CreateCalendarPayload): Promise<Calendar> {
    return apiClient.post<Calendar>('/calendars', payload);
  },

  async joinCalendarByCode(joinCode: string, userId: string): Promise<Calendar> {
    return apiClient.post<Calendar>('/calendars/join', { join_code: joinCode, user_id: userId });
  },

  async getCalendarByUserId(userId: string): Promise<Calendar | null> {
    return getCalendarById(`/calendars/user/${userId}`);
  },

  async getCalendarById(calendarId: string): Promise<Calendar | null> {
    return getCalendarById(`/calendars/${calendarId}`);
  },
};

/** Shared null-on-404 helper for the two `getCalendar*` methods. */
const getCalendarById = async (path: string): Promise<Calendar | null> => {
  try {
    return await apiClient.get<Calendar>(path);
  } catch (err) {
    if (err instanceof NotFoundError) return null;
    throw err;
  }
};

export default calendarService;