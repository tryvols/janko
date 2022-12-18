import { interfaces } from "inversify";
import { HandlerCompleteData } from "janko";

export type Location = string | number;

export interface LocationService {
    setCurrentLocation(location: Location, metadata?: HandlerCompleteData): void;
    getCurrentLocation(): Location | undefined;
};

export interface LocationMiddlewareConfig {
    // Storage Adapter should be a class
    readonly storageAdapter?: interfaces.Newable<LocationService>;
    readonly defaultLocation?: Location;
};
