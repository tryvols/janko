import { LogLevel } from "./logging-interfaces";

export const LOGGER = Symbol("APPLICATION_LOGGER");

export const defaultLogLevels: ReadonlyArray<LogLevel> = [
    "log",
    "error",
    "warn",
    "debug",
    "verbose"
];
