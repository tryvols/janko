import TelegramAPI from "node-telegram-bot-api";
import { inject, injectable, interfaces } from "inversify";
import {
    DEFAULT_ERROR,
    Errors,
    HandlerTypes,
    TELEGRAM_API
} from "../constants";
import {
    AppErrorHandler,
    CallbackQueryHandlerProps,
    ChatJoinRequestHandlerProps,
    ChatMemberHandlerProps,
    HandlerData,
    InlineQueryHandlerProps,
    MessageHandlerProps,
    MessageMetadataHandlerProps,
    PreCheckoutQueryHandlerProps,
    ShippingQueryHandlerProps
} from "../interfaces";
import { assertNever } from "../helpers";
import { LoggerService, LOGGER } from "../middleware";

@injectable()
export class ApplicationErrorHandler implements AppErrorHandler {
    constructor(
        @inject(TELEGRAM_API) private readonly telegramApi: TelegramAPI,
        @inject(DEFAULT_ERROR) private readonly defaultError: interfaces.Newable<Error>,
        @inject(LOGGER) private readonly logger: LoggerService
    ) {
        this.wrap = this.wrap.bind(this);
        this.onError = this.onError.bind(this);
    }

    wrap(callback: (data: HandlerData) => Promise<void>) {
        return async (data: HandlerData) => {
            try {
                await callback(data)
                    .catch(err => {
                        this.onError(err, data);
                    });
            } catch(err) {
                await this.onError(err, data);
            }
        };
    }

    async onError(error: Error, data: HandlerData): Promise<void> {
        this.logger.error(error);
        const errorType = this.getErrorType(error);
        const errorMessage = this.getErrorMessage(errorType, error);
        await this.sendError(errorMessage, data);
    }

    /**
     * This function specify error messages for all of the application errors.
     * You can override or extend it to specify your own messages.
     * @param errorType - type of error by the app errors classification
     * @returns 
     */
    protected getErrorMessage(errorType: Errors, error: Error): string {
        return errorType === Errors.UnknownError
            ? (new this.defaultError()).message
            : error.message;
    }

    /**
     * This method send an error to the user.
     * You can override or extend it to specify your own sending logic.
     * 
     * @param error - error message
     * @param data - data sent from telegram server
     * @returns 
     */
    protected async sendError(error: string, data: HandlerData): Promise<void> {
        const chatId = this.getChatId(data);
        const inlineQueryId = this.getInlineQueryId(data);

        /**
         * Messages that doesn't handles due to
         * lack of data (no chatId, inlineQueryId etc.)
         * 
         * HandlerTypes.Error
         * HandlerTypes.PollingError
         * HandlerTypes.WebhookError
         * HandlerTypes.PollAnswer
         * HandlerTypes.ChosenInlineResult
         */
        if (chatId) {
            await this.telegramApi.sendMessage(chatId, error);
        } else if (inlineQueryId) {
            await this.telegramApi.answerInlineQuery(inlineQueryId, [{
                type: "article",
                id: "inline-query-error",
                title: error,
                input_message_content: {message_text: ""}
            }]);
        }

        // Here we should also check for session
        // where we can store user's chat data

        // Here we need to log that error doesn't reach users
        this.logger.log(`Current error doesn't reach users: ${error}`);
        return;
    }

    private getInlineQueryId(data: HandlerData): string | undefined {
        return data.handlerDescriptor.type === HandlerTypes.InlineQuery
            ? (data as InlineQueryHandlerProps)?.inlineQuery?.id
            : undefined;
    }

    private getChatId(data: HandlerData): TelegramAPI.ChatId | undefined {
        const handlerType = data.handlerDescriptor.type;

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
                return (data as MessageMetadataHandlerProps)?.message?.chat?.id;
            case HandlerTypes.ChannelPost:
            case HandlerTypes.EditedChannelPost:
            case HandlerTypes.EditedChannelPostCaption:
            case HandlerTypes.EditedChannelPostText:
            case HandlerTypes.EditedMessage:
            case HandlerTypes.EditedMessageCaption:
            case HandlerTypes.EditedMessageText:
                return (data as MessageHandlerProps)?.message?.chat?.id;
            case HandlerTypes.ChatMember:
            case HandlerTypes.MyChatMember:
                return (data as ChatMemberHandlerProps)?.member?.chat?.id;
            case HandlerTypes.CallbackQuery:
                return (data as CallbackQueryHandlerProps)?.callbackQuery?.message?.chat?.id;
            case HandlerTypes.ChatJoinRequest:
                return (data as ChatJoinRequestHandlerProps)?.chatJoinRequest?.chat?.id;
            case HandlerTypes.PreCheckoutQuery:
                return (data as PreCheckoutQueryHandlerProps)?.preCheckoutQuery?.from?.id;
            case HandlerTypes.ShippingQuery:
                return (data as ShippingQueryHandlerProps)?.shippingQuery?.from?.id;
            // Errors doesn't allow to respond to user
            case HandlerTypes.Error:
            case HandlerTypes.PollingError:
            case HandlerTypes.WebhookError:
            // Poll answer doesn't mean back response
            case HandlerTypes.PollAnswer:
            // Inline queries has their own answer methods
            case HandlerTypes.ChosenInlineResult:
            case HandlerTypes.InlineQuery:
                return;
            default:
                assertNever(handlerType);
        }
    }

    private getErrorType(error: Error): Errors {
        const errorType = error.name as Errors;

        switch (errorType) {
            case Errors.HandlersAbsenceError:
            case Errors.DefaultError:
            case Errors.CustomError:
                return errorType;
            case Errors.UnknownError:
            default:
                return Errors.UnknownError;
        }
    }
}
