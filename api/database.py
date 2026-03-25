from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.DB_NAME]

# Collections
users_collection = db["users"]
destinations_collection = db["destinations"]
hotels_collection = db["hotels"]
restaurants_collection = db["restaurants"]
