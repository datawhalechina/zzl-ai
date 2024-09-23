const ffmpeg = require("fluent-ffmpeg");
const ffprobe = require("ffprobe-static");

ffmpeg.setFfprobePath(ffprobe.path);

ffmpeg.ffprobe("./video/demo.mp4", function (err, metadata) {
  if (err) {
    console.error("Error occurred:", err);
    return;
  }

  const duration = metadata.format.duration;

  console.log("视频总时长（秒）:", duration);
});
