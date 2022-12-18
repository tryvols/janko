import { Container, injectable } from "inversify";
import { HandlerCompleteData } from "../interfaces";
import { IMiddleware, NextMiddleware } from "../interfaces/middleware";

@injectable()
export abstract class Middleware<T = any> implements IMiddleware<T> {
    /**
     * Allows to mutate data and interrupt execution.
     * In the middleware you can add your own fields to data object
     * and use it in your handlers
     */
    beforeHandling?(data: HandlerCompleteData, next: NextMiddleware): void;

    /**
     * This helps to handle in middleware some additional data which is result of handler's work
     * or add some logic to finish something based on timeline
     */
    afterHandling?(data: HandlerCompleteData): void;

    /**
     * Allows to add to inversify entities that may use other inversify bindings.
     * This makes middleware really flexible and highly configurable.
     * Is using out of intance, so it's impossible to use `this` inside the method.
     */
    beforeInit?(container: Container, config?: T): void;

    /**
     * Allows to configure instance when it's ready. Here you can use `this` keyword.
     */
    onInit?(config?: T): void;

    /**
     * You can clean up resources when the middleware is destroyed
     */
    onDestroy?(): void;
}
