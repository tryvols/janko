import { inject, injectable } from "inversify";
import iterate from "iterare";
import { cloneDeep } from "lodash";
import { HANDLERS_CONTAINER, HandlerTypes, MIDDLEWARE_CONTROLLER } from "../constants";
import { assertNever } from "../helpers";
import {
    CallbackQueryHandlerProps,
    ChatJoinRequestHandlerProps,
    ChatMemberHandlerProps,
    ChosenInlineResultHandlerProps,
    ErrorHandlerProps,
    HandlerCompleteData,
    HandlerData,
    HandlerDescriptor,
    ICallbackQueryHandler,
    IChatJoinRequestHandler,
    IChatMemberHandler,
    IChosenInlineResultHandler,
    IErrorHandler,
    IInlineQueryHandler,
    IMessageHandler,
    IMessageMetadataHandler,
    InlineQueryHandlerProps,
    IPollAnswerHandler,
    IPreCheckoutQueryHandler,
    IRoutingRule,
    IShippingQueryHandler,
    MessageHandlerProps,
    MessageMetadataHandlerProps,
    PollAnswerHandlerProps,
    PreCheckoutQueryHandlerProps,
    ShippingQueryHandlerProps
} from "../interfaces";
import { MiddlewareController } from "../middleware";
import { HandlersContainer } from "./handlers-container";

@injectable()
export class AvailableHandlersProvider {
    constructor(
        @inject(HANDLERS_CONTAINER) private readonly handlersContainer: HandlersContainer,
        @inject(MIDDLEWARE_CONTROLLER) private readonly middlewareController: MiddlewareController
    ) {}

    getHandlers(data: HandlerData): HandlerDescriptor[] {
        return this.getAvailableHandlers(
            this.handlersContainer.getHandlersByType(data.handlerDescriptor.type),
            data
        );
    }

    getHandlersForTypes(data: HandlerData, types: HandlerTypes[]): HandlerDescriptor[] {
        return this.getAvailableHandlers(
            this.handlersContainer.getHandlersByTypes(types),
            data
        );
    }

    private getAvailableHandlers(
        handlers: ReadonlyArray<HandlerDescriptor>,
        data: HandlerData
    ): HandlerDescriptor[] {
        // This is needed to prevent mutations from the filtering functions
        const safeData = cloneDeep(data);

        return iterate(handlers)
            .filter(handlerDescriptor => this.shouldHandlerBeExecuted(handlerDescriptor, safeData))
            // It's important to filter handlers using middleware before validation
            // for unhandled event as middlewares can reject handler's execution
            // This time middleware only check if handler should exists and can't update data
            .filter(handlerDescriptor => {
                return this.middlewareController.beforeHandling({...safeData, handlerDescriptor} as HandlerCompleteData)
            })
            .toArray();
    }

    private shouldHandlerBeExecuted(handlerDescriptor: HandlerDescriptor, data: HandlerData): boolean {
        const handlerType = data.handlerDescriptor.type;

        if (handlerDescriptor.routingRule) {
            switch (handlerType) {
                // Message can contain all possible message-metadata handlers variants
                // so it should handle every possible such a case
                case HandlerTypes.Message:
                case HandlerTypes.Animation:
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
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IMessageMetadataHandler>>)
                        .useWhen(data as MessageMetadataHandlerProps);
                case HandlerTypes.ChannelPost:
                case HandlerTypes.EditedChannelPost:
                case HandlerTypes.EditedChannelPostCaption:
                case HandlerTypes.EditedChannelPostText:
                case HandlerTypes.EditedMessage:
                case HandlerTypes.EditedMessageCaption:
                case HandlerTypes.EditedMessageText:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IMessageHandler>>)
                        .useWhen(data as MessageHandlerProps);
                case HandlerTypes.ChatMember:
                case HandlerTypes.MyChatMember:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IChatMemberHandler>>)
                        .useWhen(data as ChatMemberHandlerProps);
                case HandlerTypes.Error:
                case HandlerTypes.PollingError:
                case HandlerTypes.WebhookError:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IErrorHandler>>)
                        .useWhen(data as ErrorHandlerProps);
                case HandlerTypes.CallbackQuery:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<ICallbackQueryHandler>>)
                        .useWhen(data as CallbackQueryHandlerProps);
                case HandlerTypes.ChatJoinRequest:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IChatJoinRequestHandler>>)
                        .useWhen(data as ChatJoinRequestHandlerProps);
                case HandlerTypes.ChosenInlineResult:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IChosenInlineResultHandler>>)
                        .useWhen(data as ChosenInlineResultHandlerProps);
                case HandlerTypes.InlineQuery:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IInlineQueryHandler>>)
                        .useWhen(data as InlineQueryHandlerProps);
                case HandlerTypes.PollAnswer:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IPollAnswerHandler>>)
                        .useWhen(data as PollAnswerHandlerProps);
                case HandlerTypes.PreCheckoutQuery:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IPreCheckoutQueryHandler>>)
                        .useWhen(data as PreCheckoutQueryHandlerProps);
                case HandlerTypes.ShippingQuery:
                    return (handlerDescriptor.routingRule as IRoutingRule<Parameters<IShippingQueryHandler>>)
                        .useWhen(data as ShippingQueryHandlerProps);
                default:
                    assertNever(handlerType);
            }
        }

        /**
         * For case when route exists - each type of handler can have it's own key property,
         * that can contain route (which is some key phrase or RegExp that match it)
         */
        if (handlerDescriptor.route) {
            return this.shouldHandlerBeExecutedByRoute(handlerDescriptor, data);
        }

        // By default handler should be executed
        return true;
    }

    protected shouldHandlerBeExecutedByRoute(handlerDescriptor: HandlerDescriptor, data: HandlerData): boolean {
        const handlerType = data.handlerDescriptor.type;
        const containRoute = (str?: string): boolean => !!str && str.search(handlerDescriptor.route) !== -1;

        switch (handlerType) {
            // Message can contain all possible message-metadata handlers variants
            // so it should handle every possible such a case
            case HandlerTypes.Message:
            case HandlerTypes.EditedMessage:
                const msg = (data as MessageMetadataHandlerProps)?.message;

                return (
                    containRoute(msg?.text)
                    || containRoute(msg?.caption)
                );
            case HandlerTypes.Text:
            case HandlerTypes.EditedMessageText:
                return containRoute((data as MessageMetadataHandlerProps).message.text);
            case HandlerTypes.Photo:
            case HandlerTypes.Audio:
            case HandlerTypes.Video:
            case HandlerTypes.Document:
            case HandlerTypes.EditedMessageCaption:
                return containRoute((data as MessageMetadataHandlerProps).message.caption);
            case HandlerTypes.CallbackQuery:
                return containRoute((data as CallbackQueryHandlerProps).callbackQuery.data);
            case HandlerTypes.ChosenInlineResult:
                return containRoute((data as ChosenInlineResultHandlerProps).chosenInlineResult.query);
            case HandlerTypes.InlineQuery:
                return containRoute((data as InlineQueryHandlerProps).inlineQuery.query);
            // By default messages that doesn't contain text data
            // should throw an error as it doesn't make sense to pass
            // `string | RegExp` route for the cases
            case HandlerTypes.Voice:
            case HandlerTypes.Animation:
            case HandlerTypes.Location:
            case HandlerTypes.LeftChatMember:
            case HandlerTypes.NewChatMembers:
            case HandlerTypes.NewChatPhoto:
            case HandlerTypes.GroupChatCreated:
            case HandlerTypes.ChannelChatCreated:
            case HandlerTypes.SupergroupChatCreated:
            case HandlerTypes.DeleteChatPhoto:
            case HandlerTypes.Contact:
            case HandlerTypes.Sticker:
            case HandlerTypes.NewChatTitle:
            case HandlerTypes.MigrateFromChatId:
            case HandlerTypes.MigrateToChatId:
            case HandlerTypes.ChatInviteLink:
            case HandlerTypes.ChatMemberUpdated:
            case HandlerTypes.Game:
            case HandlerTypes.Invoice:
            case HandlerTypes.MessageAutoDeleteTimerChanged:
            case HandlerTypes.PassportData:
            case HandlerTypes.PinnedMessage:
            case HandlerTypes.SuccessfulPayment:
            case HandlerTypes.VideoChatEnded:
            case HandlerTypes.VideoChatParticipantsInvited:
            case HandlerTypes.VideoChatScheduled:
            case HandlerTypes.VideoChatStarted:
            case HandlerTypes.VideoNote:
            case HandlerTypes.WebAppData:
            case HandlerTypes.ChannelPost:
            case HandlerTypes.EditedChannelPost:
            case HandlerTypes.EditedChannelPostCaption:
            case HandlerTypes.EditedChannelPostText:
            case HandlerTypes.ChatMember:
            case HandlerTypes.MyChatMember:
            case HandlerTypes.Error:
            case HandlerTypes.PollingError:
            case HandlerTypes.WebhookError:
            case HandlerTypes.ChatJoinRequest:
            case HandlerTypes.PollAnswer:
            case HandlerTypes.PreCheckoutQuery:
            case HandlerTypes.ShippingQuery:
                throw new Error(`${handlerType} can't handler "route" value, as it doesn't have text data`);
            default:
                assertNever(handlerType);
        }
    }
}
