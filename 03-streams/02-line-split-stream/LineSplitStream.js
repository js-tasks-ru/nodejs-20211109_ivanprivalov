const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding;
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    const currentString = chunk.toString(this.encoding);

    [...currentString].forEach((char) => {
      this.data += char;
      if (char === os.EOL) this._pushData();
    });

    callback();
  }

  _flush(callback) {
    this._pushData();
    callback();
  }

  _pushData() {
    if (this.data) this.push(this.data.replaceAll(os.EOL, ''));
    this.data = '';
  }
}

module.exports = LineSplitStream;
