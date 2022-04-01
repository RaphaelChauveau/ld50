class Effect {
  constructor(duration, direction) {
    this.timeEllapsed = 1; // ms XXX 0
    this.duration = duration; // ms
    this.directionX = direction[0]; // per second
    this.directionY = direction[1];

    // todo memoize (will be called with same arguments each frame)
    this.fadeFunction = () => {
      /*
      * Returns a percentage modifier for the effect (0 <= ret <= 1)
      * Should be based on the progression (duration / timeEllapsed)
      * */
      // fade out
      const ratio = this.timeEllapsed / this.duration;
      return 1 - ratio * ratio * ratio * ratio;
    };
    this.over = false;
  }

  apply = (entity, delta) => {
    this.timeEllapsed += delta;
    if (this.timeEllapsed > this.duration) {
      this.over = true;
      return;
    }
    const fading = this.fadeFunction(this.duration, this.timeEllapsed);
    const frameMutliplier = delta * fading / 1000;

    entity.positionX += this.directionX * frameMutliplier;
    entity.positionY += this.directionY * frameMutliplier;
  }
}

export default Effect;
