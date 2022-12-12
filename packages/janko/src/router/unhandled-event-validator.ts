import { inject, injectable, interfaces } from "inversify";
import { AVAILABLE_HANDLERS_PROVIDER, HANDLERS_ABSENCE_ERROR, HandlerTypes } from "../constants";
import { HandlersAbsenceError } from "../errors";
import { HandlerData } from "../interfaces";
import { AvailableHandlersProvider } from "./available-handlers-provider";

@injectable()
export class UnhandledEventValidator {
    constructor(
        @inject(AVAILABLE_HANDLERS_PROVIDER) private readonly availableHandlersProvider: AvailableHandlersProvider,
        @inject(HANDLERS_ABSENCE_ERROR) private readonly handlersAbsenceError: interfaces.Newable<HandlersAbsenceError>
    ) {}

    validate(data: HandlerData): void {
        // For now using simple validation for text commands. The simplest way to override it is to
        // extend the class and override validate method. Need to figure out better way to extends/override
        // validation.
        //
        // Need to remember about such cases when we get at the same time few events:
        // - When we get an event with metadata - we also get a Message event
        // - When user edit a message text/caption - we get EditedMessage and EditedMessage(Caption/Text) events
        // - When user edit a post - we get EditedPost and EditedPost(Caption/Text) events
        //
        // And there are may be other similar use cases.
        //
        if (data.handlerDescriptor.type === HandlerTypes.Text) {
            // If there is message with metadata - node-telegram-bot-api send two events
            // - one for HandlerTypes.Message (general type)
            // - another one for specific message type (audio, animation etc.)
            // So, to check that there is no handlers for the event - we need to check both types
            // for available handlers
            const eventHandlers = this.availableHandlersProvider.getHandlersForTypes(
                data,
                [
                    data.handlerDescriptor.type,
                    HandlerTypes.Message
                ]
            );

            if (eventHandlers.length === 0) {
                throw new this.handlersAbsenceError();
            }
        }
    }
}
