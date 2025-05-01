import { Request, Response } from "express";
import { WithBotClient } from "../types";
import Detox from "../commands/detox";
import DetoxChat from "../commands/detoxChat";

function hasBotClient(req: Request): req is WithBotClient {
    return (req as WithBotClient).botClient !== undefined;
}

export default async function executeCommand(req: Request, res: Response) {
    if (!hasBotClient(req)) {
        res.status(400).json({ error: "Bot client not found" });
        return;
    }
    console.log("Bot client found");
    const client = req.botClient;

    switch (client.commandName) {
        case "detox":
            Detox(req, res, client);
            break;
        case "chat":
            DetoxChat(req, res, client);
            break;
        default:
            break;
    }
    console.log("Initiator", client.initiator);
    console.log("Command name:", client.commandName);

    // res.status(200).json();
}