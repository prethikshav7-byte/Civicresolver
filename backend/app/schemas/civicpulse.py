from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class RecurringClusterItem(BaseModel):
    locality: str
    ward_number: int
    category: str
    recurrence_count: int
    frequency: str
    risk_index: str  # High / Severe / Moderate
    coordinates: List[float]
    primary_issue: str
    recommended_preventive_action: str

class PredictiveHotspotItem(BaseModel):
    locality: str
    ward_number: int
    predicted_category: str
    risk_probability: float  # e.g. 0.85
    forecast_window: str  # e.g. "Next 14 Days"
    historical_basis_count: int
    methodology: str
    supporting_factors: List[str]
    confidence_level: str  # High / Medium / Low
    data_sufficiency: bool

class CivicPulseOverview(BaseModel):
    total_analyzed: int
    active_backlog_days: float
    highest_risk_ward: int
    highest_risk_locality: str
    recurring_hotspots_count: int
    department_backlog: List[Dict[str, Any]]
    monthly_trends: List[Dict[str, Any]]
    recurring_clusters: List[RecurringClusterItem]
    predictive_hotspots: List[PredictiveHotspotItem]
