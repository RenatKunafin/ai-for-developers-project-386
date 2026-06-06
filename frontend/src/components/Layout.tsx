import { Box } from '@mantine/core';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      <Header />
      <Box style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
