const YoutubeClinet = require("./dist/YoutubeClient").default;

(async () => {
  const client = new YoutubeClinet();
  await client.getVideoInfo("KWlVo8mWPJs");
  console.log(await client.parseTimedText("ko"));
})();
