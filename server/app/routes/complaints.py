import os
import sys
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.complaint import Complaint
from app.services.router_service import get_department
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "../../../"))
AI_MODEL_PATH = os.path.join(PROJECT_ROOT, "ai-model")
if AI_MODEL_PATH not in sys.path:
    sys.path.append(AI_MODEL_PATH)
from predict import predict_image  # noqa
router = APIRouter(prefix="/complaints", tags=["Complaints"])
UPLOAD_DIR = os.path.join(PROJECT_ROOT, "server", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------- DB DEP ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================================================
# ✅ CREATE COMPLAINT
# =========================================================
@router.post("/")
def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # ✅ unique filename
        ext = os.path.splitext(image.filename)[1]
        unique_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        # ✅ save image
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # ✅ AI prediction
        predicted_category, confidence = predict_image(file_path)

        # ✅ department routing
        department = get_department(predicted_category)

        # ✅ store in DB
        complaint = Complaint(
            title=title,
            description=description,
            image_path=file_path,
            location=location,
            status="Pending"
        )

        # optional fields
        if hasattr(Complaint, "category"):
            complaint.category = predicted_category
        if hasattr(Complaint, "confidence"):
            complaint.confidence = confidence
        if hasattr(Complaint, "department"):
            complaint.department = department

        db.add(complaint)
        db.commit()
        db.refresh(complaint)

        return {
            "message": "Complaint created successfully",
            "id": complaint.id,
            "predicted_category": predicted_category,
            "confidence": round(float(confidence), 3),
            "department": department,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# ✅ GET ALL COMPLAINTS
# =========================================================
@router.get("/")
def get_all_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    return complaints


# =========================================================
# ✅ GET SINGLE COMPLAINT
# =========================================================
@router.get("/{complaint_id}")
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    return complaint
# =========================================================
# ✅ UPDATE COMPLAINT STATUS (ADMIN)
# =========================================================
@router.put("/{complaint_id}/status")
def update_complaint_status(
    complaint_id: int,
    status: str = Form(...),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = status
    db.commit()
    db.refresh(complaint)

    return {
        "message": "Status updated successfully",
        "id": complaint.id,
        "new_status": complaint.status
    }