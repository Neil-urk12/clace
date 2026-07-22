import { Elysia, t } from 'elysia';
import { EventModel, CreateEventInput, UpdateEventData } from '../models/Event';
import { authMiddleware } from '../middlewares/authMiddleware';
import type { ProtectedRouteContext } from '../types/context';

const CreateEventBody = t.Object({
  title: t.String(),
  description: t.Optional(t.String()),
  startDate: t.Date(),
  endDate: t.Date(),
  allDay: t.Optional(t.Boolean()),
  type: t.Optional(t.String()),
  subject: t.Optional(t.String()),
  course: t.Optional(t.String()),
  status: t.Optional(t.String()),
  location: t.Optional(t.String()),
  imageUrl: t.Optional(t.String()),
  color: t.Optional(t.String()),
});

const UpdateEventBody = t.Partial(t.Object({
  title: t.String(),
  description: t.String(),
  startDate: t.Date(),
  endDate: t.Date(),
  allDay: t.Boolean(),
  type: t.String(),
  subject: t.String(),
  course: t.String(),
  status: t.String(),
  location: t.String(),
  imageUrl: t.String(),
  color: t.String(),
}));

const BulkCreateBody = t.Array(CreateEventBody);

const FilterQuery = t.Object({
  startDate: t.Optional(t.Date()),
  endDate: t.Optional(t.Date()),
});

export const eventRoutes = new Elysia({ prefix: '/api/events' })
  .use(authMiddleware)

  // GET /api/events - Get all events for authenticated user
  .get('/', (ctx: any) => {
    const { db, userId } = ctx as ProtectedRouteContext;
    return EventModel.getAllForUser(db, userId);
  })

  // GET /api/events/:id - Get specific event by ID
  .get('/:id', (ctx: any) => {
    const { params, db, userId } = ctx as ProtectedRouteContext;
    return EventModel.getByIdForUser(db, params.id, userId);
  })

  // POST /api/events - Create new event
  .post('/', (ctx: any) => {
    const { body, db, userId, set } = ctx as ProtectedRouteContext;
    const eventData: CreateEventInput = {
      title: body.title,
      description: body.description,
      start_datetime: body.startDate,
      end_datetime: body.endDate,
      all_day: body.allDay ?? false,
      type: body.type,
      subject: body.subject,
      course: body.course,
      status: body.status,
      location: body.location,
      image_url: body.imageUrl,
      color: body.color,
    };
    set.status = 201;
    return EventModel.createForUser(db, eventData, userId);
  }, {
    body: CreateEventBody,
  })

  // PUT /api/events/:id - Update event
  .put('/:id', (ctx: any) => {
    const { params, body, db, userId } = ctx as ProtectedRouteContext;
    const updateData: UpdateEventData = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.startDate !== undefined) updateData.start_datetime = body.startDate;
    if (body.endDate !== undefined) updateData.end_datetime = body.endDate;
    if (body.allDay !== undefined) updateData.all_day = body.allDay;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.subject !== undefined) updateData.subject = body.subject;
    if (body.course !== undefined) updateData.course = body.course;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl;
    if (body.color !== undefined) updateData.color = body.color;
    return EventModel.updateForUser(db, params.id, updateData, userId);
  }, {
    body: UpdateEventBody,
  })

  // DELETE /api/events/:id - Delete event
  .delete('/:id', (ctx: any) => {
    const { params, db, userId } = ctx as ProtectedRouteContext;
    return EventModel.deleteForUser(db, params.id, userId);
  })

  // GET /api/events/filter - Get filtered events
  .get('/filter', (ctx: any) => {
    const { query, db, userId } = ctx as ProtectedRouteContext;
    const filters: { start_datetime?: Date; end_datetime?: Date } = {};
    if (query.startDate) filters.start_datetime = query.startDate as Date;
    if (query.endDate) filters.end_datetime = query.endDate as Date;
    return EventModel.filterForUser(db, filters, userId);
  }, {
    query: FilterQuery,
  })

  // POST /api/events/bulk - Create multiple events
  .post('/bulk', (ctx: any) => {
    const { body, db, userId, set } = ctx as ProtectedRouteContext;
    const eventsData: CreateEventInput[] = body.map((event: any) => ({
      title: event.title,
      description: event.description,
      start_datetime: event.startDate,
      end_datetime: event.endDate,
      all_day: event.allDay ?? false,
      type: event.type,
      subject: event.subject,
      course: event.course,
      status: event.status,
      location: event.location,
      image_url: event.imageUrl,
      color: event.color,
    }));
    set.status = 201;
    return EventModel.bulkCreateForUser(db, eventsData, userId);
  }, {
    body: BulkCreateBody,
  })

  // DELETE /api/events - Delete all events for user
  .delete('/', (ctx: any) => {
    const { db, userId } = ctx as ProtectedRouteContext;
    return EventModel.deleteAllForUser(db, userId);
  });
