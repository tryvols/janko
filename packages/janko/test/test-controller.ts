import { inject } from "inversify";
import TelegramAPI from "node-telegram-bot-api";
import {
    TELEGRAM_API,
    AnimationHandler,
    AudioHandler,
    CallbackQueryHandler,
    ChatMemberUpdatedHandler,
    ContactHandler,
    Controller,
    DocumentHandler,
    GroupChatCreatedHandler,
    LeftChatMemberHandler,
    LocationHandler,
    MessageHandler,
    NewChatMembersHandler,
    NewChatPhotoHandler,
    PhotoHandler,
    TextHandler,
    VoiceHandler,
    CallbackQueryHandlerProps,
    ChatMemberHandlerProps,
    MessageMetadataHandlerProps
} from "../src";

@Controller()
export class TestController {

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

    @CallbackQueryHandler()
    someCallbackQueryHandler({callbackQuery}: CallbackQueryHandlerProps): void {
        console.log("Callback Query Handler!");
    }

    @AnimationHandler()
    animationHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Animation Handler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @TextHandler()
    textHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Text Hadler!");
        // console.log("Message: ", message);
        // console.log("Metadata: ", metadata);
    }

    @VoiceHandler()
    voiceHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Voice Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @AudioHandler()
    audioHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Audio Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @PhotoHandler()
    photoHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Photo Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @LocationHandler()
    locationHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Location Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @LeftChatMemberHandler()
    leftChatMemberHandler({member}: ChatMemberHandlerProps): void {
        console.log("Left Chat Member Hadler!");
        console.log("Message: ", member);
    }

    @NewChatMembersHandler()
    newChatMembersHandler({member}: ChatMemberHandlerProps): void {
        console.log("New Chat Members Hadler!");
        console.log("Message: ", member);
    }

    @NewChatPhotoHandler()
    newChatPhotoHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("New Chat Photo Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @GroupChatCreatedHandler()
    groupChatCreatedHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Group Chat Created Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @ContactHandler()
    contactHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Contact Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @DocumentHandler()
    documentHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Document Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }

    @ChatMemberUpdatedHandler()
    chatMemberUpdatedHandler({message, metadata}: MessageMetadataHandlerProps): void {
        console.log("Chat Member Updated Hadler!");
        console.log("Message: ", message);
        console.log("Metadata: ", metadata);
    }
}
