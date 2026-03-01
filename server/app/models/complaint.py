from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from app.database import Base
class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image_path = Column(String, nullable=True)
    location = Column(String, nullable=True)
    category = Column(String, nullable=True)
    confidence = Column(Float, default=0.0)
    department = Column(String, nullable=True)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)