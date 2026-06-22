import axios from 'axios';
import type { Calendar, CreateCalendarPayload, CalendarResponse } from '@/types/calendar';

const API_URL = 'https://clace-sp45.onrender.com/api/calendars';

const calendarService = {
  async createCalendar(calendarData: CreateCalendarPayload): Promise<CalendarResponse> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_URL}`, calendarData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, calendar: response.data.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      }
      // Re-throw the original error (e.g. AbortError, TypeError) to preserve its stack and type.
      throw error;
    }
  },

  async getCalendarByUserId(userId: string): Promise<Calendar | null> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data ?? null;
    } catch (error) {
      console.error('Error fetching calendar:', error);
      return null;
    }
  },

  async joinCalendarByCode(joinCode: string, userId: string): Promise<CalendarResponse> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_URL}/join`, { join_code: joinCode, user_id: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, calendar: response.data.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      }
      // Re-throw the original error (e.g. AbortError, TypeError) to preserve its stack and type.
      throw error;
    }
  },

  async getCalendarById(calendarId: string): Promise<Calendar | null> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/${calendarId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data ?? null;
    } catch (error) {
      console.error('Error fetching calendar:', error);
      return null;
    }
  }
};

export default calendarService;
