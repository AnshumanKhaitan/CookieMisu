from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str  # "cake", "cookie", "pastry"
    is_available: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    is_available: Optional[bool] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    is_available: bool
    image_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True