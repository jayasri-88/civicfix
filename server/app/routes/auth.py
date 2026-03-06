import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.database import SessionLocal
from app.models.authority import Authority
import bcrypt

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

AUTHORITY_SECRET_KEY = "CIVIC2025"
JWT_SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-fixme") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(Authority).filter(Authority.username == username).first()
    if user is None:
        raise credentials_exception
    return user


class RegisterRequest(BaseModel):
    username: str
    password: str
    secret_key: str


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if req.secret_key != AUTHORITY_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid authority secret key")

    existing = db.query(Authority).filter(Authority.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    authority = Authority(
        username=req.username,
        password_hash=hash_password(req.password)
    )
    db.add(authority)
    db.commit()
    db.refresh(authority)

    access_token = create_access_token(
        data={"sub": authority.username}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "message": "Authority registered successfully", 
        "username": authority.username,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    authority = db.query(Authority).filter(Authority.username == req.username).first()

    if not authority or not verify_password(req.password, authority.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(
        data={"sub": authority.username}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "message": "Login successful", 
        "username": authority.username,
        "access_token": access_token,
        "token_type": "bearer"
    }
