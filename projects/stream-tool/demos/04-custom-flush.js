const stream = require("stream");
class ReadStream extends stream.Readable {
  constructor() {
    super();
  }
  _read() {
    this.push("I ");
    this.push("Love ");
    this.push("Xiaoju Survey!\n");
    this.push(null);
  }
}
class WriteStream extends stream.Writable {
  constructor() {
    super();
    this._storage = Buffer.from("");
  }
  _write(chunk, encode, cb) {
    console.log(chunk.toString());
    cb();
  }
}

class TransformStream extends stream.Transform {
  constructor() {
    super();
    this._storage = Buffer.from("");
  }
  _transform(chunk, encode, cb) {
    this.push(chunk);
    cb();
  }
  _flush(cb) {
    this.push("Oh Yeah!");
    cb();
  }
}

const rs = new ReadStream();

const ws = new WriteStream();
const ts = new TransformStream();
rs.pipe(ts).pipe(ws);
