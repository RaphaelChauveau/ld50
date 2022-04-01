import Scene from './scene.js';
import Input from "./input.js";


const MILLISECOND_PER_SECOND = 1000;

class Game {
  constructor(canvas) {
    // TODO watch canvas resize
    this.canvas = canvas;
    this.displayWidth = canvas.width;
    this.displayHeight = canvas.height;

    this.updatePerSecond = 120;
    this.drawPerSecond = 30;

    this.ctx = this.canvas.getContext('2d');
    // this.camera = new Camera(ctx, 0, this.displayWidth, this.displayHeight);

    this._scene = new Scene(this.canvas);
    this._updateInterval = null;
    this._drawInterval = null;
    this._lastUpdateTime = null;
  };

  run = () => {
    this.inputHandler = new Input(this.canvas);
    this.loadAssets();

    this._lastUpdateTime = new Date();
    const updateDelay = MILLISECOND_PER_SECOND / this.updatePerSecond;
    const drawDelay = MILLISECOND_PER_SECOND / this.drawPerSecond;
    this._updateInterval = window.setInterval(this._basicUpdate, updateDelay);
    this._drawInterval = window.setInterval(this._basicDraw, drawDelay);
  };

  stop = () => {
    if (this._updateInterval !== null) {
      window.clearInterval(this._updateInterval);
    }
    if (this._drawInterval !== null) {
      window.clearInterval(this._drawInterval);
    }
    this.unloadAssets();
    this.inputHandler.clean();
  };

  // TODO override
  loadAssets = () => {

  };

  // TODO override
  unloadAssets = () => {

  };

  _basicUpdate = () => {
    const now = new Date();
    const delta = now - this._lastUpdateTime;
    this._lastUpdateTime = now;

    this.update(delta);
    this.inputHandler.newFrame();
  };

  // TODO override
  update = (delta) => {

  };

  _basicDraw = () => {
    this._scene.drawBegin();
    this.draw(this._scene);
    this._scene.drawEnd()
  };

  // TODO override
  draw = (scene) => {

  };
}

export default Game;
