import urllib.request
import json
import pytest

BASE_URL = "http://127.0.0.1:8000"

def get(url):
    req = urllib.request.Request(f"{BASE_URL}{url}")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def post(url, data):
    req = urllib.request.Request(
        f"{BASE_URL}{url}",
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def test_root_endpoint():
    res = get("/")
    assert res["status"] == "online"

def test_get_projects():
    projects = get("/api/projects/")
    assert len(projects) >= 3

def test_submit_project_and_mentor_matching():
    payload = {
        "title": "Quantum Cryptography for Post-Quantum Security",
        "short_description": "Evaluating lattice-based post-quantum cryptography algorithms for low-latency network routers.",
        "full_description": "Comprehensive evaluation of Dilithium and Kyber NIST algorithms on embedded systems.",
        "category": "Cybersecurity",
        "research_area": "Post-Quantum Cryptography",
        "technology_stack": "C++, Python, OpenSSL",
        "problem_statement": "Quantum computers pose an immediate threat to traditional RSA/ECC encryption.",
        "creator_id": 1,
        "accepting_collaborators": True,
        "required_skills": "C++, Cryptography, Python",
        "roles_needed": "1 Security Analyst",
        "available_positions": 1
    }
    res = post("/api/projects/submit", payload)
    assert res["status"] in ["SUBMITTED", "MENTOR_MATCHING"]
    assert "project_id" in res

def test_get_opportunities():
    opps = get("/api/opportunities/")
    assert len(opps) >= 4
    assert any(o["nepal_eligible"] for o in opps)

def test_admin_stats():
    stats = get("/api/admin/stats")
    assert stats["total_projects"] > 0
    assert stats["total_opportunities"] > 0
