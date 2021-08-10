import React from 'react'
import { Toolbar, Button, Typography, Grid, makeStyles } from '@material-ui/core';

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
        textAlign: 'center',
        background: theme.palette.primary.main,
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
                          PictoBear
                        </Button>
                    </Grid>
                </Grid>
                
            </Toolbar>
        </header>
    )
}
