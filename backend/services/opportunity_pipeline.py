import hashlib
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
from datetime import datetime

class OpportunityPipelineService:
    @staticmethod
    def generate_duplicate_hash(title: str, organization: str) -> str:
        raw = f"{title.strip().lower()}_{organization.strip().lower()}"
        return hashlib.md5(raw.encode('utf-8')).hexdigest()

    @staticmethod
    def calculate_relevance(item: Dict[str, Any]) -> float:
        score = 0.50
        text = (item.get("title", "") + " " + item.get("description", "") + " " + item.get("research_areas", "")).lower()

        # Student relevance
        if any(term in text for term in ["student", "undergraduate", "postgraduate", "phd", "university", "college", "youth", "early career"]):
            score += 0.20
            item["student_eligible"] = True

        # Nepal / International relevance
        if any(term in text for term in ["nepal", "asia", "global", "international", "worldwide", "any country", "open to all"]):
            score += 0.15
            item["nepal_eligible"] = True
        elif "us citizens only" in text or "eu residents only" in text:
            item["nepal_eligible"] = False
            score -= 0.20

        # High-value keywords
        if any(term in text for term in ["grant", "funding", "fellowship", "hackathon", "prize", "conference", "call for papers"]):
            score += 0.15

        return round(min(max(score, 0.10), 0.99), 2)

    @staticmethod
    def fetch_rss_feed(source_url: str) -> List[Dict[str, Any]]:
        """
        Parses RSS/XML feeds (e.g. arXiv, Grants.gov RSS, Devpost RSS)
        """
        items = []
        try:
            resp = requests.get(source_url, timeout=10)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.content, features="xml")
                entries = soup.find_all(["item", "entry"])
                for entry in entries[:10]:
                    title = entry.find(["title"]).text.strip() if entry.find(["title"]) else "Untitled Opportunity"
                    description = entry.find(["description", "summary"]).text.strip() if entry.find(["description", "summary"]) else ""
                    link = entry.find(["link"])
                    url = link.text if link and link.text else (link.get("href") if link else source_url)
                    
                    # Clean html tags from description
                    clean_desc = BeautifulSoup(description, "html.parser").get_text()[:400]

                    items.append({
                        "title": title,
                        "description": clean_desc,
                        "organization": "Global Research Network",
                        "opportunity_type": "Research Grants & Papers",
                        "category": "Computer Science & AI",
                        "country": "Global",
                        "location": "Online / Virtual",
                        "is_online": True,
                        "published_date": datetime.utcnow().strftime("%Y-%m-%d"),
                        "deadline": "2026-11-30",
                        "prize_funding": "$5,000 - $25,000 USD",
                        "research_areas": "AI, ML, Software Engineering, NLP",
                        "original_url": url,
                        "application_url": url,
                    })
        except Exception as e:
            print(f"[Pipeline Error] Failed to fetch RSS source {source_url}: {e}")
        return items

    @staticmethod
    def get_curated_external_opportunities() -> List[Dict[str, Any]]:
        """
        Curated live opportunity list fetched for demonstration if external RSS source is offline.
        """
        return [
            {
                "title": "Google PhD Research Fellowship 2026",
                "description": "Nurturing future technological leaders by supporting exceptional graduate students doing exceptional and innovative research in computer science and related disciplines.",
                "organization": "Google Research",
                "opportunity_type": "Fellowship",
                "category": "Artificial Intelligence & Systems",
                "country": "Global / Nepal Eligible",
                "location": "Global",
                "is_online": True,
                "published_date": "2026-08-15",
                "deadline": "2026-10-31",
                "event_date": "2026-11-15",
                "student_eligible": True,
                "nepal_eligible": True,
                "prize_funding": "$30,000 USD Stipend + Google Mentor",
                "research_areas": "Machine Learning, NLP, Quantum Computing",
                "original_url": "https://research.google/outreach/phd-fellowship/",
                "application_url": "https://research.google/outreach/phd-fellowship/apply/"
            },
            {
                "title": "Global Hackathon 2026: AI for Climate Innovation",
                "description": "Build agentic AI applications addressing climate action, renewable energy prediction, and automated disaster relief routing. Open to university teams worldwide.",
                "organization": "Devpost & UNESCO",
                "opportunity_type": "Hackathon",
                "category": "AI & Sustainability",
                "country": "Worldwide",
                "location": "Online",
                "is_online": True,
                "published_date": "2026-09-01",
                "deadline": "2026-10-15",
                "event_date": "2026-10-20",
                "student_eligible": True,
                "nepal_eligible": True,
                "prize_funding": "$50,000 Total Cash Prizes",
                "research_areas": "LLM Agents, Geospatial AI, Computer Vision",
                "original_url": "https://devpost.com/hackathons",
                "application_url": "https://devpost.com/hackathons"
            },
            {
                "title": "IEEE International Conference on Machine Learning (ICML 2026) Call for Papers",
                "description": "Submissions requested for groundbreaking papers in deep learning architectures, reinforcement learning, multimodal models, and NLP evaluation benchmark datasets.",
                "organization": "IEEE / ICML",
                "opportunity_type": "Call for Papers",
                "category": "Computer Science & Research",
                "country": "Japan & Hybrid Online",
                "location": "Tokyo / Online",
                "is_online": True,
                "published_date": "2026-07-20",
                "deadline": "2026-11-10",
                "event_date": "2026-12-05",
                "student_eligible": True,
                "nepal_eligible": True,
                "prize_funding": "Travel Grant + Best Paper Award ($5,000)",
                "research_areas": "Deep Learning, Algorithms, NLP",
                "original_url": "https://icml.cc",
                "application_url": "https://icml.cc/Conferences/2026/CallForPapers"
            },
            {
                "title": "UK Research & Innovation Student Mobility Grant",
                "description": "Short-term research travel grants for computing and data science researchers from South Asia collaborating with UK research institutions.",
                "organization": "UK Research & Innovation (UKRI)",
                "opportunity_type": "Grant",
                "category": "Research Grant",
                "country": "Nepal & UK",
                "location": "Hybrid",
                "is_online": False,
                "published_date": "2026-08-30",
                "deadline": "2026-12-01",
                "event_date": "2027-01-15",
                "student_eligible": True,
                "nepal_eligible": True,
                "prize_funding": "£12,000 Fellowship Grant",
                "research_areas": "Cybersecurity, Distributed Systems, Data Science",
                "original_url": "https://www.ukri.org/opportunity/",
                "application_url": "https://www.ukri.org/opportunity/"
            }
        ]
