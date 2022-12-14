import { inject } from "inversify";
import TelegramAPI from "node-telegram-bot-api";
import {
    TELEGRAM_API,
    Controller,
    MessageHandler,
    TextHandler,
    MessageMetadataHandlerProps
} from "janko";

@Controller()
export class GeneralController {

    constructor(
        @inject(TELEGRAM_API) private readonly bot: TelegramAPI
    ) {}

    @MessageHandler()
    someMessageHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Message Handler!");
        // console.log("Message", message);
        // console.log("Metadata", metadata);
    }

    @TextHandler("asda")
    someTextHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Text Handler!");
        // console.log("Message", message);
        // console.log("Metadata", metadata);
    }

    @TextHandler()
    textHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Text Hadler!");
        // console.log("Message: ", message);
        // console.log("Metadata: ", metadata);
    }
}
