import { pgTable, uuid, text, char, timestamp, unique } from 'drizzle-orm/pg-core';
import { users } from './users';

export const classCalendars = pgTable('class_calendars', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  joinCode: char('join_code', { length: 6 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const calendarMemberships = pgTable('calendar_memberships', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  calendarId: uuid('calendar_id').notNull().references(() => classCalendars.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at').defaultNow(),
}, (t) => ({
  userCalendarUnique: unique('uq_user_calendar').on(t.userId, t.calendarId),
}));
