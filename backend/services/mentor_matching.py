from typing import List, Dict, Any

def calculate_mentor_match_score(
    project_category: str,
    research_area: str,
    required_skills: str,
    mentor_expertise: str,
    mentor_interests: str,
    current_load: int,
    max_load: int
) -> float:
    """
    Calculate a match score between 0.0 and 1.0 based on skill overlap,
    research interest alignment, and faculty current mentorship capacity.
    """
    if current_load >= max_load:
        return 0.0

    score = 0.0
    
    # 1. Expertise overlap
    skills_list = [s.strip().lower() for s in required_skills.split(",") if s.strip()]
    expertise_list = [e.strip().lower() for e in mentor_expertise.split(",") if e.strip()]
    
    overlap_count = 0
    for skill in skills_list:
        for exp in expertise_list:
            if skill in exp or exp in skill:
                overlap_count += 1
                break
                
    if skills_list:
        skill_ratio = min(overlap_count / len(skills_list), 1.0)
        score += skill_ratio * 0.45

    # 2. Research domain alignment
    interests_lower = mentor_interests.lower()
    if research_area.lower() in interests_lower or project_category.lower() in interests_lower:
        score += 0.35
    elif any(word in interests_lower for word in research_area.lower().split()):
        score += 0.20

    # 3. Capacity bonus (mentors with fewer active load get higher priority)
    capacity_ratio = max(0, (max_load - current_load) / max_load)
    score += capacity_ratio * 0.20

    return min(round(score, 2), 0.99)


def find_top_mentors(project_dict: Dict[str, Any], mentors_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Returns sorted list of mentors with match scores.
    """
    results = []
    for m in mentors_list:
        score = calculate_mentor_match_score(
            project_category=project_dict.get("category", ""),
            research_area=project_dict.get("research_area", ""),
            required_skills=project_dict.get("required_skills", ""),
            mentor_expertise=m.get("expertise", ""),
            mentor_interests=m.get("research_interests", ""),
            current_load=m.get("current_load", 0),
            max_load=m.get("max_load", 5)
        )
        if score > 0.2:
            results.append({
                "mentor": m,
                "score": score,
                "match_reasons": [
                    f"Expertise matches: {m.get('expertise')}",
                    f"Available mentorship capacity: {m.get('max_load', 5) - m.get('current_load', 0)} slots remaining"
                ]
            })
            
    results.sort(key=lambda x: x["score"], reverse=True)
    return results
