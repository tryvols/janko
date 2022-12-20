export const ROUTER = Symbol("router");
export const TELEGRAM_API = Symbol("telegram-api");
export const CONTROLLER = Symbol("controller");
export const MIDDLEWARE = Symbol("middleware");
export const MIDDLEWARE_CONTROLLER = Symbol("middleware-controller");
export const HANDLERS_CONTAINER = Symbol("handlers-container");
export const ERROR_HANDLER = Symbol("error-handler");
export const METADATA_SCANNER = Symbol("metadata-scanner");
export const APPLICATION_METADATA_ACCESSOR = Symbol("application-metadata-accessor");
export const AVAILABLE_HANDLERS_PROVIDER = Symbol("available-handlers-provider");
export const UNHANDLED_EVENT_VALIDATOR = Symbol("unhandles-event-validator");
export const MIDDLEWARE_REGISTRY = Symbol("middleware-registry");
// Errors
export const DEFAULT_ERROR = Symbol("default-error");
export const HANDLERS_ABSENCE_ERROR = Symbol("handlers-absence-error");
