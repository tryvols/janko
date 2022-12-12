import { Errors } from "../../constants";
import { RuntimeError } from "./runtime-error";

export class TelegramError extends RuntimeError {
    type = Errors.CustomError;

    constructor(message: string) {
        super(message);
        this.name = Errors.CustomError;
    }
}
