from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database.connection import engine

from app.api.auth import router as auth_router
from app.api.components import router as components_router
from app.api.readings import router as readings_router
from app.api.ai import router as ai_router
from app.api.simulator import router as simulator_router
from app.api.websocket import router as websocket_router


app = FastAPI(
    title="BurnInGuard AI",
    description="AI-Based Burn-In Monitoring System",
    version="1.0.0"
)


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API ROUTERS
# --------------------------------------------------

app.include_router(auth_router)
app.include_router(components_router)
app.include_router(readings_router)
app.include_router(ai_router)
app.include_router(simulator_router)
app.include_router(websocket_router)


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "BurnInGuard AI API is running",
        "status": "online"
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# --------------------------------------------------
# DATABASE HEALTH CHECK
# --------------------------------------------------

@app.get("/health/database")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )

        return {
            "database": "connected"
        }

    except Exception as error:
        return {
            "database": "error",
            "detail": str(error)
        }