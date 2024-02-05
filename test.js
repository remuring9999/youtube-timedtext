const YoutubeClinet = require("./dist/YoutubeClient").default;

(async () => {
  const client = new YoutubeClinet();
  await client.getVideoInfo("rDFUl2mHIW4");
  // console.log(await client.getCaptionLangs());
  const caption = await client.parseTimedText("ko");
  const merged = await client.mergeTimedText(caption);
  console.log(merged);
})();
