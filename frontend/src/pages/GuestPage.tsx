import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, Text, Group, Box, Stack, Modal, Grid, Badge } from '@mantine/core';
import { listPublicEventTypes, getAvailableSlots, createBooking } from '@/api/api';
import { EventTypePublic, Slot } from '@/types';
import dayjs from 'dayjs';

export function GuestPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventTypePublic | null>(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [guestName, setGuestName] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { data: eventTypes } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: listPublicEventTypes,
  });

  const { data: slots } = useQuery({
    queryKey: ['slots', selectedEvent?.id, selectedDate?.toISOString()],
    queryFn: () => getAvailableSlots(selectedEvent!.id, selectedDate?.toISOString().split('T')[0]),
    enabled: !!selectedEvent && !!selectedDate,
  });

  const handleSelectEvent = (event: EventTypePublic) => {
    setSelectedEvent(event);
    setDateModalOpen(true);
    setSelectedDate(null);
    setSelectedSlot(null);
    setBookingSuccess(false);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setDateModalOpen(false);
    setTimeModalOpen(true);
  };

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    if (!selectedEvent || !selectedSlot || !guestName) return;
    await createBooking({
      eventTypeId: selectedEvent.id,
      guestName,
      startTime: selectedSlot.startTime,
    });
    setBookingSuccess(true);
    setTimeModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
    setGuestName('');
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <Box>
      <Text size='xl' mb='md' style={{ color: '#e0e0e0' }}>
        Выбор встречи
      </Text>
      <Text size='sm' mb='lg' style={{ color: '#9a9a9a' }}>
        Выберите тип для записи
      </Text>

      <Stack gap='md'>
        {eventTypes?.map((event) => (
          <Card key={event.id} padding='md' style={{ backgroundColor: '#2d2d2d', border: '1px solid #3a3a3a' }}>
            <Group justify='space-between' align='start'>
              <Box>
                <Group gap='xs' mb='xs'>
                  <Text size='sm' style={{ color: '#e0e0e0' }}>
                    {event.name}
                  </Text>
                  <Badge color='green' size='sm'>
                    {event.durationMinutes} мин
                  </Badge>
                </Group>
                <Text size='xs' style={{ color: '#9a9a9a' }}>
                  {event.description}
                </Text>
              </Box>
              <Button color='green' size='sm' onClick={() => handleSelectEvent(event)}>
                Записаться
              </Button>
            </Group>
          </Card>
        ))}
      </Stack>

      {/* Date Modal */}
      <Modal
        opened={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        title='Выбор даты'
        centered
        styles={{
          header: { backgroundColor: '#2d2d2d' },
          body: { backgroundColor: '#2d2d2d' },
        }}
      >
        <Text size='sm' mb='md'>
          {selectedEvent?.name} · {selectedEvent?.durationMinutes} мин
        </Text>
        <Grid>
          {generateCalendarDays().map((date) => (
            <Grid.Col key={date.toISOString()} span={3}>
              <Button
                fullWidth
                size='xs'
                variant='default'
                color='gray'
                onClick={() => handleSelectDate(date)}
              >
                {dayjs(date).format('DD.MM')}
              </Button>
            </Grid.Col>
          ))}
        </Grid>
      </Modal>

      {/* Time Modal */}
      <Modal
        opened={timeModalOpen}
        onClose={() => setTimeModalOpen(false)}
        title='Выбор времени'
        centered
        styles={{
          header: { backgroundColor: '#2d2d2d' },
          body: { backgroundColor: '#2d2d2d' },
        }}
      >
        <Text size='sm' mb='md'>
          {selectedEvent?.name} · {selectedEvent?.durationMinutes} мин
        </Text>
        <Text size='xs' mb='md'>
          {selectedDate ? dayjs(selectedDate).format('DD MMMM, dddd') : ''}
        </Text>
        <Grid>
          {slots?.map((slot) => (
            <Grid.Col key={slot.startTime} span={3}>
              <Button
                fullWidth
                size='xs'
                variant={selectedSlot?.startTime === slot.startTime ? 'filled' : 'default'}
                color={slot.available ? 'green' : 'gray'}
                disabled={!slot.available}
                onClick={() => handleSelectSlot(slot)}
              >
                {dayjs(slot.startTime).format('HH:mm')}
              </Button>
            </Grid.Col>
          ))}
        </Grid>
        {selectedSlot && (
          <Box mt='md'>
            <Text size='xs' mb='xs'>Ваше имя:</Text>
            <input
              type='text'
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #3a3a3a',
                color: '#e0e0e0',
                padding: '8px',
                width: '100%',
                fontFamily: 'Press Start 2P, monospace',
                fontSize: '10px',
              }}
            />
            <Button fullWidth mt='md' color='green' onClick={handleBooking}>
              Подтвердить запись
            </Button>
          </Box>
        )}
      </Modal>

      {bookingSuccess && (
        <Text mt='md' color='green' size='sm'>
          Запись успешно создана!
        </Text>
      )}
    </Box>
  );
}
