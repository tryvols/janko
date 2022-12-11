import { injectable } from "inversify";
import {
    Controllers,
    HandlerRoute,
    HandlerRoutingRule,
    HandlerType,
    HandlerTypes
} from "../constants";
import { IRoutingRule, Route } from "../interfaces";

@injectable()
export class ApplicationMetadataAccessor {
    getIsController(target: object): boolean {
        return !!Reflect.getOwnMetadata(Controllers, target?.constructor);
    }

    getIsHandler(target: Function): boolean {
        return !!this.getHandlerType(target);
    }

    getHandlerType(target: Function): HandlerTypes | undefined {
        return Reflect.getOwnMetadata(HandlerType, target);
    }

    getHandlerRoute(target: Function): Route | undefined {
        return Reflect.getOwnMetadata(HandlerRoute, target);
    }

    getRoutingRule(target: Function): IRoutingRule<any> | undefined {
        return Reflect.getOwnMetadata(HandlerRoutingRule, target);
    }
}
