import { Container, inject } from "inversify";
import {
    HandlerCompleteData,
    NextMiddleware,
    Middleware
} from "janko";
import {
    LOCATION_SERVICE,
    LOCATION_MIDDLEWRE_METADATA_ACCESSOR
} from "./constants";
import {
    Location,
    LocationMiddlewareConfig,
    LocationService
} from "./interfaces";
import { LocationMiddlewareMetadataAccessor } from "./location-middleware-metadata-accessor";
import { RuntimeLocationStorageAdapter } from "./storage-adapters/runtime-location-storage-adapter";

export class LocationMiddleware extends Middleware<LocationMiddlewareConfig> {
    beforeInit(container: Container, config?: LocationMiddlewareConfig): void {
        const Adapter = config?.storageAdapter || RuntimeLocationStorageAdapter;

        container.bind<LocationMiddlewareMetadataAccessor>(LOCATION_MIDDLEWRE_METADATA_ACCESSOR)
            .to(LocationMiddlewareMetadataAccessor)
            .inSingletonScope();
        container.bind<LocationService>(LOCATION_SERVICE)
            .to(Adapter)
            .inSingletonScope();
    }

    constructor(
        @inject(LOCATION_SERVICE) private readonly locationService: LocationService,
        @inject(LOCATION_MIDDLEWRE_METADATA_ACCESSOR) private readonly metadataAccessor: LocationMiddlewareMetadataAccessor
    ) {
        super();
    }

    onInit(config?: LocationMiddlewareConfig): void {
        if (config?.defaultLocation) {
            this.locationService.setCurrentLocation(config.defaultLocation);
        }
    }

    beforeHandling(data: HandlerCompleteData, next: NextMiddleware): void {
        const handlerLocation = this.getLocationFromMetadata(data);

        if (!handlerLocation || handlerLocation === this.locationService.getCurrentLocation()) {
            next();
        }
    }

    private getLocationFromMetadata(data: HandlerCompleteData): Location | undefined {
        const handlerLocation = this.metadataAccessor.getHandlerLocation(data.handlerDescriptor.handler);
        const controllerLocation = this.metadataAccessor.getControllerLocation(data.handlerDescriptor.controller);
        return handlerLocation || controllerLocation;
    }
};
