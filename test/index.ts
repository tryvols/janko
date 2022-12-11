import { TelegramBotApplication } from "../repos/core/application";
import { TestController } from "./test-controller";

function bootstrap() {
    const app = new TelegramBotApplication({
        token: "5684351457:AAGFrOOkcxo02ZH79r5HNVmTQnp-naG8CTs",
        polling: true
    });
    app.registerController(TestController);
    app.run();
}
bootstrap();
