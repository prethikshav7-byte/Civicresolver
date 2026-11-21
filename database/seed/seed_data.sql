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
