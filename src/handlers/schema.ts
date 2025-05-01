import { Permissions } from "@open-ic/openchat-botclient-ts";
import { Request, Response } from "express";

export default function schema(req: Request, res: Response) {
    res.status(200).json({
        description: "Detox is a bot designed to prevent offensive words from being used on the OpenChat platform",
        commands: [
            {
                name: "chat",
                default_role: "Participant",
                description: "This command allows you to chat with the AI to understand why you can't use certain words",
                placeholder: "Detox is thinking...",
                permissions: Permissions.encodePermissions({
                    chat: [],
                    community: [],
                    message: ["Text"],
                }),
                params: [
                    {
                        name: "message",
                        description: "Enter your message to the AI",
                        placeholder: "Enter message",
                        required: true,
                        param_type: {
                            StringParam: {
                                min_length: 0,
                                max_length: 100,
                                choices: [],
                                multi_line: false
                            }
                        },
                    }
                ]
            },
            {
                name: "detox",
                default_role: "Participant",
                description: "This command helps in detecting offensive words",
                placeholder: "Detox is detecting offensive words...",
                permissions: Permissions.encodePermissions({
                    chat: [],
                    community: [],
                    message: ["Text"],
                }),
                params: [
                    {
                        name: "Message",
                        description: "This refers to the message to be detected",
                        placeholder: "Enter message",
                        required: true,
                        param_type: {
                            StringParam: {
                                min_length: 1,
                                max_length: 10000,
                                choices: [],
                                multi_line: true
                            }
                        },
                    }
                ],
                direct_messages: true
            },
        ]
    });
}