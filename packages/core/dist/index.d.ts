import { z } from "zod";

//#region src/schemas.d.ts
declare const telegramMessageInputSchema: z.ZodObject<{
  chatId: z.ZodString;
  message: z.ZodString;
}, z.core.$strip>;
declare const telegramMessageOptionsSchema: z.ZodObject<{
  chatId: z.ZodString;
  message: z.ZodString;
  botToken: z.ZodString;
}, z.core.$strip>;
declare const telegramSendMessageRequestSchema: z.ZodObject<{
  chat_id: z.ZodString;
  text: z.ZodString;
}, z.core.$strip>;
declare const telegramSendMessageResponseSchema: z.ZodObject<{
  ok: z.ZodBoolean;
  result: z.ZodOptional<z.ZodObject<{
    message_id: z.ZodNumber;
  }, z.core.$strip>>;
  description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const telegramMessageOutputSchema: z.ZodObject<{
  ok: z.ZodLiteral<true>;
  chatId: z.ZodString;
  messageId: z.ZodNumber;
}, z.core.$strip>;
type TelegramMessageInput = z.infer<typeof telegramMessageInputSchema>;
type TelegramMessageOptions = z.infer<typeof telegramMessageOptionsSchema>;
type TelegramMessageOutput = z.infer<typeof telegramMessageOutputSchema>;
//#endregion
//#region src/operations.d.ts
declare function sendTelegramMessage(input: TelegramMessageOptions): Promise<TelegramMessageOutput>;
//#endregion
export { TelegramMessageInput, TelegramMessageOptions, TelegramMessageOutput, sendTelegramMessage, telegramMessageInputSchema, telegramMessageOptionsSchema, telegramMessageOutputSchema, telegramSendMessageRequestSchema, telegramSendMessageResponseSchema };
//# sourceMappingURL=index.d.ts.map