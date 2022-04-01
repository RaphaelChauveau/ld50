import {magnitude} from "../engine/vector2.js";

class Player {
  constructor(x, y) {
    this.positionX = x;
    this.positionY = y;
    this.radius = 10;
    this.weight = 3;
    this.velocity = 90; // word units per second

    this.dirX = 1;
    this.dirY = 0;

    this.targetX = x; // init, do not move
    this.targetY = y;
  }

  // TODO copy pasted from boids (disgusting)
  expand = (others) => {
    let displacementX = 0;
    let displacementY = 0;
    for (const other of others) {
      if (this === other) {
        continue;
      }
      const toOtherX = other.positionX - this.positionX;
      const toOtherY = other.positionY - this.positionY;

      const magn = magnitude([toOtherX, toOtherY]);
      const overlap = this.radius + other.radius - magn;

      if (overlap > 0) {
        const ratio = overlap / magn;
        let share = 1;
        if (other.weight !== -1) { // not unmoveable
          share = 1 - this.weight / (this.weight + other.weight);
        }
        displacementX -= toOtherX * ratio * share;
        displacementY -= toOtherY * ratio * share;
      }
    }
    this.positionX += displacementX;
    this.positionY += displacementY;
  };


  update = (delta, inputHandler) => {
    const [mouseX, mouseY] = inputHandler.getMousePosition();
    this.targetX = mouseX;
    this.targetY = mouseY;

    // TODO ~copied from boids (ugh)
    if (this.targetX === this.positionX && this.targetY === this.positionY) {
      return;
    }
    const toTargetX = this.targetX - this.positionX;
    const toTargetY = this.targetY - this.positionY;
    const magn = magnitude([toTargetX, toTargetY]);
    this.dirX = toTargetX / magn;
    this.dirY = toTargetY / magn;

    const timedVelocity = this.velocity * delta / 1000;
    if (magn < timedVelocity) {
      return;
    }
    this.positionX += this.dirX * timedVelocity;
    this.positionY += this.dirY * timedVelocity;
  };

  draw = (scene) => {
    scene.ctx.strokeStyle = '#00DD00';
    scene.ctx.beginPath();
    scene.ctx.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
    scene.ctx.moveTo(this.positionX + this.dirX * this.radius * 2,
               this.positionY + this.dirY * this.radius * 2);
    scene.ctx.lineTo(this.positionX, this.positionY);
    scene.ctx.closePath();
    scene.ctx.stroke();
  }
}

export default Player;
