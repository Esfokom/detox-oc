import { BotClient } from "@open-ic/openchat-botclient-ts";
import { Response, Request } from "express";
import axios from "axios";
import { updateChatHistory, clearChatHistory, getChatHistory } from "../state/chatHistory";

export default async function Detox(req: Request, res: Response, client: BotClient) {
    const message = (client.command?.args[0].value as { String: string }).String;
    const userId = client.initiator;

    console.log(`[Detox] Processing message from user ${userId}:`, message);

    const response = await axios.post("https://detox-bot.vercel.app/detox", {
        text: message,
    });

    console.log('[Detox] Received response:', JSON.stringify(response.data, null, 2));

    const responseMsg = response.data.response!.label;
    const history = response.data.history || [];

    console.log(`[Detox] Extracted label: ${responseMsg}`);
    console.log(`[Detox] Extracted history:`, JSON.stringify(history, null, 2));

    // Clear existing history and update with new history from response
    if (userId) {
        clearChatHistory(userId);
        history.forEach((msg: any) => {
            updateChatHistory(userId, {
                role: msg.role,
                content: msg.content
            });
        });
        console.log(`[Detox] Updated chat history for user ${userId}:`, JSON.stringify(getChatHistory(userId), null, 2));
    }

    const final = await client.createTextMessage(responseMsg);
    final.setFinalised(true);
    client
        .sendMessage(final)
        .then(() => console.log("Message sent successfully"))
        .catch((err) => console.log("Error sending message:", err));

    res.status(200).json({
        message: final.toResponse()
    });
}