import { LogLevel } from "./logging-interfaces";

export const LOGGER = Symbol("LOGGER");

export const defaultLogLevels: ReadonlyArray<LogLevel> = [
    "log",
    "error",
    "warn",
    "debug",
    "verbose"
];
