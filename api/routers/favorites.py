from fastapi import APIRouter, HTTPException, Depends
from database import users_collection, destinations_collection, hotels_collection, restaurants_collection
from auth_utils import get_current_user
from pydantic import BaseModel
from typing import List
from bson import ObjectId

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])


class FavoriteRequest(BaseModel):
    item_id: str
    item_type: str  # destination, hotel, restaurant


@router.get("")
async def get_favorites(current_user=Depends(get_current_user)):
    favorites = current_user.get("favorites", [])
    enriched = []
    for fav in favorites:
        collection_map = {
            "destination": destinations_collection,
            "hotel": hotels_collection,
            "restaurant": restaurants_collection,
        }
        collection = collection_map.get(fav["item_type"])
        if collection:
            try:
                doc = await collection.find_one({"_id": ObjectId(fav["item_id"])})
                if doc:
                    doc["id"] = str(doc["_id"])
                    del doc["_id"]
                    doc["item_type"] = fav["item_type"]
                    enriched.append(doc)
            except Exception:
                pass
    return enriched


@router.post("")
async def add_favorite(fav: FavoriteRequest, current_user=Depends(get_current_user)):
    user_id = current_user["_id"]
    existing_favs = current_user.get("favorites", [])
    for f in existing_favs:
        if f["item_id"] == fav.item_id and f["item_type"] == fav.item_type:
            raise HTTPException(status_code=400, detail="Already in favorites")

    await users_collection.update_one(
        {"_id": user_id},
        {"$push": {"favorites": {"item_id": fav.item_id, "item_type": fav.item_type}}},
    )
    return {"message": "Added to favorites"}


@router.delete("/{item_type}/{item_id}")
async def remove_favorite(item_type: str, item_id: str, current_user=Depends(get_current_user)):
    user_id = current_user["_id"]
    await users_collection.update_one(
        {"_id": user_id},
        {"$pull": {"favorites": {"item_id": item_id, "item_type": item_type}}},
    )
    return {"message": "Removed from favorites"}
