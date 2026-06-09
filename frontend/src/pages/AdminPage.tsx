import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Text, Group, Box, Stack, Tabs, Badge, Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { listEventTypes, listBookings, deleteEventType, createEventType } from '@/api/api';
import { EventType } from '@/types';
import { DATE_FORMAT_ADMIN, TIME_FORMAT } from '@/constants';
import dayjs from 'dayjs';
import './AdminPage.css';

export function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('types');
  const handleTabChange = useCallback((value: string | null) => setActiveTab(value || 'types'), []);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newEventType, setNewEventType] = useState({ name: '', description: '', durationMinutes: 15 });
  const queryClient = useQueryClient();

  const { data: eventTypes } = useQuery({
    queryKey: ['adminEventTypes'],
    queryFn: listEventTypes,
  });

  const { data: bookings } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: listBookings,
  });

  const handleDelete = useCallback(async (id: string) => {
    await deleteEventType(id);
    queryClient.invalidateQueries({ queryKey: ['adminEventTypes'] });
  }, [queryClient]);

  const handleCreate = useCallback(async () => {
    await createEventType(newEventType);
    setCreateModalOpen(false);
    setNewEventType({ name: '', description: '', durationMinutes: 15 });
    queryClient.invalidateQueries({ queryKey: ['adminEventTypes'] });
  }, [newEventType, queryClient]);

  return (
    <Box>
      <Text className='admin-page-title' size='xl' mb='md'>
        {t('admin.pageTitle')}
      </Text>

      <Tabs value={activeTab} onChange={handleTabChange} color='green'>
        <Tabs.List className='admin-tabs'>
          <Tabs.Tab value='types'>{t('admin.typesTab')}</Tabs.Tab>
          <Tabs.Tab value='bookings'>
            {t('admin.bookingsTab')} {t('admin.bookingsCount', { count: bookings?.length || 0 })}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='types' className='admin-panel'>
          <Group className='admin-header' justify='space-between'>
            <Text className='admin-count' size='sm'>
              {t('admin.typesCount', { count: eventTypes?.length || 0 })}
            </Text>
            <Button color='green' size='sm' onClick={() => setCreateModalOpen(true)}>
              {t('admin.newType')}
            </Button>
          </Group>

          <Stack gap='md'>
            {eventTypes?.map((event: EventType) => (
              <Card key={event.id} className='event-card' padding='md'>
                <Group className='event-card-content' justify='space-between'>
                  <Box>
                    <Group gap='xs' mb='xs'>
                      <Text className='event-name' size='sm'>
                        {event.name}
                      </Text>
                      <Badge color='green' size='sm'>
                        {event.durationMinutes}{t('common.minutesShort')}
                      </Badge>
                    </Group>
                    <Text className='event-description' size='xs'>
                      {event.description}
                    </Text>
                    <Text className='event-id' size='xs'>
                      id: {event.id}
                    </Text>
                  </Box>
                  <Button color='gray' size='xs' onClick={() => handleDelete(event.id)}>
                    {t('common.delete')}
                  </Button>
                </Group>
              </Card>
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value='bookings' className='admin-panel'>
          <Stack gap='md'>
            {bookings?.map((booking) => (
              <Card key={booking.id} className='booking-card' padding='md'>
                <Group justify='space-between' align='start'>
                  <Box>
                    <Text className='booking-name' size='sm'>
                      {booking.eventTypeName}
                    </Text>
                    <Text className='booking-guest' size='xs'>
                      {booking.guestName}
                    </Text>
                    <Text className='booking-time' size='xs'>
                      {dayjs(booking.startTime).format(DATE_FORMAT_ADMIN)} - {dayjs(booking.endTime).format(TIME_FORMAT)}
                    </Text>
                  </Box>
                </Group>
              </Card>
            ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Create Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={t('admin.createType')}
        centered
        classNames={{
          header: 'modal-header',
          body: 'modal-body',
        }}
      >
        <Stack gap='sm'>
          <Text size='xs'>{t('admin.name')}</Text>
          <input
            type='text'
            value={newEventType.name}
            onChange={(e) => setNewEventType({ ...newEventType, name: e.target.value })}
            className='form-input'
            placeholder={t('admin.typeNamePlaceholder')}
          />
          <Text size='xs'>{t('admin.description')}</Text>
          <textarea
            value={newEventType.description}
            onChange={(e) => setNewEventType({ ...newEventType, description: e.target.value })}
            className='form-textarea'
            placeholder={t('admin.typeDescriptionPlaceholder')}
          />
          <Text size='xs'>{t('admin.duration')}</Text>
          <input
            type='number'
            value={newEventType.durationMinutes}
            onChange={(e) => setNewEventType({ ...newEventType, durationMinutes: parseInt(e.target.value) || 0 })}
            className='form-input'
          />
          <Button color='green' onClick={handleCreate}>
            {t('common.create')}
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}
