import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Text, Group, Box, Stack, Tabs, Badge, Modal } from '@mantine/core';
import { listEventTypes, listBookings, deleteEventType, createEventType } from '@/api/api';
import { EventType } from '@/types';
import dayjs from 'dayjs';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>('types');
  const handleTabChange = (value: string | null) => setActiveTab(value || 'types');
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

  const handleDelete = async (id: string) => {
    await deleteEventType(id);
    queryClient.invalidateQueries({ queryKey: ['adminEventTypes'] });
  };

  const handleCreate = async () => {
    await createEventType(newEventType);
    setCreateModalOpen(false);
    setNewEventType({ name: '', description: '', durationMinutes: 15 });
    queryClient.invalidateQueries({ queryKey: ['adminEventTypes'] });
  };

  return (
    <Box>
      <Text size='xl' mb='md' style={{ color: '#e0e0e0' }}>
        Панель управления
      </Text>

      <Tabs value={activeTab} onChange={handleTabChange} color='green'>
        <Tabs.List style={{ backgroundColor: '#2d2d2d', border: '1px solid #3a3a3a' }}>
          <Tabs.Tab value='types'>Типы встреч</Tabs.Tab>
          <Tabs.Tab value='bookings'>Предстоящие ({bookings?.length || 0})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='types' pt='md'>
          <Group justify='space-between' mb='md'>
            <Text size='sm' style={{ color: '#9a9a9a' }}>
              {eventTypes?.length || 0} типов
            </Text>
            <Button color='green' size='sm' onClick={() => setCreateModalOpen(true)}>
              + Новый тип
            </Button>
          </Group>

          <Stack gap='md'>
            {eventTypes?.map((event: EventType) => (
              <Card key={event.id} padding='md' style={{ backgroundColor: '#2d2d2d', border: '1px solid #3a3a3a' }}>
                <Group justify='space-between' align='start'>
                  <Box>
                    <Group gap='xs' mb='xs'>
                      <Text size='sm' style={{ color: '#e0e0e0' }}>
                        {event.name}
                      </Text>
                      <Badge color='green' size='sm'>
                        {event.durationMinutes}m
                      </Badge>
                    </Group>
                    <Text size='xs' style={{ color: '#9a9a9a' }}>
                      {event.description}
                    </Text>
                    <Text size='xs' style={{ color: '#6a6a6a', marginTop: '4px' }}>
                      id: {event.id}
                    </Text>
                  </Box>
                  <Button color='gray' size='xs' onClick={() => handleDelete(event.id)}>
                    Удалить
                  </Button>
                </Group>
              </Card>
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value='bookings' pt='md'>
          <Stack gap='md'>
            {bookings?.map((booking) => (
              <Card key={booking.id} padding='md' style={{ backgroundColor: '#2d2d2d', border: '1px solid #3a3a3a' }}>
                <Group justify='space-between' align='start'>
                  <Box>
                    <Text size='sm' style={{ color: '#e0e0e0' }}>
                      {booking.eventTypeName}
                    </Text>
                    <Text size='xs' style={{ color: '#9a9a9a' }}>
                      {booking.guestName}
                    </Text>
                    <Text size='xs' style={{ color: '#6a6a6a' }}>
                      {dayjs(booking.startTime).format('DD MMMM HH:mm')} - {dayjs(booking.endTime).format('HH:mm')}
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
        title='Новый тип встречи'
        centered
        styles={{
          header: { backgroundColor: '#2d2d2d' },
          body: { backgroundColor: '#2d2d2d' },
        }}
      >
        <Stack gap='sm'>
          <Text size='xs'>Название:</Text>
          <input
            type='text'
            value={newEventType.name}
            onChange={(e) => setNewEventType({ ...newEventType, name: e.target.value })}
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
          <Text size='xs'>Описание:</Text>
          <textarea
            value={newEventType.description}
            onChange={(e) => setNewEventType({ ...newEventType, description: e.target.value })}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #3a3a3a',
              color: '#e0e0e0',
              padding: '8px',
              width: '100%',
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '10px',
              minHeight: '60px',
            }}
          />
          <Text size='xs'>Длительность (мин):</Text>
          <input
            type='number'
            value={newEventType.durationMinutes}
            onChange={(e) => setNewEventType({ ...newEventType, durationMinutes: parseInt(e.target.value) || 0 })}
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
          <Button color='green' onClick={handleCreate}>
            Создать
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}
