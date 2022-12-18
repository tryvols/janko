import { injectable } from "inversify";
import { Location, LocationService } from "../interfaces";

@injectable()
export class RuntimeLocationStorageAdapter implements LocationService {
    private location: Location;

    setCurrentLocation(location: Location): void {
        this.location = location;
    }

    getCurrentLocation(): Location | undefined {
        return this.location;
    }
}
