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
