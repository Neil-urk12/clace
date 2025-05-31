import { CalendarModel, CreateCalendarData } from '../models/Calendar';

export class CalendarController {
  static async createCalendar(calendarData: CreateCalendarData) {
    try {
      const calendar = await CalendarModel.create(calendarData);
      return {
        success: true,
        calendar: calendar
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create calendar');
    }
  }

  static async getCalendarById(calendarId: string) {
    try {
      const calendar = await CalendarModel.findById(calendarId);
      if (!calendar) {
        throw new Error('Calendar not found');
      }
      return {
        success: true,
        calendar: CalendarModel.toResponse(calendar)
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch calendar');
    }
  }

  static async getCalendarByUserId(userId: string) {
    try {
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        return {
          success: false,
          message: 'No calendar found for user'
        };
      }
      return {
        success: true,
        calendar: CalendarModel.toResponse(calendar)
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user calendar');
    }
  }

  static async joinCalendarByCode(joinCode: string, userId: string) {
    try {
      const calendar = await CalendarModel.findByJoinCode(joinCode);
      if (!calendar) {
        throw new Error('Invalid join code');
      }

      // Check if user is already a member
      const existingMembership = await CalendarModel.getMembership(userId, calendar.calendar_id);
      if (existingMembership) {
        return {
          success: true,
          calendar: CalendarModel.toResponse(calendar),
          message: 'Already a member of this calendar'
        };
      }

      // Add user to calendar
      await CalendarModel.addMember(calendar.calendar_id, userId);

      return {
        success: true,
        calendar: CalendarModel.toResponse(calendar)
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to join calendar');
    }
  }

  static async getUserCalendars(userId: string) {
    try {
      const calendars = await CalendarModel.getUserCalendars(userId);
      return {
        success: true,
        calendars: calendars.map(calendar => CalendarModel.toResponse(calendar))
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user calendars');
    }
  }
}
