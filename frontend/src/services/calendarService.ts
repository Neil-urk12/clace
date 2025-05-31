import axios from 'axios';
import type { Calendar, CreateCalendarPayload, CalendarResponse } from '@/types/calendar';

const API_URL = 'https://clace.onrender.com/api/calendars';

const calendarService = {
  async createCalendar(calendarData: CreateCalendarPayload): Promise<CalendarResponse> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_URL}`, calendarData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  async getCalendarByUserId(userId: string): Promise<Calendar | null> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.calendar;
    } catch (error: any) {
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
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  async getCalendarById(calendarId: string): Promise<Calendar | null> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/${calendarId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.calendar;
    } catch (error: any) {
      console.error('Error fetching calendar:', error);
      return null;
    }
  }
};

export default calendarService;
