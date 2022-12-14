/**
(The MIT License)

Copyright (c) 2017-2022 Kamil Mysliwiec <https://kamilmysliwiec.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {
    inject,
    injectable,
    multiInject
} from "inversify";
import {
    CONTROLLER,
    METADATA_SCANNER,
    MetadataScanner,
    LOGGER,
    LoggerService
} from "janko";
import {
    SchedulerType,
    SCHEDULER_METADATA_ACCESSOR,
    SCHEDULER_ORCHESTRATOR
} from "./constants";
import { SchedulerMetadataAccessor } from "./scheduler-metadata-accessor";
import { SchedulerOrchestrator } from "./scheduler-orchestrator";

@injectable()
export class ScheduleExplorer {
    constructor(
        @multiInject(CONTROLLER) private readonly controllers: object[],
        @inject(SCHEDULER_ORCHESTRATOR) private readonly schedulerOrchestrator: SchedulerOrchestrator,
        @inject(SCHEDULER_METADATA_ACCESSOR) private readonly metadataAccessor: SchedulerMetadataAccessor,
        @inject(METADATA_SCANNER) private readonly metadataScanner: MetadataScanner,
        @inject(LOGGER) private readonly logger: LoggerService
    ) {}

    explore() {
        this.controllers.forEach((controller: object) => {
            if (!controller || !Object.getPrototypeOf(controller)) {
                return;
            }
            this.metadataScanner.scanFromPrototype(
                Object.getPrototypeOf(controller),
                (key: string) => this.lookupSchedulers(controller as Record<string, Function>, key)
            );
        });
    }

    lookupSchedulers(instance: Record<string, Function>, key: string) {
        const methodRef = instance[key];
        const metadata = this.metadataAccessor.getSchedulerType(methodRef);
        switch (metadata) {
            case SchedulerType.CRON: {
                const cronMetadata = this.metadataAccessor.getCronMetadata(methodRef);
                const cronFn = this.wrapFunctionInTryCatchBlocks(methodRef, instance);

                return this.schedulerOrchestrator.addCron(cronFn, cronMetadata!);
            }
            case SchedulerType.TIMEOUT: {
                const timeoutMetadata = this.metadataAccessor.getTimeoutMetadata(
                    methodRef,
                );
                const name = this.metadataAccessor.getSchedulerName(methodRef);
                const timeoutFn = this.wrapFunctionInTryCatchBlocks(
                    methodRef,
                    instance,
                );

                return this.schedulerOrchestrator.addTimeout(
                    timeoutFn,
                    timeoutMetadata!.timeout,
                    name,
                );
            }
            case SchedulerType.INTERVAL: {
                const intervalMetadata = this.metadataAccessor.getIntervalMetadata(
                    methodRef,
                );
                const name = this.metadataAccessor.getSchedulerName(methodRef);
                const intervalFn = this.wrapFunctionInTryCatchBlocks(
                    methodRef,
                    instance,
                );

                return this.schedulerOrchestrator.addInterval(
                    intervalFn,
                    intervalMetadata!.timeout,
                    name,
                );
            }
        }
    }

    private wrapFunctionInTryCatchBlocks(methodRef: Function, instance: object) {
        return async (...args: unknown[]) => {
            try {
                await methodRef.call(instance, ...args);
            } catch (error) {
                this.logger.error(error);
            }
        };
    }
}
