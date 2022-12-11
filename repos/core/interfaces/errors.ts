import { HandlerData } from "./handlers";

export interface AppErrorHandler {
    wrap(callback: (data: HandlerData) => Promise<void>): (data: HandlerData) => void;
    onError(error: Error, data: HandlerData): Promise<void>;
};
