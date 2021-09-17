import React from 'react'
import { Toolbar, Button, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  toolbar: {
    backgroundColor: theme.palette.primary.main,
  },
  header: {
    width: '100vw',
    marginLeft: -8,
    marginTop: -10,
  },
  title: {
    color: 'white',
    fontSize: 36,
    [theme.breakpoints.down(500)]: {
      fontSize: 25,
    },
    textAlign: 'center',
    background: theme.palette.primary.main,
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
}));

export default function Header() {
    const styles = useStyles();

    return (
        <header className={styles.header}>
            <Toolbar className={styles.toolbar}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Button 
                            disableRipple
                            disableFocusRipple
                            className={styles.title}>
                        <a href="/" className={styles.link} onClick={() => {window.location.href="/"}}>PictoBear</a>
                        </Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </header>
    )
}
