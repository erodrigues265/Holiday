from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from config import settings

router = APIRouter(prefix="/api/ai", tags=["AI Recommendations"])


class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = """You are Discoverii AI, a friendly and knowledgeable travel assistant specializing in Goa, India. 
You help travelers plan their perfect trip to Goa with personalized recommendations.

Your expertise includes:
- Best beaches in North and South Goa (crowd levels, water sports, sunset spots)
- Hotels, resorts, Airbnbs and guesthouses for all budgets
- Restaurants, beach shacks, and local food gems
- Nightlife, markets, temples, forts, and cultural experiences
- Best times to visit, weather, and travel tips
- Hidden gems and off-the-beaten-path spots
- Family-friendly vs party-oriented recommendations

Always be enthusiastic about Goa while being honest and helpful. 
Give specific place names and practical tips. Keep responses concise but informative.
Use emojis occasionally to keep the tone fun and travel-friendly 🏖️"""


@router.post("/recommend", response_model=ChatResponse)
async def get_recommendation(request: ChatRequest):
    if not settings.GEMINI_API_KEY:
        return ChatResponse(
            reply="🌴 AI recommendations require a Gemini API key. Please set GEMINI_API_KEY in your environment. "
            "In the meantime, here are some top picks:\n\n"
            "**Beaches:** Palolem, Agonda, Anjuna, Baga\n"
            "**Restaurants:** Gunpowder, Fisherman's Wharf, Britto's\n"
            "**Hotels:** Taj Exotica, Alila Diwa, The Leela\n\n"
            "Ask me anything about Goa! 🏖️"
        )

    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")

        messages = [{"role": "user", "parts": [SYSTEM_PROMPT + "\n\nPlease acknowledge you understand your role."]}]
        messages.append({"role": "model", "parts": ["I'm Discoverii AI, your Goa travel expert! 🌴 Ready to help you plan an amazing trip. What would you like to know?"]})

        for msg in request.history:
            role = "user" if msg.role == "user" else "model"
            messages.append({"role": role, "parts": [msg.content]})

        messages.append({"role": "user", "parts": [request.message]})

        response = model.generate_content(messages)
        return ChatResponse(reply=response.text)
    except Exception as e:
        return ChatResponse(
            reply=f"🏖️ I'm having trouble connecting right now, but here are some quick Goa tips:\n\n"
            f"**Must-visit beaches:** Palolem (peaceful), Baga (lively), Anjuna (bohemian)\n"
            f"**Great eats:** Try Goan fish curry, vindaloo, and bebinca!\n\n"
            f"Please try again in a moment."
        )
