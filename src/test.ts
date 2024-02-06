import YoutubeClient from "./YoutubeClient";

(async () => {
  const client = new YoutubeClient();
  await client.getVideoInfo("cbqvxDTLMps");
  const caption = await client.parseTimedText("ja");
  // const filtered = await client.mergeTimedText(caption.json);
  console.log(caption?.json);
  // console.log(filtered?.json);
})();
