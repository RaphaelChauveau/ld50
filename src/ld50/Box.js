import Collider from "./Collider.js";

export default class Box {
  constructor(position, isMetal=false) {
    this.position = position;
    this.isMetal = isMetal;
    this.collider = new Collider(
      position[0] - 32,
      position[1] - 32,
      64,
      64,
      !isMetal
    );
  }

  draw = (scene, resources) => {
    if (this.collider.enabled) {
      scene.drawImage(
        resources[`res/box${this.isMetal ? '_metal' : ''}.png`],
        this.collider.hitbox.x,
        this.collider.hitbox.y,
        64,
        64
      );
      //this.collider.draw(scene);
    }
  };
}
