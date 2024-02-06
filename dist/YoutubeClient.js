"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
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
            const ei = originData.split("ei=")[1].split("\\u0026")[0];
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
            // console.log(timedText.data);
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
            let message = error.message;
            if (error.message == "Unexpected end of JSON input")
                message = "Not Found Caption.";
            if (error.message == "Request failed with status code 404")
                message = "Not Found Caption.";
            return {
                success: false,
                error: message,
            };
        }
    }
    async getCaptionLangs() {
        if (!this.v || !this.ei)
            throw new Error("Call getVideoInfo first.\nNot Found Video Info.");
        try {
            const captionLangs = await this.client.get(`https://www.youtube.com/api/timedtext?v=${this.v}${this.urlPath}&type=list`, { responseType: "text" });
            const json = await (0, xml2js_1.parseStringPromise)(captionLangs.data);
            const filtered = json.transcript_list.track.map((track) => {
                return {
                    lang_code: track.$.lang_code,
                    lang_translated: track.$.lang_translated,
                };
            });
            return {
                sucess: true,
                json: filtered,
            };
        }
        catch (error) {
            console.error(error);
            return {
                success: false,
            };
        }
    }
    async mergeTimedText(timedText) {
        if (!this.v || !this.ei)
            throw new Error("Call getVideoInfo first.\nNot Found Video Info.");
        let merged = [];
        let mergedText = "";
        let mergedStart = 0;
        let mergedDur = 0;
        for (let i = 0; i < timedText.length; i++) {
            if (mergedText === "") {
                mergedText = timedText[i].text;
                mergedStart = timedText[i].start;
                mergedDur = timedText[i].dur;
            }
            else if (mergedText === timedText[i].text) {
                mergedDur += timedText[i].dur;
            }
            else {
                merged.push({
                    start: mergedStart,
                    dur: mergedDur,
                    text: mergedText,
                });
                mergedText = timedText[i].text;
                mergedStart = timedText[i].start;
                mergedDur = timedText[i].dur;
            }
        }
        if (mergedText !== "") {
            merged.push({
                start: mergedStart,
                dur: mergedDur,
                text: mergedText,
            });
            return {
                success: true,
                json: merged,
            };
        }
    }
}
exports.default = YoutubeClient;
