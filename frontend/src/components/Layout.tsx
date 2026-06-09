import { Box } from '@mantine/core';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import './Layout.css';

export function Layout() {
  return (
    <Box className='layout'>
      <Header />
      <Box className='layout-container'>
        <Outlet />
      </Box>
    </Box>
  );
}
