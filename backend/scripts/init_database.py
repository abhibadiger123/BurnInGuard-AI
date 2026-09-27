from app.database.base import Base
from app.database.connection import engine
from app.models import User, Component, BurnInReading, Prediction, Alert

def init_database():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

if __name__ == "__main__":
    init_database()