import React from 'react'
import { Button, makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    title: {
      color: theme.palette.primary.main,
    }
  }));

export default function ButtonTest() {
    const styles = useStyles();
    return (
      <Grid container direction="row" justifyContent="space-evenly">
        <Grid item>
          <Button onClick={() => console.log('clicked')}>
            Click Me
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={() => console.log('clicked')}>
            Click Me 2
          </Button>
        </Grid>
      </Grid>
    )
}
