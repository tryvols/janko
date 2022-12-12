import { HandlerLocation } from "./constants";
import { Location } from "./interfaces";

export function Location(location: Location) {
    return (target: any, propertyKey?: string, descriptor?: TypedPropertyDescriptor<Function>) => {
        return Reflect.defineMetadata(HandlerLocation, location, descriptor?.value ?? target);
    };
};
