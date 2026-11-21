-- ==============================================================================
-- CivicResolve - Initial PostgreSQL Database Schema
-- Focus City: Coimbatore, Tamil Nadu, India
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Administrative Zones of Coimbatore
CREATE TABLE IF NOT EXISTS administrative_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    headquarters VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Coimbatore Wards
CREATE TABLE IF NOT EXISTS wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES administrative_zones(id) ON DELETE SET NULL,
    ward_number INT NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    councillor_name VARCHAR(150),
    population_estimate INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Localities / Neighbourhoods within Coimbatore
CREATE TABLE IF NOT EXISTS localities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES administrative_zones(id) ON DELETE SET NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    pincode VARCHAR(10),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    landmarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Municipal Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(50),
    sla_hours INT DEFAULT 48,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Profiles (Extends Supabase auth.users or standalone mock)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(30) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'officer')),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Officers Directory
CREATE TABLE IF NOT EXISTS officers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    designation VARCHAR(150) NOT NULL,
    zone_id UUID REFERENCES administrative_zones(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequence for Complaint Reference IDs (CR-2026-00001)
CREATE SEQUENCE IF NOT EXISTS complaint_ref_seq START 1001;

-- 7. Main Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_reference VARCHAR(30) NOT NULL UNIQUE,
    citizen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    citizen_name VARCHAR(150),
    citizen_email VARCHAR(150),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL CHECK (category IN ('Roads', 'Sanitation', 'Electrical', 'Water', 'Drainage', 'Parks', 'Public Infrastructure', 'Other')),
    issue_type VARCHAR(100),
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    severity INT NOT NULL DEFAULT 3 CHECK (severity BETWEEN 1 AND 5),
    status VARCHAR(30) NOT NULL DEFAULT 'Reported' CHECK (status IN ('Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Reopened')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT NOT NULL,
    locality_id UUID REFERENCES localities(id) ON DELETE SET NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    assigned_officer_id UUID REFERENCES officers(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    is_public BOOLEAN DEFAULT TRUE,
    supports_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Complaint Images (Before / After / Evidence)
CREATE TABLE IF NOT EXISTS complaint_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) DEFAULT 'complaint' CHECK (image_type IN ('complaint', 'resolution', 'progress')),
    caption TEXT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AI Analysis Results (Gemini-generated structured outputs)
CREATE TABLE IF NOT EXISTS complaint_ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    detected_category VARCHAR(80),
    detected_issue_type VARCHAR(100),
    recommended_priority VARCHAR(20),
    severity_score INT,
    safety_risk TEXT,
    recommended_department VARCHAR(100),
    suggested_action TEXT,
    confidence DOUBLE PRECISION,
    explanation TEXT,
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Complaint Assignment History
CREATE TABLE IF NOT EXISTS complaint_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    officer_id UUID REFERENCES officers(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    instructions TEXT,
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Complaint Status Lifecycle History
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    change_reason TEXT,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Complaint Comments & Notes
CREATE TABLE IF NOT EXISTS complaint_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(150),
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Complaint Supports / Upvotes (Community validation)
CREATE TABLE IF NOT EXISTS complaint_supports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_citizen_complaint_support UNIQUE (complaint_id, citizen_id)
);

-- 14. Comprehensive Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast querying & GIS performance
CREATE INDEX IF NOT EXISTS idx_complaints_ref ON complaints(complaint_reference);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_coords ON complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_status_history_comp ON complaint_status_history(complaint_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);


-- ==========================================

-- ==============================================================================
-- CivicResolve - Row Level Security (RLS) Policies
-- Enforces role-based permissions: Citizens, Officers, Administrators
-- ==============================================================================

-- Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrative_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS VARCHAR AS $$
    SELECT role FROM profiles WHERE id = user_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Complaints Policies
-- Public view: Safe public complaint list (non-PII)
CREATE POLICY "Public can view public complaints"
    ON complaints FOR SELECT USING (is_public = true);

-- Citizens can create complaints
CREATE POLICY "Authenticated citizens can insert complaints"
    ON complaints FOR INSERT WITH CHECK (auth.uid() = citizen_id OR citizen_id IS NULL);

-- Citizens can update only their own complaints when still in 'Reported' status
CREATE POLICY "Citizens can edit pending complaints"
    ON complaints FOR UPDATE USING (
        auth.uid() = citizen_id AND status = 'Reported'
    );

-- Officers can view and update complaints assigned to their department
CREATE POLICY "Officers can update department complaints"
    ON complaints FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'officer'
            AND (p.department_id = complaints.department_id OR complaints.department_id IS NULL)
        )
    );

-- Admins can view, update, delete all complaints
CREATE POLICY "Admins have full access to complaints"
    ON complaints FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );

-- 3. Reference Tables: Public read access
CREATE POLICY "Allow public read on departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public read on zones" ON administrative_zones FOR SELECT USING (true);
CREATE POLICY "Allow public read on wards" ON wards FOR SELECT USING (true);
CREATE POLICY "Allow public read on localities" ON localities FOR SELECT USING (true);

-- 4. Audit Logs: Admin read-only, system insert
CREATE POLICY "Only admins can view audit logs"
    ON audit_logs FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );


-- ==========================================

-- ==============================================================================
-- CivicResolve - CivicProof & CivicPulse Advanced Schema Migration
-- Community-Verified Resolution & Predictive Geospatial Intelligence
-- ==============================================================================

-- 1. CivicProof: Official Resolution Verifications
CREATE TABLE IF NOT EXISTS resolution_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    officer_id UUID REFERENCES officers(id) ON DELETE SET NULL,
    officer_name VARCHAR(150) NOT NULL,
    rectification_summary TEXT NOT NULL,
    before_photo_url TEXT,
    after_photo_url TEXT,
    ai_vision_confidence DOUBLE PRECISION,
    ai_vision_assessment TEXT,
    proof_status VARCHAR(50) NOT NULL DEFAULT 'Pending Community Review' 
        CHECK (proof_status IN ('Pending Community Review', 'Community Confirmed', 'Disputed / Escalated', 'Reopened for Reinspection')),
    admin_reopened_reason TEXT,
    reopened_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CivicProof: Community Feedback & Audit Ballots
CREATE TABLE IF NOT EXISTS community_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID NOT NULL REFERENCES resolution_verifications(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    citizen_name VARCHAR(150),
    vote VARCHAR(30) NOT NULL CHECK (vote IN ('Resolved', 'Partially resolved', 'Still exists')),
    comment TEXT,
    evidence_photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_citizen_verification_vote UNIQUE (verification_id, citizen_id)
);

-- 3. CivicPulse: Predictive Infrastructure Hotspots
CREATE TABLE IF NOT EXISTS predictive_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_number INT NOT NULL,
    locality_name VARCHAR(150) NOT NULL,
    predicted_category VARCHAR(80) NOT NULL,
    risk_probability DOUBLE PRECISION NOT NULL CHECK (risk_probability BETWEEN 0.0 AND 1.0),
    forecast_window VARCHAR(50) NOT NULL,
    historical_basis_count INT NOT NULL,
    methodology TEXT NOT NULL,
    supporting_factors JSONB,
    confidence_level VARCHAR(20) NOT NULL CHECK (confidence_level IN ('High', 'Medium', 'Low')),
    data_sufficiency BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resolution_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_hotspots ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read on resolution verifications" ON resolution_verifications FOR SELECT USING (true);
CREATE POLICY "Public read on community feedback" ON community_feedback FOR SELECT USING (true);
CREATE POLICY "Public read on predictive hotspots" ON predictive_hotspots FOR SELECT USING (true);

-- Authenticated citizens can vote once
CREATE POLICY "Citizens can insert community feedback" ON community_feedback FOR INSERT 
    WITH CHECK (auth.uid() = citizen_id OR citizen_id IS NULL);

-- Officers can create resolution verifications
CREATE POLICY "Officers can insert resolution verifications" ON resolution_verifications FOR INSERT 
    WITH CHECK (true);

-- Admins can update verification status & reopen
CREATE POLICY "Admins can update verifications" ON resolution_verifications FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_verifications_comp ON resolution_verifications(complaint_id);
CREATE INDEX IF NOT EXISTS idx_feedback_verif ON community_feedback(verification_id);
CREATE INDEX IF NOT EXISTS idx_hotspots_ward ON predictive_hotspots(ward_number);


-- ==========================================

-- ==============================================================================
-- CivicResolve - Realistic Seed Data for Coimbatore, Tamil Nadu
-- Verified Localities, Administrative Zones, Wards, Departments, Sample Complaints
-- ==============================================================================

-- 1. Administrative Zones of Coimbatore Corporation
INSERT INTO administrative_zones (id, name, code, description, headquarters) VALUES
('a0000001-0000-0000-0000-000000000001', 'Central Zone', 'CBE-CENTRAL', 'Heart of Coimbatore including Gandhipuram, Town Hall, and Race Course.', 'Gopalapuram Main Office'),
('a0000001-0000-0000-0000-000000000002', 'East Zone', 'CBE-EAST', 'Eastern industrial and residential belt including Singanallur and Ramanathapuram.', 'Singanallur Zonal Office'),
('a0000001-0000-0000-0000-000000000003', 'West Zone', 'CBE-WEST', 'Western zone covering RS Puram, Vadavalli, and Thondamuthur road corridor.', 'RS Puram Zonal Office'),
('a0000001-0000-0000-0000-000000000004', 'North Zone', 'CBE-NORTH', 'Northern tech and educational hub including Peelamedu and Saravanampatti.', 'Peelamedu Zonal Office'),
('a0000001-0000-0000-0000-000000000005', 'South Zone', 'CBE-SOUTH', 'Southern zone encompassing Ukkadam, Kuniyamuthur, and Podanur.', 'Kuniyamuthur Zonal Office')
ON CONFLICT (code) DO NOTHING;

-- 2. Representative Wards in Coimbatore Corporation
INSERT INTO wards (id, zone_id, ward_number, name, councillor_name, population_estimate) VALUES
('b0000001-0000-0000-0000-000000000070', 'a0000001-0000-0000-0000-000000000001', 70, 'Ward 70 - Gandhipuram Central', 'K. Murugesan', 24500),
('b0000001-0000-0000-0000-000000000072', 'a0000001-0000-0000-0000-000000000001', 72, 'Ward 72 - Race Course / Thomas Park', 'S. Meenakshi', 18900),
('b0000001-0000-0000-0000-000000000023', 'a0000001-0000-0000-0000-000000000003', 23, 'Ward 23 - RS Puram West', 'R. Senthil Kumar', 28200),
('b0000001-0000-0000-0000-000000000038', 'a0000001-0000-0000-0000-000000000004', 38, 'Ward 38 - Peelamedu East / PSG Corridor', 'P. Karthikeyan', 31400),
('b0000001-0000-0000-0000-000000000055', 'a0000001-0000-0000-0000-000000000002', 55, 'Ward 55 - Singanallur Lake Belt', 'A. Vijayalakshmi', 27600),
('b0000001-0000-0000-0000-000000000084', 'a0000001-0000-0000-0000-000000000005', 84, 'Ward 84 - Ukkadam Periyakulam', 'M. Rahamathullah', 33100)
ON CONFLICT (ward_number) DO NOTHING;

-- 3. Coimbatore Localities with Exact Coordinates
INSERT INTO localities (id, zone_id, ward_id, name, pincode, latitude, longitude, landmarks) VALUES
('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000070', 'Gandhipuram', '641012', 11.0168, 76.9558, 'Cross Cut Road, Central Bus Stand, GP Signal'),
('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000023', 'RS Puram', '641002', 11.0089, 76.9464, 'DB Road, Cowley Brown Road, Post Office'),
('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000038', 'Peelamedu', '641004', 11.0284, 77.0035, 'Avinashi Road, PSG Tech, Fun Republic Mall'),
('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000055', 'Singanallur', '641005', 10.9998, 77.0253, 'Singanallur Lake, Trichy Road, Bus Stand'),
('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000084', 'Ukkadam', '641001', 10.9934, 76.9602, 'Periyakulam Lake, Ukkadam Flyover, Bus Terminal'),
('c0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000072', 'Race Course', '641018', 11.0065, 76.9733, 'Walking Track, Thomas Park, Collectorate Nearby'),
('c0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000038', 'Saravanampatti', '641035', 11.0797, 76.9997, 'IT SEZ, Sathy Road, Kumaraguru College')
ON CONFLICT DO NOTHING;

-- 4. Municipal Departments
INSERT INTO departments (id, name, code, description, contact_email, contact_phone, sla_hours) VALUES
('d0000001-0000-0000-0000-000000000001', 'Roads Department', 'DEPT-ROADS', 'Road maintenance, resurfacing, potholes, paving, and traffic islands.', 'roads@ccmc.gov.in', '+91 422 2300101', 48),
('d0000001-0000-0000-0000-000000000002', 'Sanitation Department', 'DEPT-SAN', 'Solid waste management, garbage bins, clearing, and public hygiene.', 'sanitation@ccmc.gov.in', '+91 422 2300102', 24),
('d0000001-0000-0000-0000-000000000003', 'Electrical Department', 'DEPT-ELEC', 'Streetlight maintenance, electric pole repairs, and public illumination.', 'electrical@ccmc.gov.in', '+91 422 2300103', 36),
('d0000001-0000-0000-0000-000000000004', 'Water Supply Department', 'DEPT-WATER', 'Drinking water pipelines, municipal water supply, valves, and leakages.', 'water@ccmc.gov.in', '+91 422 2300104', 24),
('d0000001-0000-0000-0000-000000000005', 'Drainage Department', 'DEPT-DRAIN', 'Stormwater drains, underground drainage (UGD) clearing, and culverts.', 'drainage@ccmc.gov.in', '+91 422 2300105', 48),
('d0000001-0000-0000-0000-000000000006', 'Parks & Horticulture', 'DEPT-PARK', 'Public parks, roadside greenery, fallen branches, and civic gardens.', 'parks@ccmc.gov.in', '+91 422 2300106', 72)
ON CONFLICT (code) DO NOTHING;

-- 5. Standard Initial Profiles
INSERT INTO profiles (id, email, full_name, phone_number, role, created_at) VALUES
('e0000001-0000-0000-0000-000000000001', 'admin@civicresolve.in', 'Dr. Anand Ramanathan, IAS', '+91 94430 11000', 'admin', NOW()),
('e0000001-0000-0000-0000-000000000002', 'officer.roads@civicresolve.in', 'Er. Vigneshwaran K.', '+91 94430 11001', 'officer', NOW()),
('e0000001-0000-0000-0000-000000000003', 'citizen.demo@civicresolve.in', 'Priya Sundaram', '+91 98940 22000', 'citizen', NOW())
ON CONFLICT (email) DO NOTHING;

-- 6. Officer Directory Binding
INSERT INTO officers (id, profile_id, department_id, designation, zone_id, is_active) VALUES
('f0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'Executive Engineer (Roads)', 'a0000001-0000-0000-0000-000000000001', true)
ON CONFLICT DO NOTHING;

-- 7. Realistic Seed Complaints Across Coimbatore
INSERT INTO complaints (
    id, complaint_reference, citizen_id, citizen_name, citizen_email,
    title, description, category, issue_type, priority, severity,
    status, latitude, longitude, address, locality_id, ward_id, department_id,
    resolution_notes, created_at, updated_at
) VALUES
(
    '00000001-0000-0000-0000-000000000001',
    'CR-2026-00001',
    'e0000001-0000-0000-0000-000000000003',
    'Priya Sundaram',
    'citizen.demo@civicresolve.in',
    'Deep crater pothole with standing water',
    'Dangerous pothole near Gandhipuram Central Bus Stand entry gate. Multiple two-wheelers have skidded during evening hours.',
    'Roads',
    'Pothole',
    'High',
    4,
    'In Progress',
    11.0168,
    76.9558,
    'Near Central Bus Stand Gate 2, Gandhipuram, Coimbatore 641012',
    'c0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000070',
    'd0000001-0000-0000-0000-000000000001',
    'Cold mix patch inspection completed. Hot asphalt road repair vehicle scheduled for tonight.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '4 hours'
),
(
    '00000001-0000-0000-0000-000000000002',
    'CR-2026-00002',
    'e0000001-0000-0000-0000-000000000003',
    'Priya Sundaram',
    'citizen.demo@civicresolve.in',
    'Overflowing community garbage container',
    'Commercial waste from nearby eateries overflowing onto DB Road sidewalk for over 36 hours. Stray cattle feeding.',
    'Sanitation',
    'Garbage Accumulation',
    'Medium',
    3,
    'Assigned',
    11.0089,
    76.9464,
    'Opposite Post Office, DB Road, RS Puram, Coimbatore 641002',
    'c0000001-0000-0000-0000-000000000002',
    'b0000001-0000-0000-0000-000000000023',
    'd0000001-0000-0000-0000-000000000002',
    'Assigned to RS Puram Sanitation Inspector for compactor vehicle pickup.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '6 hours'
),
(
    '00000001-0000-0000-0000-000000000003',
    'CR-2026-00003',
    'e0000001-0000-0000-0000-000000000003',
    'Karthik Narayanan',
    'karthik.n@gmail.com',
    'Cluster of 5 dead LED streetlights',
    'Complete blackout on Avinashi Road service lane near PSG Tech junction creating safety hazard for pedestrians and female college students.',
    'Electrical',
    'Streetlight Failure',
    'High',
    4,
    'Reported',
    11.0284,
    77.0035,
    'Avinashi Road Service Lane, Peelamedu, Coimbatore 641004',
    'c0000001-0000-0000-0000-000000000003',
    'b0000001-0000-0000-0000-000000000038',
    'd0000001-0000-0000-0000-000000000003',
    NULL,
    NOW() - INTERVAL '14 hours',
    NOW() - INTERVAL '14 hours'
),
(
    '00000001-0000-0000-0000-000000000004',
    'CR-2026-00004',
    'e0000001-0000-0000-0000-000000000003',
    'S. Lakshmi',
    'lakshmi.s@outlook.com',
    'High-pressure drinking water main line rupture',
    'Massive potable water leakage flooding Trichy Road main carriageway. Clean water gushing continuously into road gutter.',
    'Water',
    'Water Main Burst',
    'Critical',
    5,
    'In Progress',
    10.9998,
    77.0253,
    'Near Singanallur Signal, Trichy Road, Singanallur 641005',
    'c0000001-0000-0000-0000-000000000004',
    'b0000001-0000-0000-0000-000000000055',
    'd0000001-0000-0000-0000-000000000004',
    'Emergency valve isolated at 08:30 AM. Excavation team on site replacing 300mm ductile iron connector.',
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '1 hour'
),
(
    '00000001-0000-0000-0000-000000000005',
    'CR-2026-00005',
    'e0000001-0000-0000-0000-000000000003',
    'Mohammed Farooq',
    'farooq.m@yahoo.com',
    'Blocked stormwater culvert causing sewage backflow',
    'Heavy silt and plastic debris accumulation blocking open canal near Ukkadam fish market, flooding adjacent residential street.',
    'Drainage',
    'Drainage Overflow',
    'Critical',
    5,
    'Resolved',
    10.9934,
    76.9602,
    'Periyakulam Bund Road, Ukkadam, Coimbatore 641001',
    'c0000001-0000-0000-0000-000000000005',
    'b0000001-0000-0000-0000-000000000084',
    'd0000001-0000-0000-0000-000000000005',
    'Super-sucker desilting machine deployed. 4.2 tons of accumulated debris cleared, flow restored completely.',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '1 day'
),
(
    '00000001-0000-0000-0000-000000000006',
    'CR-2026-00006',
    'e0000001-0000-0000-0000-000000000003',
    'Priya Sundaram',
    'citizen.demo@civicresolve.in',
    'Fallen banyan tree limb blocking pedestrian jogging loop',
    'Large branch snapped during heavy winds, resting across the walkway near Thomas Park. Obstructing senior citizens and joggers.',
    'Parks',
    'Tree Fall / Obstruction',
    'Low',
    2,
    'Resolved',
    11.0065,
    76.9733,
    'Jogging Track Opposite Thomas Park, Race Course, Coimbatore 641018',
    'c0000001-0000-0000-0000-000000000006',
    'b0000001-0000-0000-0000-000000000072',
    'd0000001-0000-0000-0000-000000000006',
    'Horticulture chainsaw squad cut and cleared the fallen limb within 3 hours. Track completely reopened.',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days'
)
ON CONFLICT (complaint_reference) DO NOTHING;

-- 8. Seed Status History
INSERT INTO complaint_status_history (complaint_id, previous_status, new_status, change_reason, created_at)
SELECT id, 'Reported', 'Under Review', 'Automated AI triage verification', created_at + INTERVAL '10 minutes'
FROM complaints WHERE status != 'Reported';

INSERT INTO complaint_status_history (complaint_id, previous_status, new_status, change_reason, created_at)
SELECT id, 'Under Review', 'Assigned', 'Department allocated by zonal control room', created_at + INTERVAL '45 minutes'
FROM complaints WHERE status IN ('Assigned', 'In Progress', 'Resolved');

INSERT INTO complaint_status_history (complaint_id, previous_status, new_status, change_reason, created_at)
SELECT id, 'Assigned', 'In Progress', 'Field inspection squad dispatched', created_at + INTERVAL '2 hours'
FROM complaints WHERE status IN ('In Progress', 'Resolved');

INSERT INTO complaint_status_history (complaint_id, previous_status, new_status, change_reason, created_at)
SELECT id, 'In Progress', 'Resolved', 'Field work verified and completed with photographic record', updated_at
FROM complaints WHERE status = 'Resolved';
