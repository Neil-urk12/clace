import pool from '../config/db_config';
import { v4 as uuidv4 } from 'uuid';

export interface Calendar {
  calendar_id: string;
  calendar_name: string;
  creator_user_id: string;
  join_code: string;
  created_at: Date;
  updated_at: Date;
}

export interface CalendarMembership {
  membership_id: string;
  user_id: string;
  calendar_id: string;
  joined_at: Date;
}

export interface CreateCalendarData {
  calendar_name: string;
  creator_user_id: string;
}

export interface CalendarResponse {
  calendar_id: string;
  calendar_name: string;
  creator_user_id: string;
  join_code: string;
}

export class CalendarModel {
  static async findById(calendarId: string): Promise<Calendar | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM ClassCalendars WHERE calendar_id = ?',
      [calendarId]
    );
    const calendars = rows as Calendar[];
    return calendars.length > 0 ? calendars[0] : null;
  }

  static async findByJoinCode(joinCode: string): Promise<Calendar | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM ClassCalendars WHERE join_code = ?',
      [joinCode]
    );
    const calendars = rows as Calendar[];
    return calendars.length > 0 ? calendars[0] : null;
  }

  static async findByUserId(userId: string): Promise<Calendar | null> {
    const [rows] = await pool.execute(
      `SELECT c.* FROM ClassCalendars c 
       JOIN CalendarMemberships cm ON c.calendar_id = cm.calendar_id 
       WHERE cm.user_id = ?`,
      [userId]
    );
    const calendars = rows as Calendar[];
    return calendars.length > 0 ? calendars[0] : null;
  }

  static async create(calendarData: CreateCalendarData): Promise<CalendarResponse> {
    const calendarId = uuidv4();
    const joinCode = this.generateJoinCode();
    
    await pool.execute(
      'INSERT INTO ClassCalendars (calendar_id, calendar_name, creator_user_id, join_code) VALUES (?, ?, ?, ?)',
      [calendarId, calendarData.calendar_name, calendarData.creator_user_id, joinCode]
    );

    // Add creator as first member
    await this.addMember(calendarId, calendarData.creator_user_id);

    const createdCalendar = await this.findById(calendarId);
    if (!createdCalendar) {
      throw new Error('Failed to create calendar');
    }

    return this.toResponse(createdCalendar);
  }

  static async addMember(calendarId: string, userId: string): Promise<CalendarMembership> {
    const membershipId = uuidv4();
    
    // Check if user is already a member
    const existingMembership = await this.getMembership(userId, calendarId);
    if (existingMembership) {
      throw new Error('User is already a member of this calendar');
    }

    await pool.execute(
      'INSERT INTO CalendarMemberships (membership_id, user_id, calendar_id) VALUES (?, ?, ?)',
      [membershipId, userId, calendarId]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM CalendarMemberships WHERE membership_id = ?',
      [membershipId]
    );
    const memberships = rows as CalendarMembership[];
    return memberships[0];
  }

  static async getMembership(userId: string, calendarId: string): Promise<CalendarMembership | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM CalendarMemberships WHERE user_id = ? AND calendar_id = ?',
      [userId, calendarId]
    );
    const memberships = rows as CalendarMembership[];
    return memberships.length > 0 ? memberships[0] : null;
  }

  static async isUserMember(userId: string, calendarId: string): Promise<boolean> {
    const membership = await this.getMembership(userId, calendarId);
    return !!membership;
  }

  static async getUserCalendars(userId: string): Promise<Calendar[]> {
    const [rows] = await pool.execute(
      `SELECT c.* FROM ClassCalendars c 
       JOIN CalendarMemberships cm ON c.calendar_id = cm.calendar_id 
       WHERE cm.user_id = ?`,
      [userId]
    );
    return rows as Calendar[];
  }

  static async getCalendarMembers(calendarId: string): Promise<string[]> {
    const [rows] = await pool.execute(
      'SELECT user_id FROM CalendarMemberships WHERE calendar_id = ?',
      [calendarId]
    );
    const memberships = rows as { user_id: string }[];
    return memberships.map(m => m.user_id);
  }

  private static generateJoinCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static toResponse(calendar: Calendar): CalendarResponse {
    return {
      calendar_id: calendar.calendar_id,
      calendar_name: calendar.calendar_name,
      creator_user_id: calendar.creator_user_id,
      join_code: calendar.join_code
    };
  }
}
