from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_db, close_db
from app.routes import products, orders, admin, store


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="CookieMisu API",
    description="Backend for CookieMisu Bakery",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://cookiemisu.netlify.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(store.router)


@app.get("/")
async def root():
    return {"message": "CookieMisu API is running 🍪"}