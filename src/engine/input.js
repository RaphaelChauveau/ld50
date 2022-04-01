class Input {
  constructor(canvas) {
    this._keyStates = {};
    this._justUpdated = {};
    this._mousePosition = [0, 0]; // init value
    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('keyup', this._handleKeyUp);
    canvas.addEventListener('mousemove', this._handleMouseMove);
    canvas.addEventListener('mouseclick', this._handleMouseMove);
    canvas.addEventListener('mousedown', this._handleMouseDown);
    canvas.addEventListener('mouseup', this._handleMouseUp);
  }

  _handleMouseDown = (e) => {
    // TODO copied from _handleKeyDown (ughhh)
    const keyCode = "MOUSE_CLICK";
    console.log(keyCode);
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (!wasKeyPressed) {
      this._keyStates[keyCode] = true;
      this._justUpdated[keyCode] = true;
    }
  };

  _handleMouseUp = (e) => {
    // TODO same
    const keyCode = "MOUSE_CLICK";
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (wasKeyPressed) {
      this._keyStates[keyCode] = false;
      this._justUpdated[keyCode] = false;
    }
  };

  _handleKeyDown = (e) => {
    const keyCode = e.code;
    console.log(keyCode);
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (!wasKeyPressed) {
      this._keyStates[keyCode] = true;
      this._justUpdated[keyCode] = true;
    }
  };

  _handleKeyUp = (e) => {
    const keyCode = e.code;
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (wasKeyPressed) {
      this._keyStates[keyCode] = false;
      this._justUpdated[keyCode] = false;
    }
  };

  _handleMouseMove = (e) => {
    this._mousePosition = [e.offsetX, e.offsetY];
  };

  newFrame = () => {
    this._justUpdated = {};
  };

  clean() {
    // TODO remove listeners
    // window.removeEventListener('toot', this._handleKeyDown);
  }

  getKey = (keyCode) => {
    return this._keyStates[keyCode] || false;
  };

  getKeyDown = (keyCode) => {
    return this._justUpdated[keyCode] === true;
  };

  getKeyUp = (keyCode) => {
    return this._justUpdated[keyCode] === false;
  };

  getMousePosition = () => {
    return this._mousePosition;
  }

  // TODO mouse clicks
}

export default Input;
