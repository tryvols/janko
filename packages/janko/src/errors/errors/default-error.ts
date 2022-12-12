import { Errors } from "../../constants";
import { RuntimeError } from "./runtime-error";

export class DefaultError extends RuntimeError {
    type = Errors.DefaultError;

    constructor() {
        super("Sorry, we can't handle your response");
        this.name = Errors.DefaultError;
    }
}
