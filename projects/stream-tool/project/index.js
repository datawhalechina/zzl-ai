const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')

class VideoTool {
  constructor(inputPath, outputPath) {
    this.inputPath = inputPath;
    this.outputPath = outputPath;
  }

  convertToMp3() {
    console.log("开始转换视频为音频...");

    const outputStream = fs.createWriteStream(this.outputPath);

    outputStream.on('error', (error) => {
      console.error('写入文件错误:', error);
    });

    outputStream.on('open', () => {
      console.log('写入文件流已打开:', this.outputPath);
    });

    outputStream.on('close', () => {
      console.log('写入文件流已关闭');
    });

    ffmpeg()
      .input(this.inputPath)
      .toFormat('mp3')
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .on('end', () => {
        console.log('转换成功:', this.outputPath);
      })
      .on('error', (err) => {
        console.error('转换错误:', err.message);
      })
      .pipe(outputStream)

  }
}

const input = path.resolve(__dirname, "./input.mp4");
const output = path.resolve(__dirname, './output.mp3');
const m = new VideoTool(input, output);

m.convertToMp3();
