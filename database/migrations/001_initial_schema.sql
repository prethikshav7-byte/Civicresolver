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
