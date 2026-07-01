#!/usr/bin/env node
import { Command } from "commander";
import { sendTelegramMessage } from "@er_dev/sendkit-core";
import { z } from "zod";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
//#region src/index.ts
const program = new Command();
const configPath = join(homedir(), ".config", "sendkit", "config.json");
const cliConfigSchema = z.object({ telegramBotToken: z.string().min(1).optional() });
function writeTelegramBotToken(token) {
	mkdirSync(dirname(configPath), { recursive: true });
	writeFileSync(configPath, `${JSON.stringify({ telegramBotToken: token }, null, 2)}\n`, { mode: 384 });
}
function getTelegramBotToken() {
	if (!existsSync(configPath)) throw new Error("Telegram bot token is required. Run `sendkit init`.");
	const token = cliConfigSchema.parse(JSON.parse(readFileSync(configPath, "utf8"))).telegramBotToken;
	if (!token) throw new Error("Telegram bot token is required. Run `sendkit init`.");
	return token;
}
program.name("sendkit").description("SendKit CLI backed by sendkit-core");
program.command("init").description("Configure SendKit CLI local settings").requiredOption("--telegram-bot-token <botToken>", "Telegram bot token").action(async (options) => {
	writeTelegramBotToken(options.telegramBotToken);
	console.log(`Saved SendKit CLI config to ${configPath}`);
});
program.command("telegram").description("Send a Telegram message").argument("<chatId>", "Telegram chat ID").argument("<message>", "Message text to send").action(async (chatId, message) => {
	const result = await sendTelegramMessage({
		botToken: getTelegramBotToken(),
		chatId,
		message
	});
	console.log(JSON.stringify(result));
});
await program.parseAsync(process.argv).catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
});
//#endregion
export {};

//# sourceMappingURL=index.js.map