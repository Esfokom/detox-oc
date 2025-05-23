import { BotClient } from "@open-ic/openchat-botclient-ts";
import axios from "axios";
import { Request, Response } from "express";
import { getChatHistory, updateChatHistory } from "../state/chatHistory";

export default async function DetoxChat(req: Request, res: Response, client: BotClient) {
    const message = (client.command?.args[0].value as { String: string }).String;
    const userId = client.initiator;

    console.log(`[DetoxChat] Processing message from user ${userId}:`, message);

    // Get existing chat history for this user
    const history = userId ? getChatHistory(userId) : [];
    console.log(`[DetoxChat] Retrieved history for user ${userId}:`, JSON.stringify(history, null, 2));

    const response = await axios.post(`https://detox-bot.vercel.app/chat`, {
        text: message,
        history: history
    });

    console.log('[DetoxChat] Received response:', JSON.stringify(response.data, null, 2));

    const responseMsg = response.data.response;

    // Update chat history with new interaction
    if (userId) {
        // Add user's message to history
        updateChatHistory(userId, {
            role: "user",
            content: message
        });

        // Add AI's response to history
        updateChatHistory(userId, {
            role: "assistant",
            content: responseMsg
        });

        console.log(`[DetoxChat] Updated chat history for user ${userId}:`, JSON.stringify(getChatHistory(userId), null, 2));
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