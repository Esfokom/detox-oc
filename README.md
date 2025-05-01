# Detox OpenChat Bot

A sophisticated OpenChat bot that helps maintain healthy conversations by detecting toxic content and providing explanations for its classifications. The bot is built on top of OpenChat's bot framework and integrates with a FastAPI backend hosted on Vercel.

## Commands

### `/detox <message>`
Classifies whether a given message is toxic or not. The command takes a single required parameter:

- `message` (String): The text message to be analyzed for toxicity

Example usage:
```
/detox Is this message toxic?
```

The command will return a classification of either "toxic" or "non-toxic" and maintain a history of the interaction for context in subsequent commands.

### `/chat <question>`
Allows users to ask questions about the toxicity classification, particularly why a message was classified as toxic or non-toxic. The command takes a single required parameter:

- `question` (String): The question to ask about the toxicity classification

Example usage:
```
/chat Why was my message classified as non-toxic?
```

The chat command uses the history from previous `/detox` commands to provide contextual responses about the classification decisions.

## Technical Architecture

The Detox bot consists of several components:

1. **OpenChat Bot Interface**
   - Built using the OpenChat bot framework
   - Handles command parsing and user interactions
   - Maintains conversation history for context

2. **FastAPI Backend (Hosted on Vercel)**
   - `/detox` endpoint: Hosts a trained model for toxicity classification
   - `/chat` endpoint: Provides a chat interface for asking questions about classifications
   - Both endpoints maintain conversation history for contextual responses

3. **Machine Learning Models**
   - Classification Model: Trained to detect toxic content in messages
   - Chat Model: Provides explanations and answers questions about toxicity classifications

## How It Works

1. When a user sends a message with `/detox`, the bot:
   - Sends the message to the FastAPI backend
   - Receives a toxicity classification
   - Stores the interaction in its history
   - Returns the classification to the user

2. When a user asks a question with `/chat`, the bot:
   - Retrieves the relevant conversation history
   - Sends the question and history to the FastAPI backend
   - Receives a contextual response explaining the classification
   - Returns the explanation to the user

## Example Conversation Flow

```
User: /detox You're an idiot!
Bot: toxic

User: /chat Why was this message classified as toxic?
Bot: The message was classified as toxic because it contains a personal insult ("idiot") which is considered harmful language. Such language can create a hostile environment and negatively impact the conversation.

User: /detox Thank you for your help!
Bot: non-toxic

User: /chat Why was this message non-toxic?
Bot: The message was classified as non-toxic because it expresses gratitude in a polite and respectful manner. It contributes positively to the conversation without any harmful or offensive language.
```

## Development

The project is built with:
- TypeScript for the OpenChat bot interface
- FastAPI for the backend services
- Vercel for hosting the backend
- OpenChat's bot framework for integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 