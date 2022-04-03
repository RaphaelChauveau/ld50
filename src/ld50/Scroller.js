export default class Scroller {
    constructor(speed) {
        this.speed = speed;
        this.offset = 0;
    }

    update = (player) => {
        this.offset = (-player.position[0] * this.speed) % 800;
    }

    draw = (scene, resource) => {
        scene.ctx.drawImage(resource.value, this.offset, 0);
        scene.ctx.drawImage(resource.value, this.offset + 800, 0);
    }
}
