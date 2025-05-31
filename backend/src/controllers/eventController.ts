import { EventModel, CreateEventData, UpdateEventData, EventFilters } from '../models/Event';
import { CalendarModel } from '../models/Calendar';

export class EventController {
  static async getAllEvents(userId: string) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        return {
          success: true,
          data: []
        };
      }

      const events = await EventModel.findAllByCalendar(calendar.calendar_id);
      return {
        success: true,
        data: EventModel.toResponseArray(events)
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch events');
    }
  }

  static async getEventById(eventId: string, userId: string) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        throw new Error('No calendar found for user');
      }

      const event = await EventModel.findById(eventId, calendar.calendar_id);
      if (!event) {
        throw new Error('Event not found');
      }
      return {
        success: true,
        data: EventModel.toResponse(event)
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch event');
    }
  }

  static async createEvent(eventData: Omit<CreateEventData, 'calendar_id'>, userId: string) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        throw new Error('No calendar found for user');
      }

      const fullEventData: CreateEventData = {
        ...eventData,
        calendar_id: calendar.calendar_id,
        creator_user_id: userId
      };

      const event = await EventModel.create(fullEventData);
      return {
        success: true,
        data: event
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create event');
    }
  }

  static async updateEvent(eventId: string, userId: string, updateData: UpdateEventData) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        throw new Error('No calendar found for user');
      }

      const event = await EventModel.update(eventId, calendar.calendar_id, updateData);
      return {
        success: true,
        data: event
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update event');
    }
  }

  static async deleteEvent(eventId: string, userId: string) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        throw new Error('No calendar found for user');
      }

      const deleted = await EventModel.delete(eventId, calendar.calendar_id);
      if (!deleted) {
        throw new Error('Event not found or no permission to delete');
      }
      return {
        success: true,
        message: 'Event deleted successfully'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete event');
    }
  }

  static async getEventsByFilter(userId: string, filters: EventFilters) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        return {
          success: true,
          data: []
        };
      }

      const events = await EventModel.findByFilter(calendar.calendar_id, filters);
      return {
        success: true,
        data: EventModel.toResponseArray(events)
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch filtered events');
    }
  }

  static async syncEvents(userId: string) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        return {
          success: true,
          data: [],
          message: 'No calendar found for user'
        };
      }

      // This is a placeholder for external sync functionality
      // In a real implementation, this would sync with external calendars like Google Calendar
      const events = await EventModel.findAllByCalendar(calendar.calendar_id);
      
      // Simulate sync process
      console.log(`Syncing events for user ${userId} in calendar ${calendar.calendar_id}`);
      
      return {
        success: true,
        data: EventModel.toResponseArray(events),
        message: 'Events synced successfully'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sync events');
    }
  }

  static async bulkCreateEvents(userId: string, eventsData: Omit<CreateEventData, 'calendar_id' | 'creator_user_id'>[]) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        throw new Error('No calendar found for user');
      }

      const results = [];
      for (const eventData of eventsData) {
        const fullEventData: CreateEventData = {
          ...eventData,
          calendar_id: calendar.calendar_id,
          creator_user_id: userId
        };
        const event = await EventModel.create(fullEventData);
        results.push(event);
      }
      
      return {
        success: true,
        data: results,
        message: `${results.length} events created successfully`
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create events');
    }
  }

  static async deleteAllEvents(userId: string) {
    try {
      // Get user's calendar
      const calendar = await CalendarModel.findByUserId(userId);
      if (!calendar) {
        return {
          success: true,
          message: 'No calendar found for user'
        };
      }

      const deletedCount = await EventModel.deleteAll(calendar.calendar_id);
      return {
        success: true,
        message: `${deletedCount} events deleted successfully`
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete all events');
    }
  }
}
