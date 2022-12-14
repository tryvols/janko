import TelegramAPI from "node-telegram-bot-api";

export interface TelegramBotApplicationOptions extends TelegramAPI.ConstructorOptions {
    token: string;
    logging?: boolean;
}
