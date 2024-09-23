// 拿到 stream ⾥⾯的可读可写流接⼝
const Readable = require("stream").Readable;
const Writeble = require("stream").Writable;
const rs = new Readable();
const ws = new Writeble();
let n = 0;
// ⼀次次往流⾥⾯推数据
rs.push("I ");
rs.push("Love ");
rs.push("Xiaoju Survey!\n");
rs.push(null);
// 每⼀次 push 的内容在 pipe 的时候
// 都会⾛到 _write ⽅法，在 _write ⾥⾯可以再做处理
ws._write = function (chunk, ev, cb) {
  n++;
  console.log("chunk" + n + ": " + chunk.toString());
  // chunk1: I
  // chunk2: Love
  // chunk3: Xiaoju Survey!
  cb();
};
// pipe 将两者连接起来，实现数据的持续传递，我们可以不去关⼼内部数据如何流动
rs.pipe(ws);
