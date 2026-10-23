from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from app.config import settings

client: AsyncIOMotorClient = None
db = None
gridfs_bucket: AsyncIOMotorGridFSBucket = None


async def connect_db():
    global client, db, gridfs_bucket
    client = AsyncIOMotorClient(settings.mongo_uri)
    db = client[settings.mongo_db]
    gridfs_bucket = AsyncIOMotorGridFSBucket(db, bucket_name="product_images")
    print("✅ Connected to MongoDB")


async def close_db():
    global client
    if client:
        client.close()
        print("🔌 Disconnected from MongoDB")


def get_db():
    return db


def get_gridfs():
    return gridfs_bucket