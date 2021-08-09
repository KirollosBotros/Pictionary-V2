import React from 'react'
import { Toolbar, IconButton, Typography, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    toolbar: {
        backgroundColor: theme.palette.primary.main,
    },
    footer: {
        left: 0,
        bottom: 0,
        width: '100%',
        position: 'fixed',
    }
}));

export default function Footer() {
    const styles = useStyles();

    return (
        <footer className={styles.footer}>
            <Toolbar className={styles.toolbar}>

            </Toolbar>
        </footer>
    )
}
