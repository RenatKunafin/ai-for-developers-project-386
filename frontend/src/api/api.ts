import { apiClient } from './client';
import { mockEventTypes, mockPublicEventTypes, mockBookings, mockOwner, generateMockSlots } from './mocks';
import { EventType, EventTypePublic, EventTypeCreate, Slot, Booking, BookingCreate, Owner } from '@/types';

const USE_MOCKS = true;

// Public API
export const listPublicEventTypes = async (): Promise<EventTypePublic[]> => {
  if (USE_MOCKS) return Promise.resolve(mockPublicEventTypes);
  const response = await apiClient.get<EventTypePublic[]>('/event-types');
  return response.data;
};

export const getPublicEventType = async (id: string): Promise<EventTypePublic> => {
  if (USE_MOCKS) {
    const eventType = mockPublicEventTypes.find(et => et.id === id);
    if (!eventType) throw new Error('Event type not found');
    return Promise.resolve(eventType);
  }
  const response = await apiClient.get<EventTypePublic>(`/event-types/${id}`);
  return response.data;
};

export const getAvailableSlots = async (id: string, date?: string): Promise<Slot[]> => {
  if (USE_MOCKS) {
    const eventType = mockEventTypes.find(et => et.id === id);
    if (!eventType) throw new Error('Event type not found');
    const targetDate = date || new Date().toISOString().split('T')[0];
    return Promise.resolve(generateMockSlots(targetDate, eventType.durationMinutes));
  }
  const response = await apiClient.get<Slot[]>(`/event-types/${id}/slots`, { params: { date } });
  return response.data;
};

export const createBooking = async (data: BookingCreate): Promise<Booking> => {
  if (USE_MOCKS) {
    const eventType = mockEventTypes.find(et => et.id === data.eventTypeId);
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      eventTypeId: data.eventTypeId,
      eventTypeName: eventType?.name || 'Unknown',
      guestName: data.guestName,
      startTime: data.startTime,
      endTime: new Date(new Date(data.startTime).getTime() + (eventType?.durationMinutes || 0) * 60000).toISOString(),
      status: 'confirmed',
    };
    mockBookings.push(newBooking);
    return Promise.resolve(newBooking);
  }
  const response = await apiClient.post<Booking>('/bookings', data);
  return response.data;
};

// Admin API
export const getOwner = async (): Promise<Owner> => {
  if (USE_MOCKS) return Promise.resolve(mockOwner);
  const response = await apiClient.get<Owner>('/admin/owner');
  return response.data;
};

export const listEventTypes = async (): Promise<EventType[]> => {
  if (USE_MOCKS) return Promise.resolve(mockEventTypes);
  const response = await apiClient.get<EventType[]>('/admin/event-types');
  return response.data;
};

export const createEventType = async (data: EventTypeCreate): Promise<EventType> => {
  if (USE_MOCKS) {
    const newEventType: EventType = {
      id: `event-type-${Date.now()}`,
      ...data,
    };
    mockEventTypes.push(newEventType);
    return Promise.resolve(newEventType);
  }
  const response = await apiClient.post<EventType>('/admin/event-types', data);
  return response.data;
};

export const deleteEventType = async (id: string): Promise<void> => {
  if (USE_MOCKS) {
    const index = mockEventTypes.findIndex(et => et.id === id);
    if (index !== -1) mockEventTypes.splice(index, 1);
    return Promise.resolve();
  }
  await apiClient.delete(`/admin/event-types/${id}`);
};

export const listBookings = async (): Promise<Booking[]> => {
  if (USE_MOCKS) return Promise.resolve(mockBookings);
  const response = await apiClient.get<Booking[]>('/admin/bookings');
  return response.data;
};
