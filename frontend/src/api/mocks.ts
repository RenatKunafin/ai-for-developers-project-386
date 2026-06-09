import { EventType, EventTypePublic, Slot, Booking, Owner } from '@/types';

export const mockOwner: Owner = {
  id: 'owner-1',
  name: 'Renat Kunafin',
  email: 'renat@example.com',
};

export const mockEventTypes: EventType[] = [
  {
    id: 'quick-chat',
    name: 'Быстрый звонок',
    description: '15-минутный звонок, чтобы задать вопрос или обсудить мелкий вопрос.',
    durationMinutes: 15,
  },
  {
    id: 'project-review',
    name: 'Ревью проекта',
    description: 'Фокусная 30-минутная сессия для обзора прогресса и согласования следующих шагов.',
    durationMinutes: 30,
  },
  {
    id: 'strategy-session',
    name: 'Стратегическая сессия',
    description: 'Часовое глубокое погружение: планирование, идеи и определение направления.',
    durationMinutes: 60,
  },
];

export const mockPublicEventTypes: EventTypePublic[] = mockEventTypes.map(({ id, name, description, durationMinutes }) => ({
  id, name, description, durationMinutes,
}));

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    eventTypeId: 'quick-chat',
    eventTypeName: 'Быстрый звонок',
    guestName: 'Иван Петров',
    startTime: '2026-06-10T09:00:00Z',
    endTime: '2026-06-10T09:15:00Z',
    status: 'confirmed',
  },
  {
    id: 'booking-2',
    eventTypeId: 'project-review',
    eventTypeName: 'Ревью проекта',
    guestName: 'Мария Сидорова',
    startTime: '2026-06-10T10:00:00Z',
    endTime: '2026-06-10T10:30:00Z',
    status: 'confirmed',
  },
];

export const generateMockSlots = (date: string, durationMinutes: number): Slot[] => {
  const slots: Slot[] = [];
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = new Date(date);
      startTime.setUTCHours(hour, minute, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + durationMinutes);
      
      const isBooked = mockBookings.some(
        booking => booking.startTime === startTime.toISOString()
      );
      
      slots.push({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        available: !isBooked,
      });
    }
  }
  
  return slots;
};
