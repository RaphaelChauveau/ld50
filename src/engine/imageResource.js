import Resource, { LOADING_STATUS } from './resource.js';

class ImageResource extends Resource {
  loadValue = () => {
    this.status = LOADING_STATUS.LOADING;
    const img = new Image();
    img.addEventListener('load', () => {
      this.status = LOADING_STATUS.LOADED;
    }, false);
    img.src = this.uri;
    this.value = img;
  };
}

export default ImageResource;
