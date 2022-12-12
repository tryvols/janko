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

import { v4 } from "uuid";
import { CronJob } from "cron";
import { inject, injectable } from "inversify";
import { CronOptions } from "./interfaces";
import { SchedulerRegistry } from "./scheduler-registry";
import { SCHEDULER_REGISTRY } from "./constants";

type TargetHost = { target: Function };
type TimeoutHost = { timeout: number };
type RefHost<T> = { ref?: T };

type CronOptionsHost = {
    options: CronOptions & Record<"cronTime", string | Date | any>;
};

type IntervalOptions = TargetHost & TimeoutHost & RefHost<number>;
type TimeoutOptions = TargetHost & TimeoutHost & RefHost<number>;
type CronJobOptions = TargetHost & CronOptionsHost & RefHost<CronJob>;
  
@injectable()
export class SchedulerOrchestrator {
    private readonly cronJobs: Record<string, CronJobOptions> = {};
    private readonly timeouts: Record<string, TimeoutOptions> = {};
    private readonly intervals: Record<string, IntervalOptions> = {};
  
    constructor(@inject(SCHEDULER_REGISTRY) private readonly schedulerRegistry: SchedulerRegistry) {}
  
    onBootstrap() {
        this.mountTimeouts();
        this.mountIntervals();
        this.mountCron();
    }
  
    onDestroy() {
        this.clearTimeouts();
        this.clearIntervals();
        this.closeCronJobs();
    }
  
    mountIntervals() {
        const intervalKeys = Object.keys(this.intervals);
        intervalKeys.forEach((key) => {
            const options = this.intervals[key];
            const intervalRef = setInterval(options.target, options.timeout);
    
            options.ref = intervalRef;
            this.schedulerRegistry.addInterval(key, intervalRef);
        });
    }
  
    mountTimeouts() {
        const timeoutKeys = Object.keys(this.timeouts);
        timeoutKeys.forEach((key) => {
            const options = this.timeouts[key];
            const timeoutRef = setTimeout(options.target, options.timeout);
    
            options.ref = timeoutRef;
            this.schedulerRegistry.addTimeout(key, timeoutRef);
        });
    }
  
    mountCron() {
        const cronKeys = Object.keys(this.cronJobs);
        cronKeys.forEach((key) => {
            const { options, target } = this.cronJobs[key];
            const cronJob = new CronJob(
                options.cronTime,
                target as any,
                undefined,
                false,
                options.timeZone,
                undefined,
                false,
                options.utcOffset,
                options.unrefTimeout,
            );
            cronJob.start();
    
            this.cronJobs[key].ref = cronJob;
            this.schedulerRegistry.addCronJob(key, cronJob);
        });
    }
  
    clearTimeouts() {
        this.schedulerRegistry.getTimeouts().forEach((key) =>
            this.schedulerRegistry.deleteTimeout(key),
        );
    }
  
    clearIntervals() {
        this.schedulerRegistry.getIntervals().forEach((key) =>
            this.schedulerRegistry.deleteInterval(key),
        );
    }
  
    closeCronJobs() {
        Array.from(this.schedulerRegistry.getCronJobs().keys()).forEach((key) =>
            this.schedulerRegistry.deleteCronJob(key),
        );
    }
  
    addTimeout(methodRef: Function, timeout: number, name: string = v4()) {
        this.timeouts[name] = {
            target: methodRef,
            timeout,
        };
    }
  
    addInterval(methodRef: Function, timeout: number, name: string = v4()) {
        this.intervals[name] = {
            target: methodRef,
            timeout,
        };
    }
  
    addCron(
      methodRef: Function,
      options: CronOptions & Record<"cronTime", string | Date | any>,
    ) {
        const name = options.name || v4();
        this.cronJobs[name] = {
            target: methodRef,
            options,
        };
    }
}
