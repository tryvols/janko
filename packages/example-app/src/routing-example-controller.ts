import { inject } from "inversify";
import TelegramAPI from "node-telegram-bot-api";
import {
    TELEGRAM_API,
    Controller,
    MessageHandler,
    TextHandler,
    MessageMetadataHandlerProps
} from "janko";

const EndsWithCustomTextHandler = (route: string) => TextHandler({
    useWhen: props => props.message?.text?.endsWith(route)
});

/**
 * This is a controller with different routing examples!
 */
@Controller()
export class RoutingExampleController {

    constructor(
        @inject(TELEGRAM_API) private readonly bot: TelegramAPI
    ) {}

    @TextHandler("test command")
    someTextHandler({message}: MessageMetadataHandlerProps): void {
        /**
         * This handler will be executed when user will send a message that
         * contains `test command` substring.
         * 
         * If you need another behavior - you can extend AvailableHandlersProvider class
         * and override methods that manages this default behavior.
         */
        console.log("First routed text Handler!");

        this.bot.sendMessage(message.chat.id, "First `test command` handler applied!");
    }

    @TextHandler("test command")
    secondTextHandler({message}: MessageMetadataHandlerProps): void {
        /**
         * You can make any amount of handlers with the same routing config!
         */
        console.log("Second routed text Hadler!");

        this.bot.sendMessage(message.chat.id, "Second `test command` handler applied!");
    }

    @TextHandler()
    firstCommonTextHandler({message}: MessageMetadataHandlerProps): void {
        /**
         * This handler will handle any text event (when user send a simple message).
         */
        console.log("First common text Hadler!");

        this.bot.sendMessage(message.chat.id, "First common text handler applied!");
    }

    @TextHandler()
    secondCommonTextHandler({message, metadata}: MessageMetadataHandlerProps): void {
        /**
         * And you can make any amount of common handlers
         * (it handles any message that are handling of the current handler's event type)
         * 
         * But take care about order. It's random!
         */
        console.log("Second common text Hadler!");

        this.bot.sendMessage(message.chat.id, "Second common text handler applied!");
    }

    @MessageHandler()
    someMessageHandler({message, metadata}: MessageMetadataHandlerProps): void {
        /**
         * Message handler is handling many events that are subtypes of messages:
         * - Message
         * - Animation
         * - Text
         * - And others...
         */
        console.log("Message Handler!");

        this.bot.sendMessage(message.chat.id, "Message handler applied!");
    }

    @TextHandler({useWhen: props => props.message?.text?.startsWith("starts-with")})
    customRoutingRuleHandler({message}: MessageMetadataHandlerProps): void {
        /**
         * You are able to make your own custom routing rules based on `useWhen` parameter!
         * This gives you really awesome flexibility on how you are making your routing!
         */
        console.log("Custom Routing Rule Handler!");

        this.bot.sendMessage(message.chat.id, "Text handler with custom routing `start-with` rule applied!");
    }

    @EndsWithCustomTextHandler("ends-with")
    customRoutingDecoratorHandler({message}: MessageMetadataHandlerProps): void {
        /**
         * Of cause it's not pretty to have `useWhen` rule in props
         * so you can make you own custom decorator based on available decorators!
         * 
         * Looks pretty nice, isn't it?
         */
        console.log("Ends With Custom Text Handler!");

        this.bot.sendMessage(message.chat.id, "Text handler with custom routing `ends-with` rule applied!");
    }
}
