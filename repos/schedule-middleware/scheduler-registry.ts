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

import { CronJob } from "cron";
import { injectable } from "inversify";
import { DUPLICATE_SCHEDULER, NO_SCHEDULER_FOUND } from "./schedule-messages";

@injectable()
export class SchedulerRegistry {
    private readonly cronJobs = new Map<string, CronJob>();
    private readonly timeouts = new Map<string, any>();
    private readonly intervals = new Map<string, any>();

    /**
     * @deprecated Use the `doesExist` method instead.
     */
    doesExist(type: "cron" | "timeout" | "interval", name: string) {
        switch (type) {
            case "cron":
                return this.cronJobs.has(name);
            case "interval":
                return this.intervals.has(name);
            case "timeout":
                return this.timeouts.has(name);
            default:
                return false;
        }
    }

    getCronJob(name: string) {
        const ref = this.cronJobs.get(name);
        if (!ref) {
            throw new Error(NO_SCHEDULER_FOUND("Cron Job", name));
        }
        return ref;
    }

    getInterval(name: string) {
        const ref = this.intervals.get(name);
        if (typeof ref === "undefined") {
            throw new Error(NO_SCHEDULER_FOUND("Interval", name));
        }
        return ref;
    }

    getTimeout(name: string) {
        const ref = this.timeouts.get(name);
        if (typeof ref === "undefined") {
            throw new Error(NO_SCHEDULER_FOUND("Timeout", name));
        }
        return ref;
    }

    addCronJob(name: string, job: CronJob) {
        const ref = this.cronJobs.get(name);
        if (ref) {
            throw new Error(DUPLICATE_SCHEDULER("Cron Job", name));
        }
        this.cronJobs.set(name, job);
    }

    addInterval<T = any>(name: string, intervalId: T) {
        const ref = this.intervals.get(name);
        if (ref) {
            throw new Error(DUPLICATE_SCHEDULER("Interval", name));
        }
        this.intervals.set(name, intervalId);
    }

    addTimeout<T = any>(name: string, timeoutId: T) {
        const ref = this.timeouts.get(name);
        if (ref) {
            throw new Error(DUPLICATE_SCHEDULER("Timeout", name));
        }
        this.timeouts.set(name, timeoutId);
    }

    getCronJobs(): Map<string, CronJob> {
        return this.cronJobs;
    }

    deleteCronJob(name: string) {
        const cronJob = this.getCronJob(name);
        cronJob.stop();
        this.cronJobs.delete(name);
    }

    getIntervals(): string[] {
        return [...this.intervals.keys()];
    }

    deleteInterval(name: string) {
        const interval = this.getInterval(name);
        clearInterval(interval);
        this.intervals.delete(name);
    }

    getTimeouts(): string[] {
        return [...this.timeouts.keys()];
    }

    deleteTimeout(name: string) {
        const timeout = this.getTimeout(name);
        clearTimeout(timeout);
        this.timeouts.delete(name);
    }
}
