export type ComplaintCategory = 
  | 'Roads' 
  | 'Sanitation' 
  | 'Electrical' 
  | 'Water' 
  | 'Drainage' 
  | 'Parks' 
  | 'Public Infrastructure' 
  | 'Other';

export type ComplaintPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ComplaintStatus = 
  | 'Reported' 
  | 'Under Review' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Resolved' 
  | 'Reopened';

export interface StatusTimelineItem {
  id: string;
  previous_status?: string | null;
  new_status: string;
  change_reason?: string | null;
  changed_by?: string | null;
  created_at: string;
}

export interface Complaint {
  id: string;
  complaint_reference: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  issue_type?: string;
  priority: ComplaintPriority;
  priority_score?: number; // 1-100
  urgency_reason?: string;
  recommended_sla?: string;
  severity: number; // 1 to 5
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  address: string;
  locality_name?: string;
  ward_number?: number;
  citizen_name?: string;
  citizen_email?: string;
  department_name?: string;
  assigned_officer_name?: string;
  resolution_notes?: string | null;
  resolved_at?: string | null;
  image_url?: string | null;
  after_image_url?: string | null;
  supports_count: number;
  created_at: string;
  updated_at: string;
  timeline?: StatusTimelineItem[];
}

export interface PriorityScoreBreakdown {
  urgency_pts: number;
  urgency_label: string;
  impact_pts: number;
  impact_label: string;
  safety_pts: number;
  safety_label: string;
  context_pts: number;
  context_label: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggested_questions?: string[];
}

export interface AIAnalysisResult {
  category: ComplaintCategory;
  issue_type: string;
  priority: ComplaintPriority;
  priority_score?: number; // 1-100
  breakdown?: PriorityScoreBreakdown;
  triage_badge?: string;
  urgency_reason?: string;
  safety_risks?: string[];
  public_impact?: string;
  recommended_sla?: string;
  severity: number;
  safety_risk: string;
  recommended_department: string;
  suggested_action: string;
  confidence: number;
  explanation: string;
  is_emergency?: boolean;
  is_ai_generated?: boolean;
  is_fallback?: boolean;
}

export interface DuplicateMatch {
  complaint_reference: string;
  title: string;
  category: string;
  distance_meters: number;
  similarity_score: number;
  status: string;
  created_at: string;
}

export interface DuplicateCheckResult {
  has_possible_duplicates: boolean;
  count: number;
  matches: DuplicateMatch[];
  recommendation: string;
}

export interface AdminStats {
  total_complaints: number;
  new_reported: number;
  under_review: number;
  assigned: number;
  in_progress: number;
  resolved: number;
  critical_count: number;
  resolution_rate_percent: number;
  avg_resolution_days: number;
}

export interface DepartmentMetric {
  id: string;
  name: string;
  code: string;
  sla_hours: number;
  total: number;
  resolved: number;
  in_progress: number;
  pending: number;
  resolution_rate: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'citizen' | 'admin' | 'officer';
  department?: string;
  designation?: string;
  phone_number?: string;
  city: string;
  ward?: number;
}

export interface MapMarkerItem {
  id: string;
  reference: string;
  title: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  address: string;
  locality?: string;
  ward?: number;
  department?: string;
  created_at: string;
  supports_count: number;
}

export interface HotspotItem {
  lat: number;
  lng: number;
  intensity: number;
  category: string;
}

// ==========================================
// CivicProof: Community Verification
// ==========================================
export type CivicProofStatus = 
  | 'Community Verified' 
  | 'Community Confirmed'
  | 'Awaiting Community Verification' 
  | 'Disputed / Escalated' 
  | 'Reopened for Reinspection';

export interface CivicProofItem {
  id: string;
  complaint_id: string;
  complaint_reference: string;
  title: string;
  locality_name: string;
  locality?: string;
  ward_number: number;
  department_name: string;
  assigned_officer_name: string;
  officer_name?: string;
  category?: string;
  resolved_at: string;
  before_image_url: string;
  after_image_url: string;
  rectification_summary: string;
  ai_vision_assessment?: string;
  ai_vision_confidence?: number;
  votes_resolved: number;
  votes_partial: number;
  votes_still_exists: number;
  proof_status: CivicProofStatus;
  admin_reopened_reason?: string | null;
  voters?: string[];
}

export interface CommunityVoteRequest {
  citizen_name?: string;
  citizen_id?: string;
  vote: 'Resolved' | 'Partially resolved' | 'Still exists';
  comment?: string;
}

export interface AdminReopenRequest {
  reason: string;
  reopened_by?: string;
}

// ==========================================
// CivicPulse: Predictive Civic Intelligence
// ==========================================
export interface RecurringClusterItem {
  cluster_id: string;
  locality_name: string;
  ward_number: number;
  primary_issue: string;
  recurrence_count: number;
  first_reported: string;
  latest_reported: string;
  ai_pattern_analysis: string;
  infrastructure_age_years?: number;
  risk_level: 'High' | 'Medium' | 'Low';
}

export interface PredictiveHotspotItem {
  hotspot_id: string;
  locality_name: string;
  ward_number: number;
  predicted_issue_type: string;
  risk_probability_percent: number;
  forecast_window: string;
  trigger_factors: string[];
  recommended_preventive_action: string;
  methodology: string;
  confidence_level: 'High' | 'Medium' | 'Low';
}

export interface DepartmentBacklogItem {
  department: string;
  open_count: number;
  sla_breached_count: number;
  avg_resolution_days: number;
  active_squads: number;
}

export interface CivicPulseOverview {
  generated_at: string;
  total_analyzed_incidents: number;
  recurring_hotspots_count: number;
  high_risk_wards: number[];
  department_backlogs: DepartmentBacklogItem[];
  recurring_clusters: RecurringClusterItem[];
  predictive_hotspots: PredictiveHotspotItem[];
}

// ==========================================
// Officer Execution Queue
// ==========================================
export interface OfficerQueueResponse {
  department: string;
  officer: string;
  count: number;
  items: Complaint[];
}
