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

import { isString } from "lodash";
import { SchedulerType } from "../constants";
import {
  SCHEDULER_NAME,
  SCHEDULER_TYPE,
  SCHEDULE_INTERVAL_OPTIONS,
} from "../constants";

/**
 * Schedules an interval (`setInterval`).
 */
export function Interval(timeout: number): MethodDecorator;
/**
 * Schedules an interval (`setInterval`).
 */
export function Interval(name: string, timeout: number): MethodDecorator;
/**
 * Schedules an interval (`setInterval`).
 */
export function Interval(
  nameOrTimeout: string | number,
  timeout?: number,
): MethodDecorator {
    const [name, intervalTimeout] = isString(nameOrTimeout)
        ? [nameOrTimeout, timeout]
        : [undefined, nameOrTimeout];

    return <T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): void => {
        Reflect.defineMetadata(SCHEDULE_INTERVAL_OPTIONS, { timeout: intervalTimeout }, descriptor?.value);
        Reflect.defineMetadata(SCHEDULER_NAME, name, descriptor?.value);
        Reflect.defineMetadata(SCHEDULER_TYPE, SchedulerType.CRON, descriptor?.value);
    };
};
