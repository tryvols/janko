import { inject, injectable, multiInject, optional } from "inversify";
import {
    APPLICATION_METADATA_ACCESSOR,
    CONTROLLER,
    HandlerTypes,
    METADATA_SCANNER
} from "../constants";
import { MetadataScanner } from "../core";
import { cloneMetadataFrom } from "../helpers";
import { HandlerDescriptor } from "../interfaces";
import { ApplicationMetadataAccessor } from "../metadata";

@injectable()
export class HandlersContainer {
    private readonly handlerDescriptors: ReadonlyArray<HandlerDescriptor> = [];

    constructor(
        @inject(APPLICATION_METADATA_ACCESSOR) private readonly metadataAccessor: ApplicationMetadataAccessor,
        @inject(METADATA_SCANNER) private readonly metadataScanner: MetadataScanner,
        @multiInject(CONTROLLER) @optional() controllers: Record<string, Function>[] = []
    ) {
        this.handlerDescriptors = this.initHandlers(controllers);
    }

    getHandlers(): Array<HandlerDescriptor> {
        return [...this.handlerDescriptors];
    }

    getHandlersByType<T extends HandlerDescriptor>(type: HandlerTypes): Array<T> {
        return this.handlerDescriptors.filter(descriptor => descriptor.type === type) as Array<T>;
    }

    getHandlersByTypes<T extends HandlerDescriptor>(types: HandlerTypes[]): Array<T> {
        return this.handlerDescriptors.filter(descriptor => types.includes(descriptor.type)) as Array<T>;
    }

    private initHandlers(controllers: Record<string, Function>[]): ReadonlyArray<HandlerDescriptor> {
        return controllers.reduce<HandlerDescriptor[]>((descriptors, controller) => {
            if (!this.metadataAccessor.getIsController(controller)) {
                throw new Error("Use @Controller() decorator for the controller class!");
            }

            this.metadataScanner.scanFromPrototype(
                Object.getPrototypeOf(controller),
                (key: string) => {
                    const handler = controller[key];

                    if (!this.metadataAccessor.getIsHandler(handler)) {
                        return;
                    }

                    const type = this.metadataAccessor.getHandlerType(handler);
                    const route = this.metadataAccessor.getHandlerRoute(handler);
                    const routingRule = this.metadataAccessor.getRoutingRule(handler);

                    const descriptor = this.initHandlerDescriptor(
                        this.getBoundedHandler(handler, controller),
                        type,
                        route,
                        routingRule,
                        controller
                    );

                    descriptors.push(descriptor);
                }
            );

            return descriptors;
        }, [] as HandlerDescriptor[]);
    }

    private getBoundedHandler(handler: any, controller: any) {
        // Bind controller as a context to allow `this` work correctly
        // and get access to other controller fields
        const boundHandler = handler.bind(controller);
        // Clone metadata to allow get it from middlewares
        cloneMetadataFrom(handler).to(boundHandler);
        return boundHandler;
    }

    private initHandlerDescriptor(
        handler: any,
        type: any,
        route: any,
        routingRule: any,
        controller: any
    ): HandlerDescriptor {
        return {
            handler,
            type,
            route,
            routingRule,
            controller
        };
    }
}
