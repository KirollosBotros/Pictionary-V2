import { Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";

interface PlayerCardProps {
  name: string;
  score: number;
  rank: number;
  guessedRight: boolean;
  drawBorder: boolean;
}

const useStyles = makeStyles((theme) => ({
  playerCard: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#98c9fa",
    verticalAlign: "middle",
  },
  rank: {
    fontSize: 22,
    paddingLeft: theme.spacing(2),
  },
  name: {
    fontSize: 24,
  },
  points: {
    fontSize: 22,
    paddingRight: theme.spacing(2),
  },
}));

export default function PlayerCard({
  name,
  score,
  rank,
  guessedRight,
  drawBorder,
}: PlayerCardProps) {
  const styles = useStyles();
  return (
    <Grid
      item
      style={{ textAlign: "center", verticalAlign: "center", width: 250 }}
    >
      <Grid
        container
        className={styles.playerCard}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{
          backgroundColor: guessedRight ? "#78de93" : "#98c9fa",
          border: drawBorder ? "3px solid #1643ab" : undefined,
        }}
      >
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
