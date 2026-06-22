import { describe, it, expect, vi, beforeEach } from 'vitest';
import { eventService } from '../eventService';
import { NotFoundError } from '@/api/errors';
import type { EventApiItem } from '../eventService';

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { apiClient } from '@/api/client';

const mockApiItem: EventApiItem = {
  id: 'e1',
  title: 'Test',
  description: 'desc',
  startDate: '2026-06-22T10:00:00.000Z',
  endDate: '2026-06-22T11:00:00.000Z',
  allDay: false,
  type: 'GeneralActivity',
};

describe('eventService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllEvents maps string dates to Date objects', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce([mockApiItem]);
    const events = await eventService.getAllEvents();
    expect(events).toHaveLength(1);
    expect(events[0].startDate).toBeInstanceOf(Date);
    expect(events[0].startDate.toISOString()).toBe(mockApiItem.startDate);
    expect(events[0].endDate).toBeInstanceOf(Date);
  });

  it('getEventById returns null on 404 (NotFoundError caught)', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new NotFoundError('Event not found'));
    const event = await eventService.getEventById('missing');
    expect(event).toBeNull();
  });

  it('getEventById returns mapped event on success', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockApiItem);
    const event = await eventService.getEventById('e1');
    expect(event).not.toBeNull();
    expect(event!.startDate).toBeInstanceOf(Date);
  });

  it('getEventById propagates non-404 errors', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network'));
    await expect(eventService.getEventById('e1')).rejects.toThrow('Network');
  });

  it('createEvent converts Date fields to ISO strings on the wire', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockApiItem);
    await eventService.createEvent({
      title: 'New',
      description: 'd',
      startDate: new Date('2026-06-22T10:00:00.000Z'),
      endDate: new Date('2026-06-22T11:00:00.000Z'),
      allDay: false,
      type: 'GeneralActivity',
    });
    const call = vi.mocked(apiClient.post).mock.calls[0];
    expect(call[0]).toBe('/events');
    expect(call[1]).toMatchObject({
      startDate: '2026-06-22T10:00:00.000Z',
      endDate: '2026-06-22T11:00:00.000Z',
    });
  });

  it('deleteEvent returns backend message', async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({ message: 'Event deleted successfully' });
    const result = await eventService.deleteEvent('e1');
    expect(result.message).toBe('Event deleted successfully');
  });
});