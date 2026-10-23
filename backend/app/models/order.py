from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: EmailStr
    delivery_address: str
    items: List[OrderItem]
    total_amount: float
    notes: Optional[str] = None


class OrderResponse(BaseModel):
    id: str
    customer_name: str
    customer_phone: str
    customer_email: str
    delivery_address: str
    items: List[OrderItem]
    total_amount: float
    status: str
    notes: Optional[str] = None
    created_at: datetime