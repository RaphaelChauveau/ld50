import Rect from "./Rect.js";

export default class Hourglass {
    constructor(position, game) {
        this.position = position;
        this.game = game;
        this.hitbox = new Rect(position[0] - 24, position[1] - 32, 48, 64);
        this._collected = false;
    }

    update = (delta) => {
        if (!this._collected && this.hitbox.intersectsRect(this.game.player.hitbox)) {
            this._collected = true;
            this.game.collectHourglass(this);
        }
    }

    draw = (scene, resources) => {
        if (!this._collected) {
            scene.ctx.drawImage(resources["res/hourglass.png"].value, this.position[0] - 24, this.position[1] - 32);
        }
    }
}