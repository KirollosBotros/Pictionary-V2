import { makeStyles } from '@material-ui/core'
import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client';
import Sketch from 'react-p5'
import p5Types from 'p5'
import { useState } from 'react'
import { GameObject, Player } from '../types/game';

interface GameCanvasProps {
  socket: Socket;
  game: GameObject;
  players: Player[];
  onNextTurn: (currentDrawer: string) => void;
  getHeight: (height: number) => void;
}

const useStyles = makeStyles(theme => ({
  canvas: {
    backgroundColor: '#f0f1f2',
    width: '100%',
    touchAction: 'none',
  },
}));

export default function GameCanvas({ socket, game, players, onNextTurn, getHeight }: GameCanvasProps) {
  const styles = useStyles();
  const { creator } = game;
  let counter = 0;
  const [currentDrawer, setCurrentDrawer] = useState<string>(players[counter].id);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const setup = async (p5: p5Types, parent: Element) => {
    let CNV_WIDTH = p5.displayWidth / 2.55;
    if (p5.displayWidth < 500) {
      CNV_WIDTH = p5.displayWidth * .80;
    }
    let CNV_HEIGHT = CNV_WIDTH / 1.176;
    getHeight(CNV_HEIGHT);
    setWidth(CNV_WIDTH);
    setHeight(CNV_HEIGHT);
    p5.createCanvas(CNV_WIDTH, CNV_HEIGHT).parent(parent);
    p5.background(245,245,245);

    // socket listeners
    socket.on('drawing', (data: number[]) => {
      drawLine(p5, data, [CNV_WIDTH, CNV_HEIGHT]);
    });

    socket.on('clearBoard', () => {
      p5.clear();
      p5.background(245,245,245);
    });

    socket.on('nextTurn', ([word, player]) => {
      p5.clear();
      p5.background(245,245,245);
      setCurrentDrawer(player.id);
      onNextTurn(player.id);
    });
  };

  const drawLine = (p5: p5Types, data: number[], normalize: number[]) => {
    p5.strokeWeight(4);
    p5.line(
      data[0] * normalize[0],
      data[1] * normalize[1],
      data[2] * normalize[0],
      data[3] * normalize[1]
    );
  };

  const windowResized = (p5: p5Types) => {
    let RESIZED_WIDTH = p5.windowWidth / 2;
    if (p5.windowWidth > 1400) {
      RESIZED_WIDTH = p5.windowWidth / 2.55;
    }
    if (p5.windowWidth < 800) {
      RESIZED_WIDTH = p5.windowWidth / 1.35;
    }
    let RESIZED_HEIGHT = RESIZED_WIDTH / 1.176;
    socket.off('drawing');
    socket.on('drawing', (data: number[]) => {
      drawLine(p5, data, [RESIZED_WIDTH, RESIZED_HEIGHT]);
    });
    getHeight(RESIZED_HEIGHT);
    setWidth(RESIZED_WIDTH);
    setHeight(RESIZED_HEIGHT);
    p5.resizeCanvas(RESIZED_WIDTH, RESIZED_HEIGHT);
    p5.background(245,245,245);
  };

  const draw = (p5: p5Types) => {

  };

  const mouseDragged = (p5: p5Types) => {
    if (socket.id === currentDrawer && width !== 0 && height !== 0) {
      p5.strokeWeight(4);
      const lineCords = [
        p5.mouseX / width,
        p5.mouseY / height,
        p5.pmouseX / width,
        p5.pmouseY / height,
      ];
      p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
      socket.emit('mouse', [creator, lineCords]);
    }
  };

  const keyTyped = (p5: p5Types) => {
    if (p5.key === 'c' && socket.id === currentDrawer) {
      p5.clear();
      p5.background(245,245,245);
      socket.emit('clearedBoard', creator);
    }
  }

  return (
    <Sketch
      setup={setup}
      mouseDragged={mouseDragged}
      keyTyped={keyTyped}
      windowResized={windowResized}
      draw={draw}
    />
  );
}
