from fastapi import APIRouter, HTTPException, Query
from database import hotels_collection
from models.hotel import Hotel
from typing import Optional, List
from bson import ObjectId

router = APIRouter(prefix="/api/hotels", tags=["Hotels & Stays"])


@router.get("", response_model=List[Hotel])
async def list_hotels(
    type: Optional[str] = Query(None),
    price_range: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    query = {}
    if type:
        query["type"] = type.lower()
    if price_range:
        query["price_range"] = price_range.lower()
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
        ]

    cursor = hotels_collection.find(query).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        results.append(Hotel(**doc))
    return results


@router.get("/{hotel_id}", response_model=Hotel)
async def get_hotel(hotel_id: str):
    doc = await hotels_collection.find_one({"_id": ObjectId(hotel_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Hotel not found")
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return Hotel(**doc)
