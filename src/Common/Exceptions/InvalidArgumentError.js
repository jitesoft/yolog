class InvalidArgumentError extends Error {
  constructor (msg) {
    super();
    this.message = msg;
  }
}

export {
  InvalidArgumentError

};
