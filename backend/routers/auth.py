from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class UserSchema(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    department: str
    program: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/users", response_model=List[UserSchema])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/me", response_model=UserSchema)
def get_current_user(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = db.query(User).first()
    return user
