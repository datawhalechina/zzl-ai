const fs = require("fs");
const http = require("http");

const port = 5050;

http
  .createServer((req, res) => {
    res.writeHeader(200, { "Content-Type": "text/html; charset=UTF-8" });
    fs.createReadStream("./big.txt").pipe(res);
  })
  .listen(port, () => {
    console.log(`server is running at: http://localhost:${port}`)
  });