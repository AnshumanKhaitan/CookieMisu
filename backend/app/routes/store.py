from fastapi import APIRouter, Depends
from app.database import get_db
from app.utils.auth import verify_token

router = APIRouter(prefix="/api/store", tags=["Store"])


@router.get("/status")
async def get_store_status():
    db = get_db()
    config = await db.store_config.find_one({"key": "store_status"})
    is_open = config.get("is_open", True) if config else True
    return {"is_open": is_open}


@router.put("/status")
async def update_store_status(payload: dict, _: dict = Depends(verify_token)):
    db = get_db()
    is_open = payload.get("is_open", True)
    await db.store_config.update_one(
        {"key": "store_status"},
        {"$set": {"key": "store_status", "is_open": is_open}},
        upsert=True
    )
    return {"is_open": is_open, "message": f"Store is now {'open' if is_open else 'closed'}"}