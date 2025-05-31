import pool from '../config/db_config';
import { v4 as uuidv4 } from 'uuid';

export interface Event {
  event_id: string;
  calendar_id: string;
  creator_user_id: string;
  title: string;
  description?: string;
  start_datetime: Date;
  end_datetime: Date;
  all_day: boolean;
  created_at: Date;
  updated_at: Date;
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
  // Additional frontend-only fields for compatibility
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
  static async findById(eventId: string, calendarId: string): Promise<Event | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM Events WHERE event_id = ? AND calendar_id = ?',
      [eventId, calendarId]
    );
    const events = rows as Event[];
    return events.length > 0 ? events[0] : null;
  }

  static async findAllByCalendar(calendarId: string): Promise<Event[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM Events WHERE calendar_id = ? ORDER BY start_datetime ASC',
      [calendarId]
    );
    return rows as Event[];
  }

  static async findByFilter(calendarId: string, filters: EventFilters): Promise<Event[]> {
    let query = 'SELECT * FROM Events WHERE calendar_id = ?';
    const params: any[] = [calendarId];

    if (filters.start_datetime) {
      query += ' AND start_datetime >= ?';
      params.push(filters.start_datetime);
    }

    if (filters.end_datetime) {
      query += ' AND start_datetime <= ?';
      params.push(filters.end_datetime);
    }

    query += ' ORDER BY start_datetime ASC';

    const [rows] = await pool.execute(query, params);
    return rows as Event[];
  }

  static async create(eventData: CreateEventData): Promise<EventResponse> {
    const eventId = uuidv4();
    
    await pool.execute(
      `INSERT INTO Events (
        event_id, calendar_id, creator_user_id, title, description, 
        start_datetime, end_datetime, all_day
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        eventData.calendar_id,
        eventData.creator_user_id,
        eventData.title,
        eventData.description || null,
        eventData.start_datetime,
        eventData.end_datetime,
        eventData.all_day
      ]
    );

    const createdEvent = await this.findById(eventId, eventData.calendar_id);
    if (!createdEvent) {
      throw new Error('Failed to create event');
    }

    return this.toResponse(createdEvent);
  }

  static async update(eventId: string, calendarId: string, updateData: UpdateEventData): Promise<EventResponse> {
    const fields: string[] = [];
    const params: any[] = [];

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at field
    fields.push('updated_at = NOW()');
    params.push(eventId, calendarId);

    const query = `UPDATE Events SET ${fields.join(', ')} WHERE event_id = ? AND calendar_id = ?`;
    
    const [result] = await pool.execute(query, params);
    const updateResult = result as any;
    
    if (updateResult.affectedRows === 0) {
      throw new Error('Event not found or no permission to update');
    }

    const updatedEvent = await this.findById(eventId, calendarId);
    if (!updatedEvent) {
      throw new Error('Failed to retrieve updated event');
    }

    return this.toResponse(updatedEvent);
  }

  static async delete(eventId: string, calendarId: string): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM Events WHERE event_id = ? AND calendar_id = ?',
      [eventId, calendarId]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  static async deleteAll(calendarId: string): Promise<number> {
    const [result] = await pool.execute(
      'DELETE FROM Events WHERE calendar_id = ?',
      [calendarId]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows;
  }

  static toResponse(event: Event): EventResponse {
    return {
      id: event.event_id,
      title: event.title,
      description: event.description,
      startDate: event.start_datetime,
      endDate: event.end_datetime,
      allDay: event.all_day,
      // Default values for frontend compatibility
      type: 'GeneralActivity',
      status: 'Scheduled',
      color: '#3b82f6'
    };
  }

  static toResponseArray(events: Event[]): EventResponse[] {
    return events.map(event => this.toResponse(event));
  }
}
