"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class YoutubeClient {
    constructor() {
        this.client = axios_1.default.create({
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            },
        });
    }
    async getVideoInfo(v) {
        try {
            const originData = await this.client
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
        }
        catch (error) {
            return {
                success: false,
                error,
            };
        }
    }
    async parseTimedText(hl) {
        if (!this.v || !this.ei)
            throw new Error("Call getVideoInfo first.\nNot Found Video Info.");
        try {
            const timedText = await this.client.get(`https://www.youtube.com/api/timedtext?v=${this.v}${this.urlPath}&lang=${hl}&fmt=json3`, { responseType: "text" });
            const json = JSON.parse(timedText.data).events.map((event) => {
                return {
                    start: event.tStartMs,
                    dur: event.dDurationMs,
                    text: event.segs.map((seg) => seg.utf8).join(""),
                };
            });
            return {
                success: true,
                json,
            };
        }
        catch (error) {
            // console.error(error);
            return {
                success: false,
            };
        }
    }
}
exports.default = YoutubeClient;
//https://www.youtube.com/api/timedtext?v=cbqvxDTLMps&ei=4jrAZaX4IPHy7OsP8Jql2Ak&opi=112496729&xoaf=5&hl=ko&ip=0.0.0.0&ipbits=0&expire=1707122002&sparams=ip,ipbits,expire,v,ei,opi,xoaf&signature=AA6E0B3CF9AB77A6AD2BA57234BCCD9E025A5434.D05737E870D46527339DBD7E2590B1E3910D3388&key=yt8&lang=ja
