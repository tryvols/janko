import TelegramAPI from "node-telegram-bot-api";
import { inject, injectable } from "inversify";
import {
    AVAILABLE_HANDLERS_PROVIDER,
    ERROR_HANDLER,
    HandlerTypes,
    MIDDLEWARE_CONTROLLER,
    TELEGRAM_API,
    UNHANDLED_EVENT_VALIDATOR
} from "../constants";
import { assertNever } from "../helpers";
import {
    AppErrorHandler,
    CallbackQueryHandlerProps,
    ChatJoinRequestHandlerProps,
    ChatMemberHandlerProps,
    ChosenInlineResultHandlerProps,
    ErrorHandlerProps,
    HandlerCompleteData,
    HandlerData,
    IHandlerResult,
    InlineQueryHandlerProps,
    MessageHandlerProps,
    MessageMetadataHandlerProps,
    PollAnswerHandlerProps,
    PreCheckoutQueryHandlerProps,
    ShippingQueryHandlerProps
} from "../interfaces";
import { LoggerService, LOGGER, MiddlewareController } from "../middleware";
import { TelegramApiAdapter } from "./telegram-api-adapter";
import { AvailableHandlersProvider } from "./available-handlers-provider";
import { UnhandledEventValidator } from "./unhandled-event-validator";

@injectable()
export class Router {
    constructor(
        @inject(MIDDLEWARE_CONTROLLER) private readonly middlewareController: MiddlewareController,
        @inject(AVAILABLE_HANDLERS_PROVIDER) private readonly availableHandlersProvider: AvailableHandlersProvider,
        @inject(UNHANDLED_EVENT_VALIDATOR) private readonly unhandledEventValidator: UnhandledEventValidator,
        @inject(LOGGER) private readonly logger: LoggerService,
        @inject(ERROR_HANDLER) errorHandler: AppErrorHandler,
        @inject(TELEGRAM_API) telegramApi: TelegramAPI
    ) {
        new TelegramApiAdapter(
            telegramApi,
            // Wrap event handler into error handler.
            // This is top level for errors that we can send to a user.
            errorHandler.wrap(
                this.eventHandler.bind(this)
            )
        );
    }

    private async eventHandler(data: HandlerData): Promise<void> {
        this.logger.log(`${data.handlerDescriptor.type} event detected`);

        const executableHandlers = this.availableHandlersProvider.getHandlers(data);

        // Validation for unhandled event
        this.unhandledEventValidator.validate(data);

        executableHandlers.forEach(handlerDescriptor => {
            const completeData = {...data, handlerDescriptor} as HandlerCompleteData;
            const handlerType = handlerDescriptor.type;

            // This additional call of middleware before handling with original data
            // sub-objects (like message, member etc.) allows to mutate data (edit or extend).
            // This is needed to do it only once.
            this.middlewareController.beforeHandling(completeData);

            // Contains result of handler's work
            let result: IHandlerResult;

            switch(handlerType) {
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
                    result = handlerDescriptor.handler(data as MessageMetadataHandlerProps);
                    break;
                case HandlerTypes.ChannelPost:
                case HandlerTypes.EditedChannelPost:
                case HandlerTypes.EditedChannelPostCaption:
                case HandlerTypes.EditedChannelPostText:
                case HandlerTypes.EditedMessage:
                case HandlerTypes.EditedMessageCaption:
                case HandlerTypes.EditedMessageText:
                    result = handlerDescriptor.handler(data as MessageHandlerProps);
                    break;
                case HandlerTypes.ChatMember:
                case HandlerTypes.MyChatMember:
                    result = handlerDescriptor.handler(data as ChatMemberHandlerProps);
                    break;
                case HandlerTypes.Error:
                case HandlerTypes.PollingError:
                case HandlerTypes.WebhookError:
                    result = handlerDescriptor.handler(data as ErrorHandlerProps);
                    break;
                case HandlerTypes.CallbackQuery:
                    result = handlerDescriptor.handler(data as CallbackQueryHandlerProps);
                    break;
                case HandlerTypes.ChatJoinRequest:
                    result = handlerDescriptor.handler(data as ChatJoinRequestHandlerProps);
                    break;
                case HandlerTypes.ChosenInlineResult:
                    result = handlerDescriptor.handler(data as ChosenInlineResultHandlerProps);
                    break;
                case HandlerTypes.InlineQuery:
                    result = handlerDescriptor.handler(data as InlineQueryHandlerProps);
                    break;
                case HandlerTypes.PollAnswer:
                    result = handlerDescriptor.handler(data as PollAnswerHandlerProps);
                    break;
                case HandlerTypes.PreCheckoutQuery:
                    result = handlerDescriptor.handler(data as PreCheckoutQueryHandlerProps);
                    break;
                case HandlerTypes.ShippingQuery:
                    result = handlerDescriptor.handler(data as ShippingQueryHandlerProps);
                    break;
                default:
                    assertNever(handlerType);
            }

            this.middlewareController.afterHandling(completeData, result);
        });
    }
}
