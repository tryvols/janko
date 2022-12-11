import { Container, inject, injectable } from "inversify";
import { Middleware } from "../core";
import {
    SCHEDULE_EXPLORER,
    SCHEDULER_METADATA_ACCESSOR,
    SCHEDULER_ORCHESTRATOR,
    SCHEDULER_REGISTRY
} from "./constants";
import { ScheduleExplorer } from "./schedule-explorer";
import { SchedulerMetadataAccessor } from "./scheduler-metadata-accessor";
import { SchedulerOrchestrator } from "./scheduler-orchestrator";
import { SchedulerRegistry } from "./scheduler-registry";

@injectable()
export class ScheduleMiddleware extends Middleware {
    constructor(
        @inject(SCHEDULE_EXPLORER) private readonly scheduleExplorer: ScheduleExplorer,
        @inject(SCHEDULER_ORCHESTRATOR) private readonly scheduleOrchestrator: SchedulerOrchestrator
    ) {
        super();
    }

    beforeInit(container: Container): void {
        container.bind<SchedulerMetadataAccessor>(SCHEDULER_METADATA_ACCESSOR)
            .to(SchedulerMetadataAccessor).inSingletonScope();

        container.bind<SchedulerRegistry>(SCHEDULER_REGISTRY)
            .to(SchedulerRegistry).inSingletonScope();

        container.bind<SchedulerOrchestrator>(SCHEDULER_ORCHESTRATOR)
            .to(SchedulerOrchestrator).inSingletonScope();

        container.bind<ScheduleExplorer>(SCHEDULE_EXPLORER)
            .to(ScheduleExplorer).inSingletonScope();
    }

    onInit(): void {
        this.scheduleExplorer.explore();
        this.scheduleOrchestrator.onBootstrap();
    }

    onDestroy(): void {
        this.scheduleOrchestrator.onDestroy();
    }
}
