import { injectable } from "inversify";
import { HandlerLocation } from "./constants";
import { Location } from "./interfaces";

@injectable()
export class LocationMiddlewareMetadataAccessor {
    getHandlerLocation(handler: Function): Location | undefined {
        return Reflect.getOwnMetadata(HandlerLocation, handler);
    }

    getControllerLocation(controller: object): Location | undefined {
        return Reflect.getOwnMetadata(HandlerLocation, controller?.constructor);
    }
}
