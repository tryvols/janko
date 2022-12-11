import { injectable } from "inversify";
import {
    Controllers,
    HandlerTypes
} from "../../constants";
import {
    ICallbackQueryHandler,
    IChatJoinRequestHandler,
    IChatMemberHandler,
    IChosenInlineResultHandler,
    IErrorHandler,
    IInlineQueryHandler,
    IMessageHandler,
    IMessageMetadataHandler,
    IPollAnswerHandler,
    IPreCheckoutQueryHandler,
    IShippingQueryHandler
} from "../../interfaces";
import {
    handlerCompleteRoutingDecoratorFactory,
    handlerRoutingDecoratorFactory
} from "./handler-decorator-factories";

/**
 * Schema of controllers metadata
 * 1. Controller class contains flag that proves that it's controller
 * 2. Controller class contains handlers list (functions itself)
 * 3. Every handler contains it's own type
 */
export const Controller = () => <T extends { new (...args: any[]): {} }>(constructor: T) => {
    injectable()(constructor);
    // This is needed to later prove the class as a Controller
    Reflect.defineMetadata(Controllers, true, constructor);
};

// tslint:disable max-line-length
/**
 * Complete Routing Decorators (accept `string | RegExp | RoutingRule` route value)
 */
export const MessageHandler = handlerCompleteRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Message);
export const TextHandler = handlerCompleteRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Text);
export const AudioHandler = handlerCompleteRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Audio);
export const PhotoHandler = handlerCompleteRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Photo);
export const VideoHandler = handlerCompleteRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Video);
export const DocumentHandler = handlerCompleteRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Document);

export const EditedMessageHandler = handlerCompleteRoutingDecoratorFactory<IMessageHandler>(HandlerTypes.EditedMessage);
export const EditedMessageTextHandler = handlerCompleteRoutingDecoratorFactory<IMessageHandler>(HandlerTypes.EditedMessageText);
export const EditedMessageCaptionHandler = handlerCompleteRoutingDecoratorFactory<IMessageHandler>(HandlerTypes.EditedMessageCaption);

export const CallbackQueryHandler = handlerCompleteRoutingDecoratorFactory<ICallbackQueryHandler>(HandlerTypes.CallbackQuery);

export const ChosenInlineResultHandler = handlerCompleteRoutingDecoratorFactory<IChosenInlineResultHandler>(HandlerTypes.ChosenInlineResult);

export const InlineQueryHandler = handlerCompleteRoutingDecoratorFactory<IInlineQueryHandler>(HandlerTypes.InlineQuery);

/**
 * Routing Decorators (accept only `RoutingRule` route value)
 */
export const VoiceHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Voice);
export const AnimationHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Animation);
export const LocationHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Location);
export const NewChatPhotoHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.NewChatPhoto);
export const GroupChatCreatedHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.GroupChatCreated);
export const SupergroupChatCreatedHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.SupergroupChatCreated);
export const ChannelChatCreatedHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.ChannelChatCreated);
export const DeleteChatPhotoHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.DeleteChatPhoto);
export const ContactHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Contact);
export const StickerHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Sticker);
export const NewChatTitleHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.NewChatTitle);
export const GameHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Game);
export const InvoiceHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.Invoice);
export const MessageAutoDeleteTimerChangedHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.MessageAutoDeleteTimerChanged);
export const PassportDataHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.PassportData);
export const PinnedMessageHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.PinnedMessage);
export const VideoChatEndedHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.VideoChatEnded);
export const VideoChatParticipantsInvitedHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.VideoChatParticipantsInvited);
export const VideoChatScheduledHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.VideoChatScheduled);
export const VideoChatStartedHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.VideoChatStarted);
export const VideoNoteHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.VideoNote);
export const WebAppDataHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.WebAppData);
export const ChatMemberHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.ChatMember);
export const MyChatMemberHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.MyChatMember);
export const ChatInviteLinkHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.ChatInviteLink);
export const ChatMemberUpdatedHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.ChatMemberUpdated);
export const MigrateFromChatIdHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.MigrateFromChatId);
export const MigrateToChatIdHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.MigrateToChatId);
export const SuccessfulPaymentHandler = handlerRoutingDecoratorFactory<IMessageMetadataHandler>(HandlerTypes.SuccessfulPayment);

export const ChannelPostHandler = handlerRoutingDecoratorFactory<IMessageHandler>(HandlerTypes.ChannelPost);
export const EditedChannelPostHandler = handlerRoutingDecoratorFactory<IMessageHandler>(HandlerTypes.EditedChannelPost);
export const EditedChannelPostCaptionHandler = handlerRoutingDecoratorFactory<IMessageHandler>(HandlerTypes.EditedChannelPostCaption);
export const EditedChannelPostTextHandler = handlerRoutingDecoratorFactory<IMessageHandler>(HandlerTypes.EditedChannelPostText);

export const LeftChatMemberHandler = handlerRoutingDecoratorFactory<IChatMemberHandler>(HandlerTypes.LeftChatMember);
export const NewChatMembersHandler = handlerRoutingDecoratorFactory<IChatMemberHandler>(HandlerTypes.NewChatMembers);

export const ErrorHandler = handlerRoutingDecoratorFactory<IErrorHandler>(HandlerTypes.Error);
export const PollingErrorHandler = handlerRoutingDecoratorFactory<IErrorHandler>(HandlerTypes.PollingError);
export const WebhookErrorHandler = handlerRoutingDecoratorFactory<IErrorHandler>(HandlerTypes.WebhookError);

export const ChatJoinRequestHandler = handlerRoutingDecoratorFactory<IChatJoinRequestHandler>(HandlerTypes.ChatJoinRequest);

export const PollAnswerHandler = handlerRoutingDecoratorFactory<IPollAnswerHandler>(HandlerTypes.PollAnswer);

export const PreCheckoutQueryHandler = handlerRoutingDecoratorFactory<IPreCheckoutQueryHandler>(HandlerTypes.PreCheckoutQuery);

export const ShippingQueryHandler = handlerRoutingDecoratorFactory<IShippingQueryHandler>(HandlerTypes.ShippingQuery);
