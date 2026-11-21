# CivicResolve Architecture & Technical Specification

## 1. System Overview

**CivicResolve** is an AI-powered municipal intelligence and citizen grievance management platform purpose-built for the Coimbatore Municipal Corporation in Tamil Nadu, India. It bridges citizens, municipal administrators, and zonal field officers through automated triage, real-time GIS visualization, and transparent resolution auditing.

```mermaid
flowchart TD
    subgraph Citizens["Citizen Portal"]
        A1["Report Grievance (Photo + GPS)"]
        A2["AI Triage Preview"]
        A3["Real-time Track Reference (CR-2026-xxxxx)"]
    end

    subgraph AI["Civic AI Engine (Google Gemini)"]
        B1["Grievance Classification (6 Categories)"]
        B2["Priority & Urgency Assessment (Critical to Low)"]
        B3["Department Auto-Recommendation"]
        B4["Proximity Duplicate Detection (Haversine < 300m)"]
    end

    subgraph Backend["FastAPI Backend Services"]
        C1["Complaint REST API"]
        C2["Geographical & Reverse-Geocoding Service"]
        C3["Department Workload & SLA Manager"]
        C4["Audit & Status Lifecycle Tracker"]
    end

    subgraph GIS["GIS Intelligence Engine"]
        D1["Leaflet + OpenStreetMap Canvas"]
        D2["Category Pin Visualizer"]
        D3["Dynamic Hotspot Density Heatmap"]
        D4["Coimbatore Administrative Zones & Wards"]
    end

    subgraph Admin["Municipal Control Room"]
        E1["Administrative Dashboard & KPIs"]
        E2["Department & Officer Allocation"]
        E3["Field Rectification Verification"]
        E4["Public Transparency Analytics"]
    end

    subgraph Storage["Data & Security Layer"]
        F1["Supabase PostgreSQL + PostGIS"]
        F2["Row Level Security (RLS)"]
        F3["Supabase Auth (Citizen / Officer / Admin)"]
    end

    A1 --> A2 --> B1 & B2 & B3 & B4
    B1 & B2 & B3 & B4 --> C1
    C1 --> F1 & F2
    F1 --> D1 & D2 & D3 & D4
    D1 & D2 & D3 & D4 --> E1
    E1 --> E2 --> C4 --> F1
    E2 --> E3 --> C4
    C4 --> A3 & E4
```

---

## 2. Complaint Lifecycle State Machine

Every grievance progresses through an immutable 5-stage lifecycle:

```mermaid
stateDiagram-v2
    [*] --> Reported: Citizen Submits (Photo + Location)
    Reported --> Under_Review: Gemini AI Evaluates Urgency & Severity
    Under_Review --> Assigned: Control Room Assigns Department & Officer
    Assigned --> In_Progress: Field Crew Dispatched with Repair Vehicles
    In_Progress --> Resolved: On-site Rectification Verified with Photo Evidence
    Resolved --> Reopened: Citizen Appeals within 48 Hours
    Reopened --> In_Progress: Escalated to Zonal Commissioner
    Resolved --> [*]
```

---

## 3. Geographic Organization (Coimbatore Corporation)

Coimbatore is structured into 5 administrative zones and 100 wards:

1. **Central Zone (`CBE-CENTRAL`)**:
   - Localities: Gandhipuram (Ward 70), Race Course (Ward 72), Town Hall, Gopalapuram.
   - Key Nodes: Central Bus Stand, Cross Cut Road, Collectorate.
2. **West Zone (`CBE-WEST`)**:
   - Localities: R.S. Puram (Ward 23), Saibaba Colony, Vadavalli.
   - Key Nodes: DB Road, Cowley Brown Road, NSR Road.
3. **North Zone (`CBE-NORTH`)**:
   - Localities: Peelamedu (Ward 38), Saravanampatti, Ganapathy.
   - Key Nodes: Avinashi Road, PSG Tech Corridor, CHIL SEZ IT Park.
4. **East Zone (`CBE-EAST`)**:
   - Localities: Singanallur (Ward 55), Ramanathapuram, Ondipudur.
   - Key Nodes: Trichy Road, Singanallur Lake, Sungam Bypass.
5. **South Zone (`CBE-SOUTH`)**:
   - Localities: Ukkadam (Ward 84), Kuniyamuthur, Podanur.
   - Key Nodes: Periyakulam Bund, Ukkadam Flyover, Palakkad Highway.

---

## 4. Duplicate Grievance Prevention

Duplicate submissions are prevented via a dual-criteria proximity gate:
- **Haversine Distance**: Computes exact geographical distance in meters. Reports within 300m are flagged.
- **Token Jaccard Similarity**: Evaluates word overlap between grievance descriptions.
- If similarity is high, the citizen is offered the option to **endorse/support** the existing complaint, which automatically escalates the priority score without creating redundant database records.
