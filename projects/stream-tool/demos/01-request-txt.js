const fs = require("fs");
const http = require("http");
const port = 5050;
http
  .createServer((req, res) => {
    res.writeHeader(200, { "Content-Type": "text/html; charset=UTF-8" });
    // 1. 把⽂件内容全部读⼊内存
    fs.readFile("./big.txt", (err, data) => {
      // 2. 通过 res 批量返回
      res.end(data);
    });
  })
  .listen(port, () => {
    console.log(`server is running at: http://localhost:${port}`)
  });

  