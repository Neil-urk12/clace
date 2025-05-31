import type { SharedEventItem } from '../types/event';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://clace.onrender.com';

export interface CreateEventData extends Omit<SharedEventItem, 'id'> { }

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

export class EventService {
    private static getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('authToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    static async getAllEvents(): Promise<SharedEventItem[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/events`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.statusText}`);
            }

            const data = await response.json();
            return data.map((event: any) => ({
                ...event,
                startDate: new Date(event.startDate),
                endDate: event.endDate ? new Date(event.endDate) : undefined,
            }));
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    static async getEventById(id: string): Promise<SharedEventItem | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`Failed to fetch event: ${response.statusText}`);
            }

            const event = await response.json();
            return {
                ...event,
                startDate: new Date(event.startDate),
                endDate: event.endDate ? new Date(event.endDate) : undefined,
            };
        } catch (error) {
            console.error('Error fetching event by ID:', error);
            throw error;
        }
    }

    static async createEvent(eventData: CreateEventData): Promise<SharedEventItem> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
                body: JSON.stringify({
                    ...eventData,
                    startDate: eventData.startDate.toISOString(),
                    endDate: eventData.endDate?.toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create event: ${response.statusText}`);
            }

            const event = await response.json();
            return {
                ...event,
                startDate: new Date(event.startDate),
                endDate: event.endDate ? new Date(event.endDate) : undefined,
            };
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    static async updateEvent(eventData: UpdateEventData): Promise<SharedEventItem> {
        try {
            const updatePayload = {
                ...eventData,
                startDate: eventData.startDate?.toISOString(),
                endDate: eventData.endDate?.toISOString(),
            };

            const response = await fetch(`${API_BASE_URL}/api/events/${eventData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
                body: JSON.stringify(updatePayload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to update event: ${response.statusText}`);
            }

            const event = await response.json();
            return {
                ...event,
                startDate: new Date(event.startDate),
                endDate: event.endDate ? new Date(event.endDate) : undefined,
            };
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    static async deleteEvent(id: string): Promise<{ success: boolean }> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete event: ${response.statusText}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }

    static async getEventsByFilter(filters: EventFilters): Promise<SharedEventItem[]> {
        try {
            const searchParams = new URLSearchParams();

            if (filters.type) searchParams.append('type', filters.type);
            if (filters.course) searchParams.append('course', filters.course);
            if (filters.status) searchParams.append('status', filters.status);
            if (filters.startDate) searchParams.append('startDate', filters.startDate.toISOString());
            if (filters.endDate) searchParams.append('endDate', filters.endDate.toISOString());

            const response = await fetch(`${API_BASE_URL}/api/events/filter?${searchParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch filtered events: ${response.statusText}`);
            }

            const data = await response.json();
            return data.map((event: any) => ({
                ...event,
                startDate: new Date(event.startDate),
                endDate: event.endDate ? new Date(event.endDate) : undefined,
            }));
        } catch (error) {
            console.error('Error fetching filtered events:', error);
            throw error;
        }
    }

    static async syncEvents(): Promise<SharedEventItem[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/events/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to sync events: ${response.statusText}`);
            }

            const data = await response.json();
            return data.map((event: any) => ({
                ...event,
                startDate: new Date(event.startDate),
                endDate: event.endDate ? new Date(event.endDate) : undefined,
            }));
        } catch (error) {
            console.error('Error syncing events:', error);
            throw error;
        }
    }
}
