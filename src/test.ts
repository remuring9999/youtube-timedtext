import YoutubeClient from "./YoutubeClient";

(async () => {
  const client = new YoutubeClient();
  console.log(await client.getVideoInfo("cbqvxDTLMps"));
  console.log(await client.parseTimedText("ja"));
})();
