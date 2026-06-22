import { EventModel, CreateEventData, UpdateEventData, EventFilters } from '../models/Event';
import { CalendarModel } from '../models/Calendar';
import { NotFoundError } from '../lib/errors';

export class EventController {
  static async getAllEvents(userId: string) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      return [];
    }

    const events = await EventModel.findAllByCalendar(calendar.calendar_id);
    return EventModel.toResponseArray(events);
  }

  static async getEventById(eventId: string, userId: string) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      throw new NotFoundError('No calendar found for user');
    }

    const event = await EventModel.findById(eventId, calendar.calendar_id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    return EventModel.toResponse(event);
  }

  static async createEvent(eventData: Omit<CreateEventData, 'calendar_id' | 'creator_user_id'>, userId: string) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      throw new NotFoundError('No calendar found for user');
    }

    const fullEventData: CreateEventData = {
      ...eventData,
      calendar_id: calendar.calendar_id,
      creator_user_id: userId
    };

    return EventModel.create(fullEventData);
  }

  static async updateEvent(eventId: string, userId: string, updateData: UpdateEventData) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      throw new NotFoundError('No calendar found for user');
    }

    return EventModel.update(eventId, calendar.calendar_id, updateData);
  }

  static async deleteEvent(eventId: string, userId: string) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      throw new NotFoundError('No calendar found for user');
    }

    const deleted = await EventModel.delete(eventId, calendar.calendar_id);
    if (!deleted) {
      throw new NotFoundError('Event not found or no permission to delete');
    }
    return { message: 'Event deleted successfully' };
  }

  static async getEventsByFilter(userId: string, filters: EventFilters) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      return [];
    }

    const events = await EventModel.findByFilter(calendar.calendar_id, filters);
    return EventModel.toResponseArray(events);
  }

  static async syncEvents(userId: string) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      return [];
    }

    // Placeholder for external sync (e.g. Google Calendar).
    const events = await EventModel.findAllByCalendar(calendar.calendar_id);

    return EventModel.toResponseArray(events);
  }

  static async bulkCreateEvents(userId: string, eventsData: Omit<CreateEventData, 'calendar_id' | 'creator_user_id'>[]) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      throw new NotFoundError('No calendar found for user');
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

    return results;
  }

  static async deleteAllEvents(userId: string) {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      return null;
    }

    const deletedCount = await EventModel.deleteAll(calendar.calendar_id);
    return { message: `${deletedCount} events deleted successfully` };
  }
}
