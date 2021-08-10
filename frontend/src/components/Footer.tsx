import React from 'react'
import { Toolbar, Typography, Grid, makeStyles } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles(theme => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },
    lockIcon: {
      marginTop: 4,
      marginRight: 4,
      [theme.breakpoints.down('sm')]: {
        marginRight: 0,
      },
    },
    footer: {
        left: 0,
        bottom: 0,
        width: '100%',
        position: 'fixed',
    },
    bottomText: {
      color: 'white',
      fontSize: 22,
      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
      },
      textAlign: 'center',
      background: theme.palette.primary.main,
  },
  click: {
    textDecoration: 'none',
    color: 'white',
  },
}));

export default function Footer() {
    const styles = useStyles();

    return (
        <footer className={styles.footer}>
          <Toolbar className={styles.toolbar}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item className={styles.bottomText}>
                <Grid container direction="row" alignItems="center">
                  <Grid item className={styles.lockIcon}>
                    <LockOutlinedIcon />
                  </Grid>
                  <Typography className={styles.bottomText}>
                    V 2.0.0
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography className={styles.bottomText}>
                  Made by&nbsp;
                  <a target="_blank" href="http://www.linkedin.com/in/kirollos-botros" className={styles.click}>
                    Kirollos Botros
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </footer>
    )
}
