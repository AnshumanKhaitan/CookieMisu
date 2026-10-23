from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from bson import ObjectId
from datetime import datetime
from app.database import get_db, get_gridfs
from app.utils.auth import verify_token
import io

router = APIRouter(prefix="/api/products", tags=["Products"])


def serialize_product(p: dict) -> dict:
    return {
        "id": str(p["_id"]),
        "name": p["name"],
        "description": p["description"],
        "price": p["price"],
        "category": p["category"],
        "is_available": p.get("is_available", True),
        "image_id": str(p["image_id"]) if p.get("image_id") else None,
        "created_at": p.get("created_at", datetime.utcnow()).isoformat(),
    }


@router.get("/")
async def get_products(category: str = None):
    db = get_db()
    query = {}
    if category:
        query["category"] = category
    products = await db.products.find(query).sort("created_at", -1).to_list(100)
    return [serialize_product(p) for p in products]


@router.get("/image/{image_id}")
async def get_product_image(image_id: str):
    gridfs = get_gridfs()
    try:
        grid_out = await gridfs.open_download_stream(ObjectId(image_id))
        content = await grid_out.read()
        return StreamingResponse(io.BytesIO(content), media_type="image/jpeg")
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")


@router.post("/")
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    is_available: bool = Form(True),
    image: UploadFile = File(...),
    _: dict = Depends(verify_token)
):
    db = get_db()
    gridfs = get_gridfs()

    image_data = await image.read()
    image_id = await gridfs.upload_from_stream(
        image.filename,
        image_data,
        metadata={"content_type": image.content_type}
    )

    product = {
        "name": name,
        "description": description,
        "price": price,
        "category": category,
        "is_available": is_available,
        "image_id": image_id,
        "created_at": datetime.utcnow()
    }
    result = await db.products.insert_one(product)
    product["_id"] = result.inserted_id
    return serialize_product(product)


@router.put("/{product_id}")
async def update_product(
    product_id: str,
    name: str = Form(None),
    description: str = Form(None),
    price: float = Form(None),
    category: str = Form(None),
    is_available: bool = Form(None),
    image: UploadFile = File(None),
    _: dict = Depends(verify_token)
):
    db = get_db()
    gridfs = get_gridfs()

    update_data = {}
    if name is not None:
        update_data["name"] = name
    if description is not None:
        update_data["description"] = description
    if price is not None:
        update_data["price"] = price
    if category is not None:
        update_data["category"] = category
    if is_available is not None:
        update_data["is_available"] = is_available

    if image:
        image_data = await image.read()
        image_id = await gridfs.upload_from_stream(
            image.filename,
            image_data,
            metadata={"content_type": image.content_type}
        )
        update_data["image_id"] = image_id

    await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
    updated = await db.products.find_one({"_id": ObjectId(product_id)})
    return serialize_product(updated)


@router.patch("/{product_id}/availability")
async def toggle_availability(product_id: str, payload: dict, _: dict = Depends(verify_token)):
    db = get_db()
    is_available = payload.get("is_available")
    await db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"is_available": is_available}}
    )
    return {"message": "Updated", "is_available": is_available}


@router.delete("/{product_id}")
async def delete_product(product_id: str, _: dict = Depends(verify_token)):
    db = get_db()
    await db.products.delete_one({"_id": ObjectId(product_id)})
    return {"message": "Product deleted"}