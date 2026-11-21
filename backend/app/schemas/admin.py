from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class AdminStatsOverview(BaseModel):
    total_complaints: int
    new_reported: int
    under_review: int
    assigned: int
    in_progress: int
    resolved: int
    critical_count: int
    resolution_rate_percent: float
    avg_resolution_days: float

class DepartmentMetric(BaseModel):
    id: str
    name: str
    code: str
    total_assigned: int
    resolved: int
    in_progress: int
    pending: int
    sla_compliance_rate: float

class WardMetric(BaseModel):
    ward_number: int
    name: str
    zone: str
    total_complaints: int
    resolved: int
    pending: int

class AuditLogItem(BaseModel):
    id: str
    action: str
    entity_type: str
    entity_id: str
    performed_by: str
    details: Dict[str, Any]
    created_at: datetime
