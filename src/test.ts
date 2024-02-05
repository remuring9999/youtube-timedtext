import YoutubeClient from "./YoutubeClient";

(async () => {
  const client = new YoutubeClient();
  await client.getVideoInfo("rDFUl2mHIW4");
  const caption = await client.parseTimedText("ko");
  const filtered = await client.mergeTimedText(caption.json);
  console.log(caption?.json);
  console.log(filtered?.json);
})();
