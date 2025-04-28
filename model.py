from groq import  Groq
from dotenv import load_dotenv
from typing import List
import os
from fastapi import Query

#Load env variables
load_dotenv()
qroq_api = os.getenv("GROQ_API_KEY")

groq_client = Groq(api_key=qroq_api)



def detox_model(text: str) -> str:
    """
    Checks for toxicity and returns "toxic" or "non-toxic".
    """
    messages = [
        {"role": "system", "content": (
            "You are a toxicity detector. "
            "Given a piece of text, reply ONLY with 'toxic' or 'non-toxic'."
        )},
        {"role": "user", "content": 'Text: "I appreciate your help!"'},
        {"role": "assistant", "content": "non-toxic"},
        {"role": "user", "content": 'Text: "You are a worthless idiot!"'},
        {"role": "assistant", "content": "toxic"},
        
        {"role": "user", "content": f'Text: "{text}"'}
    ]

    
    chat_completion = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
    )

    label = chat_completion.choices[0].message.content.strip().lower()
    
    return {
        "label": label
        }
    
    


def chat_model(text: str, messages: List[dict] = Query(None)) -> dict:
    """
    Provides a chat response based on the input messages.
    """

    if messages:
        base_messages = messages
    else:
        base_messages = [
            {"role": "system", "content": (
                "You are a polite and helpful AI assistant specialized in:"
                "\n- Explaining why a text is considered toxic."
                "\n- Rewriting toxic texts into non-toxic versions."
                "\n- Responding kindly and helpfully to general conversations."
                "\nAlways maintain a professional, empathetic, and clear tone."
            )},

            {"role": "user", "content": "Why was my text 'You are so dumb and annoying' considered toxic?"},
            {"role": "assistant", "content": (
                "Your text was considered toxic because it includes insults ('dumb' and 'annoying'), "
                "which can be hurtful and disrespectful. It's important to communicate with kindness and respect."
            )},

            {"role": "user", "content": "Can you rewrite 'You are so dumb and annoying' to be non-toxic?"},
            {"role": "assistant", "content": (
                "'I find it challenging to work with you sometimes, "
                "but I'm open to improving our communication.'"
            )},

            {"role": "user", "content": "What's the capital of France?"},
            {"role": "assistant", "content": "The capital of France is Paris!"}
        ]

    # Create a new list for full_messages
    full_messages = base_messages + [{"role": "user", "content": text}]

    chat_completion = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=full_messages,
    )

    response = chat_completion.choices[0].message.content.strip()
    
    full_messages.append({"role": "assistant", "content": response})
    
    return {
        "response": response,
        "messages": full_messages
    }