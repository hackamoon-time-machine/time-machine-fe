import { extendTheme } from '@chakra-ui/react';

const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
};

const theme = extendTheme({
  colors: {
    dark: {
      100: '#818589',
      200: '#2F414F',
      300: '#20252C',
      400: '#141D24',
      500: '#0A1015',
    },
    primary: {
      100: '#1DE9B6',
      200: '#1DE9B6',
    },
    secondary: {
      100: '#FF6E40',
    },
    white: {
      100: '#F3F4F4',
      200: '#fff',
    },
  },
  breakpoints,
});

export default theme;
