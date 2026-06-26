import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { classCalendars } from './calendars';

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  calendarId: uuid('calendar_id').notNull().references(() => classCalendars.id, { onDelete: 'cascade' }),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  startDatetime: timestamp('start_datetime').notNull(),
  endDatetime: timestamp('end_datetime').notNull(),
  allDay: boolean('all_day').default(false),
  type: text('type').default('GeneralActivity'),
  subject: text('subject'),
  course: text('course'),
  status: text('status').default('Scheduled'),
  location: text('location'),
  imageUrl: text('image_url'),
  color: text('color').default('#3b82f6'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
