from fastapi import APIRouter, HTTPException, Query
from database import destinations_collection
from models.destination import Destination
from typing import Optional, List
from bson import ObjectId

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])


@router.get("", response_model=List[Destination])
async def list_destinations(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    query = {}
    if category:
        query["category"] = category.lower()
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}},
        ]

    cursor = destinations_collection.find(query).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        results.append(Destination(**doc))
    return results


@router.get("/{destination_id}", response_model=Destination)
async def get_destination(destination_id: str):
    doc = await destinations_collection.find_one({"_id": ObjectId(destination_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Destination not found")
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return Destination(**doc)
