from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="STUDENT")  # STUDENT, FACULTY, RESEARCHER, ADMIN, IRC_ADMIN
    department = Column(String, default="Computing & Information Technology")
    program = Column(String, default="BSc (Hons) Computer Science")
    avatar_url = Column(String, nullable=True)

    projects_created = relationship("Project", back_populates="creator", foreign_keys="Project.creator_id")
    mentor_profile = relationship("MentorProfile", back_populates="user", uselist=False)


class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    expertise = Column(Text)  # Comma separated e.g. "NLP, Computer Vision, Machine Learning"
    research_interests = Column(Text)
    areas_supervised = Column(Text)
    current_load = Column(Integer, default=0)
    max_load = Column(Integer, default=5)
    availability = Column(Boolean, default=True)

    user = relationship("User", back_populates="mentor_profile")
    mentor_requests = relationship("MentorRequest", back_populates="mentor")
    mentored_projects = relationship("Project", back_populates="lead_mentor", foreign_keys="Project.lead_mentor_id")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    category = Column(String, default="Artificial Intelligence")
    research_area = Column(String, default="Machine Learning")
    technology_stack = Column(String, default="Python, PyTorch, React")
    
    # Status: DRAFT, SUBMITTED, MENTOR_MATCHING, UNDER_REVIEW, APPROVED, ONGOING, COMPLETED, ARCHIVED
    status = Column(String, default="ONGOING", index=True)
    
    problem_statement = Column(Text, nullable=True)
    background = Column(Text, nullable=True)
    objectives = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    current_stage = Column(String, default="In Development")
    outcome_findings = Column(Text, nullable=True)
    deliverables = Column(Text, nullable=True)
    
    start_date = Column(String, nullable=True)
    expected_completion = Column(String, nullable=True)
    actual_completion = Column(String, nullable=True)
    academic_year = Column(String, default="2025-2026")
    department = Column(String, default="Department of Computing")
    
    creator_id = Column(Integer, ForeignKey("users.id"))
    lead_mentor_id = Column(Integer, ForeignKey("mentor_profiles.id"), nullable=True)
    
    paper_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    dataset_url = Column(String, nullable=True)
    
    accepting_collaborators = Column(Boolean, default=True)
    required_skills = Column(String, default="Python, Data Analysis")
    roles_needed = Column(String, default="Research Assistant, Data Engineer")
    available_positions = Column(Integer, default=2)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship("User", back_populates="projects_created", foreign_keys=[creator_id])
    lead_mentor = relationship("MentorProfile", back_populates="mentored_projects", foreign_keys=[lead_mentor_id])
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    applications = relationship("ProjectApplication", back_populates="project", cascade="all, delete-orphan")
    mentor_requests = relationship("MentorRequest", back_populates="project", cascade="all, delete-orphan")


class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    role_name = Column(String, default="Contributor")
    joined_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="members")


class ProjectApplication(Base):
    __tablename__ = "project_applications"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    applicant_name = Column(String, nullable=False)
    applicant_email = Column(String, nullable=False)
    program = Column(String, default="BSc (Hons) Computer Science")
    skills = Column(String, nullable=False)
    motivation = Column(Text, nullable=False)
    portfolio_url = Column(String, nullable=True)
    desired_role = Column(String, default="Collaborator")
    
    # Status: PENDING, ACCEPTED, REJECTED, WAITLISTED
    status = Column(String, default="PENDING")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="applications")


class MentorRequest(Base):
    __tablename__ = "mentor_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    mentor_id = Column(Integer, ForeignKey("mentor_profiles.id"))
    
    # Status: PENDING, ACCEPTED, REJECTED, INFO_REQUESTED
    status = Column(String, default="PENDING")
    match_score = Column(Float, default=0.85)
    message = Column(Text, nullable=True)
    mentor_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    responded_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="mentor_requests")
    mentor = relationship("MentorProfile", back_populates="mentor_requests")


class OpportunitySource(Base):
    __tablename__ = "opportunity_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    source_type = Column(String, default="RSS")  # RSS, HTML, API
    extraction_method = Column(String, default="Generic Parser")
    update_frequency_hours = Column(Integer, default=24)
    is_active = Column(Boolean, default=True)
    category = Column(String, default="Grants")
    last_fetched_at = Column(DateTime, nullable=True)
    total_fetched = Column(Integer, default=0)

    opportunities = relationship("Opportunity", back_populates="source_rel")
    logs = relationship("SourceFetchLog", back_populates="source_rel", cascade="all, delete-orphan")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    organization = Column(String, nullable=False)
    
    # Category: Grant, Hackathon, Conference, Call for Papers, Fellowship, Competition, Research Program
    opportunity_type = Column(String, default="Grant", index=True)
    category = Column(String, default="Computer Science")
    
    country = Column(String, default="Global")
    location = Column(String, default="Online")
    is_online = Column(Boolean, default=True)
    
    published_date = Column(String, nullable=True)
    deadline = Column(String, nullable=True)
    event_date = Column(String, nullable=True)
    
    student_eligible = Column(Boolean, default=True)
    nepal_eligible = Column(Boolean, default=True)
    
    prize_funding = Column(String, nullable=True)
    research_areas = Column(String, default="AI, CS, Data Science")
    
    original_url = Column(String, nullable=False)
    application_url = Column(String, nullable=True)
    
    source_id = Column(Integer, ForeignKey("opportunity_sources.id"), nullable=True)
    relevance_score = Column(Float, default=0.90)
    is_duplicate = Column(Boolean, default=False)
    duplicate_hash = Column(String, nullable=True, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    source_rel = relationship("OpportunitySource", back_populates="opportunities")


class SourceFetchLog(Base):
    __tablename__ = "source_fetch_logs"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("opportunity_sources.id"))
    fetched_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="SUCCESS")  # SUCCESS, PARTIAL, FAILED
    records_fetched = Column(Integer, default=0)
    new_records = Column(Integer, default=0)
    duplicate_records = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)

    source_rel = relationship("OpportunitySource", back_populates="logs")
