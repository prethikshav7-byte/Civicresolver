import math
import re
from typing import List, Dict, Any
from backend.app.schemas.ai import DuplicateCheckRequest, DuplicateCheckResponse, DuplicateMatch
from backend.app.database.connection import local_store

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geographical distance between two lat/lon coordinates in meters."""
    R = 6371000  # Radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def compute_text_similarity(t1: str, t2: str) -> float:
    """Computes token Jaccard similarity between two text snippets."""
    words1 = set(re.findall(r'\b\w+\b', t1.lower()))
    words2 = set(re.findall(r'\b\w+\b', t2.lower()))
    if not words1 or not words2:
        return 0.0
    intersection = len(words1 & words2)
    union = len(words1 | words2)
    return round(intersection / union, 2)

class DuplicateService:
    @staticmethod
    def find_duplicates(request: DuplicateCheckRequest) -> DuplicateCheckResponse:
        matches: List[DuplicateMatch] = []

        for c in local_store.complaints:
            dist = calculate_haversine_distance(
                request.latitude, request.longitude,
                c.get("latitude", 0.0), c.get("longitude", 0.0)
            )

            # Proximity gate (radius in meters, default 300m)
            if dist <= request.radius_meters:
                similarity = compute_text_similarity(
                    request.title + " " + request.description,
                    c.get("title", "") + " " + c.get("description", "")
                )

                # If category matches, bump similarity
                if request.category and request.category.lower() == c.get("category", "").lower():
                    similarity = min(1.0, similarity + 0.25)

                if similarity >= 0.3 or dist <= 50.0:
                    matches.append(DuplicateMatch(
                        complaint_reference=c["complaint_reference"],
                        title=c["title"],
                        category=c["category"],
                        distance_meters=dist,
                        similarity_score=similarity,
                        status=c["status"],
                        created_at=c["created_at"]
                    ))

        has_duplicates = len(matches) > 0
        if has_duplicates:
            recommendation = (
                f"Found {len(matches)} active report(s) within {request.radius_meters}m with matching characteristics. "
                "You can endorse the existing report to escalate priority, or proceed to submit as a separate issue."
            )
        else:
            recommendation = "No duplicate civic reports found in this immediate perimeter. Proceed with submission."

        return DuplicateCheckResponse(
            has_possible_duplicates=has_duplicates,
            count=len(matches),
            matches=sorted(matches, key=lambda x: x.distance_meters),
            recommendation=recommendation
        )
