from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import detox_model, chat_model
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="Detox bot API",
    description="A bot that detects toxic texts and also interacts with users to some extent"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DetoxRequest(BaseModel):
    text: str
    
    
@app.post("/detox")
async def detox(request: DetoxRequest):
    """
    This endpoint takes a text input and returns "toxic" or "non-toxic".
    """
    try:
        response = detox_model(request.text)
        return response
    except Exception as e:
        return {"error": str(e)}


class ChatRequest(BaseModel):
    text: str
    history: List[dict] = []
    

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    This endpoint takes a list of messages and returns a response from the chat model.
    """
    try:
        history = request.history if request and request.history else []
        response = chat_model(text=request.text, messages=history)
        return response
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    """
    Root endpoint to check if the API is running.
    """
    return {"message": "Welcome to the Detox bot API! Use /detox or /chat endpoints."}
