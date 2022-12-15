import { TelegramBotApplication } from "janko";
import { LocationMiddleware } from "janko-location-middleware";
import { ScheduleMiddleware } from "janko-schedule-middleware";
import { GeneralController } from "./general-controller";

function bootstrap() {
    const app = new TelegramBotApplication({
        token: process.env.TELEGRAM_BOT_TOKEN,
        polling: true
    });
    app.registerController(GeneralController);
    app.useMiddleware(LocationMiddleware);
    app.useMiddleware(ScheduleMiddleware);
    app.run();
}
bootstrap();
