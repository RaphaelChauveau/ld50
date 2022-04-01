class Animation {
  // todo configuration object (+reset + linear/sin +...)
  constructor(duration, looping=false) {
    this._duration = duration;
    this._looping = looping;

    this._frame = 0;
  }

  // TODO switch for a start/end api ?
  // TODO hide animation logic (handled by engine) ?
  animate = () => {
    this._frame += 1;
    if (this._frame > this._duration) {
      if (this._looping) {
        this._frame = 0;
      } else {
        this._frame = this._duration;
      }
    }
  };

  // returns a value between 0 and 1 corresponding to the advancement of the animation
  getValue = () => {
    console.log(this._frame / this._duration);
    return this._frame / this._duration;
  };

  reset = () => {
    this._frame = 0;
  }
}

export default Animation;
