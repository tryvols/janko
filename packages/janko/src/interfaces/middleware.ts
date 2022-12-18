import { Container } from "inversify";
import { HandlerData } from "./handlers";

export type NextMiddleware = () => void;

export interface IMiddleware<T = any> {
    beforeHandling?(data: HandlerData, next: NextMiddleware): void;
    afterHandling?(data: HandlerData): void;
    beforeInit?(container: Container, config?: T): void;
    onInit?(config?: T): void;
    onDestroy?(): void;
};
