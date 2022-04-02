import Game from "../engine/game.js";
import Player from "./Player.js";
import ResourceLoader from "../engine/resourceLoader.js";
import {load, play} from "../engine/sound_test/soundTest.js";
import Collider from "./Collider.js";


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

    this.loadImage("res/player_spritesheet_idle_right.png");
    this.loadImage("res/player_spritesheet_walk_right.png");
    this.loadImage("res/player_spritesheet_crouch_right.png");
    this.loadImage("res/player_spritesheet_jump_right.png");
    this.loadImage("res/player_spritesheet_fall_right.png");
    this.loadImage("res/player_spritesheet_dash_right.png");

    // environment
    this.loadImage("res/tree_1.png");

    // sounds
    load("res/Hibou.ogg");
  };

  loadImage = (path) => {
    this.resources[path] = this.resourceLoader.loadImage(path);
  };

  addCollider = (x, y, w, h) => {
      const collider = new Collider(x, y, w, h);
      this.colliders.push(collider);
      this.entities.push(collider);
  }

  initLevel = () => {
    this.player = new Player(100, 100);
    this.state = "PLAYING";

    this.colliders = [];

    this.addCollider(0, 550, 10000, 10);
    this.addCollider(0, 0, 50, 550);
    this.addCollider(435, 418, 100, 100);

    // this.initEnvironment();
  };
  
  update = (delta) => { // delta in ms
      this.player.update(delta, this.inputHandler, this.colliders);
  }

  draw = (scene) => {
      for (const entity of this.entities) {
          entity.draw(scene, this.resources);
      }
      this.player.draw(scene, this.resources);
    // scene.setCenterPosition(Math.round(this.player.position[0]), Math.round(this.player.position[1]));
  };
}
