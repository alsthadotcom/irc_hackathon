from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from backend.database import get_db
from backend.models import Project, ProjectMember, ProjectApplication, User, MentorProfile, MentorRequest
from backend.services.mentor_matching import find_top_mentors

router = APIRouter(prefix="/api/projects", tags=["Projects"])

class ApplicationCreate(BaseModel):
    applicant_name: str
    applicant_email: str
    program: str
    skills: str
    motivation: str
    portfolio_url: Optional[str] = None
    desired_role: Optional[str] = "Collaborator"

class ProjectCreate(BaseModel):
    title: str
    short_description: str
    full_description: Optional[str] = ""
    category: str
    research_area: str
    technology_stack: str
    problem_statement: str
    background: Optional[str] = ""
    objectives: Optional[str] = ""
    methodology: Optional[str] = ""
    creator_id: int = 1
    accepting_collaborators: bool = True
    required_skills: Optional[str] = ""
    roles_needed: Optional[str] = ""
    available_positions: int = 2

class CompleteProjectUpdate(BaseModel):
    outcome_findings: str
    deliverables: str
    paper_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    dataset_url: Optional[str] = None

@router.get("/")
def list_projects(
    status: Optional[str] = None, # ONGOING, COMPLETED, SUBMITTED
    category: Optional[str] = None,
    accepting_only: bool = False,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    
    if status:
        query = query.filter(Project.status == status)
    if category and category != "All":
        query = query.filter(Project.category == category)
    if accepting_only:
        query = query.filter(Project.accepting_collaborators == True)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Project.title.ilike(s)) | 
            (Project.short_description.ilike(s)) | 
            (Project.technology_stack.ilike(s)) |
            (Project.required_skills.ilike(s))
        )
        
    projects = query.order_by(Project.created_at.desc()).all()
    
    # Enrich with members and mentor details
    result = []
    for p in projects:
        mentor_name = "Unassigned"
        if p.lead_mentor and p.lead_mentor.user:
            mentor_name = p.lead_mentor.user.full_name
            
        creator_name = p.creator.full_name if p.creator else "Anonymous Student"
        
        result.append({
            "id": p.id,
            "title": p.title,
            "short_description": p.short_description,
            "full_description": p.full_description,
            "category": p.category,
            "research_area": p.research_area,
            "technology_stack": p.technology_stack,
            "status": p.status,
            "problem_statement": p.problem_statement,
            "background": p.background,
            "objectives": p.objectives,
            "methodology": p.methodology,
            "current_stage": p.current_stage,
            "outcome_findings": p.outcome_findings,
            "deliverables": p.deliverables,
            "start_date": p.start_date,
            "expected_completion": p.expected_completion,
            "actual_completion": p.actual_completion,
            "academic_year": p.academic_year,
            "department": p.department,
            "creator_name": creator_name,
            "mentor_name": mentor_name,
            "paper_url": p.paper_url,
            "github_url": p.github_url,
            "demo_url": p.demo_url,
            "dataset_url": p.dataset_url,
            "accepting_collaborators": p.accepting_collaborators,
            "required_skills": p.required_skills,
            "roles_needed": p.roles_needed,
            "available_positions": p.available_positions,
            "members": [{"name": m.name, "role": m.role_name} for m in p.members],
            "applications_count": len(p.applications)
        })
    return result

@router.get("/{project_id}")
def get_project_details(project_id: int, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    mentor_data = None
    if p.lead_mentor and p.lead_mentor.user:
        mentor_data = {
            "id": p.lead_mentor.id,
            "name": p.lead_mentor.user.full_name,
            "email": p.lead_mentor.user.email,
            "expertise": p.lead_mentor.expertise
        }

    return {
        "id": p.id,
        "title": p.title,
        "short_description": p.short_description,
        "full_description": p.full_description,
        "category": p.category,
        "research_area": p.research_area,
        "technology_stack": p.technology_stack,
        "status": p.status,
        "problem_statement": p.problem_statement,
        "background": p.background,
        "objectives": p.objectives,
        "methodology": p.methodology,
        "outcome_findings": p.outcome_findings,
        "deliverables": p.deliverables,
        "start_date": p.start_date,
        "expected_completion": p.expected_completion,
        "actual_completion": p.actual_completion,
        "academic_year": p.academic_year,
        "department": p.department,
        "creator": {"name": p.creator.full_name, "email": p.creator.email} if p.creator else None,
        "mentor": mentor_data,
        "paper_url": p.paper_url,
        "github_url": p.github_url,
        "demo_url": p.demo_url,
        "dataset_url": p.dataset_url,
        "accepting_collaborators": p.accepting_collaborators,
        "required_skills": p.required_skills,
        "roles_needed": p.roles_needed,
        "available_positions": p.available_positions,
        "members": [{"name": m.name, "role": m.role_name} for m in p.members],
        "applications": [
            {
                "id": app.id,
                "applicant_name": app.applicant_name,
                "applicant_email": app.applicant_email,
                "program": app.program,
                "skills": app.skills,
                "motivation": app.motivation,
                "desired_role": app.desired_role,
                "status": app.status,
                "created_at": app.created_at.strftime("%Y-%m-%d")
            }
            for app in p.applications
        ]
    }

@router.post("/submit")
def submit_new_project(data: ProjectCreate, db: Session = Depends(get_db)):
    """
    Submits project into the formal validation & mentor matching pipeline.
    """
    new_project = Project(
        title=data.title,
        short_description=data.short_description,
        full_description=data.full_description or data.short_description,
        category=data.category,
        research_area=data.research_area,
        technology_stack=data.technology_stack,
        problem_statement=data.problem_statement,
        background=data.background,
        objectives=data.objectives,
        methodology=data.methodology,
        status="SUBMITTED", # Enters validation pipeline
        start_date=datetime.utcnow().strftime("%Y-%m-%d"),
        expected_completion="2026-12-30",
        creator_id=data.creator_id,
        accepting_collaborators=data.accepting_collaborators,
        required_skills=data.required_skills,
        roles_needed=data.roles_needed,
        available_positions=data.available_positions
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    # Add creator as Lead Student Member
    creator_user = db.query(User).filter(User.id == data.creator_id).first()
    creator_name = creator_user.full_name if creator_user else "Project Creator"
    db.add(ProjectMember(project_id=new_project.id, user_id=data.creator_id, name=creator_name, role_name="Project Creator / Lead"))
    db.commit()

    # Trigger Automated Mentor Matching Algorithm
    mentors = db.query(MentorProfile).all()
    mentors_list = []
    for m in mentors:
        mentors_list.append({
            "id": m.id,
            "user_name": m.user.full_name if m.user else "Faculty",
            "expertise": m.expertise,
            "research_interests": m.research_interests,
            "current_load": m.current_load,
            "max_load": m.max_load
        })

    matches = find_top_mentors(
        project_dict={
            "category": new_project.category,
            "research_area": new_project.research_area,
            "required_skills": new_project.required_skills
        },
        mentors_list=mentors_list
    )

    top_mentor_request = None
    if matches:
        top_match = matches[0]
        # Create a pending MentorRequest for top candidate
        req = MentorRequest(
            project_id=new_project.id,
            mentor_id=top_match["mentor"]["id"],
            status="PENDING",
            match_score=top_match["score"],
            message=f"Automated System Match ({int(top_match['score']*100)}% match). Skill overlap: {data.required_skills}"
        )
        db.add(req)
        new_project.status = "MENTOR_MATCHING"
        db.commit()
        top_mentor_request = {
            "mentor_id": top_match["mentor"]["id"],
            "mentor_name": top_match["mentor"]["user_name"],
            "score": top_match["score"]
        }

    return {
        "message": "Project submitted successfully into validation pipeline!",
        "project_id": new_project.id,
        "status": new_project.status,
        "mentor_match": top_mentor_request,
        "all_mentor_recommendations": matches[:3]
    }

@router.post("/{project_id}/apply")
def apply_to_project(project_id: int, app_data: ApplicationCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_app = ProjectApplication(
        project_id=project.id,
        applicant_name=app_data.applicant_name,
        applicant_email=app_data.applicant_email,
        program=app_data.program,
        skills=app_data.skills,
        motivation=app_data.motivation,
        portfolio_url=app_data.portfolio_url,
        desired_role=app_data.desired_role,
        status="PENDING"
    )
    db.add(new_app)
    db.commit()
    return {"message": "Application submitted successfully! The project team/mentor will review your profile.", "application_id": new_app.id}

@router.post("/applications/{application_id}/status")
def update_application_status(application_id: int, status: str = Query(..., regex="^(ACCEPTED|REJECTED|WAITLISTED)$"), db: Session = Depends(get_db)):
    app = db.query(ProjectApplication).filter(ProjectApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = status
    if status == "ACCEPTED":
        # Add to project members list
        db.add(ProjectMember(
            project_id=app.project_id,
            name=app.applicant_name,
            role_name=app.desired_role or "Collaborator"
        ))
        # Reduce available positions
        if app.project and app.project.available_positions > 0:
            app.project.available_positions -= 1

    db.commit()
    return {"message": f"Application status updated to {status}"}

@router.post("/{project_id}/complete")
def transition_to_completed(project_id: int, data: CompleteProjectUpdate, db: Session = Depends(get_db)):
    """
    Transition ongoing project to COMPLETED institutional archive state.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.status = "COMPLETED"
    project.actual_completion = datetime.utcnow().strftime("%Y-%m-%d")
    project.outcome_findings = data.outcome_findings
    project.deliverables = data.deliverables
    if data.paper_url:
        project.paper_url = data.paper_url
    if data.github_url:
        project.github_url = data.github_url
    if data.demo_url:
        project.demo_url = data.demo_url
    if data.dataset_url:
        project.dataset_url = data.dataset_url

    project.accepting_collaborators = False
    db.commit()

    return {"message": "Project successfully completed and transferred to Islington Permanent Institutional Archive!", "project_id": project.id}
