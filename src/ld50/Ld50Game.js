import Game from "../engine/game.js";
import Player from "./Player.js";
import ResourceLoader from "../engine/resourceLoader.js";
import {load, play} from "../engine/sound_test/soundTest.js";


export class Ld50Game extends Game {
  constructor(canvas) {
    super(canvas);
    this.updatePerSecond = 60;
    this.drawPerSecond = 30;

    this.highscore = 0;

    this.colliders = [];
    this.entities = [];
    this.enemies = [];
    this.waveNumber = 1;
    this.state = "PLAYING";
    this.score = 0;

    this.initLevel();

    this.resources = {};
  }

  loadAssets = () => {
    this.resourceLoader = new ResourceLoader();

    // environment
    this.loadImage("res/tree_1.png");

    // sounds
    load("res/Hibou.ogg");
  };

  loadImage = (path) => {
    this.resources[path] = this.resourceLoader.loadImage(path);
  };

  initLevel = () => {
    this.player = new Player(100, 100);
    this.state = "PLAYING";

    // this.initEnvironment();
  };
  
  update = (delta) => { // delta in ms
      this.player.update(delta, this.inputHandler);
  }

  draw = (scene) => {
      this.player.draw(scene);
    // scene.setCenterPosition(Math.round(this.player.position[0]), Math.round(this.player.position[1]));
  };
}
