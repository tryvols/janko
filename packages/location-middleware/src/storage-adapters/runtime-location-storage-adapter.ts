import { injectable } from "inversify";
import { Location, LocationMiddlewareStorageAdapter } from "../interfaces";

@injectable()
export class RuntimeLocationStorageAdapter implements LocationMiddlewareStorageAdapter {
    private location: Location;

    saveCurrentLocation(location: Location): void {
        this.location = location;
    }

    getCurrentLocation(): Location | undefined {
        return this.location;
    }
}
