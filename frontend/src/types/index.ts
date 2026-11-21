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
  supports_count: number;
  created_at: string;
  updated_at: string;
  timeline?: StatusTimelineItem[];
}

export interface AIAnalysisResult {
  category: ComplaintCategory;
  issue_type: string;
  priority: ComplaintPriority;
  severity: number;
  safety_risk: string;
  recommended_department: string;
  suggested_action: string;
  confidence: number;
  explanation: string;
  is_emergency?: boolean;
  is_ai_generated?: boolean;
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
