import { Elysia } from 'elysia';
import { CalendarController } from '../controllers/calendarController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const calendarRoutes = new Elysia({ prefix: '/api/calendars' })
  .use(authMiddleware)
  
  // POST /api/calendars - Create new calendar
  .post('/', async ({ body, userId, set }) => {
    try {
      const calendarData = {
        calendar_name: (body as any).calendar_name,
        creator_user_id: userId
      };
      
      const result = await CalendarController.createCalendar(calendarData);
      set.status = 201;
      return result;
    } catch (error: any) {
      console.error('Create calendar error:', error);
      set.status = 400;
      return { 
        success: false, 
        message: error.message || 'Failed to create calendar'
      };
    }
  })

  // GET /api/calendars/:id - Get calendar by ID
  .get('/:id', async ({ params, set }) => {
    try {
      const result = await CalendarController.getCalendarById(params.id);
      return result;
    } catch (error: any) {
      console.error('Get calendar by ID error:', error);
      set.status = error.message.includes('not found') ? 404 : 500;
      return { 
        success: false, 
        message: error.message || 'Failed to fetch calendar'
      };
    }
  })

  // GET /api/calendars/user/:userId - Get calendar by user ID
  .get('/user/:userId', async ({ params, userId, set }) => {
    try {
      // Only allow users to get their own calendar or if they're authorized
      if (params.userId !== userId) {
        set.status = 403;
        return { 
          success: false, 
          message: 'Not authorized to access this calendar'
        };
      }
      
      const result = await CalendarController.getCalendarByUserId(params.userId);
      return result;
    } catch (error: any) {
      console.error('Get calendar by user ID error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Failed to fetch user calendar'
      };
    }
  })

  // POST /api/calendars/join - Join calendar by join code
  .post('/join', async ({ body, userId, set }) => {
    try {
      const { join_code } = body as any;
      
      if (!join_code) {
        set.status = 400;
        return { 
          success: false, 
          message: 'Join code is required'
        };
      }
      
      const result = await CalendarController.joinCalendarByCode(join_code, userId);
      return result;
    } catch (error: any) {
      console.error('Join calendar error:', error);
      set.status = 400;
      return { 
        success: false, 
        message: error.message || 'Failed to join calendar'
      };
    }
  })

  // GET /api/calendars - Get all calendars for authenticated user
  .get('/', async ({ userId, set }) => {
    try {
      const result = await CalendarController.getUserCalendars(userId);
      return result;
    } catch (error: any) {
      console.error('Get user calendars error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Failed to fetch calendars'
      };
    }
  });
