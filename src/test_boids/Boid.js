import { magnitude } from "../engine/vector2.js";

const BOID_RADIUS = 10;
const VELOCITY = 60; // word units per second

export class Boid {
  constructor(x, y, r, w) {
    this.positionX = x;
    this.positionY = y;
    this.radius = r || BOID_RADIUS;
    this.weight = w || 1;

    this.range = this.radius + 10; // TODO 10 ? (should be over player radius)

    this.dirX = 1;
    this.dirY = 0;
    this.color = '#FF0000';

    this.targetX = 400;
    this.targetY = 300;

    this.state = "CHASE";
    this.attackDuration = 1000; // ms
    this.attackCooldown = 3000; // ms
    this._timeSinceLastAttack = 0; // ms (=> full cooldown on init)

    // TODO maybe have only one effect and replace it
    this.effects = [];
  }

  addEffect = (effect) => {
    this.effects.push(effect);
  };

  _applyEffects = (delta) => {
    this.effects.forEach((effect) => effect.apply(this, delta));
    this.effects.filter((effect) => !effect.over);
  };

  expand = (colliders) => {
    let displacementX = 0;
    let displacementY = 0;
    for (const collider of colliders) {
      if (this === collider) {
        continue;
      }
      const toOtherX = collider.positionX - this.positionX;
      const toOtherY = collider.positionY - this.positionY;

      const magn = magnitude([toOtherX, toOtherY]);
      const overlap = this.radius + collider.radius - magn;

      if (overlap > 0) {
        const ratio = overlap / magn;
        let share = 1;
        if (collider.weight !== -1) { // not unmoveable
          share = 1 - this.weight / (this.weight + collider.weight);
        }
        displacementX -= toOtherX * ratio * share;
        displacementY -= toOtherY * ratio * share;
      }
    }
    this.positionX += displacementX;
    this.positionY += displacementY;
  };

  update(delta, player) {
    // update timings
    this._timeSinceLastAttack += delta;

    // update effects
    this._applyEffects(delta);

    // face player
    this.targetX = player.positionX;
    this.targetY = player.positionY;

    if (this.targetX === this.positionX && this.targetY === this.positionY) {
      return; // TODO ? maybe not
    }
    const toTargetX = this.targetX - this.positionX;
    const toTargetY = this.targetY - this.positionY;
    const magn = magnitude([toTargetX, toTargetY]);
    this.dirX = toTargetX / magn;
    this.dirY = toTargetY / magn;

    switch (this.state) {
      case "CHASE": {
        if (magn < this.range) {
          if (this._timeSinceLastAttack > this.attackCooldown) {
            this._timeSinceLastAttack = 0;
            this.state = "ATTACK";
          }
          return;
        }

        let hasEffect = false;
        for (const effect of this.effects) {
          if (!effect.over) {
            hasEffect = true;
          }
        }
        if (hasEffect) {
          break;
        }

        const timedVelocity = VELOCITY * delta / 1000;
        this.positionX += this.dirX * timedVelocity;
        this.positionY += this.dirY * timedVelocity;
        break;
      }
      case "ATTACK": {
        if (this._timeSinceLastAttack > this.attackDuration) {
          this.state = "CHASE";
          return;
        }
        break;
      }
      default: {

      }
    }

  }

  draw(scene) {

    // scene.drawImage(image, this.positionX - this.radius, this.positionY - this.radius, this.radius * 2, this.radius * 2);

    scene.ctx.beginPath();
    scene.ctx.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
    scene.ctx.moveTo(this.positionX + this.dirX * this.radius * 2,
               this.positionY + this.dirY * this.radius * 2);
    scene.ctx.lineTo(this.positionX, this.positionY);
    scene.ctx.closePath();
    if (this.state === "ATTACK") {
      scene.ctx.fillStyle = this.color;
      scene.ctx.fill();
    }
    scene.ctx.strokeStyle = this.color;
    scene.ctx.stroke();
  }
}