import { Errors } from "../../constants";
import { RuntimeError } from "./runtime-error";

export class HandlersAbsenceError extends RuntimeError {
    type = Errors.HandlersAbsenceError;

    constructor() {
        super("Sorry, I can't handle your request. Try another command.");
        this.name = Errors.HandlersAbsenceError;
    }
}
