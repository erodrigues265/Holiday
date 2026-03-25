from fastapi import APIRouter, HTTPException, Query
from database import restaurants_collection
from models.restaurant import Restaurant
from typing import Optional, List
from bson import ObjectId

router = APIRouter(prefix="/api/restaurants", tags=["Restaurants & Spots"])


@router.get("", response_model=List[Restaurant])
async def list_restaurants(
    cuisine: Optional[str] = Query(None),
    price_range: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    query = {}
    if cuisine:
        query["cuisine"] = {"$regex": cuisine, "$options": "i"}
    if price_range:
        query["price_range"] = price_range.lower()
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"cuisine": {"$regex": search, "$options": "i"}},
        ]

    cursor = restaurants_collection.find(query).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        results.append(Restaurant(**doc))
    return results


@router.get("/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(restaurant_id: str):
    doc = await restaurants_collection.find_one({"_id": ObjectId(restaurant_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return Restaurant(**doc)
