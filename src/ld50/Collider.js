import Rect from "./Rect.js";

export default class Collider {
    constructor(x, y, w, h, isDestructible = false) {
      this.position = [x, y];
      this.hitbox = new Rect(x, y, w, h);
      this.enabled = true;
      this.isDestructible = isDestructible;
    }

    intersectsRect = (rect) => {
        return this.enabled && this.hitbox.intersectsRect(rect)
    }

    destruct = () => {
        if (this.isDestructible) {
            this.enabled = false;
        }
    }

    draw = (scene, resources) => {
        /*scene.ctx.beginPath();
        scene.ctx.rect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
        scene.ctx.strokeStyle = "#FF0000";
        scene.ctx.stroke();*/
    }
}