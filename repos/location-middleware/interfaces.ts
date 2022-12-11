import { interfaces } from "inversify";
import { HandlerCompleteData, IHandlerResult } from "../core";
import { NewLocation } from "./constants";

export type Location = string | number;

export interface LocationMiddlewareStorageAdapter {
    saveCurrentLocation(location: Location, metadata?: HandlerCompleteData): void;
    getCurrentLocation(): Location | undefined;
};

export interface LocationMiddlewareConfig {
    // Storage Adapter should be a class
    readonly storageAdapter?: interfaces.Newable<LocationMiddlewareStorageAdapter>;
    readonly defaultLocation?: Location;
};

export type LocationMiddlewareResult = IHandlerResult & Partial<Readonly<{
    [NewLocation]: string;
}>>;
