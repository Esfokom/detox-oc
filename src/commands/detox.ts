import { BotClient } from "@open-ic/openchat-botclient-ts";
import { Response, Request } from "express";
import axios from "axios";

export default async function Detox(req: Request, res: Response, client: BotClient) {
    const message = (client.command?.args[0].value as { String: string }).String;
    console.log(message);
    const response = await axios.post("https://detox-bot.vercel.app/detox", {
        text: message,
    }
    );
    const responseMsg = response.data.response!.label;
    console.log(responseMsg);
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