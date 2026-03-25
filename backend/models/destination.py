from pydantic import BaseModel, Field
from typing import Optional, List


class Destination(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    image_url: str
    location: str
    category: str  # beach, fort, waterfall, market, temple, nature
    rating: float = Field(ge=0, le=5)
    tags: List[str] = []
    lat: Optional[float] = None
    lng: Optional[float] = None
    highlights: List[str] = []
    best_time: str = ""


class DestinationList(BaseModel):
    destinations: List[Destination]
    total: int
