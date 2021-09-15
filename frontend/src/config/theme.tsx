import { createTheme } from '@material-ui/core';

const PRIMARY_BLUE = '#0944A8';
const SECONDARY_BLUE = '#1C6CF5';
// const TERTIARY_BLUE = '#367FFF';
const PRIMARY_PURPLE = '#5A2DAD';
// const SECONDARY_PURPLE = '#9813F0';

export const theme = createTheme({
    palette: {
        primary: {
          main: SECONDARY_BLUE,
        },
        secondary: {
          main: PRIMARY_PURPLE,
        },
    },
    overrides: {
      MuiButton: {
        text: {
          color: 'white',
        },
        root: {
          textTransform: 'none',
          background: PRIMARY_BLUE,
          '&:hover': {
            backgroundColor: SECONDARY_BLUE,
          },
        },
      },
    },
    props: {
      MuiButton: {
        disableRipple: true,
      }
    }
});
