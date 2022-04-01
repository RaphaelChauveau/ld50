export const LOADING_STATUS = {
  NOT_LOADED: 'NOT_LOADED', // todo useless ?
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  FAILED: 'FAILED',
};

class Resource {
  constructor(uri) {
    console.log('tut tut', this);
    this.uri = uri;
    this.status = LOADING_STATUS.LOADING;
    this.value = null;
  }

  // TODO override
  loadValue = () => {
    console.log('caca');
  };
}

export default Resource;
