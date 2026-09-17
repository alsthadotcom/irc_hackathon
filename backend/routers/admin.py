from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Project, User, MentorProfile, Opportunity, ProjectApplication, SourceFetchLog

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats")
def get_admin_dashboard_stats(db: Session = Depends(get_db)):
    total_projects = db.query(Project).count()
    ongoing_projects = db.query(Project).filter(Project.status == "ONGOING").count()
    completed_projects = db.query(Project).filter(Project.status == "COMPLETED").count()
    pending_validations = db.query(Project).filter(Project.status.in_(["SUBMITTED", "MENTOR_MATCHING"])).count()
    
    total_students = db.query(User).filter(User.role == "STUDENT").count()
    total_mentors = db.query(MentorProfile).count()
    total_opportunities = db.query(Opportunity).filter(Opportunity.is_duplicate == False).count()
    total_applications = db.query(ProjectApplication).count()

    recent_logs = db.query(SourceFetchLog).order_by(SourceFetchLog.fetched_at.desc()).limit(5).all()
    logs_data = []
    for l in recent_logs:
        logs_data.append({
            "id": l.id,
            "source_name": l.source_rel.name if l.source_rel else "Pipeline Scraper",
            "fetched_at": l.fetched_at.strftime("%Y-%m-%d %H:%M:%S"),
            "status": l.status,
            "records_fetched": l.records_fetched,
            "new_records": l.new_records,
            "duplicate_records": l.duplicate_records
        })

    return {
        "total_projects": total_projects,
        "ongoing_projects": ongoing_projects,
        "completed_projects": completed_projects,
        "pending_validations": pending_validations,
        "total_students": total_students,
        "total_mentors": total_mentors,
        "total_opportunities": total_opportunities,
        "total_applications": total_applications,
        "recent_pipeline_logs": logs_data
    }

@router.get("/pending-projects")
def get_pending_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).filter(Project.status.in_(["SUBMITTED", "MENTOR_MATCHING"])).all()
    res = []
    for p in projects:
        res.append({
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "creator_name": p.creator.full_name if p.creator else "Student",
            "creator_email": p.creator.email if p.creator else "",
            "status": p.status,
            "problem_statement": p.problem_statement,
            "created_at": p.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return res

@router.post("/approve-project/{project_id}")
def approve_pending_project(project_id: int, action: str = "APPROVE", db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    if action == "APPROVE":
        p.status = "ONGOING"
    elif action == "REJECT":
        p.status = "REJECTED"

    db.commit()
    return {"message": f"Project status updated to {p.status}"}
