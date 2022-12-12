import { injectable, multiInject, optional } from "inversify";
import { MIDDLEWARE } from "../constants";
import { HandlerCompleteData, IHandlerResult } from "../interfaces";
import { Middleware } from "./middleware";

@injectable()
export class MiddlewareController {
    constructor(
        @multiInject(MIDDLEWARE) @optional() private readonly middleware: Middleware[] = []
    ) {}

    /**
     * This is adapter function that encapsulate how we apply needed middlewares
     * @param data - request data
     * @returns true if request should be handled and false if shoudn't
     */
    beforeHandling(data: HandlerCompleteData): boolean {
        const availableMiddleware = this.middleware.filter(m => m?.beforeHandling);
        let currentMiddlewareIndex = 0;
        let currentMiddleware = availableMiddleware[currentMiddlewareIndex];
        let isMiddlewareInProgress = false;

        while (currentMiddleware) {
            isMiddlewareInProgress = true;

            currentMiddleware.beforeHandling(data, () => {
                currentMiddleware = availableMiddleware[++currentMiddlewareIndex];
                isMiddlewareInProgress = false;
            });

            if (isMiddlewareInProgress) {
                // If middleware is in progress at the point
                // - next callback hasn't been called, which means interruption
                // of the chain and handling as a whole
                return false;
            }
        }

        // No one middleware interrupted the chain and we
        // should call handler if it exists
        return true;
    }

    /**
     * This is adapter function that encapsulate how we apply needed middlewares
     * @param data - request data
     * @returns true if request should be handled and false if shoudn't
     */
    afterHandling(data: HandlerCompleteData, result: IHandlerResult = {}): void {
        this.middleware.forEach(m => m?.afterHandling?.(data, result));
    }
}
