class Obstacle {
  constructor(x, y, r) {
    this.positionX = x;
    this.positionY = y;
    this.radius = r;
    this.weight = -1;
  }

  update = () => {

  };

  draw = (scene) => {
    scene.ctx.strokeStyle = '#FF9900';
    scene.ctx.beginPath();
    scene.ctx.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
    scene.ctx.closePath();
    scene.ctx.stroke();
  };
}

export default Obstacle;
