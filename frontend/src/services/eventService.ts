import { apiClient } from '@/api/client';
import { NotFoundError } from '@/api/errors';
import type { SharedEventItem } from '@/types/event';

/**
 * Wire shape returned by the backend before date strings are converted to Date.
 * Derived from SharedEventItem so it auto-tracks new fields.
 */
export type EventApiItem = Omit<SharedEventItem, 'startDate' | 'endDate'> & {
  startDate: string;
  endDate?: string;
};

export type CreateEventData = Omit<SharedEventItem, 'id'>;
export interface UpdateEventData extends Partial<SharedEventItem> {
  id: string;
}
export interface EventFilters {
  type?: string;
  course?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

/** Convert a wire-shape event to the runtime SharedEventItem (Date fields). */
const toSharedItem = (event: EventApiItem): SharedEventItem => ({
  ...event,
  startDate: new Date(event.startDate),
  endDate: event.endDate ? new Date(event.endDate) : undefined,
});

/** Convert a runtime event to the outgoing wire shape (ISO date strings). */
const toApiItem = (event: Partial<SharedEventItem>): Partial<EventApiItem> => ({
  ...event,
  startDate: event.startDate instanceof Date ? event.startDate.toISOString() : event.startDate,
  endDate: event.endDate instanceof Date ? event.endDate.toISOString() : event.endDate,
});

export const eventService = {
  async getAllEvents(): Promise<SharedEventItem[]> {
    const rows = await apiClient.get<EventApiItem[]>('/events');
    return rows.map(toSharedItem);
  },

  /** Returns null on 404 (typed catch); other errors propagate. */
  async getEventById(id: string): Promise<SharedEventItem | null> {
    try {
      const row = await apiClient.get<EventApiItem>(`/events/${id}`);
      return toSharedItem(row);
    } catch (err) {
      if (err instanceof NotFoundError) return null;
      throw err;
    }
  },

  async createEvent(eventData: CreateEventData): Promise<SharedEventItem> {
    const row = await apiClient.post<EventApiItem>('/events', toApiItem(eventData));
    return toSharedItem(row);
  },

  async updateEvent(eventData: UpdateEventData): Promise<SharedEventItem> {
    const { id, ...rest } = eventData;
    const row = await apiClient.put<EventApiItem>(`/events/${id}`, toApiItem(rest));
    return toSharedItem(row);
  },

  async deleteEvent(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/events/${id}`);
  },

  async getEventsByFilter(filters: EventFilters): Promise<SharedEventItem[]> {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.course) params.append('course', filters.course);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

    const rows = await apiClient.get<EventApiItem[]>(`/events/filter?${params}`);
    return rows.map(toSharedItem);
  },
};

export default eventService;