export default class Sunrise {
  constructor() {
    this.risePercentage = 0;
    this._follow_percentage = 0;

    this._startHeight = 600;
    this._endHeight = 200;

    this._animatingSince = 0;
  }

  update = (delta, risePercentage) => {
    this._animatingSince += delta;

    this.risePercentage = risePercentage;
    const percentageDiff = this.risePercentage - this._follow_percentage;
    this._follow_percentage +=
      (Math.min(
        Math.max(this.risePercentage - this._follow_percentage, -0.06),
        0.06
      ) *
        delta) /
      1000;
  };

  animate = (
    // should definitively be in scene =(
    scene,
    spriteSheet,
    nbFrames,
    duration,
    timeEllapsed,
    position,
    cellWidth,
    cellHeight,
    zoom = 1
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
      cellWidth * zoom,
      cellHeight * zoom
    );
  };

  draw = (scene, resources) => {
    const sunHeight =
      this._startHeight +
      (this._endHeight - this._startHeight) * this._follow_percentage;
    //const sunHeight = this._endHeight;

    scene.ctx.beginPath();
    scene.ctx.fillStyle = "#2d5b85";
    scene.ctx.arc(
      100,
      sunHeight,
      450 + 450 * this._follow_percentage,
      0,
      2 * Math.PI
    );
    scene.ctx.fill();

    scene.ctx.beginPath();
    scene.ctx.fillStyle = "#49b2d3";
    scene.ctx.arc(
      100,
      sunHeight,
      200 + 250 * this._follow_percentage,
      0,
      2 * Math.PI
    );
    scene.ctx.fill();

    /*scene.ctx.beginPath();
    scene.ctx.fillStyle = "#fce886";
    scene.ctx.arc(
      100,
      sunHeight,
      60 + 60 * this._follow_percentage,
      0,
      2 * Math.PI
    );
    scene.ctx.fill();*/

    const sunWidth = 60 + 60 * this._follow_percentage;
    /*this.animate(
      scene,
      resources[`res/sun.png`],
      1,
      1000,
      this._animatingSince % 1000,
      [,],
      120,
      120,
      (1 + this._follow_percentage) * 2
    );*/

    scene.drawImage(
      resources[`res/sun.png`],
      0,
      0,
      240,
      240,
      100 - 120 * (1 + this._follow_percentage),
      sunHeight - 120 * (1 + this._follow_percentage),
      240 * (1 + this._follow_percentage),
      240 * (1 + this._follow_percentage)
    );

    const remainingTime = 20_000 * (1 - this.risePercentage);
    scene.ctx.font = "60px Arial Black";
    scene.ctx.fillStyle = "red";
    scene.ctx.textAlign = "center";
    scene.ctx.fillText(
      `${Math.trunc(remainingTime / 1000)}:${Math.trunc(
        (remainingTime % 1000) / 100
      )}`,
      100,
      sunHeight
    );

    // TODO remaining time on sun ! lol

    scene.ctx.drawImage(
      resources["res/moon.png"].value,
      650 + 250 * this._follow_percentage,
      30
    );
  };
}
