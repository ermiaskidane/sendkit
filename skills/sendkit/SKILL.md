---
name: sendkit
description: Use sendkit to send Telegram messages from agents through the SendKit MCP tool or CLI fallback. Use when a user asks to send a Telegram message, use SendKit, interact with the SendKit toolset, verify SendKit manually, or choose between SendKit MCP and CLI workflows.
---

# SendKit - Telegram Messaging for Agents

SendKit enables agents to send Telegram messages through two workflows: the MCP tool (preferred) or the CLI fallback.

## Workflow Selection

### MCP Tool (Preferred)
If the `telegram` MCP tool is available, use it directly:

```
Tool: telegram
Input:
  chatId: "<telegram_chat_id>"
  message: "<message_text>"
```

The MCP tool returns a structured response with `messageId` and `chatId` on success.

### CLI Fallback
If the MCP tool is unavailable, use the SendKit CLI:

```bash
sendkit telegram <chatId> "<message>"
```

**First-time setup** (only needed once):
```bash
sendkit init --telegram-bot-token <YOUR_BOT_TOKEN>
```

This stores the token in `~/.config/sendkit/config.json`.

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `chatId`  | Yes      | The Telegram chat ID (user or group) |
| `message` | Yes      | The message text to send |

## Verifying SendKit Manually

To verify the setup works:

1. **Check CLI installation**: `sendkit --help`
2. **Test message**: `sendkit telegram <your_chat_id> "Test message"`
3. **Check config**: Verify `~/.config/sendkit/config.json` contains the bot token

## Getting Required Values

### Bot Token
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the prompts
3. Copy the token provided

### Chat ID
1. Start a chat with your bot
2. Send any message to the bot
3. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find `chat.id` in the response

## Success Response

```json
{
  "ok": true,
  "chatId": "123456789",
  "messageId": 42
}
```

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "Telegram bot token is required" | Run `sendkit init --telegram-bot-token <token>` |
| "Chat not found" | Ensure the user has started a conversation with your bot |
| "Unauthorized" | Verify the bot token is correct |
