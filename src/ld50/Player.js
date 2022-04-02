import Rect from "./Rect.js";
import { sum, mul } from "../engine/vector2.js";

const State = {
  DASHING: "DASHING",
  IDLE: "IDLE",
  WALKING: "WALKING",
  JUMPING: "JUMPING",
  FALLING: "FALLING",
};

export default class Player {
  constructor(x, y) {
    this.position = [x, y];
    this.width = 32 * 2;
    this.height = 48 * 2;
    this.hitbox = this.getHitboxFromPosition(this.position);

    this.state = State.FALLING;
    this.isGrounded = false;
    this.orientation = "right";
    this.horizontalVelocity = 0;
    this.horizontalInput = 0;
    this.jumpPressed = false;

    this._bufferedActionSince = 9999;
    this._bufferedActionType = "jump"; // or dash
    this._bufferedActionDuration = 200;

    this.dashDuration = 500;
    this._dashingSince = 9999;

    this.verticalVelocity = 0; // per sec
    this.horizontalVelocity = 0; // per sec
    this.jumpVelocity = -700; // per sec
    this.walkVelocity = 300;
    this.gravity = 1400; // per sec
    this.maxVerticalVelocity = 5000; // per sec
  }

  getHitboxFromPosition = ([x, y]) => {
    return new Rect(x - this.width / 2, y, this.width, this.height);
  };

  computeHorizontalInput = (inputHandler) => {
    if (this.horizontalInput < 0) {
      // top, A pressed
      if (!inputHandler.getKey("KeyA")) {
        this.horizontalInput = 0;
        if (inputHandler.getKey("KeyD")) {
          this.horizontalInput = 1;
          //this.orientation = "right";
        }
      }
    } else if (this.horizontalInput > 0) {
      // bottom, D pressed
      if (!inputHandler.getKey("KeyD")) {
        this.horizontalInput = 0;
        if (inputHandler.getKey("KeyA")) {
          this.horizontalInput = -1;
          //this.orientation = "left";
        }
      }
    }
    if (inputHandler.getKeyDown("KeyD")) {
      this.horizontalInput = 1;
      //this.orientation = "right";
    } else if (inputHandler.getKeyDown("KeyA")) {
      this.horizontalInput = -1;
      //this.orientation = "left";
    }
  };

  update = (delta, inputHandler) => {
    // update timings
    this._timeSinceAnimation += delta;
    this._dashingSince += delta;

    this._bufferedActionSince += delta;

    //hzInput
    this.computeHorizontalInput(inputHandler);

    if (inputHandler.getKeyDown("KeyW")) {
      this._bufferedActionSince = 0;
      this._bufferedActionType = "jump";
    }
    if (inputHandler.getKeyDown("KeyE")) {
      this._bufferedActionSince = 0;
      this._bufferedActionType = "dash";
    }

    if (inputHandler.getKeyUp("KeyW")) {
      this.jumpPressed = false;
      if (this.verticalVelocity < 0) {
        // jumping
        this.verticalVelocity /= 2;
      }
    }

    // is grounded ?
    const groundDetectionHitbox = this.getHitboxFromPosition(this.position);
    groundDetectionHitbox.y += groundDetectionHitbox.h;
    groundDetectionHitbox.h = 1;
    const shouldBecomeGrounded =
      groundDetectionHitbox.y + groundDetectionHitbox.h > 550; // TODO collisions, toussa
    // const newlyGrounded = !this.isGrounded && shouldBecomeGrounded;
    this.isGrounded = shouldBecomeGrounded;

    // compute actions
    if (this._bufferedActionSince < this._bufferedActionDuration) {
      // try to trigger action
      if (this._bufferedActionType === "dash" && this.state !== State.DASHING) {
        console.log("DASH");
        this._bufferedActionSince = 9999;
        this._dashingSince = 0;
      } else if (
        this._bufferedActionType === "jump" &&
        this.state !== State.DASHING &&
        this.isGrounded
      ) {
        console.log("JUMP");
        this._bufferedActionSince = 9999;

        this.jumpPressed = inputHandler.getKey("KeyW");
        this.verticalVelocity = this.jumpPressed
          ? this.jumpVelocity
          : this.jumpVelocity / 2;
      }
    }

    // compute movement
    if (this._dashingSince < this.dashDuration) {
      // dashing
      const direction = this.orientation == "right" ? 1 : -1;
      this.horizontalVelocity = direction * this.walkVelocity * 2;
      this.verticalVelocity = 0;
    } else {
      // TODO determine state
      // gravity
      if (!this.isGrounded) {
        this.verticalVelocity += (this.gravity * delta) / 1000;
        if (this.verticalVelocity > this.maxVerticalVelocity) {
          this.verticalVelocity = this.maxVerticalVelocity;
        }
      }

      // hz mvt
      this.horizontalVelocity = this.horizontalInput * this.walkVelocity;
      // orientation
      if (this.horizontalInput > 0) {
        this.orientation = "right";
      } else if (this.horizontalInput < 0) {
        this.orientation = "left";
      }
    }

    // apply movement
    const nextPosition = sum(
      this.position,
      mul([this.horizontalVelocity, this.verticalVelocity], delta / 1000)
    );
    const nextHitbox = this.getHitboxFromPosition(nextPosition);

    // TODO check for intersections
    // calculate pushback & set pos
    // pushback vers le haut => grounded
    // OR!! maybe check separately for the two directions :o
    // OR!! test all points between nextPosition && this.position
    let intersects = false;
    if (nextHitbox.y + nextHitbox.h > 550) {
      // TODO use a collider for floor
      intersects = true;
      this.isGrounded = true;
      this.verticalVelocity = 0;
    }
    if (!intersects) {
      this.position = nextPosition;
      this.hitbox = nextHitbox;
    }

    // Set state
    const oldState = this.state;
    if (this._dashingSince < this.dashDuration) {
      this.state = State.DASHING;
    } else {
      if (this.isGrounded) {
        if (this.horizontalVelocity) {
          this.state = State.WALKING;
        } else {
          this.state = State.IDLE;
        }
      } else {
        if (this.verticalVelocity < 0) {
          this.state = State.JUMPING;
        } else {
          this.state = State.FALLING;
        }
      }
    }
    if (oldState !== this.state) {
      this._animatingSince = 0;
    }
  };

  animate = (
    scene,
    spriteSheet,
    nbFrames,
    duration,
    timeEllapsed,
    position,
    cellWidth,
    cellHeight
  ) => {
    const currentLoopSince = timeEllapsed % duration;
    const currentFrame = Math.floor(currentLoopSince / (duration / nbFrames));

    scene.drawImage(
      spriteSheet,
      cellWidth * currentFrame,
      0,
      cellWidth,
      cellHeight,
      position[0],
      position[1],
      cellWidth,
      cellHeight
    );
  };

  draw = (scene) => {

    /*if ()
    this.animate(scene, resources[`res/player_spritesheet.png`], 1, this.attackDuration,
    this._timeSinceLastAttack, dif(this.position, [64, 96]), 128, 128);*/

    scene.ctx.beginPath();
    scene.ctx.rect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
    scene.ctx.strokeStyle = "#FF0000";
    scene.ctx.stroke();
  };
}
