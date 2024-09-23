const fs = require('fs');  
const path = require('path');  
  
// 目标文件路径  
const filePath = path.join(__dirname, 'test_8MB.txt');  
  
// 每个“测试”字符串占用的字节数（UTF-8编码下，'测试'是4个字节）  
const bytesPerTest = Buffer.from('测试').length;  
  
// 计算需要多少个“测试”字符串来填满8MB（8 * 1024 * 1024字节）  
const numberOfTests = Math.ceil((8 * 1024 * 1024) / bytesPerTest);  
  
// 使用fs.writeFileSync或fs.writeFile异步写入  
// 这里使用fs.writeFileSync作为示例，因为它更简单直接  
fs.writeFileSync(filePath, '测试'.repeat(numberOfTests), { encoding: 'utf8' });  
  
console.log(`文件 ${filePath} 已生成，大小约为8MB。`);