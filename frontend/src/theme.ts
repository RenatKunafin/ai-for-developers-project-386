import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'green',
  primaryShade: 6,
  colors: {
    dark: [
      '#1a1a1a',
      '#2d2d2d',
      '#3a3a3a',
      '#4a4a4a',
      '#5a5a5a',
      '#6a6a6a',
      '#7a7a7a',
      '#8a8a8a',
      '#9a9a9a',
      '#aaaaaa',
    ],
    green: [
      '#e8f5e9',
      '#c8e6c9',
      '#a5d6a7',
      '#81c784',
      '#66bb6a',
      '#4caf50',
      '#43a047',
      '#388e3c',
      '#2e7d32',
      '#1b5e20',
    ],
  },
  fontFamily: 'Press Start 2P, monospace',
  headings: {
    fontFamily: 'Press Start 2P, monospace',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 0,
      },
    },
    Card: {
      defaultProps: {
        radius: 0,
        bg: 'dark.1',
      },
    },
    Modal: {
      defaultProps: {
        radius: 0,
      },
    },
  },
});
