/*
  不借助三方 API
  把大文件拷贝一份
*/
const fs = require('fs')
const util = require('util')
const copyFile = util.promisify(fs.copyFile)
const COPYFILE_FICLONE = fs.constants.COPYFILE_FICLONE

class FileTool {
  removeFile (dest) {
    if (dest && fs.existsSync(dest)) {
      try {
        fs.unlinkSync(dest)
        console.log(`已删除 ${dest}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  copyFile (file, dest) {
    return copyFile(file, dest)
  }

  copyFileFiclone (file, dest) {
    return copyFile(file, dest, COPYFILE_FICLONE)
  }

  copyFileStream (file, dest) {
    return new Promise((resolve, reject) => {
      const rs = fs.createReadStream(file);
      const ws = fs.createWriteStream(dest);
  
      rs.on('error', reject);
      ws.on('error', reject);
  
      ws.on('finish', resolve);
  
      rs.pipe(ws);
    });
  }
}

module.exports = FileTool
