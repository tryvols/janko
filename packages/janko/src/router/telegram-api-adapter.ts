import TelegramAPI from "node-telegram-bot-api";
import { HandlerTypes } from "../constants";
import { assertNever } from "../helpers";
import {
    HandlerData,
    OriginalCallbackQueryHandlerDescriptor,
    OriginalChatJoinRequestHandlerDescriptor,
    OriginalChatMemberHandlerDescriptor,
    OriginalChosenInlineResultHandlerDescriptor,
    OriginalErrorHandlerDescriptor,
    OriginalHandlerDescriptor,
    OriginalInlineQueryHandlerDescriptor,
    OriginalMessageHandlerDescriptor,
    OriginalMessageMetadataHandlerDescriptor,
    OriginalPollAnswerHandlerDescriptor,
    OriginalPreCheckoutQueryHandlerDescriptor,
    OriginalShippingQueryHandlerDescriptor
} from "../interfaces";

export class TelegramApiAdapter {
    constructor(
        private readonly telegramApi: TelegramAPI,
        private readonly eventHandler: (data: HandlerData) => void
    ) {
        this.registerHandlers();
    }

    private getHandlerAdapter<D extends OriginalHandlerDescriptor>(handlerType: D["type"]): D["handler"] {
        switch (handlerType) {
            case HandlerTypes.Animation:
            case HandlerTypes.Message:
            case HandlerTypes.Audio:
            case HandlerTypes.ChannelChatCreated:
            case HandlerTypes.ChatInviteLink:
            case HandlerTypes.ChatMemberUpdated:
            case HandlerTypes.Contact:
            case HandlerTypes.DeleteChatPhoto:
            case HandlerTypes.Document:
            case HandlerTypes.Game:
            case HandlerTypes.GroupChatCreated:
            case HandlerTypes.Invoice:
            case HandlerTypes.LeftChatMember:
            case HandlerTypes.Location:
            case HandlerTypes.MessageAutoDeleteTimerChanged:
            case HandlerTypes.MigrateFromChatId:
            case HandlerTypes.MigrateToChatId:
            case HandlerTypes.NewChatMembers:
            case HandlerTypes.NewChatPhoto:
            case HandlerTypes.NewChatTitle:
            case HandlerTypes.PassportData:
            case HandlerTypes.Photo:
            case HandlerTypes.PinnedMessage:
            case HandlerTypes.Sticker:
            case HandlerTypes.SuccessfulPayment:
            case HandlerTypes.SupergroupChatCreated:
            case HandlerTypes.Text:
            case HandlerTypes.Video:
            case HandlerTypes.VideoChatEnded:
            case HandlerTypes.VideoChatParticipantsInvited:
            case HandlerTypes.VideoChatScheduled:
            case HandlerTypes.VideoChatStarted:
            case HandlerTypes.VideoNote:
            case HandlerTypes.Voice:
            case HandlerTypes.WebAppData:
                return (message: TelegramAPI.Message, metadata: TelegramAPI.Metadata): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        message,
                        metadata
                    });
                };
            case HandlerTypes.ChannelPost:
            case HandlerTypes.EditedChannelPost:
            case HandlerTypes.EditedChannelPostCaption:
            case HandlerTypes.EditedChannelPostText:
            case HandlerTypes.EditedMessage:
            case HandlerTypes.EditedMessageCaption:
            case HandlerTypes.EditedMessageText:
                return (message: TelegramAPI.Message): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        message
                    });
                };
            case HandlerTypes.ChatMember:
            case HandlerTypes.MyChatMember:
                return (member: TelegramAPI.ChatMemberUpdated): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        member
                    });
                };
            case HandlerTypes.Error:
            case HandlerTypes.PollingError:
            case HandlerTypes.WebhookError:
                return (error: Error): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        error
                    });
                };
            case HandlerTypes.CallbackQuery:
                return (callbackQuery: TelegramAPI.CallbackQuery): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        callbackQuery
                    });
                };
            case HandlerTypes.ChatJoinRequest:
                return (chatJoinRequest: TelegramAPI.ChatJoinRequest): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        chatJoinRequest
                    });
                };
            case HandlerTypes.ChosenInlineResult:
                return (chosenInlineResult: TelegramAPI.ChosenInlineResult): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        chosenInlineResult
                    });
                };
            case HandlerTypes.InlineQuery:
                return (inlineQuery: TelegramAPI.InlineQuery): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        inlineQuery
                    });
                };
            case HandlerTypes.PollAnswer:
                return (pollAnswer: TelegramAPI.PollAnswer): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        pollAnswer
                    });
                };
            case HandlerTypes.PreCheckoutQuery:
                return (preCheckoutQuery: TelegramAPI.PreCheckoutQuery): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        preCheckoutQuery
                    });
                };
            case HandlerTypes.ShippingQuery:
                return (shippingQuery: TelegramAPI.ShippingQuery): void => {
                    this.eventHandler({
                        handlerDescriptor: { type: handlerType },
                        shippingQuery
                    });
                };
            default:
                assertNever(handlerType);
        }
    }

    private registerHandlers() {
        Object.values(HandlerTypes).forEach(type => {
            switch (type) {
                case HandlerTypes.Animation:
                    return this.telegramApi.on(
                        "animation",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.Audio:
                    return this.telegramApi.on(
                        "audio",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.CallbackQuery:
                    return this.telegramApi.on(
                        "callback_query",
                        this.getHandlerAdapter<OriginalCallbackQueryHandlerDescriptor>(type)
                    );
                case HandlerTypes.ChannelChatCreated:
                    return this.telegramApi.on(
                        "channel_chat_created",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.ChannelPost:
                    return this.telegramApi.on(
                        "channel_post",
                        this.getHandlerAdapter<OriginalMessageHandlerDescriptor>(type)
                    );
                case HandlerTypes.ChatInviteLink:
                    return this.telegramApi.on(
                        "chat_invite_link",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.ChatJoinRequest:
                    return this.telegramApi.on(
                        "chat_join_request",
                        this.getHandlerAdapter<OriginalChatJoinRequestHandlerDescriptor>(type)
                    );
                case HandlerTypes.ChatMember:
                    return this.telegramApi.on(
                        "chat_member",
                        this.getHandlerAdapter<OriginalChatMemberHandlerDescriptor>(type)
                    );
                case HandlerTypes.ChatMemberUpdated:
                    return this.telegramApi.on(
                        "chat_member_updated",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.ChosenInlineResult:
                    return this.telegramApi.on(
                        "chosen_inline_result",
                        this.getHandlerAdapter<OriginalChosenInlineResultHandlerDescriptor>(type)
                    );
                case HandlerTypes.Contact:
                    return this.telegramApi.on(
                        "contact",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.DeleteChatPhoto:
                    return this.telegramApi.on(
                        "delete_chat_photo",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.Document:
                    return this.telegramApi.on(
                        "document",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.EditedChannelPost:
                    return this.telegramApi.on(
                        "edited_channel_post",
                        this.getHandlerAdapter<OriginalMessageHandlerDescriptor>(type)
                    );
                case HandlerTypes.EditedChannelPostCaption:
                    return this.telegramApi.on(
                        "edited_channel_post_caption",
                        this.getHandlerAdapter<OriginalMessageHandlerDescriptor>(type)
                    );
                case HandlerTypes.EditedChannelPostText:
                    return this.telegramApi.on(
                        "edited_channel_post_text",
                        this.getHandlerAdapter<OriginalMessageHandlerDescriptor>(type)
                    );
                case HandlerTypes.EditedMessage:
                    return this.telegramApi.on(
                        "edited_message",
                        this.getHandlerAdapter<OriginalMessageHandlerDescriptor>(type)
                    );
                case HandlerTypes.EditedMessageCaption:
                    return this.telegramApi.on(
                        "edited_message_caption",
                        this.getHandlerAdapter<OriginalMessageHandlerDescriptor>(type)
                    );
                case HandlerTypes.EditedMessageText:
                    return this.telegramApi.on(
                        "edited_message_text",
                        this.getHandlerAdapter<OriginalMessageHandlerDescriptor>(type)
                    );
                case HandlerTypes.Error:
                    return this.telegramApi.on(
                        "error",
                        this.getHandlerAdapter<OriginalErrorHandlerDescriptor>(type)
                    );
                case HandlerTypes.Game:
                    return this.telegramApi.on(
                        "game",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.GroupChatCreated:
                    return this.telegramApi.on(
                        "group_chat_created",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.InlineQuery:
                    return this.telegramApi.on(
                        "inline_query",
                        this.getHandlerAdapter<OriginalInlineQueryHandlerDescriptor>(type)
                    );
                case HandlerTypes.Invoice:
                    return this.telegramApi.on(
                        "invoice",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.LeftChatMember:
                    return this.telegramApi.on(
                        "left_chat_member",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.Location:
                    return this.telegramApi.on(
                        "location",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.Message:
                    return this.telegramApi.on(
                        "message",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.MessageAutoDeleteTimerChanged:
                    return this.telegramApi.on(
                        "message_auto_delete_timer_changed",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.MigrateFromChatId:
                    return this.telegramApi.on(
                        "migrate_from_chat_id",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.MigrateToChatId:
                    return this.telegramApi.on(
                        "migrate_to_chat_id",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.MyChatMember:
                    return this.telegramApi.on(
                        "my_chat_member",
                        this.getHandlerAdapter<OriginalChatMemberHandlerDescriptor>(type)
                    );
                case HandlerTypes.NewChatMembers:
                    return this.telegramApi.on(
                        "new_chat_members",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.NewChatPhoto:
                    return this.telegramApi.on(
                        "new_chat_photo",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.NewChatTitle:
                    return this.telegramApi.on(
                        "new_chat_title",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.PassportData:
                    return this.telegramApi.on(
                        "passport_data",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.Photo:
                    return this.telegramApi.on(
                        "photo",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.PinnedMessage:
                    return this.telegramApi.on(
                        "pinned_message",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.PollAnswer:
                    return this.telegramApi.on(
                        "poll_answer",
                        this.getHandlerAdapter<OriginalPollAnswerHandlerDescriptor>(type)
                    );
                case HandlerTypes.PollingError:
                    return this.telegramApi.on(
                        "polling_error",
                        this.getHandlerAdapter<OriginalErrorHandlerDescriptor>(type)
                    );
                case HandlerTypes.PreCheckoutQuery:
                    return this.telegramApi.on(
                        "pre_checkout_query",
                        this.getHandlerAdapter<OriginalPreCheckoutQueryHandlerDescriptor>(type)
                    );
                case HandlerTypes.ShippingQuery:
                    return this.telegramApi.on(
                        "shipping_query",
                        this.getHandlerAdapter<OriginalShippingQueryHandlerDescriptor>(type)
                    );
                case HandlerTypes.Sticker:
                    return this.telegramApi.on(
                        "sticker",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.SuccessfulPayment:
                    return this.telegramApi.on(
                        "successful_payment",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.SupergroupChatCreated:
                    return this.telegramApi.on(
                        "supergroup_chat_created",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.Text:
                    return this.telegramApi.on(
                        "text",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.Video:
                    return this.telegramApi.on(
                        "video",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.VideoChatEnded:
                    return this.telegramApi.on(
                        "video_chat_ended",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.VideoChatParticipantsInvited:
                    return this.telegramApi.on(
                        "video_chat_participants_invited",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.VideoChatScheduled:
                    return this.telegramApi.on(
                        "video_chat_scheduled",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.VideoChatStarted:
                    return this.telegramApi.on(
                        "video_chat_started",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.VideoNote:
                    return this.telegramApi.on(
                        "video_note",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.Voice:
                    return this.telegramApi.on(
                        "voice",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.WebAppData:
                    return this.telegramApi.on(
                        "web_app_data",
                        this.getHandlerAdapter<OriginalMessageMetadataHandlerDescriptor>(type)
                    );
                case HandlerTypes.WebhookError:
                    return this.telegramApi.on(
                        "webhook_error",
                        this.getHandlerAdapter<OriginalErrorHandlerDescriptor>(type)
                    );
                default:
                    return assertNever(type);
            }
        });
    }
}
