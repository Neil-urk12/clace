import { Elysia, t } from 'elysia';
import { CalendarModel } from '../models/Calendar';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ForbiddenError, ValidationError } from '../lib/errors';
import type { ProtectedRouteContext } from '../types/context';

const CreateCalendarBody = t.Object({
  calendar_name: t.String(),
});

const JoinCalendarBody = t.Object({
  join_code: t.String({ minLength: 1 }),
});

export const calendarRoutes = new Elysia({ prefix: '/api/calendars' })
  .use(authMiddleware)

  // POST /api/calendars - Create new calendar
  .post('/', (ctx: any) => {
    const { body, db, userId, set } = ctx as ProtectedRouteContext;
    set.status = 201;
    return CalendarModel.create(db, {
      calendar_name: body.calendar_name,
      creator_user_id: userId,
    });
  }, {
    body: CreateCalendarBody,
  })

  // GET /api/calendars/:id - Get calendar by ID
  .get('/:id', (ctx: any) => {
    const { params, db } = ctx as ProtectedRouteContext;
    return CalendarModel.findById(db, params.id);
  })

  // GET /api/calendars/user/:userId - Get calendar by user ID
  .get('/user/:userId', async (ctx: any) => {
    const { params, db, userId } = ctx as ProtectedRouteContext;
    if (params.userId !== userId) {
      throw new ForbiddenError('Not authorized to access this calendar');
    }
    const calendar = await CalendarModel.findByUserId(db, userId);
    if (!calendar) return null;
    return CalendarModel.toResponse(calendar);
  })

  // POST /api/calendars/join - Join calendar by join code
  .post('/join', async (ctx: any) => {
    const { userId, body, db } = ctx as ProtectedRouteContext;
    const calendar = await CalendarModel.findByJoinCode(db, body.join_code);
    if (!calendar) {
      throw new ValidationError('Invalid join code');
    }

    const existingMembership = await CalendarModel.getMembership(db, userId, calendar.id);
    if (existingMembership) {
      return CalendarModel.toResponse(calendar);
    }

    await CalendarModel.addMember(db, calendar.id, userId);
    return CalendarModel.toResponse(calendar);
  }, {
    body: JoinCalendarBody,
  })

  // GET /api/calendars - Get all calendars for authenticated user
  .get('/', async (ctx: any) => {
    const { db, userId } = ctx as ProtectedRouteContext;
    const calendars = await CalendarModel.getUserCalendars(db, userId);
    return calendars.map((calendar) => CalendarModel.toResponse(calendar));
  });
