"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const YoutubeClient_1 = __importDefault(require("./YoutubeClient"));
(async () => {
    const client = new YoutubeClient_1.default();
    await client.getVideoInfo("cbqvxDTLMps");
    const caption = await client.parseTimedText("ja");
    // const filtered = await client.mergeTimedText(caption.json);
    console.log(caption?.json);
    // console.log(filtered?.json);
})();
