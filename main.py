from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from model import detox_model, chat_model
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="Detox bot API", description="A bot that detects toxic texts and also interacts with user to some extent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/detox")
async def detox(text: str):
    """
    This endpoint takes a text input and returns a "toxic" or "non-toxic".
    """
    try:
        # Call the Groq API with the provided text
        response = detox_model(text)
        return response
    except Exception as e:
        return {"error": str(e)}
    
class MessageHistory(BaseModel):
    history: List[dict] = []

@app.post("/chat")
async def chat(text: str, messages: MessageHistory = None):
    """
    This endpoint takes a list of messages and returns a response from the chat model.
    """
    try:
        # Ensure messages.history is a list
        history = messages.history if messages and messages.history else []
        response = chat_model(text=text, messages=history)
        return response
    except Exception as e:
        return {"error": str(e)}