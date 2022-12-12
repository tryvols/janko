import { HandlerTypes } from "../../constants";
import {
    ICompleteRoutingDecorator,
    IHandlerDecorator,
    IHandlers,
    RoutingDecorator,
    IRoutingRule,
    Route
} from "../../interfaces";
import {
    generalHandlerDecorator,
    routingHandlerDecorator
} from "./base-handler-decorators";
import { combineHandlerDecorators } from "./utils";

export const handlerRoutingDecoratorFactory = <T extends IHandlers>(
    handlerType: HandlerTypes
): RoutingDecorator<T> => {
    // Types of messages without text data (commands can't be there)
    return (route?: IRoutingRule<Parameters<T>>): IHandlerDecorator<T> => {
        return combineHandlerDecorators<T>(
            generalHandlerDecorator<T>(handlerType),
            routingHandlerDecorator<T>(route)
        );
    };
};
  
export const handlerCompleteRoutingDecoratorFactory = <T extends IHandlers>(
    handlerType: HandlerTypes
): ICompleteRoutingDecorator<T> => {
    // Types of messages with text data where can be commands
    return (route?: Route | IRoutingRule<Parameters<T>>): IHandlerDecorator<T> => {
        return combineHandlerDecorators<T>(
            generalHandlerDecorator<T>(handlerType),
            routingHandlerDecorator<T>(route)
        );
    };
};