import {
    HandlerRoute,
    HandlerRoutingRule,
    Handlers,
    HandlerType,
    HandlerTypes
} from "../../constants";
import {
    IHandlers as HandlersInterfaces,
    IRoutingRule,
    Route
} from "../../interfaces";

// This is a general decorator which should be used for every decorator's type
export const generalHandlerDecorator = <T extends HandlersInterfaces>(handlerType: HandlerTypes) => {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        // Assign handler type to the function
        Reflect.defineMetadata(HandlerType, handlerType, descriptor.value);
        // Push handler to controller's list
        const handlers = Reflect.getMetadata(Handlers, target) || [];
        handlers.push(descriptor.value);
        Reflect.defineMetadata(Handlers, handlers, target);
    };
};
  
// Routing Handler Decorator save routing rule which restrict when
// current handler should be executed
export const routingHandlerDecorator = <T extends HandlersInterfaces>(
    route: Route | IRoutingRule<Parameters<T>>
) => {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        if (typeof route === "object" && route) {
            Reflect.defineMetadata(HandlerRoutingRule, route, descriptor.value);
        } else if (route) {
            Reflect.defineMetadata(HandlerRoute, route, descriptor.value);
        }
    };
};
