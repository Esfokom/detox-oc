interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

interface ChatHistory {
    [userId: string]: ChatMessage[];
}

const chatHistory: ChatHistory = {};

export function getChatHistory(userId: string): ChatMessage[] {
    return chatHistory[userId] || [];
}

export function updateChatHistory(userId: string, message: ChatMessage): void {
    if (!chatHistory[userId]) {
        chatHistory[userId] = [];
    }
    chatHistory[userId].push(message);
}

export function clearChatHistory(userId: string): void {
    delete chatHistory[userId];
} 