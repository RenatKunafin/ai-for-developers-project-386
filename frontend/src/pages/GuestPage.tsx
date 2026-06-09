import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, Text, Group, Box, Stack, Modal, Grid, Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { listPublicEventTypes, getAvailableSlots, createBooking } from '@/api/api';
import { EventTypePublic, Slot } from '@/types';
import { BOOKING_WINDOW_DAYS, DATE_FORMAT_SHORT, DATE_FORMAT_FULL, TIME_FORMAT } from '@/constants';
import dayjs from 'dayjs';
import './GuestPage.css';

export function GuestPage() {
  const { t } = useTranslation();
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

  const handleSelectEvent = useCallback((event: EventTypePublic) => {
    setSelectedEvent(event);
    setDateModalOpen(true);
    setSelectedDate(null);
    setSelectedSlot(null);
    setBookingSuccess(false);
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setDateModalOpen(false);
    setTimeModalOpen(true);
  }, []);

  const handleSelectSlot = useCallback((slot: Slot) => {
    setSelectedSlot(slot);
  }, []);

  const handleBooking = useCallback(async () => {
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
  }, [selectedEvent, selectedSlot, guestName]);

  const generateCalendarDays = useCallback(() => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  }, []);

  return (
    <Box>
      <Text className='guest-page-title' size='xl' mb='md'>
        {t('guest.pageTitle')}
      </Text>
      <Text className='guest-page-subtitle' size='sm' mb='lg'>
        {t('guest.selectType')}
      </Text>

      <Stack gap='md'>
        {eventTypes?.map((event) => (
          <Card key={event.id} className='event-card' padding='md'>
            <Group className='event-card-content' justify='space-between'>
              <Box className='event-info'>
                <Group gap='xs' mb='xs'>
                  <Text className='event-name' size='sm'>
                    {event.name}
                  </Text>
                  <Badge color='green' size='sm'>
                    {t('guest.duration', { minutes: event.durationMinutes })}
                  </Badge>
                </Group>
                <Text className='event-description' size='xs'>
                  {event.description}
                </Text>
              </Box>
              <Button color='green' size='sm' onClick={() => handleSelectEvent(event)}>
                {t('guest.bookButton')}
              </Button>
            </Group>
          </Card>
        ))}
      </Stack>

      {/* Date Modal */}
      <Modal
        opened={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        title={t('guest.selectDate')}
        centered
        classNames={{
          header: 'modal-header',
          body: 'modal-body',
        }}
      >
        <Text size='sm' mb='md'>
          {selectedEvent?.name} · {t('guest.duration', { minutes: selectedEvent?.durationMinutes })}
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
                {dayjs(date).format(DATE_FORMAT_SHORT)}
              </Button>
            </Grid.Col>
          ))}
        </Grid>
      </Modal>

      {/* Time Modal */}
      <Modal
        opened={timeModalOpen}
        onClose={() => setTimeModalOpen(false)}
        title={t('guest.selectTime')}
        centered
        classNames={{
          header: 'modal-header',
          body: 'modal-body',
        }}
      >
        <Text size='sm' mb='md'>
          {selectedEvent?.name} · {t('guest.duration', { minutes: selectedEvent?.durationMinutes })}
        </Text>
        <Text size='xs' mb='md'>
          {selectedDate ? dayjs(selectedDate).format(DATE_FORMAT_FULL) : ''}
        </Text>
        <div className='time-grid'>
          {slots?.map((slot) => (
            <Button
              key={slot.startTime}
              fullWidth
              size='xs'
              variant={selectedSlot?.startTime === slot.startTime ? 'filled' : 'default'}
              color={slot.available ? 'green' : 'gray'}
              disabled={!slot.available}
              onClick={() => handleSelectSlot(slot)}
            >
              {dayjs(slot.startTime).format(TIME_FORMAT)}
            </Button>
          ))}
        </div>
        {selectedSlot && (
          <Box className='booking-form'>
            <Text size='xs' mb='xs'>{t('guest.yourName')}</Text>
            <input
              type='text'
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className='booking-input'
            />
            <Button fullWidth mt='md' color='green' onClick={handleBooking}>
              {t('guest.confirmBooking')}
            </Button>
          </Box>
        )}
      </Modal>

      {bookingSuccess && (
        <Text className='success-message' size='sm'>
          {t('guest.bookingSuccess')}
        </Text>
      )}
    </Box>
  );
}
