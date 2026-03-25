from pydantic import BaseModel, Field
from typing import Optional, List


class Restaurant(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    image_url: str
    cuisine: str
    price_range: str  # budget, mid, upscale
    location: str
    rating: float = Field(ge=0, le=5)
    tags: List[str] = []
    lat: Optional[float] = None
    lng: Optional[float] = None
    specialties: List[str] = []
    vibe: str = ""  # rooftop, beachside, garden, casual


class RestaurantList(BaseModel):
    restaurants: List[Restaurant]
    total: int
