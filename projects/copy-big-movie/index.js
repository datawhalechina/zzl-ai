/*
  不借助三方 API
  把大文件拷贝一份
*/
const { resolve, basename } = require("path");
const FileTool = require("./lib/file");

(async function () {
  const SMAFILE = resolve(__dirname, "./video/xiaoju-small.mp4");
  const BIGFILE = resolve(__dirname, "./video/xiaoju-big.mp4");
  const TIP =
    "拷贝挂了，排除文件损坏/权限/内存不足外因素，该 API/方法 可能无法稳定胜任";
  const ft = new FileTool();

  // 先把之前测试的文件清理一波
  const copied = ["copyfile", "ficlone", "stream"];
  copied.map((item) => {
    ft.removeFile(resolve(__dirname, `./video/${item}-${basename(BIGFILE)}`));
    ft.removeFile(resolve(__dirname, `./video/${item}-${basename(SMAFILE)}`));
  });

  // 封装一个执行函数，无脑执行任务
  const runner = async (file, dest, name, via, task) => {
    try {
      console.time(`${via} ${name} 耗时`);
      await task(file, dest);
      console.timeEnd(`${via} ${name} 耗时`);
    } catch (err) {
      console.log(via, name, TIP, err);
    }
  };

  // 把三个体积的文件，用多种拷贝方法分别跑一遍
  [SMAFILE, BIGFILE].map(async (item) => {
    const name = basename(item);
    // 第一种：使用 Node 自带的 API - copyfile，拷大文件时，内存很可能就不够了
    await runner(
      item,
      `./video/copyfile-${name}`,
      name,
      "copyfile",
      ft.copyFile
    );
    // 第二种：使用 Node 的 API copyfile 传参 COPYFILE_FICLONE，拷大文件时，内存很可能就不够了
    // 尝试通过 copy-on-write(cow) 快速，底层不支持则使用备选拷贝机制，关于 cow 大家可自行搜索，如：
    await runner(
      item,
      `./video/ficlone-${name}`,
      name,
      "copyfile_ficlone",
      ft.copyFileFiclone
    );
    // 第三种，使用 stream pipe，通过流和管道拷贝文件，拷大文件时，内存不太会被吃爆。
    await runner(
      item,
      `./video/stream-${name}`,
      name,
      "stream_pipe",
      ft.copyFileStream
    );
  });
})();
