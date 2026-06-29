import { z } from "zod";
//#region src/schemas.ts
const telegramMessageInputSchema = z.object({
	chatId: z.string().min(1, "Chat ID is required"),
	message: z.string().min(1, "Message is required")
});
const telegramMessageOptionsSchema = telegramMessageInputSchema.extend({ botToken: z.string().min(1, "Telegram bot token is required") });
const telegramSendMessageRequestSchema = z.object({
	chat_id: z.string().min(1),
	text: z.string().min(1)
});
const telegramSendMessageResponseSchema = z.object({
	ok: z.boolean(),
	result: z.object({ message_id: z.number() }).optional(),
	description: z.string().optional()
});
const telegramMessageOutputSchema = z.object({
	ok: z.literal(true),
	chatId: z.string(),
	messageId: z.number()
});
//#endregion
//#region src/operations.ts
async function sendTelegramMessage(input) {
	const parsedInput = telegramMessageOptionsSchema.parse(input);
	const requestBody = telegramSendMessageRequestSchema.parse({
		chat_id: parsedInput.chatId,
		text: parsedInput.message
	});
	const response = await fetch(`https://api.telegram.org/bot${parsedInput.botToken}/sendMessage`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: await Response.json(requestBody).text()
	});
	const data = telegramSendMessageResponseSchema.parse(await response.json());
	if (!response.ok || !data.ok || !data.result) throw new Error(data.description ?? "Telegram message request failed");
	return telegramMessageOutputSchema.parse({
		ok: true,
		chatId: parsedInput.chatId,
		messageId: data.result.message_id
	});
}
//#endregion
export { sendTelegramMessage, telegramMessageInputSchema, telegramMessageOptionsSchema, telegramMessageOutputSchema, telegramSendMessageRequestSchema, telegramSendMessageResponseSchema };

//# sourceMappingURL=index.js.map