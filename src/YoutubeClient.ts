import axios, { AxiosInstance } from "axios";

class YoutubeClient {
  public client: AxiosInstance;
  public v!: string;
  public ei!: string;
  public expire!: string;
  public opi!: string;
  public signature!: string;
  public urlPath!: string;
  public constructor() {
    this.client = axios.create({
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
  }

  public async getVideoInfo(v: string) {
    try {
      const originData: string = await this.client
        .get(`https://www.youtube.com/watch?v=${v}`, {
          responseType: "text",
        })
        .then((res) => res.data);

      const ei = originData.split("ei%3D")[1].split("%26")[0];
      const expire = originData.split("expire=")[1].split("\\u0026")[0];
      const opi = originData.split("opi=")[1].split("\\u0026")[0];
      const signature = originData.split("signature=")[1].split("\\u0026")[0];
      const urlPath = originData
        .split('"baseUrl":"https://www.youtube.com/api/timedtext?v=' + v)[1]
        .split('"')[0]
        .replace(/\\u0026/g, "&")
        .split("&lang=")[0];

      this.v = v;
      this.ei = ei;
      this.expire = expire;
      this.opi = opi;
      this.signature = signature;
      this.urlPath = urlPath;

      return {
        success: true,
        ei,
        expire,
        opi,
        signature,
        urlPath,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  public async parseTimedText(hl: string) {
    if (!this.v || !this.ei)
      throw new Error("Call getVideoInfo first.\nNot Found Video Info.");

    try {
      const timedText = await this.client.get(
        `https://www.youtube.com/api/timedtext?v=${this.v}${this.urlPath}&lang=${hl}&fmt=json3`,
        { responseType: "text" }
      );

      const json = JSON.parse(timedText.data).events.map((event: any) => {
        return {
          start: event.tStartMs,
          dur: event.dDurationMs,
          text: event.segs.map((seg: any) => seg.utf8).join(""),
        };
      });

      return {
        success: true,
        json,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
      };
    }
  }
}

export default YoutubeClient;
