<<<<<<< HEAD
import YoutubeClient from "./YoutubeClient";

(async () => {
  const client = new YoutubeClient();
  await client.getVideoInfo("rDFUl2mHIW4");
  //   console.log(await client.parseTimedText("ja"));
  console.log(await client.getCaptionLangs());
})();
=======
import YoutubeClient from "./YoutubeClient";

(async () => {
  const client = new YoutubeClient();
  console.log(await client.getVideoInfo("cbqvxDTLMps"));
  console.log(await client.parseTimedText("ja"));
})();
>>>>>>> 9feba83e51843dfc3cf95f2ccda17cbdda545b79
