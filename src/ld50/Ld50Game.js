import Game from "../engine/game.js";
import Hourglass from "./Hourglass.js";
import Player from "./Player.js";
import Sunrise from "./Sunrise.js";
import Scroller from "./Scroller.js";
import ResourceLoader from "../engine/resourceLoader.js";
import { load, play } from "../engine/sound_test/soundTest.js";
import Collider from "./Collider.js";
import Box from "./Box.js";

const GameState = {
  PLAYING: "PLAYING",
  MENU: "MENU",
  GAME_OVER: "GAME_OVER",
};

export class Ld50Game extends Game {
  constructor(canvas) {
    super(canvas);
    this.updatePerSecond = 60;
    this.drawPerSecond = 30;

    this.highscore = 0; // TODO load
    this.score = 0;
    this.levelStartedSince = 0;
    this.levelDuration = 20_000;
    this.hourglassTimeGiven = 5_000;

    this.colliders = [];
    this.entities = [];

    this.state = GameState.MENU;

    this.resources = {};

    this.initLevel();
  }

  loadAssets = () => {
    this.resourceLoader = new ResourceLoader();

    this.loadImage("res/menu.png");

    this.loadImage("res/player_spritesheet_idle_right.png");
    this.loadImage("res/player_spritesheet_walk_right.png");
    this.loadImage("res/player_spritesheet_crouch_right.png");
    this.loadImage("res/player_spritesheet_jump_right.png");
    this.loadImage("res/player_spritesheet_fall_right.png");
    this.loadImage("res/player_spritesheet_dash_right.png");

    this.loadImage("res/hourglass.png");
    this.loadImage("res/box.png");
    this.loadImage("res/box_metal.png");

    // environment
    this.loadImage("res/tree_1.png");
    this.loadImage("res/backdrop.png");
    this.loadImage("res/backdrop_1.png");
    this.loadImage("res/backdrop_2.png");
    this.loadImage("res/backdrop_3.png");
    this.loadImage("res/moon.png");
    this.loadImage("res/sun.png");

    // sounds
    load("res/Hibou.ogg");

    load("res/break.ogg");
    load("res/dash.ogg");
    load("res/game_over.ogg");
    load("res/hourglass.ogg");
    load("res/jump.ogg");
    load("res/start.ogg");
  };

  loadImage = (path) => {
    this.resources[path] = this.resourceLoader.loadImage(path);
  };

  addCollider = (x, y, w, h) => {
    const collider = new Collider(x, y, w, h);
    this.colliders.push(collider);
    this.entities.push(collider);
  };

  addBox = (x, y, metal=false) => {
      const box = new Box([x, y], metal);
      this.colliders.push(box.collider);
      this.entities.push(box);
  }

  addHourglass = (x, y) => {
    const hourglass = new Hourglass([x, y], this);
    this.entities.push(hourglass);
  }

  initLevel = () => {
    this.score = 0;
    this.levelStartedSince = 0;
    this.entities = []
    this.colliders = [];
    this.patternGeneratedAt = 800;

    this.player = new Player(100, 100);
    this.sunrise = new Sunrise();
    this.scroller1 = new Scroller(0.25);
    this.scroller2 = new Scroller(0.5);
    this.scroller3 = new Scroller(1);

    this.addCollider(0, 550, 100_000_000, 1000);

    this.addPattern(0, ['M','M','M','M','M','M','M','M',])
  };

  collectHourglass = (hourglass) => {
    this.levelStartedSince -= this.hourglassTimeGiven;
    this.levelStartedSince = Math.max(0, this.levelStartedSince);
    this.score += this.hourglassTimeGiven / 1000;
    play('res/hourglass.ogg');
  };

  update = (delta) => {
    if (this.state === GameState.PLAYING && this.levelStartedSince === 0) {
      play('res/start.ogg');
    }
    if (
      this.state === GameState.PLAYING ||
      this.state === GameState.GAME_OVER
    ) {
      if (this.inputHandler.getKeyDown("Escape")) {
        this.state = GameState.MENU;
        return;
      }

      if (this.state === GameState.PLAYING) {
        // delta in ms
        this.levelStartedSince += delta;
        this.levelStartedSince = Math.min(
          this.levelDuration,
          this.levelStartedSince
        );
        if (this.levelStartedSince >= this.levelDuration) {
          play('res/game_over.ogg');
          this.player.die();
          this.state = GameState.GAME_OVER;

          this.highscore = parseInt(window.localStorage.getItem('score') || '0', 10);
          if (this.score > this.highscore) {
            this.highscore = this.score;
            window.localStorage.setItem('score', this.score);
          }
          return;
        }

        if (this.patternGeneratedAt < this.player.position[0] + 400) {
          const patternWidth = this.addPattern(this.player.position[0] + 500);
          this.patternGeneratedAt = this.player.position[0] + 500 + patternWidth;
        }
      }

      this.player.update(delta, this.inputHandler, this.colliders);
      this.sunrise.update(delta, this.levelStartedSince / this.levelDuration);
      this.scroller1.update(this.player);
      this.scroller2.update(this.player);
      this.scroller3.update(this.player);

      for (const entity of this.entities) {
        entity.update && entity.update(delta);
      }

      if (this.state === GameState.GAME_OVER) {
        if (this.inputHandler.getKeyDown("Enter")) {
          this.initLevel();
          this.state = GameState.PLAYING;
        }
      }
    } else if (this.state === GameState.MENU) {
      if (this.inputHandler.getKeyDown("Enter")) {
        this.initLevel();
        this.state = GameState.PLAYING;
      }
    }
  };

  draw = (scene) => {
    if (
      this.state === GameState.PLAYING ||
      this.state === GameState.GAME_OVER
    ) {
      scene.setCenterPosition(400, 300);
      scene.ctx.drawImage(this.resources["res/backdrop.png"].value, 0, 0);
      this.sunrise.draw(scene, this.resources);
      this.scroller1.draw(scene, this.resources["res/backdrop_1.png"]);
      this.scroller2.draw(scene, this.resources["res/backdrop_2.png"]);
      this.scroller3.draw(scene, this.resources["res/backdrop_3.png"]);

      scene.setCenterPosition(Math.round(this.player.position[0]), 300);
      for (const entity of this.entities) {
        entity.draw(scene, this.resources);
      }
      this.player.draw(scene, this.resources);


      // HUD
      scene.setCenterPosition(400, 300);
      if (this.state === GameState.PLAYING) {
        scene.ctx.font = "40px Arial Black";
        scene.ctx.fillStyle = "black";
        scene.ctx.textAlign = "center";
        scene.ctx.fillText(`score: ${this.score}`, 625, 40);
      }
      if (this.state === GameState.GAME_OVER) {
        scene.ctx.font = "60px Arial Black";
        scene.ctx.fillStyle = "black";
        scene.ctx.textAlign = "center";
        scene.ctx.fillText(`Press Enter to restart`, 400, 400);
        scene.ctx.fillText(`Oh, you failed...`, 400, 80);

        scene.ctx.font = "40px Arial Black";
        scene.ctx.fillText(`Your score : ${this.score}`, 400, 180);
        scene.ctx.fillText(`Highscore : ${this.highscore}`, 400, 240);

        scene.ctx.font = "20px Arial Black";
        scene.ctx.fillText(`(dev : 210)`, 400, 280);

      }
    } else if (this.state === GameState.MENU) {
        scene.drawImage(this.resources["res/menu.png"], 0, 0, 800, 600);
        scene.ctx.font = "60px Arial Black";
        scene.ctx.fillStyle = "#a8372d";
        scene.ctx.textAlign = "left";
        const base = 250
        scene.ctx.fillText(`: Move`, 545, base);
        scene.ctx.fillText(`: Jump`, 545, base + 70);
        scene.ctx.fillText(`: Dash`, 545, base + 140);


        scene.ctx.font = "68px Arial Black";
        scene.ctx.fillText(`: Start`, 545, 500);
    }
  };

  addPattern = (x, patternOverride) => {
    let randomIndex = Math.floor(Math.random() * this.patterns.length);
    //randomIndex = 0;
    let pattern = patternOverride || this.patterns[randomIndex];
    /*pattern = [
        "........",
        "BBB.....",
        "HBB.....",
        ".BM.....",
        ".BM.....",
        "BBB.....",
    ]*/
    // pattern = ['B.H']
    const patternHeight = pattern.length;

    pattern.forEach((line, row) => {
        const yy = 582 - (patternHeight - row) * 64;
        for (let col = 0; col < line.length; col++) {
            const object = line[col];
            const xx = x + col * 64;
            if (object === '.') {
                continue;
            } else if (object === "B") {
              this.addBox(xx, yy, false);
          }else if (object === "M") {
            this.addBox(xx, yy, true);
        } else if (object === "H") {
                this.addHourglass(xx, yy);
            }
        }
    })

    return pattern[0].length * 64; // pattern length
  }
  /*
    [
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
    ],
   */
  patterns = [
    [
      '...............',
      '...............',
      '...............',
      '...............',
      '......MMMMMMM..',
      '...M..B.....B..',
      '...M..B....HB..',
      '...M..B.....B..',
    ],
    [
      '...............',
      '............MH.',
      '...............',
      '...............',
      '......MMMM.....',
      '...M..B........',
      '...M..B........',
      '...M..B........',
    ],
    [
      '..........',
      '..........',
      '..........',
      '..........',
      '..BBBBBB..',
      '..BBBMBB..',
      '..BBBMBB..',
      '..BBBBBB..',
    ],
    [
      '.............',
      '.............',
      '.............',
      '..........M..',
      '..........M..',
      '...M......M..',
      '..BB......M..',
      '.BBB......M..',
    ],
    [
      'H.........',
      '..........',
      '..........',
      '.MMM......',
      '..........',
      '......BBB.',
      '..........',
      '..........',
    ],
    [
      '..............',
      '..............',
      '..............',
      '..............',
      '..............',
      '..MMMMMMM.....',
      '..MHHHHHM.....',
      '..MHHHHHM.....',
    ],
    [
      '..............',
      '..............',
      '.............H',
      '..............',
      '..............',
      '..MMMMMMM.....',
      '..............',
      '..............',
    ],
    [
      '..........',
      '........M.',
      '........M.',
      '........B.',
      '........B.',
      '..MMMMMMM.',
      '..........',
      '..........',
    ],
    [
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
      '..MMMMMMM.',
      '........M.',
      '........M.',
    ],
    [
      '..........',
      '..........',
      '..........',
      '..........',
      '...MMM....',
      '...BBB....',
      '...BBB....',
      '...BBB....',
    ],
    [
      '.........H',
      '..........',
      '...MM.....',
      '...B......',
      '...B......',
      'MMBB......',
      '..........',
      '..........',
    ],
    [
      '.....H.',
      '...MMMM',
      '.......',
      'M......',
      'M......',
    ],
    [
      "...",
      "BBB",
      "HBB",
      ".BM",
      ".BM",
      "MMM",
    ],
  ]
}
