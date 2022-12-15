import { injectable } from "inversify";
import dayjs from "dayjs";
import winston from "winston";
import { LoggerService, LogLevel } from "../logging-interfaces";

@injectable()
export class ConsoleLogger implements LoggerService {
    private activeLevels: ReadonlyArray<LogLevel> = [];

    private readonly logger = winston.createLogger({
        level: "verbose",
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.label({ label: "janko" }),
                    winston.format.timestamp(),
                    winston.format.printf(info => {
                        const date = dayjs(info.timestamp).format("HH:mm:ss");
                        return `${info.label} ${date} [${info.level}]: ${info.message}`;
                    })
                )
            })
        ]
    });

    log(message: string): void {
        if (!this.activeLevels.includes("log")) {
            return;
        }
        this.logger.info(message);
    }

    error(message: string): void {
        if (!this.activeLevels.includes("error")) {
            return;
        }
        this.logger.error(message);
    }
    
    warn(message: any): void {
        if (!this.activeLevels.includes("warn")) {
            return;
        }
        this.logger.warn(message);
    }

    debug(message: string): void {
        if (!this.activeLevels.includes("debug")) {
            return;
        }
        this.logger.debug(message);
    }

    verbose(message: any): void {
        if (!this.activeLevels.includes("verbose")) {
            return;
        }
        this.logger.verbose(message);
    }

    setLogLevels(levels: ReadonlyArray<LogLevel>) {
        this.activeLevels = levels;
    }
}
