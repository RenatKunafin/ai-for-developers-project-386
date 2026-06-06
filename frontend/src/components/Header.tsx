import { Link, useLocation } from 'react-router-dom';
import { Box, Button, Group } from '@mantine/core';

export function Header() {
  const location = useLocation();
  const isGuest = !location.pathname.startsWith('/admin');

  return (
    <Box component='header' style={{ backgroundColor: '#2d2d2d', borderBottom: '1px solid #3a3a3a' }}>
      <Group justify='space-between' p='md' style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Box style={{ fontSize: '14px', color: '#4caf50' }}>
          Запись на звонок
        </Box>
        <Group gap='xs'>
          <Button
            component={Link}
            to='/'
            variant={isGuest ? 'filled' : 'default'}
            color='green'
            size='xs'
          >
            Запись
          </Button>
          <Button
            component={Link}
            to='/admin'
            variant={!isGuest ? 'filled' : 'default'}
            color='gray'
            size='xs'
          >
            Admin
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
