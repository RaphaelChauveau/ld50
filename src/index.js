"use strict";

import { BoidGame } from "./test_boids/BoidGame.js";

console.log("APP");
const canvas = document.getElementById("display");
console.log("CANVAS", canvas);
const game = new BoidGame(canvas);
console.log("GAME", game);
game.run();


const onWindowResized = (width, height, displayRatio) => {
  game.onWindowResized(width, height, displayRatio);
};

const setCanvasSize = (canvas, viewportWidth, viewportHeight) => {
  const widthRatio = viewportWidth / GAME_WIDTH;
  const heightRatio = viewportHeight / GAME_HEIGHT;
  let displayRatio = 1;

  if (widthRatio < heightRatio) {
    displayRatio = widthRatio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${GAME_HEIGHT * widthRatio}px`;
    canvas.style.marginTop = `${
      (innerHeight - GAME_HEIGHT * widthRatio) / 2
    }px`;
    canvas.style.marginLeft = 0;
  } else {
    displayRatio = heightRatio;
    canvas.style.width = `${GAME_WIDTH * heightRatio}px`;
    canvas.style.height = `${innerHeight}px`;
    canvas.style.marginTop = 0;
    canvas.style.marginLeft = `${
      (innerWidth - GAME_WIDTH * heightRatio) / 2
    }px`;
  }

  onWindowResized(GAME_WIDTH, GAME_HEIGHT, displayRatio);
};

setCanvasSize(canvas, window.innerWidth, window.innerHeight);

window.onresize = (e) => {
  const viewPortWidth = e.currentTarget.innerWidth;
  const viewPortHeight = e.currentTarget.innerHeight;
  setCanvasSize(canvas, viewPortWidth, viewPortHeight);
};
