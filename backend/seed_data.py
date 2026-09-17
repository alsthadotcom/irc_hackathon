from backend.database import SessionLocal, engine, Base
from backend.models import (
    User, MentorProfile, Project, ProjectMember, ProjectApplication,
    MentorRequest, OpportunitySource, Opportunity, SourceFetchLog
)
from backend.services.opportunity_pipeline import OpportunityPipelineService
from datetime import datetime, timedelta

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).first():
        print("[Seed] Database already seeded. Skipping.")
        db.close()
        return

    print("[Seed] Populating Islington Research Platform Database...")

    # 1. Users
    student_aarav = User(
        email="aarav.shrestha@islingtoncollege.edu.np",
        full_name="Aarav Shrestha",
        role="STUDENT",
        department="Department of Computing",
        program="BSc (Hons) Computer Science",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    )
    student_riya = User(
        email="riya.thapa@islingtoncollege.edu.np",
        full_name="Riya Thapa",
        role="STUDENT",
        department="Department of Computing",
        program="BSc (Hons) Data Science & AI",
        avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
    )
    student_bipin = User(
        email="bipin.karki@islingtoncollege.edu.np",
        full_name="Bipin Karki",
        role="STUDENT",
        department="Department of Computing",
        program="BSc (Hons) Software Engineering",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    )
    faculty_dr_sharma = User(
        email="dr.sharma@islingtoncollege.edu.np",
        full_name="Dr. Rajesh Sharma",
        role="FACULTY",
        department="Department of Computing",
        program="Senior Research Fellow / Professor",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    )
    faculty_er_adhikari = User(
        email="er.adhikari@islingtoncollege.edu.np",
        full_name="Er. Sunita Adhikari",
        role="FACULTY",
        department="Department of Computing",
        program="Associate Lecturer / NLP Specialist",
        avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    )
    admin_user = User(
        email="irc.admin@islingtoncollege.edu.np",
        full_name="IRC Platform Admin",
        role="IRC_ADMIN",
        department="Innovation & Research Center",
        program="R&I Director",
        avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    )

    db.add_all([student_aarav, student_riya, student_bipin, faculty_dr_sharma, faculty_er_adhikari, admin_user])
    db.commit()

    # 2. Mentor Profiles
    mentor_sharma = MentorProfile(
        user_id=faculty_dr_sharma.id,
        expertise="Computer Vision, Deep Learning, Medical Imaging, PyTorch",
        research_interests="Medical AI, Convolutional Neural Networks, Diagnostic Radiology",
        areas_supervised="Final Year Research, Postgrad AI Thesis",
        current_load=2,
        max_load=5,
        availability=True
    )
    mentor_adhikari = MentorProfile(
        user_id=faculty_er_adhikari.id,
        expertise="NLP, LLMs, Nepali Language Processing, Transformers, Python",
        research_interests="Multilingual NLP, Low-resource languages, Sentiment Analysis",
        areas_supervised="NLP Projects, Student Research Papers",
        current_load=1,
        max_load=4,
        availability=True
    )

    db.add_all([mentor_sharma, mentor_adhikari])
    db.commit()

    # 3. Projects - Branch A

    # Ongoing Project 1
    project_nlp = Project(
        title="Multilingual Nepali Language Model (NepalLM)",
        short_description="Building a high-accuracy open-source LLM specifically tailored for low-resource Nepali dialects and official document summarizing.",
        full_description="""This research focuses on building a specialized Nepali Transformer-based language model. Current frontier models suffer from tokenization inefficiencies and hallunication when processing native Devanagari script and regional dialects (e.g. Doteli, Maithili).

Our team is assembling a curated 10GB Devanagari corpus from news, legal documents, and Wikipedia, fine-tuning Llama-3 and Mistral architectures using LoRA and QLoRA.""",
        category="Artificial Intelligence",
        research_area="Natural Language Processing",
        technology_stack="Python, PyTorch, Transformers, HuggingFace, FastAPI",
        status="ONGOING",
        problem_statement="Nepali language processing is severely hindered by token bloat and poor contextual understanding in global commercial LLMs.",
        background="Islington College Innovation Center initiative to preserve and enhance digital literacy in Devanagari script.",
        objectives="1. Construct 10GB corpus. 2. Fine-tune 8B parameter model. 3. Achieve 85%+ accuracy on Nepali NLP Benchmarks.",
        methodology="Low-Rank Adaptation (LoRA) fine-tuning on consumer/cloud GPUs with custom Devanagari byte-pair tokenizer.",
        current_stage="Data pre-processing & Tokenizer Training",
        start_date="2026-06-01",
        expected_completion="2026-12-15",
        academic_year="2025-2026",
        department="Department of Computing",
        creator_id=student_aarav.id,
        lead_mentor_id=mentor_adhikari.id,
        github_url="https://github.com/islington-research/nepal-llm",
        accepting_collaborators=True,
        required_skills="Python, PyTorch, Transformers, Data Cleaning",
        roles_needed="2 NLP Researchers, 1 Data Pipeline Engineer",
        available_positions=3
    )

    # Ongoing Project 2
    project_med_vision = Project(
        title="Early Chest X-Ray Pneumonia Detection System",
        short_description="An AI-assisted diagnostic tool using Deep Convolutional Neural Networks for fast diagnostic screening in rural Nepal healthcare centers.",
        full_description="""Pneumonia and respiratory diseases remain high-mortality risks in remote healthcare facilities across Nepal where certified radiologists are unavailable.

This project develops an ultra-lightweight MobileNetV4 / EfficientNet model capable of performing on-device X-Ray classification on low-power edge hardware without internet access.""",
        category="Medical AI",
        research_area="Computer Vision",
        technology_stack="TensorFlow, OpenCV, Flutter, Docker",
        status="ONGOING",
        problem_statement="Lack of qualified radiologists in rural districts leads to delayed diagnosis of treatable pulmonary conditions.",
        background="Collaborative effort between Islington Computing Department and local healthcare clinics.",
        objectives="Build 95%+ precision diagnostic classifier executable on Raspberry Pi 4 edge device.",
        methodology="Transfer learning using NIH Chest X-Ray14 dataset combined with locally anonymized hospital scans.",
        start_date="2026-05-10",
        expected_completion="2026-11-20",
        academic_year="2025-2026",
        department="Department of Computing",
        creator_id=student_riya.id,
        lead_mentor_id=mentor_sharma.id,
        github_url="https://github.com/islington-research/chest-xray-ai",
        accepting_collaborators=True,
        required_skills="Computer Vision, TensorFlow/PyTorch, Mobile App Dev",
        roles_needed="1 ML Researcher, 1 Flutter Frontend Engineer",
        available_positions=2
    )

    # Completed Project 1 (Institutional Archive)
    project_smart_grid = Project(
        title="IoT-Based Smart Energy Grid & Peak Demand Predictor",
        short_description="Successfully deployed predictive IoT metering system for institutional power management at Islington Academic Complex.",
        full_description="""Completed capstone research paper and hardware prototype. Developed smart sensor nodes using ESP32 measuring real-time voltage, current, and power factor.

An LSTM recurrent neural network predicts 24-hour campus peak loads with 94.2% accuracy, allowing automated battery generator switching and reducing campus grid energy expenses by 18.4%.""",
        category="Internet of Things & Data Science",
        research_area="Smart Energy Systems",
        technology_stack="Python, LSTM, MQTT, ESP32, React, InfluxDB",
        status="COMPLETED",
        problem_statement="High electricity tariff surcharges caused by unexpected peak power spikes during laboratory usage hours.",
        background="Islington Energy Conservation Project 2025.",
        objectives="Predict campus load shifts 1 hour ahead and dynamically automate non-critical load shedding.",
        methodology="Time-series forecasting with bidirectional LSTM models trained on 12 months of high-frequency sensor readings.",
        outcome_findings="Achieved 94.2% prediction accuracy. Reduced peak demand charges by 18.4%. Paper accepted at IEEE South Asia Tech Conference 2025.",
        deliverables="Research Paper, GitHub Repository, Live Sensor Dashboard, Hardware Schematics",
        start_date="2025-01-15",
        actual_completion="2025-10-30",
        academic_year="2024-2025",
        department="Department of Computing",
        creator_id=student_bipin.id,
        lead_mentor_id=mentor_sharma.id,
        paper_url="https://doi.org/10.1109/ISLINGTON.2025.01",
        github_url="https://github.com/islington-research/smart-grid-iot",
        demo_url="https://smartgrid.islingtoncollege.edu.np",
        accepting_collaborators=False,
        available_positions=0
    )

    db.add_all([project_nlp, project_med_vision, project_smart_grid])
    db.commit()

    # Members
    m1 = ProjectMember(project_id=project_nlp.id, user_id=student_aarav.id, name="Aarav Shrestha", role_name="Lead Researcher")
    m2 = ProjectMember(project_id=project_nlp.id, user_id=student_riya.id, name="Riya Thapa", role_name="Data Analyst")
    m3 = ProjectMember(project_id=project_med_vision.id, user_id=student_riya.id, name="Riya Thapa", role_name="Project Lead")
    m4 = ProjectMember(project_id=project_smart_grid.id, user_id=student_bipin.id, name="Bipin Karki", role_name="IoT Engineer")
    db.add_all([m1, m2, m3, m4])
    db.commit()

    # Applications
    app1 = ProjectApplication(
        project_id=project_nlp.id,
        applicant_name="Kabir Thapa",
        applicant_email="kabir.thapa@islingtoncollege.edu.np",
        program="BSc (Hons) Computer Science",
        skills="Python, PyTorch, HuggingFace",
        motivation="I have completed coursework in NLP and want to contribute to Devanagari corpus curation.",
        portfolio_url="https://github.com/kabirthapa",
        desired_role="NLP Researcher",
        status="PENDING"
    )
    db.add(app1)

    # Mentor Requests
    m_req1 = MentorRequest(
        project_id=project_nlp.id,
        mentor_id=mentor_adhikari.id,
        status="ACCEPTED",
        match_score=0.92,
        message="Automated Match: High expertise in NLP and Devanagari models.",
        mentor_response="Accepted. I will supervise weekly lab sprints."
    )
    db.add(m_req1)
    db.commit()

    # 4. Branch B — External Sources & Opportunities
    source_devpost = OpportunitySource(
        name="Devpost Global AI Hackathons",
        url="https://devpost.com/hackathons",
        source_type="HTML",
        extraction_method="Devpost Parser",
        update_frequency_hours=12,
        is_active=True,
        category="Hackathons",
        last_fetched_at=datetime.utcnow() - timedelta(hours=2),
        total_fetched=14
    )
    source_grants = OpportunitySource(
        name="Global Research Grants Network",
        url="https://www.researchgrants.org/rss",
        source_type="RSS",
        extraction_method="RSS Parser",
        update_frequency_hours=24,
        is_active=True,
        category="Grants",
        last_fetched_at=datetime.utcnow() - timedelta(hours=5),
        total_fetched=28
    )
    db.add_all([source_devpost, source_grants])
    db.commit()

    # Seed Curated Opportunities
    curated_list = OpportunityPipelineService.get_curated_external_opportunities()
    for opp_data in curated_list:
        dup_hash = OpportunityPipelineService.generate_duplicate_hash(opp_data["title"], opp_data["organization"])
        rel_score = OpportunityPipelineService.calculate_relevance(opp_data)
        
        opp = Opportunity(
            title=opp_data["title"],
            description=opp_data["description"],
            organization=opp_data["organization"],
            opportunity_type=opp_data["opportunity_type"],
            category=opp_data["category"],
            country=opp_data["country"],
            location=opp_data["location"],
            is_online=opp_data["is_online"],
            published_date=opp_data["published_date"],
            deadline=opp_data["deadline"],
            event_date=opp_data.get("event_date"),
            student_eligible=opp_data["student_eligible"],
            nepal_eligible=opp_data["nepal_eligible"],
            prize_funding=opp_data["prize_funding"],
            research_areas=opp_data["research_areas"],
            original_url=opp_data["original_url"],
            application_url=opp_data["application_url"],
            source_id=source_devpost.id,
            relevance_score=rel_score,
            duplicate_hash=dup_hash
        )
        db.add(opp)
        
    db.commit()

    # Seed Log
    log1 = SourceFetchLog(
        source_id=source_devpost.id,
        fetched_at=datetime.utcnow(),
        status="SUCCESS",
        records_fetched=4,
        new_records=4,
        duplicate_records=0
    )
    db.add(log1)
    db.commit()

    db.close()
    print("[Seed] Islington Research Platform database successfully seeded!")

if __name__ == "__main__":
    seed_database()
