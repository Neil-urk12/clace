import { eq, and, gte, lte } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { events } from '../config/schema';
import { Calendar, CalendarModel } from './Calendar';
import { NotFoundError, ValidationError } from '../lib/errors';

export interface Event {
  id: string;
  calendarId: string;
  creatorId: string;
  title: string;
  description?: string;
  startDatetime: Date;
  endDatetime: Date;
  allDay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventData {
  calendar_id: string;
  creator_user_id: string;
  title: string;
  description?: string;
  start_datetime: Date;
  end_datetime: Date;
  all_day: boolean;
}

/** Shape the routes pass in. The model fills in calendar_id and creator_user_id. */
export type CreateEventInput = Omit<CreateEventData, 'calendar_id' | 'creator_user_id'>;

export interface UpdateEventData {
  title?: string;
  description?: string;
  start_datetime?: Date;
  end_datetime?: Date;
  all_day?: boolean;
}

export interface EventResponse {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type?: "Assignment" | "Quiz" | "Project" | "Reminder" | "ClassSession" | "Exam" | "GeneralActivity";
  subject?: string;
  course?: string;
  status?: "Pending" | "InProgress" | "Completed" | "Submitted" | "Graded" | "Overdue" | "Scheduled";
  location?: string;
  imageUrl?: string;
  color?: string;
}

export interface EventFilters {
  start_datetime?: Date;
  end_datetime?: Date;
}

export class EventModel {
  // === PUBLIC SEAM ===

  static async getAllForUser(userId: string): Promise<EventResponse[]> {
    const calendar = await this.getCalendarForUser(userId);
    const eventsList = await this.findAllByCalendar(calendar.id);
    return this.toResponseArray(eventsList);
  }

  static async getByIdForUser(eventId: string, userId: string): Promise<EventResponse> {
    const calendar = await this.getCalendarForUser(userId);
    const event = await this.findById(eventId, calendar.id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    return this.toResponse(event);
  }

  static async createForUser(eventData: CreateEventInput, userId: string): Promise<EventResponse> {
    const calendar = await this.getCalendarForUser(userId);
    return this.insertRow({
      ...eventData,
      calendar_id: calendar.id,
      creator_user_id: userId,
    });
  }

  static async updateForUser(eventId: string, updateData: UpdateEventData, userId: string): Promise<EventResponse> {
    const calendar = await this.getCalendarForUser(userId);
    return this.updateRow(eventId, calendar.id, updateData);
  }

  static async deleteForUser(eventId: string, userId: string): Promise<{ message: string }> {
    const calendar = await this.getCalendarForUser(userId);
    const deleted = await this.deleteRow(eventId, calendar.id);
    if (!deleted) {
      throw new NotFoundError('Event not found or no permission to delete');
    }
    return { message: 'Event deleted successfully' };
  }

  static async deleteAllForUser(userId: string): Promise<{ message: string }> {
    const calendar = await this.getCalendarForUser(userId);
    const deletedCount = await this.deleteAllByCalendar(calendar.id);
    return { message: `${deletedCount} events deleted successfully` };
  }

  static async filterForUser(filters: EventFilters, userId: string): Promise<EventResponse[]> {
    const calendar = await this.getCalendarForUser(userId);
    const eventsList = await this.findByFilter(calendar.id, filters);
    return this.toResponseArray(eventsList);
  }

  static async bulkCreateForUser(eventsData: CreateEventInput[], userId: string): Promise<EventResponse[]> {
    const calendar = await this.getCalendarForUser(userId);
    return db.transaction(async (tx) => {
      const results: EventResponse[] = [];
      for (const eventData of eventsData) {
        const created = await this.insertRow(
          {
            ...eventData,
            calendar_id: calendar.id,
            creator_user_id: userId,
          },
          tx,
        );
        results.push(created);
      }
      return results;
    });
  }

  // === PRIVATE ===

  private static async getCalendarForUser(userId: string): Promise<Calendar> {
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) {
      throw new NotFoundError('No calendar found for user');
    }
    return calendar;
  }

  private static async findById(eventId: string, calendarId: string, tx?: any): Promise<Event | null> {
    const executor = tx ?? db;
    const result = await executor
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.calendarId, calendarId)));
    return result.length > 0 ? (result[0] as Event) : null;
  }

  private static async findAllByCalendar(calendarId: string): Promise<Event[]> {
    const result = await db.select().from(events).where(eq(events.calendarId, calendarId)).orderBy(events.startDatetime);
    return result as Event[];
  }

  private static async findByFilter(calendarId: string, filters: EventFilters): Promise<Event[]> {
    const conditions = [eq(events.calendarId, calendarId)];

    if (filters.start_datetime) {
      conditions.push(gte(events.startDatetime, filters.start_datetime));
    }
    if (filters.end_datetime) {
      conditions.push(lte(events.startDatetime, filters.end_datetime));
    }

    const result = await db.select().from(events).where(and(...conditions)).orderBy(events.startDatetime);
    return result as Event[];
  }

  private static async insertRow(eventData: CreateEventData, tx?: any): Promise<EventResponse> {
    const executor = tx ?? db;

    const [created] = await executor
      .insert(events)
      .values({
        calendarId: eventData.calendar_id,
        creatorId: eventData.creator_user_id,
        title: eventData.title,
        description: eventData.description || null,
        startDatetime: eventData.start_datetime,
        endDatetime: eventData.end_datetime,
        allDay: eventData.all_day,
      })
      .returning();

    return this.toResponse(created as Event);
  }

  private static async updateRow(eventId: string, calendarId: string, updateData: UpdateEventData): Promise<EventResponse> {
    const updateFields: Partial<typeof events.$inferInsert> = {};

    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.start_datetime !== undefined) updateFields.startDatetime = updateData.start_datetime;
    if (updateData.end_datetime !== undefined) updateFields.endDatetime = updateData.end_datetime;
    if (updateData.all_day !== undefined) updateFields.allDay = updateData.all_day;

    if (Object.keys(updateFields).length === 0) {
      throw new ValidationError('No fields to update');
    }

    updateFields.updatedAt = new Date();

    const existing = await this.findById(eventId, calendarId);
    if (!existing) {
      throw new NotFoundError('Event not found or no permission to update');
    }

    await db.update(events).set(updateFields).where(and(eq(events.id, eventId), eq(events.calendarId, calendarId)));

    const updatedEvent = await this.findById(eventId, calendarId);
    if (!updatedEvent) {
      throw new Error('Failed to retrieve updated event');
    }

    return this.toResponse(updatedEvent);
  }

  private static async deleteRow(eventId: string, calendarId: string): Promise<boolean> {
    const existing = await this.findById(eventId, calendarId);
    if (!existing) return false;

    await db.delete(events).where(and(eq(events.id, eventId), eq(events.calendarId, calendarId)));
    return true;
  }

  private static async deleteAllByCalendar(calendarId: string): Promise<number> {
    const allEvents = await this.findAllByCalendar(calendarId);
    const count = allEvents.length;

    await db.delete(events).where(eq(events.calendarId, calendarId));
    return count;
  }

  private static toResponse(event: Event): EventResponse {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDatetime,
      endDate: event.endDatetime,
      allDay: event.allDay,
      type: 'GeneralActivity',
      status: 'Scheduled',
      color: '#3b82f6',
    };
  }

  private static toResponseArray(eventsList: Event[]): EventResponse[] {
    return eventsList.map((event) => this.toResponse(event));
  }
}
