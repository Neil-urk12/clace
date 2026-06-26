import { eq, and } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { classCalendars, calendarMemberships } from '../config/schema';

export interface Calendar {
  id: string;
  name: string;
  creatorId: string;
  joinCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarMembership {
  id: string;
  userId: string;
  calendarId: string;
  joinedAt: Date;
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
    const result = await db.select().from(classCalendars).where(eq(classCalendars.id, calendarId));
    return result.length > 0 ? (result[0] as Calendar) : null;
  }

  static async findByJoinCode(joinCode: string): Promise<Calendar | null> {
    const result = await db.select().from(classCalendars).where(eq(classCalendars.joinCode, joinCode));
    return result.length > 0 ? (result[0] as Calendar) : null;
  }

  static async findByUserId(userId: string): Promise<Calendar | null> {
    const result = await db
      .select({ calendar: classCalendars })
      .from(classCalendars)
      .innerJoin(calendarMemberships, eq(classCalendars.id, calendarMemberships.calendarId))
      .where(eq(calendarMemberships.userId, userId));
    return result.length > 0 ? (result[0].calendar as Calendar) : null;
  }

  static async create(calendarData: CreateCalendarData): Promise<CalendarResponse> {
    const joinCode = this.generateJoinCode();

    const [created] = await db
      .insert(classCalendars)
      .values({
        name: calendarData.calendar_name,
        creatorId: calendarData.creator_user_id,
        joinCode,
      })
      .returning();

    await this.addMember(created.id, calendarData.creator_user_id);

    const createdCalendar = await this.findById(created.id);
    if (!createdCalendar) {
      throw new Error('Failed to create calendar');
    }

    return this.toResponse(createdCalendar);
  }

  static async addMember(calendarId: string, userId: string): Promise<CalendarMembership> {
    const existingMembership = await this.getMembership(userId, calendarId);
    if (existingMembership) {
      throw new Error('User is already a member of this calendar');
    }

    const [created] = await db
      .insert(calendarMemberships)
      .values({
        userId,
        calendarId,
      })
      .returning();

    return created as CalendarMembership;
  }

  static async getMembership(userId: string, calendarId: string): Promise<CalendarMembership | null> {
    const result = await db
      .select()
      .from(calendarMemberships)
      .where(and(eq(calendarMemberships.userId, userId), eq(calendarMemberships.calendarId, calendarId)));
    return result.length > 0 ? (result[0] as CalendarMembership) : null;
  }

  static async isUserMember(userId: string, calendarId: string): Promise<boolean> {
    const membership = await this.getMembership(userId, calendarId);
    return !!membership;
  }

  static async getUserCalendars(userId: string): Promise<Calendar[]> {
    const result = await db
      .select({ calendar: classCalendars })
      .from(classCalendars)
      .innerJoin(calendarMemberships, eq(classCalendars.id, calendarMemberships.calendarId))
      .where(eq(calendarMemberships.userId, userId));
    return result.map((r) => r.calendar as Calendar);
  }

  static async getCalendarMembers(calendarId: string): Promise<string[]> {
    const result = await db
      .select({ userId: calendarMemberships.userId })
      .from(calendarMemberships)
      .where(eq(calendarMemberships.calendarId, calendarId));
    return result.map((r) => r.userId);
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
      calendar_id: calendar.id,
      calendar_name: calendar.name,
      creator_user_id: calendar.creatorId,
      join_code: calendar.joinCode,
    };
  }
}
