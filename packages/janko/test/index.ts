import { TelegramBotApplication } from "../src";
import { TestController } from "./test-controller";

function bootstrap() {
    const app = new TelegramBotApplication({
        token: "some-token",
        polling: true
    });
    app.registerController(TestController);
    app.run();
}
bootstrap();
