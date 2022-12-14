import { TelegramBotApplication } from "janko";
import { GeneralController } from "./general-controller";

function bootstrap() {
    const app = new TelegramBotApplication({
        token: process.env.TELEGRAM_BOT_TOKEN,
        polling: true
    });
    app.registerController(GeneralController);
    app.run();
}
bootstrap();
