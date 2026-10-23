from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
from app.database import get_db
from app.models.order import OrderCreate
from app.utils.auth import verify_token

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def serialize_order(o: dict) -> dict:
    return {
        "id": str(o["_id"]),
        "customer_name": o["customer_name"],
        "customer_phone": o["customer_phone"],
        "customer_email": o["customer_email"],
        "delivery_address": o["delivery_address"],
        "items": o["items"],
        "total_amount": o["total_amount"],
        "status": o.get("status", "pending"),
        "notes": o.get("notes", ""),
        "created_at": o.get("created_at", datetime.utcnow()).isoformat(),
    }


@router.post("/")
async def place_order(order: OrderCreate):
    db = get_db()

    # Check store is open
    config = await db.store_config.find_one({"key": "store_status"})
    if config and not config.get("is_open", True):
        raise HTTPException(status_code=403, detail="Store is currently closed. Orders not accepted.")

    order_dict = order.model_dump()
    order_dict["status"] = "pending"
    order_dict["created_at"] = datetime.utcnow()

    result = await db.orders.insert_one(order_dict)
    order_dict["_id"] = result.inserted_id
    return serialize_order(order_dict)


@router.get("/")
async def get_orders(_: dict = Depends(verify_token)):
    db = get_db()
    orders = await db.orders.find().sort("created_at", -1).to_list(500)
    return [serialize_order(o) for o in orders]


@router.patch("/{order_id}/status")
async def update_order_status(order_id: str, payload: dict, _: dict = Depends(verify_token)):
    db = get_db()
    status = payload.get("status")
    await db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": status}})
    return {"message": "Status updated", "status": status}