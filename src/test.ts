import YoutubeClient from "./YoutubeClient";

(async () => {
  const client = new YoutubeClient();
  await client.getVideoInfo("fgSXAKsq-Vo");
  const caption = await client.parseTimedText("ja");
  const filtered = await client.mergeTimedText(caption.json);
  // console.dir(caption?.json, { maxArrayLength: null });
  console.log(filtered?.json);
})();
