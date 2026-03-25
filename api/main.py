from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, destinations, hotels, restaurants, favorites, ai

app = FastAPI(
    title="Discoverii API",
    description="Travel planning API for Goa, India",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(destinations.router)
app.include_router(hotels.router)
app.include_router(restaurants.router)
app.include_router(favorites.router)
app.include_router(ai.router)


@app.get("/")
async def root():
    return {"message": "Welcome to Discoverii API 🌴", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}
