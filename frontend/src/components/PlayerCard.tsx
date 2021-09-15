import { Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

interface PlayerCardProps {
  name: string;
  score: number;
  rank: number;
}

const useStyles = makeStyles(theme => ({
  playerCard: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#98c9fa',
    verticalAlign: 'middle',
  },
  rank: {
    fontSize: 22,
  },
  name: {
    fontSize: 24,
  },
  points: {
    fontSize: 22,
  }
}));

export default function PlayerCard({ name, score, rank }: PlayerCardProps) {
  const styles = useStyles();
  return (
    <Grid item style={{textAlign: 'center', verticalAlign: 'center', width: 250}}>
      <Grid container className={styles.playerCard} direction="row" justifyContent="space-around" alignItems="center">
        <Grid item>
          <Typography className={styles.rank}>#{rank}</Typography>
        </Grid>
        <Grid item>
          <Typography className={styles.name}>{name}</Typography>
        </Grid>
        <Grid item>
          <Typography className={styles.points}>{score}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
