import { 
  Complaint, AIAnalysisResult, DuplicateCheckResult, 
  AdminStats, DepartmentMetric, MapMarkerItem, HotspotItem, UserProfile,
  CivicProofItem, CommunityVoteRequest, AdminReopenRequest, CivicPulseOverview, OfficerQueueResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` 
  : 'http://localhost:8000/api/v1';

// Seed initial Coimbatore records for standalone preview & resilient fallback
const INITIAL_COIMBATORE_COMPLAINTS: Complaint[] = [
  {
    id: "c-1001",
    complaint_reference: "CR-2026-00001",
    title: "Deep crater pothole with standing water",
    description: "Dangerous pothole near Gandhipuram Central Bus Stand entry gate. Multiple two-wheelers have skidded during evening hours.",
    category: "Roads",
    issue_type: "Pothole",
    priority: "High",
    severity: 4,
    status: "In Progress",
    latitude: 11.0168,
    longitude: 76.9558,
    address: "Near Central Bus Stand Gate 2, Gandhipuram, Coimbatore 641012",
    locality_name: "Gandhipuram",
    ward_number: 70,
    citizen_name: "Priya Sundaram",
    citizen_email: "citizen.demo@civicresolve.in",
    department_name: "Roads Department",
    assigned_officer_name: "Er. Vigneshwaran K.",
    resolution_notes: "Cold mix patch inspection completed. Hot asphalt road repair vehicle scheduled.",
    supports_count: 14,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    timeline: [
      { id: "t-1", previous_status: null, new_status: "Reported", change_reason: "Issue reported via portal", changed_by: "Citizen", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: "t-2", previous_status: "Reported", new_status: "Under Review", change_reason: "Civic AI triage classified priority as High", changed_by: "Civic AI Engine", created_at: new Date(Date.now() - 2 * 86400000 + 900000).toISOString() },
      { id: "t-3", previous_status: "Under Review", new_status: "Assigned", change_reason: "Allocated to Central Zone Roads Squad", changed_by: "Admin Control Room", created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: "t-4", previous_status: "Assigned", new_status: "In Progress", change_reason: "Field team inspected site with asphalt crew", changed_by: "Er. Vigneshwaran K.", created_at: new Date(Date.now() - 4 * 3600000).toISOString() }
    ]
  },
  {
    id: "c-1002",
    complaint_reference: "CR-2026-00002",
    title: "Overflowing community garbage container",
    description: "Commercial waste from nearby eateries overflowing onto DB Road sidewalk for over 36 hours. Stray cattle feeding.",
    category: "Sanitation",
    issue_type: "Garbage Overflow",
    priority: "Medium",
    severity: 3,
    status: "Assigned",
    latitude: 11.0089,
    longitude: 76.9464,
    address: "Opposite Post Office, DB Road, RS Puram, Coimbatore 641002",
    locality_name: "RS Puram",
    ward_number: 23,
    citizen_name: "Priya Sundaram",
    citizen_email: "citizen.demo@civicresolve.in",
    department_name: "Sanitation Department",
    assigned_officer_name: "Sanitation Inspector S. Mohan",
    resolution_notes: null,
    supports_count: 8,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    timeline: [
      { id: "t-5", previous_status: null, new_status: "Reported", change_reason: "Issue reported via portal", changed_by: "Citizen", created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: "t-6", previous_status: "Reported", new_status: "Assigned", change_reason: "Dispatched to RS Puram Compactor Route 4", changed_by: "Admin Control Room", created_at: new Date(Date.now() - 6 * 3600000).toISOString() }
    ]
  },
  {
    id: "c-1003",
    complaint_reference: "CR-2026-00003",
    title: "Cluster of 5 dead LED streetlights",
    description: "Complete blackout on Avinashi Road service lane near PSG Tech junction creating safety hazard for pedestrians and students.",
    category: "Electrical",
    issue_type: "Streetlight Failure",
    priority: "High",
    severity: 4,
    status: "Reported",
    latitude: 11.0284,
    longitude: 77.0035,
    address: "Avinashi Road Service Lane, Peelamedu, Coimbatore 641004",
    locality_name: "Peelamedu",
    ward_number: 38,
    citizen_name: "Karthik Narayanan",
    citizen_email: "karthik.n@gmail.com",
    department_name: "Electrical Department",
    assigned_officer_name: undefined,
    resolution_notes: null,
    supports_count: 19,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    timeline: [
      { id: "t-7", previous_status: null, new_status: "Reported", change_reason: "Submitted by citizen", changed_by: "Citizen", created_at: new Date(Date.now() - 14 * 3600000).toISOString() }
    ]
  },
  {
    id: "c-1004",
    complaint_reference: "CR-2026-00004",
    title: "High-pressure drinking water main line rupture",
    description: "Massive potable water leakage flooding Trichy Road main carriageway. Clean water gushing continuously into road gutter.",
    category: "Water",
    issue_type: "Water Main Burst",
    priority: "Critical",
    severity: 5,
    status: "In Progress",
    latitude: 10.9998,
    longitude: 77.0253,
    address: "Near Singanallur Signal, Trichy Road, Singanallur 641005",
    locality_name: "Singanallur",
    ward_number: 55,
    citizen_name: "S. Lakshmi",
    citizen_email: "lakshmi.s@outlook.com",
    department_name: "Water Supply Department",
    assigned_officer_name: "Assistant Engineer T. Balaji",
    resolution_notes: "Emergency isolation valve closed. 300mm ductile iron sleeve being welded.",
    supports_count: 31,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    timeline: [
      { id: "t-8", previous_status: null, new_status: "Reported", change_reason: "Emergency citizen alert", changed_by: "Citizen", created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
      { id: "t-9", previous_status: "Reported", new_status: "In Progress", change_reason: "Critical priority emergency team rushed", changed_by: "Control Room", created_at: new Date(Date.now() - 3 * 3600000).toISOString() }
    ]
  },
  {
    id: "c-1005",
    complaint_reference: "CR-2026-00005",
    title: "Blocked stormwater culvert causing sewage backflow",
    description: "Heavy silt and plastic debris accumulation blocking open canal near Ukkadam Periyakulam, flooding adjacent residential street.",
    category: "Drainage",
    issue_type: "Drainage Overflow",
    priority: "Critical",
    severity: 5,
    status: "Resolved",
    latitude: 10.9934,
    longitude: 76.9602,
    address: "Periyakulam Bund Road, Ukkadam, Coimbatore 641001",
    locality_name: "Ukkadam",
    ward_number: 84,
    citizen_name: "Mohammed Farooq",
    citizen_email: "farooq.m@yahoo.com",
    department_name: "Drainage Department",
    assigned_officer_name: "AE Drainage M. Suresh",
    resolution_notes: "Super-sucker desilting machine cleared 4.2 tons of silt and plastic obstruction. Gravity flow restored.",
    resolved_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    supports_count: 22,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    timeline: [
      { id: "t-10", previous_status: null, new_status: "Reported", change_reason: "Submitted by citizen", changed_by: "Citizen", created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: "t-11", previous_status: "Reported", new_status: "Assigned", change_reason: "Assigned to South Zone Drainage Unit", changed_by: "Admin", created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: "t-12", previous_status: "Assigned", new_status: "In Progress", change_reason: "Desilting vehicle arrived on site", changed_by: "Officer", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: "t-13", previous_status: "In Progress", new_status: "Resolved", change_reason: "Debris cleared, water flowing freely. Photo verified.", changed_by: "AE Drainage M. Suresh", created_at: new Date(Date.now() - 1 * 86400000).toISOString() }
    ]
  },
  {
    id: "c-1006",
    complaint_reference: "CR-2026-00006",
    title: "Fallen banyan tree limb blocking pedestrian jogging loop",
    description: "Large branch snapped during heavy winds, resting across the walkway near Thomas Park. Obstructing senior citizens and joggers.",
    category: "Parks",
    issue_type: "Tree Fall",
    priority: "Low",
    severity: 2,
    status: "Resolved",
    latitude: 11.0065,
    longitude: 76.9733,
    address: "Jogging Track Opposite Thomas Park, Race Course, Coimbatore 641018",
    locality_name: "Race Course",
    ward_number: 72,
    citizen_name: "Priya Sundaram",
    citizen_email: "citizen.demo@civicresolve.in",
    department_name: "Parks & Horticulture",
    assigned_officer_name: "Horticulture Officer G. Ramesh",
    resolution_notes: "Chainsaw squad cleared and safely removed branches within 3 hours. Walkway unobstructed.",
    resolved_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    supports_count: 7,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    timeline: [
      { id: "t-14", previous_status: null, new_status: "Reported", change_reason: "Submitted by citizen", changed_by: "Citizen", created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: "t-15", previous_status: "Reported", new_status: "In Progress", change_reason: "Chainsaw crew dispatched", changed_by: "Admin", created_at: new Date(Date.now() - 3 * 86400000 + 7200000).toISOString() },
      { id: "t-16", previous_status: "In Progress", new_status: "Resolved", change_reason: "Branch cleared, footpath reopened.", changed_by: "G. Ramesh", created_at: new Date(Date.now() - 2 * 86400000).toISOString() }
    ]
  }
];

// Initial CivicProof items for community verification
const INITIAL_CIVICPROOF_ITEMS: CivicProofItem[] = [
  {
    id: "proof-1",
    complaint_id: "c-1005",
    complaint_reference: "CR-2026-00005",
    title: "Monsoon stormwater channel desilting",
    locality_name: "Singanallur",
    ward_number: 55,
    department_name: "Drainage Department",
    assigned_officer_name: "Assistant Engineer M. Balaji",
    resolved_at: new Date(Date.now() - 36 * 3600000).toISOString(),
    before_image_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    after_image_url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
    rectification_summary: "Channel desilted using suction machines; 4.2 metric tons of wet silt evacuated. Flow rate restored.",
    ai_vision_assessment: "De-silted canal cross-section verified clear. Zero standing sludge detected.",
    votes_resolved: 18,
    votes_partial: 1,
    votes_still_exists: 0,
    proof_status: "Community Verified"
  },
  {
    id: "proof-2",
    complaint_id: "c-1006",
    complaint_reference: "CR-2026-00006",
    title: "Broken public park swing set & perimeter fence",
    locality_name: "Race Course",
    ward_number: 72,
    department_name: "Parks & Horticulture",
    assigned_officer_name: "Horticulture Officer K. Malathi",
    resolved_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    before_image_url: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80",
    after_image_url: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=600&q=80",
    rectification_summary: "Installed new reinforced steel chains, replacement safety swing seats, and welded chain-link perimeter fence.",
    ai_vision_assessment: "Park apparatus safety inspection confirmed complete with structural welds.",
    votes_resolved: 7,
    votes_partial: 2,
    votes_still_exists: 1,
    proof_status: "Awaiting Community Verification"
  },
  {
    id: "proof-3",
    complaint_id: "c-1001",
    complaint_reference: "CR-2026-00001",
    title: "Deep crater pothole patch repair",
    locality_name: "Gandhipuram",
    ward_number: 70,
    department_name: "Roads Department",
    assigned_officer_name: "Er. Vigneshwaran K.",
    resolved_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    before_image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    after_image_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    rectification_summary: "Emergency cold-mix bitumen patching completed. Surface compacted level with surrounding carriageway.",
    ai_vision_assessment: "Surface filled with bitumen aggregate. Level requires secondary roller compaction.",
    votes_resolved: 2,
    votes_partial: 3,
    votes_still_exists: 1,
    proof_status: "Disputed / Escalated"
  }
];

const INITIAL_CIVICPULSE_OVERVIEW: CivicPulseOverview = {
  generated_at: new Date().toISOString(),
  total_analyzed_incidents: 1420,
  recurring_hotspots_count: 4,
  high_risk_wards: [70, 38, 55, 84],
  department_backlogs: [
    { department: "Roads Department", open_count: 24, sla_breached_count: 3, avg_resolution_days: 2.8, active_squads: 6 },
    { department: "Drainage Department", open_count: 19, sla_breached_count: 5, avg_resolution_days: 3.4, active_squads: 4 },
    { department: "Sanitation Department", open_count: 12, sla_breached_count: 1, avg_resolution_days: 1.2, active_squads: 14 },
    { department: "Electrical Department", open_count: 9, sla_breached_count: 0, avg_resolution_days: 0.9, active_squads: 8 },
    { department: "Water Supply Department", open_count: 15, sla_breached_count: 2, avg_resolution_days: 2.1, active_squads: 5 }
  ],
  recurring_clusters: [
    {
      cluster_id: "cl-1",
      locality_name: "Gandhipuram Bus Stand Carriageway",
      ward_number: 70,
      primary_issue: "Chronic Bitumen Erosion & Heavy Bus Axle Potholes",
      recurrence_count: 14,
      first_reported: "2025-04-12",
      latest_reported: "2026-11-20",
      ai_pattern_analysis: "High turning moment of heavy intra-district buses combined with sub-base moisture seepage causes repeated asphalt stripping within 45 days of patch repair.",
      infrastructure_age_years: 11,
      risk_level: "High"
    },
    {
      cluster_id: "cl-2",
      locality_name: "Singanallur Trichy Road Underpass",
      ward_number: 55,
      primary_issue: "Stormwater Inundation & Silt Choking",
      recurrence_count: 9,
      first_reported: "2025-06-15",
      latest_reported: "2026-11-18",
      ai_pattern_analysis: "Inadequate drain slope gradient causes reverse runoff from railway culvert during precipitation > 20mm/hr.",
      infrastructure_age_years: 16,
      risk_level: "High"
    },
    {
      cluster_id: "cl-3",
      locality_name: "Saravanampatti IT Corridor Service Road",
      ward_number: 38,
      primary_issue: "Nighttime Streetlight Circuit Overloads",
      recurrence_count: 8,
      first_reported: "2025-08-01",
      latest_reported: "2026-11-17",
      ai_pattern_analysis: "Phase load imbalance across high-density commercial transformers causes feeder trips on alternate poles.",
      infrastructure_age_years: 4,
      risk_level: "Medium"
    },
    {
      cluster_id: "cl-4",
      locality_name: "Ukkadam Fish Market Perimeter",
      ward_number: 84,
      primary_issue: "Organic Waste Dump Overflow & Drain Clogging",
      recurrence_count: 12,
      first_reported: "2025-05-10",
      latest_reported: "2026-11-19",
      ai_pattern_analysis: "Bi-daily commercial market volume exceeds dumper placer capacity by 180%; uncollected effluent enters lake bund canal.",
      infrastructure_age_years: 8,
      risk_level: "High"
    }
  ],
  predictive_hotspots: [
    {
      hotspot_id: "pred-1",
      locality_name: "Singanallur Trichy Road Underpass",
      ward_number: 55,
      predicted_issue_type: "Severe Stormwater Flooding & Traffic Paralysis",
      risk_probability_percent: 88,
      forecast_window: "Next 7-14 Days (Early Monsoon Onset)",
      trigger_factors: ["Current silt deposit depth > 60%", "Forecasted thunderstorm > 25mm/hr", "Low terrain gradient"],
      recommended_preventive_action: "Pre-monsoon super-sucker mechanical desilting and standby dewatering diesel pump deployment.",
      methodology: "Spatio-temporal Poisson regression over 24-month rainfall, monsoon water-logging recurrence, and soil permeability data.",
      confidence_level: "High"
    },
    {
      hotspot_id: "pred-2",
      locality_name: "Peelamedu Avinashi Road Flyover Descent",
      ward_number: 38,
      predicted_issue_type: "Micro-Trench Pavement Subsidence & Skid Zone",
      risk_probability_percent: 74,
      forecast_window: "Next 15-30 Days",
      trigger_factors: ["Recent uncompacted telecom fiber trenching", "Heavy commercial vehicle braking zone", "Thermal pavement fatigue"],
      recommended_preventive_action: "Mandate contractor reinstatement with mastic asphalt and core density compaction testing.",
      methodology: "Urban utility excavation overlay crossed with accelerometer telemetry and two-wheeler accident historical reports.",
      confidence_level: "Medium"
    },
    {
      hotspot_id: "pred-3",
      locality_name: "RS Puram West Venkatasamy Road",
      ward_number: 23,
      predicted_issue_type: "Drinking Water Supply Pipeline Burst",
      risk_probability_percent: 69,
      forecast_window: "Next 30 Days",
      trigger_factors: ["Pilloor-II ductile iron distribution line age > 22 years", "Pressure surge from booster pump station", "Ground vibration from commercial construction"],
      recommended_preventive_action: "Acoustic leak detection sweep and pressure relief valve calibration at Ward 23 manifold.",
      methodology: "Hydraulic pressure transient simulation coupled with pipe material degradation lifespan matrix.",
      confidence_level: "Medium"
    }
  ]
};

// Fallback in-memory storage for reactive UI updates
let localStoreComplaints = [...INITIAL_COIMBATORE_COMPLAINTS];
let localStoreProof = [...INITIAL_CIVICPROOF_ITEMS];
let complaintCounter = 1007;

export const CivicApi = {
  async getComplaints(params?: { category?: string; priority?: string; status?: string; search?: string }): Promise<{ total: number; items: Complaint[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.priority) query.append('priority', params.priority);
      if (params?.status) query.append('status', params.status);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/complaints?${query.toString()}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Backend offline, use local store
    }

    let items = [...localStoreComplaints];
    if (params?.category) items = items.filter(c => c.category.toLowerCase() === params.category!.toLowerCase());
    if (params?.priority) items = items.filter(c => c.priority.toLowerCase() === params.priority!.toLowerCase());
    if (params?.status) items = items.filter(c => c.status.toLowerCase() === params.status!.toLowerCase());
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) || 
        c.complaint_reference.toLowerCase().includes(q)
      );
    }
    return { total: items.length, items };
  },

  async getComplaint(idOrRef: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${idOrRef}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (e) {}

    const found = localStoreComplaints.find(c => c.id === idOrRef || c.complaint_reference === idOrRef);
    return found || null;
  },

  async createComplaint(payload: Partial<Complaint>): Promise<Complaint> {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback creation
    complaintCounter++;
    const ref = `CR-2026-${String(complaintCounter).padStart(5, '0')}`;
    const newComp: Complaint = {
      id: `c-${Date.now()}`,
      complaint_reference: ref,
      title: payload.title || "Untitled Grievance",
      description: payload.description || "",
      category: payload.category || "Roads",
      issue_type: payload.issue_type || payload.category,
      priority: payload.priority || "Medium",
      severity: payload.severity || 3,
      status: "Reported",
      latitude: payload.latitude || 11.0168,
      longitude: payload.longitude || 76.9558,
      address: payload.address || "Coimbatore, Tamil Nadu",
      locality_name: payload.locality_name || "Coimbatore Central",
      ward_number: payload.ward_number || 70,
      citizen_name: payload.citizen_name || "Priya Sundaram",
      citizen_email: payload.citizen_email || "citizen.demo@civicresolve.in",
      department_name: payload.category === 'Roads' ? 'Roads Department' : 'Sanitation Department',
      supports_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      timeline: [
        {
          id: `t-${Date.now()}`,
          previous_status: null,
          new_status: "Reported",
          change_reason: "Registered via CivicResolve portal",
          changed_by: payload.citizen_name || "Citizen",
          created_at: new Date().toISOString()
        }
      ]
    };
    localStoreComplaints.unshift(newComp);
    return newComp;
  },

  async analyzeWithAI(title: string, description: string, address?: string): Promise<AIAnalysisResult> {
    try {
      const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, address }),
        signal: AbortSignal.timeout(6000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Deterministic client fallback if backend is unreachable
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes('water') || text.includes('pipe') || text.includes('leak')) {
      return {
        category: "Water",
        issue_type: "Potable Water Pipeline Leakage",
        priority: text.includes('flood') || text.includes('burst') ? "Critical" : "High",
        severity: 4,
        safety_risk: "Drinking water loss and pedestrian carriageway softening",
        recommended_department: "Water Supply Department",
        suggested_action: "Isolate local valve and deploy pipe repair crew",
        confidence: 0.94,
        explanation: "Analyzed keywords indicating municipal water distribution breakdown.",
        is_ai_generated: true
      };
    }
    if (text.includes('light') || text.includes('wire') || text.includes('dark')) {
      return {
        category: "Electrical",
        issue_type: "Streetlight / Cable Hazard",
        priority: "High",
        severity: 4,
        safety_risk: "Nighttime safety hazard and pedestrian vulnerability",
        recommended_department: "Electrical Department",
        suggested_action: "Dispatch lineman squad with replacement LED modules",
        confidence: 0.92,
        explanation: "Civic AI identified illumination failure on public street.",
        is_ai_generated: true
      };
    }
    if (text.includes('drain') || text.includes('sewage') || text.includes('silt')) {
      return {
        category: "Drainage",
        issue_type: "Stormwater Drain Overflow",
        priority: "High",
        severity: 4,
        safety_risk: "Vector-borne disease hazard and monsoon flood risk",
        recommended_department: "Drainage Department",
        suggested_action: "Deploy desilting machinery and vacuum super-sucker",
        confidence: 0.93,
        explanation: "Identified wastewater or drainage passage obstruction.",
        is_ai_generated: true
      };
    }
    if (text.includes('garbage') || text.includes('waste') || text.includes('dump')) {
      return {
        category: "Sanitation",
        issue_type: "Solid Waste Accumulation",
        priority: "Medium",
        severity: 3,
        safety_risk: "Health risk and stray animal congregation",
        recommended_department: "Sanitation Department",
        suggested_action: "Route compactor truck for clearance and bleaching sanitation",
        confidence: 0.95,
        explanation: "Civic report documents uncollected municipal solid waste.",
        is_ai_generated: true
      };
    }

    return {
      category: "Roads",
      issue_type: "Pothole / Road Surface Damage",
      priority: text.includes('skid') || text.includes('deep') ? "High" : "Medium",
      severity: 3,
      safety_risk: "Two-wheeler skid hazard and vehicular traffic slowdown",
      recommended_department: "Roads Department",
      suggested_action: "Deploy cold-mix asphalt patch team",
      confidence: 0.91,
      explanation: "Surface deterioration detected in right of way.",
      is_ai_generated: true
    };
  },

  async checkDuplicates(title: string, description: string, lat: number, lng: number): Promise<DuplicateCheckResult> {
    try {
      const res = await fetch(`${API_BASE}/ai/find-duplicates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, latitude: lat, longitude: lng, radius_meters: 300 }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback: check against nearest seeded complaints
    const matches = localStoreComplaints.filter(c => {
      const dLat = Math.abs(c.latitude - lat);
      const dLng = Math.abs(c.longitude - lng);
      return (dLat < 0.003 && dLng < 0.003); // within ~300 meters
    }).map(c => ({
      complaint_reference: c.complaint_reference,
      title: c.title,
      category: c.category,
      distance_meters: 65,
      similarity_score: 0.82,
      status: c.status,
      created_at: c.created_at
    }));

    return {
      has_possible_duplicates: matches.length > 0,
      count: matches.length,
      matches,
      recommendation: matches.length > 0 
        ? "Similar report located within 100 meters. You can endorse it to escalate urgency." 
        : "No active duplicate complaints detected within this immediate zone."
    };
  },

  async getMapComplaints(): Promise<MapMarkerItem[]> {
    try {
      const res = await fetch(`${API_BASE}/map/complaints`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.markers;
      }
    } catch (e) {}

    return localStoreComplaints.map(c => ({
      id: c.id,
      reference: c.complaint_reference,
      title: c.title,
      category: c.category,
      priority: c.priority,
      status: c.status,
      latitude: c.latitude,
      longitude: c.longitude,
      address: c.address,
      locality: c.locality_name,
      ward: c.ward_number,
      department: c.department_name,
      created_at: c.created_at,
      supports_count: c.supports_count
    }));
  },

  async getHotspots(): Promise<HotspotItem[]> {
    try {
      const res = await fetch(`${API_BASE}/map/hotspots`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.hotspots;
      }
    } catch (e) {}

    return localStoreComplaints.map(c => ({
      lat: c.latitude,
      lng: c.longitude,
      intensity: c.priority === 'Critical' ? 1.0 : c.priority === 'High' ? 0.75 : 0.5,
      category: c.category
    }));
  },

  async getAdminStats(): Promise<AdminStats> {
    try {
      const res = await fetch(`${API_BASE}/admin/overview`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (e) {}

    const total = localStoreComplaints.length;
    const resolved = localStoreComplaints.filter(c => c.status === 'Resolved').length;
    return {
      total_complaints: total,
      new_reported: localStoreComplaints.filter(c => c.status === 'Reported').length,
      under_review: localStoreComplaints.filter(c => c.status === 'Under Review').length,
      assigned: localStoreComplaints.filter(c => c.status === 'Assigned').length,
      in_progress: localStoreComplaints.filter(c => c.status === 'In Progress').length,
      resolved: resolved,
      critical_count: localStoreComplaints.filter(c => c.priority === 'Critical').length,
      resolution_rate_percent: Math.round((resolved / total) * 100),
      avg_resolution_days: 2.3
    };
  },

  async assignDepartment(complaintRef: string, deptName: string, officerName?: string, instructions?: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/admin/assign?complaint_id=${complaintRef}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department_id: "dept-auto",
          department_name: deptName,
          officer_name: officerName,
          instructions
        }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.complaint;
      }
    } catch (e) {}

    const target = localStoreComplaints.find(c => c.complaint_reference === complaintRef || c.id === complaintRef);
    if (target) {
      target.department_name = deptName;
      if (officerName) target.assigned_officer_name = officerName;
      target.status = 'Assigned';
      target.updated_at = new Date().toISOString();
      target.timeline?.push({
        id: `t-${Date.now()}`,
        previous_status: "Reported",
        new_status: "Assigned",
        change_reason: instructions || `Assigned to ${deptName}`,
        changed_by: "Admin Control Room",
        created_at: new Date().toISOString()
      });
      return target;
    }
    return null;
  },

  async resolveComplaint(complaintRef: string, resolutionNotes: string, officerName?: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/admin/complaints/${complaintRef}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Resolved',
          reason: 'Field work verified and completed',
          resolution_notes: resolutionNotes,
          officer_name: officerName || "Executive Engineer"
        }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.complaint;
      }
    } catch (e) {}

    const target = localStoreComplaints.find(c => c.complaint_reference === complaintRef || c.id === complaintRef);
    if (target) {
      target.status = 'Resolved';
      target.resolution_notes = resolutionNotes;
      target.resolved_at = new Date().toISOString();
      target.updated_at = new Date().toISOString();
      target.timeline?.push({
        id: `t-${Date.now()}`,
        previous_status: "In Progress",
        new_status: "Resolved",
        change_reason: resolutionNotes,
        changed_by: officerName || "Officer",
        created_at: new Date().toISOString()
      });
      return target;
    }
    return null;
  },

  async supportComplaint(ref: string): Promise<number> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${ref}/support`, { method: 'POST', signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const d = await res.json();
        return d.supports_count;
      }
    } catch (e) {}

    const target = localStoreComplaints.find(c => c.complaint_reference === ref || c.id === ref);
    if (target) {
      target.supports_count = (target.supports_count || 0) + 1;
      return target.supports_count;
    }
    return 1;
  },

  // ==========================================
  // CivicProof: Community Verification Methods
  // ==========================================
  async getProofList(status?: string): Promise<CivicProofItem[]> {
    try {
      const url = status && status !== 'All' 
        ? `${API_BASE}/civicproof/list?status=${encodeURIComponent(status)}` 
        : `${API_BASE}/civicproof/list`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (e) {}

    if (status && status !== 'All') {
      return localStoreProof.filter(p => p.proof_status.toLowerCase() === status.toLowerCase());
    }
    return localStoreProof;
  },

  async voteProof(idOrRef: string, payload: CommunityVoteRequest): Promise<CivicProofItem | null> {
    try {
      const res = await fetch(`${API_BASE}/civicproof/${idOrRef}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.proof_item;
      }
    } catch (e) {}

    const p = localStoreProof.find(item => item.id === idOrRef || item.complaint_reference === idOrRef);
    if (p) {
      if (payload.vote === 'Resolved') p.votes_resolved += 1;
      else if (payload.vote === 'Partially resolved') p.votes_partial += 1;
      else if (payload.vote === 'Still exists') p.votes_still_exists += 1;

      const total = p.votes_resolved + p.votes_partial + p.votes_still_exists;
      if (p.votes_still_exists + p.votes_partial >= 3) {
        p.proof_status = "Disputed / Escalated";
      } else if (p.votes_resolved / total >= 0.7 && total >= 3) {
        p.proof_status = "Community Verified";
      }
      return { ...p };
    }
    return null;
  },

  async reopenProof(idOrRef: string, payload: AdminReopenRequest): Promise<CivicProofItem | null> {
    try {
      const res = await fetch(`${API_BASE}/civicproof/${idOrRef}/reopen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.proof_item;
      }
    } catch (e) {}

    const p = localStoreProof.find(item => item.id === idOrRef || item.complaint_reference === idOrRef);
    if (p) {
      p.proof_status = "Reopened for Reinspection";
      p.admin_reopened_reason = payload.reason;
      return { ...p };
    }
    return null;
  },

  // ==========================================
  // CivicPulse: Predictive Analytics
  // ==========================================
  async getPulseOverview(): Promise<CivicPulseOverview> {
    try {
      const res = await fetch(`${API_BASE}/civicpulse/overview`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_CIVICPULSE_OVERVIEW;
  },

  // ==========================================
  // Officer Execution Queue
  // ==========================================
  async getOfficerQueue(department: string = "Roads Department"): Promise<OfficerQueueResponse> {
    try {
      const res = await fetch(`${API_BASE}/officer/queue?department=${encodeURIComponent(department)}`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const assigned = localStoreComplaints.filter(
      c => (c.department_name || "").toLowerCase() === department.toLowerCase() &&
           ['Assigned', 'In Progress', 'Reopened'].includes(c.status)
    );
    return {
      department,
      officer: "Er. Vigneshwaran K.",
      count: assigned.length,
      items: assigned
    };
  },

  async recordInspection(idOrRef: string, notes: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/officer/inspect/${idOrRef}?notes=${encodeURIComponent(notes)}`, {
        method: 'POST',
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.complaint;
      }
    } catch (e) {}

    const target = localStoreComplaints.find(c => c.complaint_reference === idOrRef || c.id === idOrRef);
    if (target) {
      target.status = 'In Progress';
      target.updated_at = new Date().toISOString();
      target.timeline?.push({
        id: `t-${Date.now()}`,
        previous_status: "Assigned",
        new_status: "In Progress",
        change_reason: `Field inspection conducted: ${notes}`,
        changed_by: "Er. Vigneshwaran K. (Executive Engineer)",
        created_at: new Date().toISOString()
      });
      return target;
    }
    return null;
  },

  async submitOfficerResolution(idOrRef: string, notes: string, afterImageUrl?: string): Promise<Complaint | null> {
    try {
      const query = new URLSearchParams({ resolution_notes: notes });
      if (afterImageUrl) query.append('after_image_url', afterImageUrl);
      const res = await fetch(`${API_BASE}/officer/resolve/${idOrRef}?${query.toString()}`, {
        method: 'POST',
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.complaint;
      }
    } catch (e) {}

    const target = localStoreComplaints.find(c => c.complaint_reference === idOrRef || c.id === idOrRef);
    if (target) {
      target.status = 'Resolved';
      target.resolution_notes = notes;
      target.resolved_at = new Date().toISOString();
      target.after_image_url = afterImageUrl;
      target.updated_at = new Date().toISOString();
      target.timeline?.push({
        id: `t-${Date.now()}`,
        previous_status: "In Progress",
        new_status: "Resolved",
        change_reason: notes,
        changed_by: "Er. Vigneshwaran K. (Executive Engineer)",
        created_at: new Date().toISOString()
      });
      return target;
    }
    return null;
  },

  // ==========================================
  // Administrative CSV Audit Export
  // ==========================================
  async exportAuditCsv(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/admin/export/csv`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `civicresolve_audit_coimbatore_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {}

    // Fallback CSV download from local memory
    const headers = "Reference_ID,Title,Category,Priority,Status,Locality,Ward,Department,Assigned_Officer,Created_At,Resolved_At\n";
    const rows = localStoreComplaints.map(c => 
      `"${c.complaint_reference}","${c.title.replace(/"/g, '""')}","${c.category}","${c.priority}","${c.status}","${c.locality_name || ''}","${c.ward_number || ''}","${c.department_name || ''}","${c.assigned_officer_name || ''}","${c.created_at}","${c.resolved_at || ''}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civicresolve_audit_coimbatore_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // ==========================================
  // Persistent Civic AI Assistant Chat
  // ==========================================
  async chatWithAssistant(message: string, role: string = 'citizen', complaintRef?: string): Promise<{ reply: string; suggested_questions: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, role, complaint_reference: complaintRef }),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const lower = message.toLowerCase();
    if (lower.includes('track') || lower.includes('reference')) {
      return {
        reply: "To track a grievance, enter your reference number (such as CR-2026-00001 or CR-2026-80019) on the Track Issue page. The system details the full chronological history from Reported to Resolved with before/after audit photos.",
        suggested_questions: ["What are the resolution SLAs?", "How does CivicProof voting work?", "Which department handles potholes?"]
      };
    }
    if (lower.includes('sla') || lower.includes('time')) {
      return {
        reply: "Standard resolution SLAs: Critical emergencies (live wires, water main bursts) are targeted within 4 to 12 hours. Carriageway potholes and sanitation spills are scheduled within 24 to 48 hours.",
        suggested_questions: ["How do I report a new issue?", "How do I endorse an existing issue?", "What is CivicPulse?"]
      };
    }
    return {
      reply: `CivicResolve Assistant (${role.toUpperCase()} mode): How can I assist you with municipal operations, GIS mapping, or resolution auditing in Coimbatore today?`,
      suggested_questions: ["How do I report a grievance?", "What are the standard resolution SLAs?", "How does CivicProof verify repairs?"]
    };
  }
};
