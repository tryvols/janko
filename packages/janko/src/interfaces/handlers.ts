import TelegramAPI from "node-telegram-bot-api";
import { HandlerTypes } from "../constants";
import { IRoutingRule, Route } from "./handler-decorators";
import { ChatMemberHandlers, ErrorHandlers, MessageHandlers, MessageMetadataHandlers } from "./original-handlers";

/**
 * Client handlers descriptors (are provided by decorators)
 */
type HandlerProps = Readonly<{
    message: TelegramAPI.Message;
    metadata: TelegramAPI.Metadata;
    member: TelegramAPI.ChatMemberUpdated;
    error: Error;
    callbackQuery: TelegramAPI.CallbackQuery;
    chatJoinRequest: TelegramAPI.ChatJoinRequest;
    chosenInlineResult: TelegramAPI.ChosenInlineResult;
    inlineQuery: TelegramAPI.InlineQuery;
    pollAnswer: TelegramAPI.PollAnswer;
    preCheckoutQuery: TelegramAPI.PreCheckoutQuery;
    shippingQuery: TelegramAPI.ShippingQuery;
}>;

export type MessageMetadataHandlerProps = Pick<HandlerProps, "message" | "metadata">;
export type MessageHandlerProps = Pick<HandlerProps, "message">;
export type ChatMemberHandlerProps = Pick<HandlerProps, "member">;
export type ErrorHandlerProps = Pick<HandlerProps, "error">;
export type CallbackQueryHandlerProps = Pick<HandlerProps, "callbackQuery">;
export type ChatJoinRequestHandlerProps = Pick<HandlerProps, "chatJoinRequest">;
export type ChosenInlineResultHandlerProps = Pick<HandlerProps, "chosenInlineResult">;
export type InlineQueryHandlerProps = Pick<HandlerProps, "inlineQuery">;
export type PollAnswerHandlerProps = Pick<HandlerProps, "pollAnswer">;
export type PreCheckoutQueryHandlerProps = Pick<HandlerProps, "preCheckoutQuery">;
export type ShippingQueryHandlerProps = Pick<HandlerProps, "shippingQuery">;

export type IMessageMetadataHandler = (props: MessageMetadataHandlerProps) => void;
export type IMessageHandler = (props: MessageHandlerProps) => void;
export type IChatMemberHandler = (props: ChatMemberHandlerProps) => void;
export type IErrorHandler = (props: ErrorHandlerProps) => void;
export type ICallbackQueryHandler = (props: CallbackQueryHandlerProps) => void;
export type IChatJoinRequestHandler = (props: ChatJoinRequestHandlerProps) => void;
export type IChosenInlineResultHandler = (props: ChosenInlineResultHandlerProps) => void;
export type IInlineQueryHandler = (props: InlineQueryHandlerProps) => void;
export type IPollAnswerHandler = (props: PollAnswerHandlerProps) => void;
export type IPreCheckoutQueryHandler = (props: PreCheckoutQueryHandlerProps) => void;
export type IShippingQueryHandler = (props: ShippingQueryHandlerProps) => void;

export type IHandlers =
    | IMessageMetadataHandler
    | IMessageHandler
    | IChatMemberHandler
    | IErrorHandler
    | ICallbackQueryHandler
    | IChatJoinRequestHandler
    | IChosenInlineResultHandler
    | IInlineQueryHandler
    | IPollAnswerHandler
    | IPreCheckoutQueryHandler
    | IShippingQueryHandler;

/**
 * Handlers descriptors interfaces
 */
interface BaseHandlerDescriptor<
    T extends HandlerTypes,
    H extends IHandlers
> {
    readonly type: T;
    readonly route?: Route;
    readonly routingRule?: IRoutingRule<Parameters<H>>;
    readonly handler: H;
    readonly controller: object;
};

// tslint:disable max-line-length
export type MessageMetadataHandlerDescriptor = BaseHandlerDescriptor<MessageMetadataHandlers, IMessageMetadataHandler>;
export type MessageHandlerDescriptor = BaseHandlerDescriptor<MessageHandlers, IMessageHandler>;
export type ChatMemberHandlerDescriptor = BaseHandlerDescriptor<ChatMemberHandlers, IChatMemberHandler>;
export type ErrorHandlerDescriptor = BaseHandlerDescriptor<ErrorHandlers, IErrorHandler>;
export type CallbackQueryHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.CallbackQuery, ICallbackQueryHandler>;
export type ChatJoinRequestHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.ChatJoinRequest, IChatJoinRequestHandler>;
export type ChosenInlineResultHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.ChosenInlineResult, IChosenInlineResultHandler>;
export type InlineQueryHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.InlineQuery, IInlineQueryHandler>;
export type PollAnswerHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.PollAnswer, IPollAnswerHandler>;
export type PreCheckoutQueryHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.PreCheckoutQuery, IPreCheckoutQueryHandler>;
export type ShippingQueryHandlerDescriptor = BaseHandlerDescriptor<HandlerTypes.ShippingQuery, IShippingQueryHandler>;
// tslint:enable max-line-length

export type HandlerDescriptor =
  | MessageMetadataHandlerDescriptor
  | MessageHandlerDescriptor
  | ChatMemberHandlerDescriptor
  | ErrorHandlerDescriptor
  | CallbackQueryHandlerDescriptor
  | ChatJoinRequestHandlerDescriptor
  | ChosenInlineResultHandlerDescriptor
  | InlineQueryHandlerDescriptor
  | PollAnswerHandlerDescriptor
  | PreCheckoutQueryHandlerDescriptor
  | ShippingQueryHandlerDescriptor;

/**
 * Handler's Data
 */
export type MessageMetadataHandlerData = Readonly<{
  handlerDescriptor: Pick<MessageMetadataHandlerDescriptor, "type">;
} & MessageMetadataHandlerProps>;

export type MessageHandlerData = Readonly<{
  handlerDescriptor: Pick<MessageHandlerDescriptor, "type">;
} & MessageHandlerProps>;

export type ChatMemberHandlerData = Readonly<{
  handlerDescriptor: Pick<ChatMemberHandlerDescriptor, "type">;
}> & ChatMemberHandlerProps;

export type ErrorHandlerData = Readonly<{
  handlerDescriptor: Pick<ErrorHandlerDescriptor, "type">;
}> & ErrorHandlerProps;

export type CallbackQueryHandlerData = Readonly<{
  handlerDescriptor: Pick<CallbackQueryHandlerDescriptor, "type">;
}> & CallbackQueryHandlerProps;

export type ChatJoinRequestHandlerData = Readonly<{
  handlerDescriptor: Pick<ChatJoinRequestHandlerDescriptor, "type">;
}> & ChatJoinRequestHandlerProps;

export type ChosenInlineResultHandlerData = Readonly<{
  handlerDescriptor: Pick<ChosenInlineResultHandlerDescriptor, "type">;
}> & ChosenInlineResultHandlerProps;

export type InlineQueryHandlerData = Readonly<{
  handlerDescriptor: Pick<InlineQueryHandlerDescriptor, "type">;
}> & InlineQueryHandlerProps;

export type PollAnswerHandlerData = Readonly<{
  handlerDescriptor: Pick<PollAnswerHandlerDescriptor, "type">;
}> & PollAnswerHandlerProps;

export type PreCheckoutQueryHandlerData = Readonly<{
  handlerDescriptor: Pick<PreCheckoutQueryHandlerDescriptor, "type">;
}> & PreCheckoutQueryHandlerProps;

export type ShippingQueryHandlerData = Readonly<{
  handlerDescriptor: Pick<ShippingQueryHandlerDescriptor, "type">;
}> & ShippingQueryHandlerProps;

export type HandlerData =
  | MessageMetadataHandlerData
  | MessageHandlerData
  | ChatMemberHandlerData
  | ErrorHandlerData
  | CallbackQueryHandlerData
  | ChatJoinRequestHandlerData
  | ChosenInlineResultHandlerData
  | InlineQueryHandlerData
  | PollAnswerHandlerData
  | PreCheckoutQueryHandlerData
  | ShippingQueryHandlerData;

/**
 * Complete Handlers Data
 */
export type MessageMetadataHandlerCompleteData = Readonly<{
  handlerDescriptor: MessageMetadataHandlerDescriptor;
} & MessageMetadataHandlerProps>;

export type MessageHandlerCompleteData = Readonly<{
  handlerDescriptor: MessageHandlerDescriptor;
} & MessageHandlerProps>;

export type ChatMemberHandlerCompleteData = Readonly<{
  handlerDescriptor: ChatMemberHandlerDescriptor;
}> & ChatMemberHandlerProps;

export type ErrorHandlerCompleteData = Readonly<{
  handlerDescriptor: ErrorHandlerDescriptor;
}> & ErrorHandlerProps;

export type CallbackQueryHandlerCompleteData = Readonly<{
  handlerDescriptor: CallbackQueryHandlerDescriptor;
}> & CallbackQueryHandlerProps;

export type ChatJoinRequestHandlerCompleteData = Readonly<{
  handlerDescriptor: ChatJoinRequestHandlerDescriptor;
}> & ChatJoinRequestHandlerProps;

export type ChosenInlineResultHandlerCompleteData = Readonly<{
  handlerDescriptor: ChosenInlineResultHandlerDescriptor;
}> & ChosenInlineResultHandlerProps;

export type InlineQueryHandlerCompleteData = Readonly<{
  handlerDescriptor: InlineQueryHandlerDescriptor;
}> & InlineQueryHandlerProps;

export type PollAnswerHandlerCompleteData = Readonly<{
  handlerDescriptor: PollAnswerHandlerDescriptor;
}> & PollAnswerHandlerProps;

export type PreCheckoutQueryHandlerCompleteData = Readonly<{
  handlerDescriptor: PreCheckoutQueryHandlerDescriptor;
}> & PreCheckoutQueryHandlerProps;

export type ShippingQueryHandlerCompleteData = Readonly<{
  handlerDescriptor: ShippingQueryHandlerDescriptor;
}> & ShippingQueryHandlerProps;

export type HandlerCompleteData =
  | MessageMetadataHandlerCompleteData
  | MessageHandlerCompleteData
  | ChatMemberHandlerCompleteData
  | ErrorHandlerCompleteData
  | CallbackQueryHandlerCompleteData
  | ChatJoinRequestHandlerCompleteData
  | ChosenInlineResultHandlerCompleteData
  | InlineQueryHandlerCompleteData
  | PollAnswerHandlerCompleteData
  | PreCheckoutQueryHandlerCompleteData
  | ShippingQueryHandlerCompleteData;
