import { Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import { Socket } from 'socket.io-client';
import Sketch from 'react-p5'
import p5Types from 'p5'

interface GameCanvasProps {
  socket: Socket;
  creator: string;
}

const useStyles = makeStyles(theme => ({
  canvas: {
    backgroundColor: '#f0f1f2',
    height: '100%',
    width: '100%',
    minHeight: 700,
  },
}));

export default function GameCanvas({ socket, creator }: GameCanvasProps) {
  const styles = useStyles();
  
  const setup = (p5: p5Types, parent: Element) => {
    p5.createCanvas(700,700).parent(parent);
    p5.background(245,245,245);

    // socket listeners
    socket.on('drawing', data => {
      p5.strokeWeight(4);
      p5.line(data[0], data[1], data[2], data[3]);
    })

    socket.on('clearBoard', () => {
      p5.clear();
      p5.background(245,245,245);
    });
  };

  const mouseDragged = (p5: p5Types) => {
    p5.strokeWeight(4);
    const lineCords = [p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY];
    p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    socket.emit('mouse', [creator, lineCords]);
  };

  const keyTyped = (p5: p5Types) => {
    if (p5.key === 'c') {
      p5.clear();
      p5.background(245,245,245);
      socket.emit('clearedBoard', creator);
    }
  }

  return (
    <Grid item xs={10} md={6} >
      <Grid container direction="row" alignItems="center" >
        <Grid item>
          <Sketch setup={setup} mouseDragged={mouseDragged} keyTyped={keyTyped} />
        </Grid>
      </Grid>
    </Grid>
  )
}
