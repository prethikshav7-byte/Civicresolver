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
