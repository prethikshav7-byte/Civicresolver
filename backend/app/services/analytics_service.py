from typing import Dict, Any, List
from backend.app.database.connection import local_store
from backend.app.schemas.admin import AdminStatsOverview

class AnalyticsService:
    @staticmethod
    def get_overview_stats() -> AdminStatsOverview:
        complaints = local_store.complaints
        total = len(complaints)
        new_reported = sum(1 for c in complaints if c.get("status") == "Reported")
        under_review = sum(1 for c in complaints if c.get("status") == "Under Review")
        assigned = sum(1 for c in complaints if c.get("status") == "Assigned")
        in_progress = sum(1 for c in complaints if c.get("status") == "In Progress")
        resolved = sum(1 for c in complaints if c.get("status") == "Resolved")
        critical_count = sum(1 for c in complaints if c.get("priority") == "Critical")

        res_rate = round((resolved / total * 100), 1) if total > 0 else 0.0

        return AdminStatsOverview(
            total_complaints=total,
            new_reported=new_reported,
            under_review=under_review,
            assigned=assigned,
            in_progress=in_progress,
            resolved=resolved,
            critical_count=critical_count,
            resolution_rate_percent=res_rate,
            avg_resolution_days=2.4
        )

    @staticmethod
    def get_category_breakdown() -> List[Dict[str, Any]]:
        counts: Dict[str, int] = {}
        for c in local_store.complaints:
            cat = c.get("category", "Other")
            counts[cat] = counts.get(cat, 0) + 1
        
        return [{"category": k, "count": v} for k, v in counts.items()]

    @staticmethod
    def get_department_performance() -> List[Dict[str, Any]]:
        departments = local_store.departments
        complaints = local_store.complaints
        
        results = []
        for d in departments:
            d_name = d["name"]
            dept_complaints = [c for c in complaints if c.get("department_name") == d_name]
            total = len(dept_complaints)
            resolved = sum(1 for c in dept_complaints if c.get("status") == "Resolved")
            in_prog = sum(1 for c in dept_complaints if c.get("status") == "In Progress")
            pending = total - resolved - in_prog
            rate = round((resolved / total * 100), 1) if total > 0 else 100.0

            results.append({
                "id": d["id"],
                "name": d_name,
                "code": d["code"],
                "sla_hours": d.get("sla_hours", 48),
                "total": total,
                "resolved": resolved,
                "in_progress": in_prog,
                "pending": pending,
                "resolution_rate": rate
            })
        return results

    @staticmethod
    def get_ward_metrics() -> List[Dict[str, Any]]:
        localities = local_store.localities
        complaints = local_store.complaints
        
        ward_map: Dict[int, Dict[str, Any]] = {}
        for loc in localities:
            w_num = loc["ward_number"]
            if w_num not in ward_map:
                ward_map[w_num] = {
                    "ward_number": w_num,
                    "locality": loc["name"],
                    "zone": loc["zone"],
                    "total": 0,
                    "resolved": 0,
                    "active": 0
                }

        for c in complaints:
            w_num = c.get("ward_number", 70)
            if w_num in ward_map:
                ward_map[w_num]["total"] += 1
                if c.get("status") == "Resolved":
                    ward_map[w_num]["resolved"] += 1
                else:
                    ward_map[w_num]["active"] += 1

        return list(ward_map.values())
