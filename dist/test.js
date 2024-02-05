"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const YoutubeClient_1 = __importDefault(require("./YoutubeClient"));
(async () => {
    const client = new YoutubeClient_1.default();
    await client.getVideoInfo("fgSXAKsq-Vo");
    console.log(await client.parseTimedText("ko"));
    console.log(await client.getCaptionLangs());
})();
