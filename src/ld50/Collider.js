import Rect from "./Rect.js";

export default class Collider {
    constructor(x, y, w, h) {
      this.position = [x, y];
      this.width = w;
      this.height = h;
      this.hitbox = new Rect(x, y, w, h);
    }

    draw = (scene, resources) => {
        scene.ctx.beginPath();
        scene.ctx.rect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
        scene.ctx.strokeStyle = "#FF0000";
        scene.ctx.stroke();
    }
}