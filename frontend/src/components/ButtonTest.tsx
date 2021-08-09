import React from 'react'
import { Button, makeStyles, MuiThemeProvider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    title: {
      color: theme.palette.primary.main,
    }
  }));

export default function ButtonTest() {
    const styles = useStyles();
    return (
        <Button onClick={() => console.log('clicked')}>
          Click Me
        </Button>
    )
}
