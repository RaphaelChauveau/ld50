'use strict';

import {BoidGame} from "./test_boids/BoidGame.js";

console.log('APP');
const canvas = document.getElementById('canvas');
console.log('CANVAS', canvas);
const game = new BoidGame(canvas);
console.log('GAME', game);
game.run();
