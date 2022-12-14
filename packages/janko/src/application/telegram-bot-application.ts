import "reflect-metadata";
import TelegramAPI from "node-telegram-bot-api";
import { Container, interfaces } from "inversify";
import { MetadataScanner } from "../core";
import {
    Router,
    HandlersContainer,
    AvailableHandlersProvider,
    UnhandledEventValidator
} from "../router";
import {
    AppErrorHandler,
    RegisterMiddlewareOptions,
    TelegramBotApplicationOptions
} from "../interfaces";
import {
    APPLICATION_METADATA_ACCESSOR,
    AVAILABLE_HANDLERS_PROVIDER,
    CONTROLLER,
    DEFAULT_ERROR,
    ERROR_HANDLER,
    HANDLERS_ABSENCE_ERROR,
    HANDLERS_CONTAINER,
    METADATA_SCANNER,
    MIDDLEWARE,
    MIDDLEWARE_CONTROLLER,
    MIDDLEWARE_REGISTRY,
    ROUTER,
    TELEGRAM_API,
    UNHANDLED_EVENT_VALIDATOR
} from "../constants";
import {
    LoggerService,
    LOGGER,
    LoggingMiddleware,
    Middleware,
    MiddlewareController
} from "../middleware";
import {
    DefaultError,
    ApplicationErrorHandler,
    HandlersAbsenceError
} from "../errors";
import { ApplicationMetadataAccessor } from "../metadata";
import { MiddlewareRegistry } from "../middleware/middleware-registry";

export class TelegramBotApplication {
    private readonly container = new Container();

    constructor(options: TelegramBotApplicationOptions) {
        this.initMiddleware(options);
        this.initServices(options);
        this.initApplicationShutdownHandler();
        this.logger.log("Application initialized!");
    }

    private initMiddleware(options: TelegramBotApplicationOptions) {
        this.container.bind<MiddlewareRegistry>(MIDDLEWARE_REGISTRY).toDynamicValue(ctx => {
            return new MiddlewareRegistry(ctx.container);
        }).inSingletonScope();
        this.useMiddleware(LoggingMiddleware, {
            applyImmediately: true,
            isEnable: options.logging ?? true
        });
    }

    private initServices(options: TelegramBotApplicationOptions) {
        this.container.bind<TelegramAPI>(TELEGRAM_API).toDynamicValue(() => {
            return new TelegramAPI(options.token, options);
        }).inSingletonScope();
        this.container.bind<Router>(ROUTER).to(Router).inSingletonScope();
        this.container.bind<MetadataScanner>(METADATA_SCANNER).to(MetadataScanner).inSingletonScope();
        this.container.bind<MiddlewareController>(MIDDLEWARE_CONTROLLER).to(MiddlewareController).inSingletonScope();
        this.container.bind<AppErrorHandler>(ERROR_HANDLER).to(ApplicationErrorHandler).inSingletonScope();
        this.container.bind<HandlersContainer>(HANDLERS_CONTAINER).to(HandlersContainer).inSingletonScope();
        this.container.bind<ApplicationMetadataAccessor>(APPLICATION_METADATA_ACCESSOR)
            .to(ApplicationMetadataAccessor).inSingletonScope();
        this.container.bind<AvailableHandlersProvider>(AVAILABLE_HANDLERS_PROVIDER)
            .to(AvailableHandlersProvider).inSingletonScope();
        this.container.bind<UnhandledEventValidator>(UNHANDLED_EVENT_VALIDATOR)
            .to(UnhandledEventValidator).inSingletonScope();
        // Errors
        this.container.bind<interfaces.Newable<Error>>(DEFAULT_ERROR).toConstructor(DefaultError);
        this.container.bind<interfaces.Newable<Error>>(HANDLERS_ABSENCE_ERROR).toConstructor(HandlersAbsenceError);
    }

    getContainer(): Container {
        return this.container;
    }

    run(): void {
        // We are applying middleware exactly before the application has started
        // to prevent any time-based issues
        this.middlewareRegistry.applyAllMiddleware();
        // Router is the main node of the application
        this.container.get(ROUTER);
        this.logger.log("Application started!");
    }

    registerController<T>(controller: interfaces.Newable<T>): void {
        this.container.bind<T>(CONTROLLER).to(controller);
    }

    useMiddleware<T>(
        middleware: interfaces.Newable<Middleware<T>>,
        config?: RegisterMiddlewareOptions & T
    ): void {
        this.middlewareRegistry.registerMiddleware(middleware, config);
    }

    private initApplicationShutdownHandler() {
        process.on("SIGTERM", () => {
            const middleware = this.container.getAll<Middleware>(MIDDLEWARE);
            middleware.forEach(m => m?.onDestroy?.());
            this.logger.log("Application destroyed!");
        });
    }

    private get logger(): LoggerService {
        return this.container.get<LoggerService>(LOGGER);
    }

    private get middlewareRegistry(): MiddlewareRegistry {
        return this.container.get<MiddlewareRegistry>(MIDDLEWARE_REGISTRY);
    }
}
