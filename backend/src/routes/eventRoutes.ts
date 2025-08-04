import { Elysia } from 'elysia';
import { EventController } from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const eventRoutes = new Elysia({ prefix: '/api/events' })
  .use(authMiddleware)
  
  // GET /api/events - Get all events for authenticated user
  .get('/', async ({ userId, set }) => {
    try {
      const result = await EventController.getAllEvents(userId);
      return result.data;
    } catch (error: any) {
      console.error('Get all events error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Failed to fetch events'
      };
    }
  })

  // GET /api/events/:id - Get specific event by ID
  .get('/:id', async ({ params, userId, set }) => {
    try {
      const result = await EventController.getEventById(params.id, userId);
      return result.data;
    } catch (error: any) {
      console.error('Get event by ID error:', error);
      set.status = error.message.includes('not found') ? 404 : 500;
      return { 
        success: false, 
        message: error.message || 'Failed to fetch event'
      };
    }
  })

  // POST /api/events - Create new event
  .post('/', async ({ body, userId, set }) => {
    try {
      const eventData = {
        title: (body as any).title,
        description: (body as any).description,
        start_datetime: new Date((body as any).startDate),
        end_datetime: new Date((body as any).endDate),
        all_day: (body as any).allDay || false
      };
      
      const result = await EventController.createEvent(eventData, userId);
      set.status = 201;
      return result.data;
    } catch (error: any) {
      console.error('Create event error:', error);
      set.status = 400;
      return { 
        success: false, 
        message: error.message || 'Failed to create event'
      };
    }
  })

  // PUT /api/events/:id - Update event
  .put('/:id', async ({ params, body, userId, set }) => {
    try {
      const updateData: any = {};
      
      // Map frontend fields to backend fields
      if ((body as any).title !== undefined) updateData.title = (body as any).title;
      if ((body as any).description !== undefined) updateData.description = (body as any).description;
      if ((body as any).startDate !== undefined) updateData.start_datetime = new Date((body as any).startDate);
      if ((body as any).endDate !== undefined) updateData.end_datetime = new Date((body as any).endDate);
      if ((body as any).allDay !== undefined) updateData.all_day = (body as any).allDay;
      
      const result = await EventController.updateEvent(params.id, userId, updateData);
      return result.data;
    } catch (error: any) {
      console.error('Update event error:', error);
      set.status = error.message.includes('not found') ? 404 : 400;
      return { 
        success: false, 
        message: error.message || 'Failed to update event'
      };
    }
  })

  // DELETE /api/events/:id - Delete event
  .delete('/:id', async ({ params, userId, set }) => {
    try {
      const result = await EventController.deleteEvent(params.id, userId);
      return { success: true };
    } catch (error: any) {
      console.error('Delete event error:', error);
      set.status = error.message.includes('not found') ? 404 : 500;
      return { 
        success: false, 
        message: error.message || 'Failed to delete event'
      };
    }
  })

  // GET /api/events/filter - Get filtered events
  .get('/filter', async ({ query, userId, set }) => {
    try {
      const filters: any = {};
      
      if (query.startDate) filters.start_datetime = new Date(query.startDate as string);
      if (query.endDate) filters.end_datetime = new Date(query.endDate as string);
      
      const result = await EventController.getEventsByFilter(userId, filters);
      return result.data;
    } catch (error: any) {
      console.error('Filter events error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Failed to filter events'
      };
    }
  })

  // POST /api/events/sync - Sync events with external sources
  .post('/sync', async ({ userId, set }) => {
    try {
      const result = await EventController.syncEvents(userId);
      return result.data;
    } catch (error: any) {
      console.error('Sync events error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Failed to sync events'
      };
    }
  })

  // POST /api/events/bulk - Create multiple events
  .post('/bulk', async ({ body, userId, set }) => {
    try {
      const eventsData = (body as any[]).map((event: any) => ({
        title: event.title,
        description: event.description,
        start_datetime: new Date(event.startDate),
        end_datetime: new Date(event.endDate),
        all_day: event.allDay || false
      }));
      
      const result = await EventController.bulkCreateEvents(userId, eventsData);
      set.status = 201;
      return result.data;
    } catch (error: any) {
      console.error('Bulk create events error:', error);
      set.status = 400;
      return { 
        success: false, 
        message: error.message || 'Failed to create events'
      };
    }
  })

  // DELETE /api/events - Delete all events for user
  .delete('/', async ({ userId, set }) => {
    try {
      const result = await EventController.deleteAllEvents(userId);
      return { success: true, message: result.message };
    } catch (error: any) {
      console.error('Delete all events error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Failed to delete all events'
      };
    }
  });
