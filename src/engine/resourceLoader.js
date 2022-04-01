import Resource from './resource.js';
import ImageResource from './imageResource.js';

// TODO basically a big dict to handle resource loading/unloading
// use ResourceLoader.load instead of Resource constructor

class ResourceLoader {
  constructor() {
    this.resources = {};
  }

  _loadResource = (resourceType) => (uri) => {
    const resource = new resourceType(uri);
    resource.loadValue();
    this.resources[uri] = resource;

    return resource;
  };

  load = this._loadResource(Resource);

  loadImage = this._loadResource(ImageResource);

  unloadAsset = (uri) => {
    delete this.resources[uri];
    // TODO not enough, free memory
  }

  // UnloadUnusedAssets
}

export default ResourceLoader;
