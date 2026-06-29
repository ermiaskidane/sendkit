// ######################### 1 step solution #########################################
import { Command } from "commander";
import { sendTelegramMessage } from "sendkit-core";
import { z } from "zod";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";

const program = new Command();

const configPath = join(homedir(), ".config", "sendkit", "config.json");
const cliConfigSchema = z.object({
  telegramBotToken: z.string().min(1).optional(),
});

function writeTelegramBotToken(token: string) {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify({ telegramBotToken: token }, null, 2)}\n`, {
    mode: 0o600,
  });
}

function getTelegramBotToken() {
  if (!existsSync(configPath)) {
    throw new Error("Telegram bot token is required. Run `sendkit init`.");
  }

  const config = cliConfigSchema.parse(JSON.parse(readFileSync(configPath, "utf8")));
  const token = config.telegramBotToken;

  if (!token) {
    throw new Error("Telegram bot token is required. Run `sendkit init`.");
  }

  return token;
}

program.name("sendkit").description("SendKit CLI backed by sendkit-core");

// https://github.com/tj/commander.js
program
  .command("init")
  .description("Configure SendKit CLI local settings")
  .requiredOption("--telegram-bot-token <botToken>", "Telegram bot token")
  .action(async (options: { telegramBotToken: string }) => {
    writeTelegramBotToken(options.telegramBotToken);
    console.log(`Saved SendKit CLI config to ${configPath}`);
  });

program
  .command("telegram")
  .description("Send a Telegram message")
  .argument("<chatId>", "Telegram chat ID")
  .argument("<message>", "Message text to send")
  .action(async (chatId: string, message: string) => {
    const result = await sendTelegramMessage({
      botToken: getTelegramBotToken(),
      chatId,
      message,
    });

    console.log(JSON.stringify(result));
  });

await program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

// ######################### 2 step solution #########################################

// import { Command } from "commander";
// import { sendTelegramMessage } from "sendkit-core";

// const program = new Command();

// program
//   .name("sendkit")
//   .description("sendkit Tutotial CLI")
//   .command("telegram")
//   .description("Send a Telegram message")
//   .argument("<chatId>", "Telegram chat ID")
//   .argument("<message>", "Message text to send")
//   .action(async (chatId: string, message: string) => {
//     // console.log(`Sending message to Telegram: ${message} to chat ID: ${chatId}`);
//     // console.log(chatId, message);

//     const token = process.env.TELEGRAM_BOT_TOKEN;

//     if (!token) {
//       console.error("Missing TELEGRAM_BOT_TOKEN environment variable");
//       process.exit(1);
//     }

//     if (!chatId) {
//       console.error("Missing telegram chatId argument");
//       process.exit(1);
//     }

//     if (!message) {
//       console.error("Missing telegram message argument");
//       process.exit(1);
//     }

//     try {
//       const result = await sendTelegramMessage({
//         chatId,
//         message,
//         botToken: token,
//       });
//       console.log(`Message sent successfully to Telegram: ${result.messageId}`);
//       console.log(`Sent telegram message to chat ID: ${result.chatId}`);
//     } catch (error) {
//       const detail = error instanceof Error ? error.message : String(error);
//       console.error(`Telegram API request failed: ${detail}`);
//       process.exit(1);
//     }
//   });

// program.parseAsync(process.argv);

// ######################### 1 step solution #########################################

// import { Command } from "commander";

// type TelegramResponse = {
//   ok: boolean;
//   result?: {
//     message_id?: number;
//     description?: string;
//   };
// };

// const program = new Command();

// program
//   .name("sendkit")
//   .description("sendkit Tutotial CLI")
//   .command("telegram")
//   .description("Send a Telegram message")
//   .argument("<chatId>", "Telegram chat ID")
//   .argument("<message>", "Message text to send")
//   .action(async (chatId: string, message: string) => {
//     // console.log(`Sending message to Telegram: ${message} to chat ID: ${chatId}`);
//     // console.log(chatId, message);

//     const token = process.env.TELEGRAM_BOT_TOKEN;

//     if (!token) {
//       console.error("Missing TELEGRAM_BOT_TOKEN environment variable");
//       process.exit(1);
//     }

//     if (!chatId) {
//       console.error("Missing telegram chatId argument");
//       process.exit(1);
//     }

//     if (!message) {
//       console.error("Missing telegram message argument");
//       process.exit(1);
//     }

//     const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         chat_id: chatId,
//         text: message,
//        }),
//     });

//     const data = await response.json() as TelegramResponse;

//     if (!response.ok || !data.ok) {
//       const detail = data.result?.description ?? response.statusText;
//       console.error(`Telegram API error: ${detail}`)
//       process.exit(1);
//     }

//     const messageId = data.result?.message_id;
//     console.log(`Message sent successfully to Telegram: ${messageId}`);

//     console.log(`Sent telegram message to chat ID: ${chatId}`);

//     if (messageId !== undefined) {
//       console.log(`telegram message ID: ${messageId}`);
//     }
//   });

// program.parseAsync(process.argv);

// https://api.telegram.org/bot8943498387:AAEa-ktlLUQHmKV7vjWAeahavn1M4IfyjwE/getUpdates
