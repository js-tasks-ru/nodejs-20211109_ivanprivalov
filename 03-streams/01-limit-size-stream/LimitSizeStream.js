const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.dataSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.dataSize += chunk.length;

    const error = this.dataSize > this.limit ? new LimitExceededError() : null;

    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
