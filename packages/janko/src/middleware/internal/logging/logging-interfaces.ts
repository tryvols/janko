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

export type LogLevel = "log" | "error" | "warn" | "debug" | "verbose";

export interface LoggerService {
    /**
     * Write a "log" level log.
     */
    log(message: any, ...optionalParams: any[]): any;

    /**
     * Write an "error" level log.
     */
    error(message: any, ...optionalParams: any[]): any;

    /**
     * Write a "warn" level log.
     */
    warn(message: any, ...optionalParams: any[]): any;

    /**
     * Write a "debug" level log.
     */
    debug?(message: any, ...optionalParams: any[]): any;

    /**
     * Write a "verbose" level log.
     */
    verbose?(message: any, ...optionalParams: any[]): any;

    /**
     * Set log levels.
     * @param levels log levels
     */
    setLogLevels?(levels: ReadonlyArray<LogLevel>): any;
}

export interface LoggingMiddlewareOptions {
    isEnable?: boolean;
}
