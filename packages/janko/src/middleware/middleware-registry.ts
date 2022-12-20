import { injectable, interfaces } from "inversify";
import { MIDDLEWARE } from "../constants";
import { getClassName } from "../helpers";
import { IMiddleware, MiddlewareDescriptor, RegisterMiddlewareOptions } from "../interfaces";
import { LOGGER, LoggerService } from "./internal";
import { Middleware } from "./middleware";

@injectable()
export class MiddlewareRegistry {
    private readonly middlewareDescriptors: MiddlewareDescriptor[] = [];

    constructor(
        private readonly container: interfaces.Container
    ) {}

    registerMiddleware<T>(middleware: interfaces.Newable<IMiddleware<T>>, config?: T & RegisterMiddlewareOptions) {
        if (this.isMiddlewareRegistered(middleware)) {
            throw new Error(`Middleware ${getClassName(middleware)} is already registered!`);
        }

        const descriptor = {
            middleware,
            config,
            activated: false
        };

        this.middlewareDescriptors.push(descriptor);

        if (config?.applyImmediately) {
            this.applyMiddleware(descriptor);
        }
    }

    applyAllMiddleware(): void {
        // We should add handling of middleware dependencies (as it makes sense)
        // Also we should analyse it for cyclic dependencies
        // Current version is simplified to allow to work with middleware whild
        // it doesn't have dependencies
        this.middlewareDescriptors.forEach(this.applyMiddleware.bind(this));
        this.logger.log("All middleware initialized!");
    }

    private applyMiddleware(descriptor: MiddlewareDescriptor) {
        const {middleware, config, activated} = descriptor;

        if (activated) {
            return;
        }

        // At first we register required dependencies that are using with inversify
        middleware.prototype?.beforeInit?.(this.container, config);
        const middlewareInstance = this.container.resolve<Middleware>(middleware);
        middlewareInstance.onInit?.(config);
        this.container.bind<Middleware>(MIDDLEWARE).toConstantValue(middlewareInstance);

        descriptor.activated = true;

        this.logger.log(`Inited ${getClassName(middleware)} middleware.`);
    }

    private isMiddlewareRegistered(middleware: interfaces.Newable<IMiddleware>) {
        return this.middlewareDescriptors.some(
            descriptor => getClassName(descriptor.middleware) === getClassName(middleware)
        );
    }

    private get logger(): LoggerService {
        return this.container.get<LoggerService>(LOGGER);
    }
}