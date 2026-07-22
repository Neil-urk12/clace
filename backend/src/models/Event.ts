import { eq, and, gte, lte } from 'drizzle-orm';
import { events } from '../config/schema';
import { Calendar, CalendarModel } from './Calendar';
import { NotFoundError, ValidationError } from '../lib/errors';
import type { AppDb } from '../core/db';

export interface Event {
  id: string;
  calendarId: string;
  creatorId: string;
  title: string;
  description?: string;
  startDatetime: Date;
  endDatetime: Date;
  allDay: boolean;
  type: string | null;
  subject: string | null;
  course: string | null;
  status: string | null;
  location: string | null;
  imageUrl: string | null;
  color: string | null;
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
  type?: string;
  subject?: string;
  course?: string;
  status?: string;
  location?: string;
  image_url?: string;
  color?: string;
}

/** Shape the routes pass in. The model fills in calendar_id and creator_user_id. */
export type CreateEventInput = Omit<CreateEventData, 'calendar_id' | 'creator_user_id'>;

export interface UpdateEventData {
  title?: string;
  description?: string;
  start_datetime?: Date;
  end_datetime?: Date;
  all_day?: boolean;
  type?: string;
  subject?: string;
  course?: string;
  status?: string;
  location?: string;
  image_url?: string;
  color?: string;
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

  static async getAllForUser(db: AppDb, userId: string): Promise<EventResponse[]> {
    const calendar = await this.getCalendarForUser(db, userId);
    const eventsList = await this.findAllByCalendar(db, calendar.id);
    return this.toResponseArray(eventsList);
  }

  static async getByIdForUser(db: AppDb, eventId: string, userId: string): Promise<EventResponse> {
    const calendar = await this.getCalendarForUser(db, userId);
    const event = await this.findById(db, eventId, calendar.id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    return this.toResponse(event);
  }

  static async createForUser(db: AppDb, eventData: CreateEventInput, userId: string): Promise<EventResponse> {
    const calendar = await this.getCalendarForUser(db, userId);
    return this.insertRow(db, {
      ...eventData,
      calendar_id: calendar.id,
      creator_user_id: userId,
    });
  }

  static async updateForUser(db: AppDb, eventId: string, updateData: UpdateEventData, userId: string): Promise<EventResponse> {
    const calendar = await this.getCalendarForUser(db, userId);
    return this.updateRow(db, eventId, calendar.id, updateData);
  }

  static async deleteForUser(db: AppDb, eventId: string, userId: string): Promise<{ message: string }> {
    const calendar = await this.getCalendarForUser(db, userId);
    const deleted = await this.deleteRow(db, eventId, calendar.id);
    if (!deleted) {
      throw new NotFoundError('Event not found or no permission to delete');
    }
    return { message: 'Event deleted successfully' };
  }

  static async deleteAllForUser(db: AppDb, userId: string): Promise<{ message: string }> {
    const calendar = await this.getCalendarForUser(db, userId);
    const deletedCount = await this.deleteAllByCalendar(db, calendar.id);
    return { message: `${deletedCount} events deleted successfully` };
  }

  static async filterForUser(db: AppDb, filters: EventFilters, userId: string): Promise<EventResponse[]> {
    const calendar = await this.getCalendarForUser(db, userId);
    const eventsList = await this.findByFilter(db, calendar.id, filters);
    return this.toResponseArray(eventsList);
  }

  static async bulkCreateForUser(db: AppDb, eventsData: CreateEventInput[], userId: string): Promise<EventResponse[]> {
    const calendar = await this.getCalendarForUser(db, userId);
    return db.transaction(async (tx) => {
      const results: EventResponse[] = [];
      for (const eventData of eventsData) {
        const created = await this.insertRow(
          db,
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

  private static async getCalendarForUser(db: AppDb, userId: string): Promise<Calendar> {
    const calendar = await CalendarModel.findByUserId(db, userId);
    if (!calendar) {
      throw new NotFoundError('No calendar found for user');
    }
    return calendar;
  }

  private static async findById(db: AppDb, eventId: string, calendarId: string, tx?: any): Promise<Event | null> {
    const executor = tx ?? db;
    const result = await executor
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.calendarId, calendarId)));
    return result.length > 0 ? (result[0] as Event) : null;
  }

  private static async findAllByCalendar(db: AppDb, calendarId: string): Promise<Event[]> {
    const result = await db.select().from(events).where(eq(events.calendarId, calendarId)).orderBy(events.startDatetime);
    return result as Event[];
  }

  private static async findByFilter(db: AppDb, calendarId: string, filters: EventFilters): Promise<Event[]> {
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

  private static async insertRow(db: AppDb, eventData: CreateEventData, tx?: any): Promise<EventResponse> {
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
        type: eventData.type || null,
        subject: eventData.subject || null,
        course: eventData.course || null,
        status: eventData.status || null,
        location: eventData.location || null,
        imageUrl: eventData.image_url || null,
        color: eventData.color || null,
      })
      .returning();

    return this.toResponse(created as Event);
  }

  private static async updateRow(db: AppDb, eventId: string, calendarId: string, updateData: UpdateEventData): Promise<EventResponse> {
    const updateFields: Partial<typeof events.$inferInsert> = {};

    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.start_datetime !== undefined) updateFields.startDatetime = updateData.start_datetime;
    if (updateData.end_datetime !== undefined) updateFields.endDatetime = updateData.end_datetime;
    if (updateData.all_day !== undefined) updateFields.allDay = updateData.all_day;
    if (updateData.type !== undefined) updateFields.type = updateData.type;
    if (updateData.subject !== undefined) updateFields.subject = updateData.subject;
    if (updateData.course !== undefined) updateFields.course = updateData.course;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.location !== undefined) updateFields.location = updateData.location;
    if (updateData.image_url !== undefined) updateFields.imageUrl = updateData.image_url;
    if (updateData.color !== undefined) updateFields.color = updateData.color;

    if (Object.keys(updateFields).length === 0) {
      throw new ValidationError('No fields to update');
    }

    updateFields.updatedAt = new Date();

    const existing = await this.findById(db, eventId, calendarId);
    if (!existing) {
      throw new NotFoundError('Event not found or no permission to update');
    }

    await db.update(events).set(updateFields).where(and(eq(events.id, eventId), eq(events.calendarId, calendarId)));

    const updatedEvent = await this.findById(db, eventId, calendarId);
    if (!updatedEvent) {
      throw new Error('Failed to retrieve updated event');
    }

    return this.toResponse(updatedEvent);
  }

  private static async deleteRow(db: AppDb, eventId: string, calendarId: string): Promise<boolean> {
    const existing = await this.findById(db, eventId, calendarId);
    if (!existing) return false;

    await db.delete(events).where(and(eq(events.id, eventId), eq(events.calendarId, calendarId)));
    return true;
  }

  private static async deleteAllByCalendar(db: AppDb, calendarId: string): Promise<number> {
    const allEvents = await this.findAllByCalendar(db, calendarId);
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
      type: (event.type as EventResponse['type']) ?? 'GeneralActivity',
      subject: event.subject ?? undefined,
      course: event.course ?? undefined,
      status: (event.status as EventResponse['status']) ?? 'Scheduled',
      location: event.location ?? undefined,
      imageUrl: event.imageUrl ?? undefined,
      color: event.color ?? '#3b82f6',
    };
  }

  private static toResponseArray(eventsList: Event[]): EventResponse[] {
    return eventsList.map((event) => this.toResponse(event));
  }
}
