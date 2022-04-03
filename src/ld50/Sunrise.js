export default class Sunrise {
    constructor() {
        this.risingSince = 0;
        this.risingDuration = 20_000;

        this._startHeight = 600;
        this._endHeight = 300;
    }

    update = (delta) => {
        this.risingSince += delta;
        if (this.risingSince > this.risingDuration) {
            this.risingSince = this.risingDuration;
            // TODO loose
        }
    }

    draw = (scene) => {
        const percentage = this.risingSince / this.risingDuration;
        const sunHeight = this._startHeight + (this._endHeight - this._startHeight) * percentage
        
        scene.ctx.beginPath();
        scene.ctx.fillStyle = "#2d5b85";
        scene.ctx.arc(100, sunHeight, 450, 0, 2 * Math.PI);
        scene.ctx.fill();

        scene.ctx.beginPath();
        scene.ctx.fillStyle = "#49b2d3";
        scene.ctx.arc(100, sunHeight, 200, 0, 2 * Math.PI);
        scene.ctx.fill();

        scene.ctx.beginPath();
        scene.ctx.fillStyle = "#bdeef7";
        scene.ctx.arc(100, sunHeight, 100, 0, 2 * Math.PI);
        scene.ctx.fill();

        scene.ctx.beginPath();
        scene.ctx.fillStyle = "#fce886";
        scene.ctx.arc(100, sunHeight, 60, 0, 2 * Math.PI);
        scene.ctx.fill();
    }
}