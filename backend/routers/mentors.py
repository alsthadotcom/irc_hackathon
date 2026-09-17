from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from backend.database import get_db
from backend.models import MentorProfile, MentorRequest, Project, User

router = APIRouter(prefix="/api/mentors", tags=["Mentors"])

class MentorResponseSchema(BaseModel):
    request_id: int
    action: str # ACCEPT, REJECT, INFO_REQUESTED
    response_note: Optional[str] = ""

@router.get("/")
def list_mentors(db: Session = Depends(get_db)):
    mentors = db.query(MentorProfile).all()
    res = []
    for m in mentors:
        res.append({
            "id": m.id,
            "name": m.user.full_name if m.user else "Faculty Member",
            "email": m.user.email if m.user else "",
            "expertise": m.expertise,
            "research_interests": m.research_interests,
            "areas_supervised": m.areas_supervised,
            "current_load": m.current_load,
            "max_load": m.max_load,
            "availability": m.availability
        })
    return res

@router.get("/requests")
def get_mentor_requests(mentor_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(MentorRequest)
    if mentor_id:
        query = query.filter(MentorRequest.mentor_id == mentor_id)
        
    requests = query.order_by(MentorRequest.created_at.desc()).all()
    res = []
    for r in requests:
        res.append({
            "request_id": r.id,
            "project_id": r.project_id,
            "project_title": r.project.title if r.project else "Untitled Project",
            "project_category": r.project.category if r.project else "",
            "problem_statement": r.project.problem_statement if r.project else "",
            "creator_name": r.project.creator.full_name if (r.project and r.project.creator) else "Student",
            "mentor_id": r.mentor_id,
            "mentor_name": r.mentor.user.full_name if (r.mentor and r.mentor.user) else "Faculty",
            "status": r.status,
            "match_score": r.match_score,
            "message": r.message,
            "mentor_response": r.mentor_response,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return res

@router.post("/respond")
def respond_to_mentor_request(data: MentorResponseSchema, db: Session = Depends(get_db)):
    req = db.query(MentorRequest).filter(MentorRequest.id == data.request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Mentorship request not found")

    req.status = data.action
    req.mentor_response = data.response_note
    req.responded_at = datetime.utcnow()

    if data.action == "ACCEPT":
        # Assign lead mentor to project and update project status to APPROVED / ONGOING
        if req.project:
            req.project.lead_mentor_id = req.mentor_id
            req.project.status = "ONGOING"
        # Increment mentor load
        if req.mentor:
            req.mentor.current_load += 1
            
    elif data.action == "REJECT":
        # Escalate/move project status back to SUBMITTED for re-matching or admin intervention
        if req.project:
            req.project.status = "SUBMITTED"

    db.commit()
    return {"message": f"Request updated successfully with status {data.action}"}
