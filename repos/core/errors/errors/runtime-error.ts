import { Errors } from "../../constants";

export abstract class RuntimeError extends Error {
    abstract type: Errors;

    constructor(message: string) {
        super(message);
    }
}
