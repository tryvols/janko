import TelegramAPI from "node-telegram-bot-api";
import { HandlerTypes } from "../constants";

/**
 * Original handlers interfaces
 */
export type MessageMetadataHandlers =
    | HandlerTypes.Animation
    | HandlerTypes.Message
    | HandlerTypes.Audio
    | HandlerTypes.ChannelChatCreated
    | HandlerTypes.ChatInviteLink
    | HandlerTypes.ChatMemberUpdated
    | HandlerTypes.Contact
    | HandlerTypes.DeleteChatPhoto
    | HandlerTypes.Document
    | HandlerTypes.Game
    | HandlerTypes.GroupChatCreated
    | HandlerTypes.Invoice
    | HandlerTypes.LeftChatMember
    | HandlerTypes.Location
    | HandlerTypes.MessageAutoDeleteTimerChanged
    | HandlerTypes.MigrateFromChatId
    | HandlerTypes.MigrateToChatId
    | HandlerTypes.NewChatMembers
    | HandlerTypes.NewChatPhoto
    | HandlerTypes.NewChatTitle
    | HandlerTypes.PassportData
    | HandlerTypes.Photo
    | HandlerTypes.PinnedMessage
    | HandlerTypes.Sticker
    | HandlerTypes.SuccessfulPayment
    | HandlerTypes.SupergroupChatCreated
    | HandlerTypes.Text
    | HandlerTypes.Video
    | HandlerTypes.VideoChatEnded
    | HandlerTypes.VideoChatParticipantsInvited
    | HandlerTypes.VideoChatScheduled
    | HandlerTypes.VideoChatStarted
    | HandlerTypes.VideoNote
    | HandlerTypes.Voice
    | HandlerTypes.WebAppData;
export type OriginalMessageMetadataHandler = (message: TelegramAPI.Message, metadata: TelegramAPI.Metadata) => void;

export type MessageHandlers =
    | HandlerTypes.ChannelPost
    | HandlerTypes.EditedChannelPost
    | HandlerTypes.EditedChannelPostCaption
    | HandlerTypes.EditedChannelPostText
    | HandlerTypes.EditedMessage
    | HandlerTypes.EditedMessageCaption
    | HandlerTypes.EditedMessageText;
export type OriginalMessageHandler = (message: TelegramAPI.Message) => void;

export type ChatMemberHandlers =
    | HandlerTypes.ChatMember
    | HandlerTypes.MyChatMember;
export type OriginalChatMemberHandler = (member: TelegramAPI.ChatMemberUpdated) => void;

export type ErrorHandlers =
    | HandlerTypes.Error
    | HandlerTypes.PollingError
    | HandlerTypes.WebhookError;
export type OriginalErrorHandler = (error: Error) => void;

export type OriginalCallbackQueryHandler = (callback_query: TelegramAPI.CallbackQuery) => void;
export type OriginalChatJoinRequestHandler = (query: TelegramAPI.ChatJoinRequest) => void;
export type OriginalChosenInlineResultHandler = (result: TelegramAPI.ChosenInlineResult) => void;
export type OriginalInlineQueryHandler = (query: TelegramAPI.InlineQuery) => void;
export type OriginalPollAnswerHandler = (answer: TelegramAPI.PollAnswer) => void;
export type OriginalPreCheckoutQueryHandler = (query: TelegramAPI.PreCheckoutQuery) => void;
export type OriginalShippingQueryHandler = (query: TelegramAPI.ShippingQuery) => void;

export type OriginalHandlers =
    | OriginalMessageMetadataHandler
    | OriginalMessageHandler
    | OriginalChatMemberHandler
    | OriginalErrorHandler
    | OriginalCallbackQueryHandler
    | OriginalChatJoinRequestHandler
    | OriginalChosenInlineResultHandler
    | OriginalInlineQueryHandler
    | OriginalPollAnswerHandler
    | OriginalPreCheckoutQueryHandler
    | OriginalShippingQueryHandler;

/**
 * Handlers descriptors interfaces
 */
interface BaseHandlerDescriptor<
    T extends HandlerTypes,
    H extends OriginalHandlers
> {
    readonly type: T;
    readonly handler: H;
};

// tslint:disable max-line-length
export type OriginalMessageMetadataHandlerDescriptor = BaseHandlerDescriptor<MessageMetadataHandlers, OriginalMessageMetadataHandler>;
export type OriginalMessageHandlerDescriptor = BaseHandlerDescriptor<MessageHandlers, OriginalMessageHandler>;
export type OriginalChatMemberHandlerDescriptor = BaseHandlerDescriptor<ChatMemberHandlers, OriginalChatMemberHandler>;
export type OriginalErrorHandlerDescriptor = BaseHandlerDescriptor<ErrorHandlers, OriginalErrorHandler>;
export type OriginalCallbackQueryHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.CallbackQuery, OriginalCallbackQueryHandler>;
export type OriginalChatJoinRequestHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.ChatJoinRequest, OriginalChatJoinRequestHandler>;
export type OriginalChosenInlineResultHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.ChosenInlineResult, OriginalChosenInlineResultHandler>;
export type OriginalInlineQueryHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.InlineQuery, OriginalInlineQueryHandler>;
export type OriginalPollAnswerHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.PollAnswer, OriginalPollAnswerHandler>;
export type OriginalPreCheckoutQueryHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.PreCheckoutQuery, OriginalPreCheckoutQueryHandler>;
export type OriginalShippingQueryHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.ShippingQuery, OriginalShippingQueryHandler>;
// tslint:enable max-line-length

export type OriginalHandlerDescriptor =
    | OriginalMessageMetadataHandlerDescriptor
    | OriginalMessageHandlerDescriptor
    | OriginalChatMemberHandlerDescriptor
    | OriginalErrorHandlerDescriptor
    | OriginalCallbackQueryHandlerDescriptor
    | OriginalChatJoinRequestHandlerDescriptor
    | OriginalChosenInlineResultHandlerDescriptor
    | OriginalInlineQueryHandlerDescriptor
    | OriginalPollAnswerHandlerDescriptor
    | OriginalPreCheckoutQueryHandlerDescriptor
    | OriginalShippingQueryHandlerDescriptor;
