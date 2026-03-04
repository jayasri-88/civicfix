import os
import hashlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine, SessionLocal
from app.routes import complaints, auth
from app import models

app = FastAPI(title="CivicFix API")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

UPLOAD_DIR = os.path.join(PROJECT_ROOT, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def seed_admin():
    from app.models.authority import Authority
    import bcrypt
    db = SessionLocal()
    try:
        existing = db.query(Authority).filter(Authority.username == "admin").first()
        if not existing:
            admin = Authority(
                username="admin",
                password_hash=bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            )
            db.add(admin)
            db.commit()
        else:
            # Upgrade existing admin to bcrypt if it's still using the old sha256 (length 64)
            if len(existing.password_hash) == 64:
                existing.password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                db.commit()
    finally:
        db.close()

seed_admin()

app.include_router(complaints.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "Backend Running"}