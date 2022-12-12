import { Container, inject } from "inversify";
import {
    HandlerCompleteData,
    NextMiddleware,
    Middleware
} from "janko";
import {
    LOCATION_MIDDLEWARE_STORAGE_ADAPTER,
    LOCATION_MIDDLEWRE_METADATA_ACCESSOR,
    NewLocation
} from "./constants";
import {
    Location,
    LocationMiddlewareConfig,
    LocationMiddlewareResult,
    LocationMiddlewareStorageAdapter
} from "./interfaces";
import { LocationMiddlewareMetadataAccessor } from "./location-middleware-metadata-accessor";
import { RuntimeLocationStorageAdapter } from "./storage-adapters/runtime-location-storage-adapter";

export class LocationMiddleware extends Middleware<LocationMiddlewareConfig> {
    beforeInit(container: Container, config?: LocationMiddlewareConfig): void {
        const Adapter = config?.storageAdapter || RuntimeLocationStorageAdapter;

        container.bind<LocationMiddlewareMetadataAccessor>(LOCATION_MIDDLEWRE_METADATA_ACCESSOR)
            .to(LocationMiddlewareMetadataAccessor)
            .inSingletonScope();
        container.bind<LocationMiddlewareStorageAdapter>(LOCATION_MIDDLEWARE_STORAGE_ADAPTER)
            .to(Adapter)
            .inSingletonScope();
    }

    constructor(
        @inject(LOCATION_MIDDLEWARE_STORAGE_ADAPTER) private readonly locationStorage: LocationMiddlewareStorageAdapter,
        @inject(LOCATION_MIDDLEWRE_METADATA_ACCESSOR) private readonly metadataAccessor: LocationMiddlewareMetadataAccessor
    ) {
        super();
    }

    onInit(config?: LocationMiddlewareConfig): void {
        if (config?.defaultLocation) {
            this.locationStorage.saveCurrentLocation(config.defaultLocation);
        }
    }

    beforeHandling(data: HandlerCompleteData, next: NextMiddleware): void {
        const handlerLocation = this.getLocationFromMetadata(data);

        if (!handlerLocation || handlerLocation === this.locationStorage.getCurrentLocation()) {
            next();
        }
    }

    afterHandling(data: HandlerCompleteData, result: LocationMiddlewareResult): void {
        if (result[NewLocation]) {
            this.locationStorage.saveCurrentLocation(result[NewLocation], data);
        }
    }

    private getLocationFromMetadata(data: HandlerCompleteData): Location | undefined {
        const handlerLocation = this.metadataAccessor.getHandlerLocation(data.handlerDescriptor.handler);
        const controllerLocation = this.metadataAccessor.getControllerLocation(data.handlerDescriptor.controller);
        return handlerLocation || controllerLocation;
    }
};
