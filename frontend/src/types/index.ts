export interface Owner {
  id: string;
  name: string;
  email: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface EventTypeCreate {
  name: string;
  description: string;
  durationMinutes: number;
}

export interface EventTypePublic {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface Slot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export type BookingStatus = 'confirmed';

export interface Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  guestName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

export interface BookingCreate {
  eventTypeId: string;
  guestName: string;
  startTime: string;
}

export interface ValidationError {
  code: string;
  message: string;
}

export interface ErrorResponse {
  statusCode: number;
  error: ValidationError;
}
