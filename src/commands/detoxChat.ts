import { BotClient } from "@open-ic/openchat-botclient-ts";
import axios from "axios";
import { Request, Response } from "express";

export default async function DetoxChat(req: Request, res: Response, client: BotClient) {

    const message = (client.command?.args[0].value as { String: string }).String;
    const clientId = client.initiator;
    const response = await axios.post(`https://detox-bot.vercel.app/chat`, {
        text: message,
        history: []
    }
    );
    const responseMsg = response.data.response;
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