import { defineStore } from 'pinia';
import calendarService from '@/services/calendarService';
import type { Calendar } from '@/types/calendar';
import { useAuthStore } from './authStore';

interface CalendarState {
  calendar: Calendar | null;
  loading: boolean;
  error: string | null;
}

export const useCalendarStore = defineStore('calendar', {
  state: (): CalendarState => ({
    calendar: null,
    loading: false,
    error: null
  }),
  
  getters: {
    hasCalendar: (state) => !!state.calendar,
    calendarName: (state) => state.calendar?.calendar_name || '',
    joinCode: (state) => state.calendar?.join_code || '',
    isCreator: (state) => {
      const authStore = useAuthStore();
      return state.calendar?.creator_user_id === authStore.user?.user_id;
    }
  },
  
  actions: {
    async createCalendar(calendarName: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const authStore = useAuthStore();
        if (!authStore.user?.user_id) {
          throw new Error('User not authenticated');
        }
        
        const response = await calendarService.createCalendar({
          calendar_name: calendarName,
          creator_user_id: authStore.user.user_id
        });
        
        if (response.success && response.calendar) {
          this.calendar = response.calendar;
          authStore.setHasJoinedClass(true);
          return { success: true, calendar: response.calendar };
        } else {
          throw new Error(response.message || 'Failed to create calendar');
        }
      } catch (error: any) {
        this.error = error.message || 'An error occurred while creating the calendar';
        console.error('Create calendar error:', error);
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    async joinCalendarByCode(joinCode: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const authStore = useAuthStore();
        if (!authStore.user?.user_id) {
          throw new Error('User not authenticated');
        }
        
        const response = await calendarService.joinCalendarByCode(joinCode, authStore.user.user_id);
        
        if (response.success && response.calendar) {
          this.calendar = response.calendar;
          authStore.setHasJoinedClass(true);
          return { success: true, calendar: response.calendar };
        } else {
          throw new Error(response.message || 'Failed to join calendar');
        }
      } catch (error: any) {
        this.error = error.message || 'An error occurred while joining the calendar';
        console.error('Join calendar error:', error);
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    async loadUserCalendar() {
      this.loading = true;
      this.error = null;
      
      try {
        const authStore = useAuthStore();
        if (!authStore.user?.user_id) {
          return { success: false, message: 'User not authenticated' };
        }
        
        const calendar = await calendarService.getCalendarByUserId(authStore.user.user_id);
        
        if (calendar) {
          this.calendar = calendar;
          return { success: true, calendar };
        } else {
          return { success: false, message: 'No calendar found for user' };
        }
      } catch (error: any) {
        this.error = error.message || 'An error occurred while loading the calendar';
        console.error('Load calendar error:', error);
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    resetCalendarState() {
      this.calendar = null;
      this.loading = false;
      this.error = null;
    }
  }
});
