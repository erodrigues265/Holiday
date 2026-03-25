from pydantic import BaseModel, Field
from typing import Optional, List


class Hotel(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    image_url: str
    price_per_night: int
    price_range: str  # budget, mid, luxury
    location: str
    rating: float = Field(ge=0, le=5)
    amenities: List[str] = []
    type: str  # hotel, airbnb, resort, guesthouse
    tags: List[str] = []
    lat: Optional[float] = None
    lng: Optional[float] = None
    nearby_beach: str = ""


class HotelList(BaseModel):
    hotels: List[Hotel]
    total: int
