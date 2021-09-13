import { Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

interface PlayerCardProps {
  name: string;
}

const useStyles = makeStyles(theme => ({
  playerCard: {
    height: 50,
    backgroundColor: '#98c9fa',
    verticalAlign: 'middle',
  },
}));

export default function PlayerCard({ name }: PlayerCardProps) {
  const styles = useStyles();
  return (
    <Grid item style={{textAlign: 'center', verticalAlign: 'center', width: 250}}>
      <Typography className={styles.playerCard}>{name}</Typography>
    </Grid>
  );
}
