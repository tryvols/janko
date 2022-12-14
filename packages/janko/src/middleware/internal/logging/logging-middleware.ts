import { Container, inject, injectable } from "inversify";
import { Middleware } from "../../middleware";
import { defaultLogLevels, LOGGER } from "./logging-constants";
import { ConsoleLogger } from "./loggers";
import { LoggerService, LoggingMiddlewareOptions } from "./logging-interfaces";

@injectable()
export class LoggingMiddleware extends Middleware<LoggingMiddlewareOptions> {
    beforeInit(container: Container): void {
        container.bind<LoggerService>(LOGGER).to(ConsoleLogger).inSingletonScope();
    }

    constructor(@inject(LOGGER) private readonly logger: LoggerService) {
        super();
    }

    onInit(config?: LoggingMiddlewareOptions): void {
        this.logger?.setLogLevels(config?.isEnable ? defaultLogLevels : []);
    }
}
