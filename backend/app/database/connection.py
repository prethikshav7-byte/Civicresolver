import os
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
from backend.app.core.config import settings

logger = logging.getLogger("civicresolve.db")

# In-memory mock/demo store with Coimbatore data when Supabase is not configured
class LocalDataStore:
    def __init__(self):
        self.complaints: List[Dict[str, Any]] = []
        self.departments: List[Dict[str, Any]] = []
        self.zones: List[Dict[str, Any]] = []
        self.wards: List[Dict[str, Any]] = []
        self.localities: List[Dict[str, Any]] = []
        self.audit_logs: List[Dict[str, Any]] = []
        self.counter = 1007
        self._seed_initial_data()

    def _seed_initial_data(self):
        # Departments
        self.departments = [
            {"id": "dept-1", "name": "Roads Department", "code": "DEPT-ROADS", "sla_hours": 48, "email": "roads@ccmc.gov.in"},
            {"id": "dept-2", "name": "Sanitation Department", "code": "DEPT-SAN", "sla_hours": 24, "email": "sanitation@ccmc.gov.in"},
            {"id": "dept-3", "name": "Electrical Department", "code": "DEPT-ELEC", "sla_hours": 36, "email": "electrical@ccmc.gov.in"},
            {"id": "dept-4", "name": "Water Supply Department", "code": "DEPT-WATER", "sla_hours": 24, "email": "water@ccmc.gov.in"},
            {"id": "dept-5", "name": "Drainage Department", "code": "DEPT-DRAIN", "sla_hours": 48, "email": "drainage@ccmc.gov.in"},
            {"id": "dept-6", "name": "Parks & Horticulture", "code": "DEPT-PARK", "sla_hours": 72, "email": "parks@ccmc.gov.in"},
        ]

        # Zones
        self.zones = [
            {"id": "zone-1", "name": "Central Zone", "code": "CBE-CENTRAL"},
            {"id": "zone-2", "name": "East Zone", "code": "CBE-EAST"},
            {"id": "zone-3", "name": "West Zone", "code": "CBE-WEST"},
            {"id": "zone-4", "name": "North Zone", "code": "CBE-NORTH"},
            {"id": "zone-5", "name": "South Zone", "code": "CBE-SOUTH"},
        ]

        # Localities
        self.localities = [
            {"id": "loc-1", "name": "Gandhipuram", "ward_number": 70, "zone": "Central Zone", "lat": 11.0168, "lng": 76.9558},
            {"id": "loc-2", "name": "RS Puram", "ward_number": 23, "zone": "West Zone", "lat": 11.0089, "lng": 76.9464},
            {"id": "loc-3", "name": "Peelamedu", "ward_number": 38, "zone": "North Zone", "lat": 11.0284, "lng": 77.0035},
            {"id": "loc-4", "name": "Singanallur", "ward_number": 55, "zone": "East Zone", "lat": 10.9998, "lng": 77.0253},
            {"id": "loc-5", "name": "Ukkadam", "ward_number": 84, "zone": "South Zone", "lat": 10.9934, "lng": 76.9602},
            {"id": "loc-6", "name": "Race Course", "ward_number": 72, "zone": "Central Zone", "lat": 11.0065, "lng": 76.9733},
            {"id": "loc-7", "name": "Saravanampatti", "ward_number": 38, "zone": "North Zone", "lat": 11.0797, "lng": 76.9997},
        ]

        now = datetime.utcnow()

        # Seed initial realistic complaints in Coimbatore
        self.complaints = [
            {
                "id": "c-1001",
                "complaint_reference": "#80001",
                "title": "Deep crater pothole with standing water",
                "description": "Dangerous pothole near Gandhipuram Central Bus Stand entry gate. Multiple two-wheelers have skidded during evening hours.",
                "category": "Roads",
                "issue_type": "Pothole",
                "priority": "High",
                "severity": 4,
                "status": "In Progress",
                "latitude": 11.0168,
                "longitude": 76.9558,
                "address": "Near Central Bus Stand Gate 2, Gandhipuram, Coimbatore 641012",
                "locality_name": "Gandhipuram",
                "ward_number": 70,
                "citizen_name": "Priya Sundaram",
                "citizen_email": "citizen.demo@civicresolve.in",
                "department_name": "Roads Department",
                "assigned_officer_name": "Er. Vigneshwaran K.",
                "resolution_notes": "Cold mix patch inspection completed. Hot asphalt road repair vehicle scheduled.",
                "supports_count": 14,
                "created_at": (now - timedelta(days=2)).isoformat(),
                "updated_at": (now - timedelta(hours=4)).isoformat(),
                "timeline": [
                    {"id": "t-1", "previous_status": None, "new_status": "Reported", "change_reason": "Issue reported via portal", "changed_by": "Citizen", "created_at": (now - timedelta(days=2)).isoformat()},
                    {"id": "t-2", "previous_status": "Reported", "new_status": "Under Review", "change_reason": "Gemini AI classified priority as High", "changed_by": "Civic AI Engine", "created_at": (now - timedelta(days=2, minutes=-15)).isoformat()},
                    {"id": "t-3", "previous_status": "Under Review", "new_status": "Assigned", "change_reason": "Allocated to Central Zone Roads Squad", "changed_by": "Admin Control Room", "created_at": (now - timedelta(days=1, hours=18)).isoformat()},
                    {"id": "t-4", "previous_status": "Assigned", "new_status": "In Progress", "change_reason": "Field team inspected site with asphalt crew", "changed_by": "Er. Vigneshwaran K.", "created_at": (now - timedelta(hours=4)).isoformat()},
                ]
            },
            {
                "id": "c-1002",
                "complaint_reference": "#80002",
                "title": "Overflowing community garbage container",
                "description": "Commercial waste from nearby eateries overflowing onto DB Road sidewalk for over 36 hours. Stray cattle feeding.",
                "category": "Sanitation",
                "issue_type": "Garbage Overflow",
                "priority": "Medium",
                "severity": 3,
                "status": "Assigned",
                "latitude": 11.0089,
                "longitude": 76.9464,
                "address": "Opposite Post Office, DB Road, RS Puram, Coimbatore 641002",
                "locality_name": "RS Puram",
                "ward_number": 23,
                "citizen_name": "Priya Sundaram",
                "citizen_email": "citizen.demo@civicresolve.in",
                "department_name": "Sanitation Department",
                "assigned_officer_name": "Sanitation Inspector S. Mohan",
                "resolution_notes": None,
                "supports_count": 8,
                "created_at": (now - timedelta(days=1)).isoformat(),
                "updated_at": (now - timedelta(hours=6)).isoformat(),
                "timeline": [
                    {"id": "t-5", "previous_status": None, "new_status": "Reported", "change_reason": "Issue reported via portal", "changed_by": "Citizen", "created_at": (now - timedelta(days=1)).isoformat()},
                    {"id": "t-6", "previous_status": "Reported", "new_status": "Assigned", "change_reason": "Dispatched to RS Puram Compactor Route 4", "changed_by": "Admin Control Room", "created_at": (now - timedelta(hours=6)).isoformat()},
                ]
            },
            {
                "id": "c-1003",
                "complaint_reference": "#80003",
                "title": "Cluster of 5 dead LED streetlights",
                "description": "Complete blackout on Avinashi Road service lane near PSG Tech junction creating safety hazard for pedestrians and students.",
                "category": "Electrical",
                "issue_type": "Streetlight Failure",
                "priority": "High",
                "severity": 4,
                "status": "Reported",
                "latitude": 11.0284,
                "longitude": 77.0035,
                "address": "Avinashi Road Service Lane, Peelamedu, Coimbatore 641004",
                "locality_name": "Peelamedu",
                "ward_number": 38,
                "citizen_name": "Karthik Narayanan",
                "citizen_email": "karthik.n@gmail.com",
                "department_name": "Electrical Department",
                "assigned_officer_name": None,
                "resolution_notes": None,
                "supports_count": 19,
                "created_at": (now - timedelta(hours=14)).isoformat(),
                "updated_at": (now - timedelta(hours=14)).isoformat(),
                "timeline": [
                    {"id": "t-7", "previous_status": None, "new_status": "Reported", "change_reason": "Submitted by citizen", "changed_by": "Citizen", "created_at": (now - timedelta(hours=14)).isoformat()},
                ]
            },
            {
                "id": "c-1004",
                "complaint_reference": "#80004",
                "title": "High-pressure drinking water main line rupture",
                "description": "Massive potable water leakage flooding Trichy Road main carriageway. Clean water gushing continuously into road gutter.",
                "category": "Water",
                "issue_type": "Water Main Burst",
                "priority": "Critical",
                "severity": 5,
                "status": "In Progress",
                "latitude": 10.9998,
                "longitude": 77.0253,
                "address": "Near Singanallur Signal, Trichy Road, Singanallur 641005",
                "locality_name": "Singanallur",
                "ward_number": 55,
                "citizen_name": "S. Lakshmi",
                "citizen_email": "lakshmi.s@outlook.com",
                "department_name": "Water Supply Department",
                "assigned_officer_name": "Assistant Engineer T. Balaji",
                "resolution_notes": "Emergency isolation valve closed. 300mm ductile iron sleeve being welded.",
                "supports_count": 31,
                "created_at": (now - timedelta(hours=5)).isoformat(),
                "updated_at": (now - timedelta(hours=1)).isoformat(),
                "timeline": [
                    {"id": "t-8", "previous_status": None, "new_status": "Reported", "change_reason": "Emergency citizen alert", "changed_by": "Citizen", "created_at": (now - timedelta(hours=5)).isoformat()},
                    {"id": "t-9", "previous_status": "Reported", "new_status": "In Progress", "change_reason": "Critical priority emergency team rushed", "changed_by": "Control Room", "created_at": (now - timedelta(hours=3)).isoformat()},
                ]
            },
            {
                "id": "c-1005",
                "complaint_reference": "#80005",
                "title": "Blocked stormwater culvert causing sewage backflow",
                "description": "Heavy silt and plastic debris accumulation blocking open canal near Ukkadam Periyakulam, flooding adjacent residential street.",
                "category": "Drainage",
                "issue_type": "Drainage Overflow",
                "priority": "Critical",
                "severity": 5,
                "status": "Resolved",
                "latitude": 10.9934,
                "longitude": 76.9602,
                "address": "Periyakulam Bund Road, Ukkadam, Coimbatore 641001",
                "locality_name": "Ukkadam",
                "ward_number": 84,
                "citizen_name": "Mohammed Farooq",
                "citizen_email": "farooq.m@yahoo.com",
                "department_name": "Drainage Department",
                "assigned_officer_name": "AE Drainage M. Suresh",
                "resolution_notes": "Super-sucker desilting machine cleared 4.2 tons of silt and plastic obstruction. Gravity flow restored.",
                "resolved_at": (now - timedelta(days=1)).isoformat(),
                "supports_count": 22,
                "created_at": (now - timedelta(days=4)).isoformat(),
                "updated_at": (now - timedelta(days=1)).isoformat(),
                "timeline": [
                    {"id": "t-10", "previous_status": None, "new_status": "Reported", "change_reason": "Submitted by citizen", "changed_by": "Citizen", "created_at": (now - timedelta(days=4)).isoformat()},
                    {"id": "t-11", "previous_status": "Reported", "new_status": "Assigned", "change_reason": "Assigned to South Zone Drainage Unit", "changed_by": "Admin", "created_at": (now - timedelta(days=3)).isoformat()},
                    {"id": "t-12", "previous_status": "Assigned", "new_status": "In Progress", "change_reason": "Desilting vehicle arrived on site", "changed_by": "Officer", "created_at": (now - timedelta(days=2)).isoformat()},
                    {"id": "t-13", "previous_status": "In Progress", "new_status": "Resolved", "change_reason": "Debris cleared, water flowing freely. Photo verified.", "changed_by": "AE Drainage M. Suresh", "created_at": (now - timedelta(days=1)).isoformat()},
                ]
            },
            {
                "id": "c-1006",
                "complaint_reference": "#80006",
                "title": "Fallen banyan tree limb blocking pedestrian jogging loop",
                "description": "Large branch snapped during heavy winds, resting across the walkway near Thomas Park. Obstructing senior citizens and joggers.",
                "category": "Parks",
                "issue_type": "Tree Fall",
                "priority": "Low",
                "severity": 2,
                "status": "Resolved",
                "latitude": 11.0065,
                "longitude": 76.9733,
                "address": "Jogging Track Opposite Thomas Park, Race Course, Coimbatore 641018",
                "locality_name": "Race Course",
                "ward_number": 72,
                "citizen_name": "Priya Sundaram",
                "citizen_email": "citizen.demo@civicresolve.in",
                "department_name": "Parks & Horticulture",
                "assigned_officer_name": "Horticulture Officer G. Ramesh",
                "resolution_notes": "Chainsaw squad cleared and safely removed branches within 3 hours. Walkway unobstructed.",
                "resolved_at": (now - timedelta(days=2)).isoformat(),
                "supports_count": 7,
                "created_at": (now - timedelta(days=3)).isoformat(),
                "updated_at": (now - timedelta(days=2)).isoformat(),
                "timeline": [
                    {"id": "t-14", "previous_status": None, "new_status": "Reported", "change_reason": "Submitted by citizen", "changed_by": "Citizen", "created_at": (now - timedelta(days=3)).isoformat()},
                    {"id": "t-15", "previous_status": "Reported", "new_status": "In Progress", "change_reason": "Chainsaw crew dispatched", "changed_by": "Admin", "created_at": (now - timedelta(days=3, hours=-2)).isoformat()},
                    {"id": "t-16", "previous_status": "In Progress", "new_status": "Resolved", "change_reason": "Branch cleared, footpath reopened.", "changed_by": "G. Ramesh", "created_at": (now - timedelta(days=2)).isoformat()},
                ]
            }
        ]

# Singleton instance of local store
local_store = LocalDataStore()

def is_supabase_configured() -> bool:
    return bool(settings.SUPABASE_URL and (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY))
