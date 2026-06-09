import { Link, useLocation } from 'react-router-dom';
import { Box, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import './Header.css';

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const isGuest = !location.pathname.startsWith('/admin');

  return (
    <Box component='header' className='header'>
      <Group className='header-content' justify='space-between'>
        <Box className='header-title'>
          {t('common.appTitle')}
        </Box>
        <Group className='header-nav' gap='xs'>
          <Button
            component={Link}
            to='/'
            variant={isGuest ? 'filled' : 'default'}
            color='green'
            size='xs'
          >
            {t('common.booking')}
          </Button>
          <Button
            component={Link}
            to='/admin'
            variant={!isGuest ? 'filled' : 'default'}
            color='gray'
            size='xs'
          >
            {t('common.admin')}
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
