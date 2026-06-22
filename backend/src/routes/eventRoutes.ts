import { Elysia } from 'elysia';
import { EventController } from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const eventRoutes = new Elysia({ prefix: '/api/events' })
  .use(authMiddleware)

  // GET /api/events - Get all events for authenticated user
  .get('/', ({ userId }) => EventController.getAllEvents(userId))

  // GET /api/events/:id - Get specific event by ID
  .get('/:id', ({ params, userId }) => EventController.getEventById(params.id, userId))

  // POST /api/events - Create new event
  .post('/', ({ body, userId, set }) => {
    const eventData = {
      title: (body as any).title,
      description: (body as any).description,
      start_datetime: new Date((body as any).startDate),
      end_datetime: new Date((body as any).endDate),
      all_day: (body as any).allDay || false
    };
    set.status = 201;
    return EventController.createEvent(eventData, userId);
  })

  // PUT /api/events/:id - Update event
  .put('/:id', ({ params, body, userId }) => {
    const updateData: any = {};

    if ((body as any).title !== undefined) updateData.title = (body as any).title;
    if ((body as any).description !== undefined) updateData.description = (body as any).description;
    if ((body as any).startDate !== undefined) updateData.start_datetime = new Date((body as any).startDate);
    if ((body as any).endDate !== undefined) updateData.end_datetime = new Date((body as any).endDate);
    if ((body as any).allDay !== undefined) updateData.all_day = (body as any).allDay;

    return EventController.updateEvent(params.id, userId, updateData);
  })

  // DELETE /api/events/:id - Delete event
  .delete('/:id', ({ params, userId }) => EventController.deleteEvent(params.id, userId))

  // GET /api/events/filter - Get filtered events
  .get('/filter', ({ query, userId }) => {
    const filters: any = {};

    if (query.startDate) filters.start_datetime = new Date(query.startDate as string);
    if (query.endDate) filters.end_datetime = new Date(query.endDate as string);

    return EventController.getEventsByFilter(userId, filters);
  })

  // POST /api/events/sync - Sync events with external sources
  .post('/sync', ({ userId }) => EventController.syncEvents(userId))

  // POST /api/events/bulk - Create multiple events
  .post('/bulk', ({ body, userId, set }) => {
    const eventsData = (body as any[]).map((event: any) => ({
      title: event.title,
      description: event.description,
      start_datetime: new Date(event.startDate),
      end_datetime: new Date(event.endDate),
      all_day: event.allDay || false
    }));
    set.status = 201;
    return EventController.bulkCreateEvents(userId, eventsData);
  })

  // DELETE /api/events - Delete all events for user
  .delete('/', ({ userId }) => EventController.deleteAllEvents(userId));
