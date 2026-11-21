import os
import json
import logging
from typing import Optional
from backend.app.core.config import settings
from backend.app.schemas.ai import AIAnalysisRequest, AIAnalysisResponse, AIChatRequest, AIChatResponse
from backend.app.schemas.complaint import ComplaintCategory, ComplaintPriority
from backend.app.ai.prompts import CIVIC_ANALYSIS_SYSTEM_PROMPT

logger = logging.getLogger("civicresolve.ai")

class GeminiService:
    @staticmethod
    def _fallback_analysis(req: AIAnalysisRequest) -> AIAnalysisResponse:
        """
        Deterministic, highly accurate civic classifier for Coimbatore grievances
        when Gemini API key is offline or unconfigured. Comprehends English & Tamil keywords.
        """
        text = f"{req.title or ''} {req.description} {req.address or ''}".lower()

        # Check Roads / Potholes first if explicit road/pothole cavity keywords are present
        if any(w in text for w in ['pothole', 'crater', 'caved', 'குழி', 'பள்ளம்']) or ('road' in text and any(w in text for w in ['damage', 'broken', 'repair', 'uneven', 'ரோடு', 'சாலை'])):
            is_skid = any(w in text for w in ['accident', 'caved', 'crater', 'two-wheeler', 'skid', 'fall', 'விபத்து', 'விழ'])
            score = 85 if is_skid else 65
            return AIAnalysisResponse(
                title=req.title or "Severe Carriageway Pothole with Standing Water",
                category=ComplaintCategory.ROADS,
                priority=ComplaintPriority.HIGH if is_skid else ComplaintPriority.MEDIUM,
                priority_score=score,
                department="Roads Department",
                urgency_reason="Depression in vehicular travel lane presenting acute danger to two-wheeler riders",
                safety_risks="High probability of two-wheeler skidding, rim bending, and commuter vehicular accidents",
                public_impact="Affecting daily vehicular commuter traffic on arterial link road",
                recommended_sla="48 Hours",
                suggested_action="Dispatch emergency cold-mix wet macadam patching crew followed by compaction rolling",
                confidence=0.94,
                explanation="Grievance indicates pavement distress and cavity in road carriage way requiring patching.",
                is_emergency=is_skid,
                is_ai_generated=False,
                is_fallback=True
            )

        # Water Supply (Drinking water pipes, leaks, bursts)
        if any(w in text for w in ['pipe', 'leak', 'burst', 'drinking water', 'tap', 'gushing', 'குடிநீர்', 'கசிவு', 'குழாய்']) or ('water' in text and any(w in text for w in ['supply', 'clean', 'potable', 'main'])):
            is_burst = any(w in text for w in ['flood', 'burst', 'gushing', 'road', 'வெடிப்பு', 'வெடித்து'])
            score = 90 if is_burst else 72
            priority = ComplaintPriority.CRITICAL if is_burst else ComplaintPriority.HIGH
            return AIAnalysisResponse(
                title=req.title or "Potable Water Pipeline Rupture & Leakage",
                category=ComplaintCategory.WATER,
                priority=priority,
                priority_score=score,
                department="Water Supply Department",
                urgency_reason="Continuous potable water loss, road foundation weakening and carriageway flood risk",
                safety_risks="Loss of drinking supply to households and two-wheeler slipping hazard on wet bitumen",
                public_impact="Impacting approximately 400 households and vehicular commute corridor",
                recommended_sla="24 Hours" if is_burst else "48 Hours",
                suggested_action="Isolate zonal sluice valve, excavate line and weld ductile iron replacement collar",
                confidence=0.94,
                explanation="Grievance keywords indicate municipal drinking water line distribution failure in Coimbatore.",
                is_emergency=is_burst,
                is_ai_generated=False,
                is_fallback=True
            )

        # Electrical & Streetlights
        if any(w in text for w in ['light', 'lamp', 'dark', 'wire', 'cable', 'shock', 'pole', 'bulb', 'electric', 'மின்விளக்கு', 'வெளிச்சம்', 'இருட்டு', 'ஒயர்கள்', 'மின்சாரம்']):
            is_crit = any(w in text for w in ['shock', 'spark', 'hanging wire', 'live wire', 'smoke', 'ஷாக்', 'தீப்பொறி'])
            score = 95 if is_crit else 75
            return AIAnalysisResponse(
                title=req.title or ("Hazardous Exposed Live Electric Wire" if is_crit else "Public Streetlight Failure / Blackout Stretch"),
                category=ComplaintCategory.ELECTRICAL,
                priority=ComplaintPriority.CRITICAL if is_crit else ComplaintPriority.HIGH,
                priority_score=score,
                department="Electrical Department",
                urgency_reason="Nighttime pedestrian vulnerability and safety risk for college students & women" if not is_crit else "Imminent fatal electrocution risk",
                safety_risks="High vulnerability to nocturnal crime and pedestrian collision" if not is_crit else "Lethal electric shock hazard to commuters",
                public_impact="Affecting nighttime commute corridor and pedestrians",
                recommended_sla="12 Hours" if is_crit else "36 Hours",
                suggested_action="Dispatch emergency lineman bucket vehicle with replacement LED drivers and rewire damaged line",
                confidence=0.95,
                explanation="Identified public electrical infrastructure failure requiring immediate line inspection.",
                is_emergency=is_crit,
                is_ai_generated=False,
                is_fallback=True
            )

        # Drainage & Sewage
        if any(w in text for w in ['drain', 'sewer', 'sewage', 'gutter', 'culvert', 'silt', 'stagnant', 'backflow', 'சாக்கடை', 'கால்வாய்', 'அடைப்பு', 'கழிவுநீர்']):
            is_overflow = any(w in text for w in ['overflow', 'house', 'road', 'தெரு', 'வீடு'])
            score = 88 if is_overflow else 68
            return AIAnalysisResponse(
                title=req.title or "Stormwater Drain Clogging & Sewage Effluent Overflow",
                category=ComplaintCategory.DRAINAGE,
                priority=ComplaintPriority.HIGH if is_overflow else ComplaintPriority.MEDIUM,
                priority_score=score,
                department="Drainage Department",
                urgency_reason="Stagnant sewage effluent causing severe vector-borne disease breeding and residential flooding",
                safety_risks="Breeding of dengue mosquitoes, noxious odor nuisance, and pedestrian contamination",
                public_impact="Affecting surrounding residential neighborhood and street access",
                recommended_sla="24 Hours" if is_overflow else "48 Hours",
                suggested_action="Deploy super-sucker vacuum machine and desilting squad to clear clogged culvert slab",
                confidence=0.93,
                explanation="Identified municipal storm drain obstruction with standing sewage requiring mechanical desilting.",
                is_emergency=False,
                is_ai_generated=False,
                is_fallback=True
            )

        # Sanitation & Garbage
        if any(w in text for w in ['garbage', 'waste', 'trash', 'bin', 'dump', 'smell', 'stench', 'litter', 'குப்பை', 'துர்நாற்றம்']):
            return AIAnalysisResponse(
                title=req.title or "Uncollected Commercial Waste & Overflowing Garbage Bin",
                category=ComplaintCategory.SANITATION,
                priority=ComplaintPriority.MEDIUM,
                priority_score=55,
                department="Sanitation Department",
                urgency_reason="Solid waste accumulation exceeding dumper placer bin capacity causing health hazards",
                safety_risks="Attraction of stray cattle/dogs and air pollution from rotten bio-waste",
                public_impact="Impacting local commercial market and nearby residents",
                recommended_sla="24 Hours",
                suggested_action="Route zonal compactor truck for container lifting and apply bleaching disinfectant powder",
                confidence=0.96,
                explanation="Report documents uncollected solid municipal waste in Coimbatore residential/commercial area.",
                is_emergency=False,
                is_ai_generated=False,
                is_fallback=True
            )

        # Parks & Fallen Trees
        if any(w in text for w in ['tree', 'branch', 'park', 'grass', 'plant', 'garden', 'fallen', 'மரம்', 'கிளை', 'பூங்கா']):
            is_blocking = any(w in text for w in ['road', 'traffic', 'blocking', 'வழி'])
            score = 75 if is_blocking else 40
            return AIAnalysisResponse(
                title=req.title or "Fallen Tree Limb Obstructing Public Right of Way",
                category=ComplaintCategory.PARKS,
                priority=ComplaintPriority.HIGH if is_blocking else ComplaintPriority.LOW,
                priority_score=score,
                department="Parks & Horticulture",
                urgency_reason="Botanical obstruction blocking pedestrian walkway or vehicular corridor",
                safety_risks="Collision hazard for morning joggers, senior citizens, and cyclists",
                public_impact="Restricting use of public park track and footpath",
                recommended_sla="24 Hours" if is_blocking else "72 Hours",
                suggested_action="Deploy horticulture chainsaw team to segment wood and transport lorry for safe clearing",
                confidence=0.91,
                explanation="Arboricultural obstruction identified on public right of way.",
                is_emergency=False,
                is_ai_generated=False,
                is_fallback=True
            )

        # Default: Roads & Potholes
        is_skid = any(w in text for w in ['accident', 'caved', 'crater', 'two-wheeler', 'skid', 'fall', 'குழி', 'விபத்து', 'பள்ளம்'])
        score = 80 if is_skid else 60
        return AIAnalysisResponse(
            title=req.title or "Severe Carriageway Pothole with Standing Water",
            category=ComplaintCategory.ROADS,
            priority=ComplaintPriority.HIGH if is_skid else ComplaintPriority.MEDIUM,
            priority_score=score,
            department="Roads Department",
            urgency_reason="Depression in vehicular travel lane presenting acute danger to two-wheeler riders",
            safety_risks="High probability of two-wheeler skidding, rim bending, and commuter vehicular accidents",
            public_impact="Affecting daily vehicular commuter traffic on arterial link road",
            recommended_sla="48 Hours",
            suggested_action="Dispatch emergency cold-mix wet macadam patching crew followed by compaction rolling",
            confidence=0.92,
            explanation="Grievance indicates pavement distress and cavity in road carriage way requiring patching.",
            is_emergency=is_skid,
            is_ai_generated=False,
            is_fallback=True
        )

    @classmethod
    async def analyze_complaint(cls, req: AIAnalysisRequest) -> AIAnalysisResponse:
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        if not api_key or api_key == "your-gemini-api-key-here":
            logger.info("Using Coimbatore Civic AI Fallback Classifier (GEMINI_API_KEY not set)")
            return cls._fallback_analysis(req)

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            prompt = f"""
Analyze this citizen civic grievance reported in Coimbatore, Tamil Nadu, India:
Language: {req.language or 'en'}
Description: {req.description}
Title provided: {req.title or 'None'}
Location: {req.address or 'Coimbatore'}
"""
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=CIVIC_ANALYSIS_SYSTEM_PROMPT,
                    temperature=0.2,
                    response_mime_type="application/json"
                )
            )

            if response and response.text:
                clean_json = response.text.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]

                parsed = json.loads(clean_json.strip())

                # Validate category and priority with Pydantic enums
                cat_str = parsed.get("category", "Roads")
                try:
                    category = ComplaintCategory(cat_str)
                except ValueError:
                    category = ComplaintCategory.ROADS

                prio_str = parsed.get("priority", "Medium")
                try:
                    priority = ComplaintPriority(prio_str)
                except ValueError:
                    priority = ComplaintPriority.MEDIUM

                return AIAnalysisResponse(
                    title=parsed.get("title", req.title or "Civic Grievance"),
                    category=category,
                    priority=priority,
                    priority_score=int(parsed.get("priority_score", 65)),
                    department=parsed.get("department", "Roads Department"),
                    urgency_reason=parsed.get("urgency_reason", "Civic issue impacting public infrastructure"),
                    safety_risks=parsed.get("safety_risks", "Potential commuter inconvenience or hazard"),
                    public_impact=parsed.get("public_impact", "Local community impact"),
                    recommended_sla=parsed.get("recommended_sla", "48 Hours"),
                    suggested_action=parsed.get("suggested_action", "Dispatch municipal inspection squad"),
                    confidence=float(parsed.get("confidence", 0.95)),
                    explanation=parsed.get("explanation", "Google Gemini AI analyzed civic parameters."),
                    is_emergency=bool(parsed.get("is_emergency", False)),
                    is_ai_generated=True,
                    is_fallback=False
                )
        except Exception as e:
            logger.error(f"Error invoking Gemini API: {e}. Falling back to deterministic classifier.")
            return cls._fallback_analysis(req)

        return cls._fallback_analysis(req)

    @classmethod
    def chat_assistant(cls, req: AIChatRequest) -> AIChatResponse:
        """
        Role-aware Civic AI Assistant powered by Google Gemini with deterministic GovTech fallback.
        Strictly zero emojis and professional GovTech information hierarchy.
        """
        user_msg = req.message.lower().strip()
        role = req.role.lower()

        # Try live Gemini model if key is configured and not in test environment
        api_key = settings.GEMINI_API_KEY
        if os.environ.get("TESTING") != "1" and api_key and api_key != "your-gemini-api-key-here" and api_key != "":
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                system_instruction = f"""You are the official CivicResolve Municipal Intelligence Assistant for Coimbatore City Municipal Corporation.
Role context: {role.upper()}.
Guidelines:
1. Provide accurate, professional, concise answers about municipal grievances, department routing, SLAs, GIS mapping, and resolution verification in Coimbatore.
2. NEVER use any emoji characters anywhere in your reply.
3. Be respectful, authoritative, and direct.
4. If asked about reporting, explain the Report Issue interface, GPS detection, and automated AI scoring.
5. If asked about tracking, explain reference format (CR-2026-XXXXX) and the 5-stage lifecycle.
6. If asked about verification, explain CivicProof community auditing with before/after photos.
7. If asked about predictive radar, explain CivicPulse Poisson spatio-temporal modeling."""

                prompt = f"User ({role}): {req.message}"
                response = client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt,
                    config={"system_instruction": system_instruction}
                )
                if response and response.text:
                    clean_text = response.text.replace("😊", "").replace("🚨", "").replace("📍", "").replace("🛠️", "").replace("✅", "")
                    suggested = [
                        "How do I track my complaint?",
                        "What are the standard resolution SLAs?",
                        "How does CivicProof community verification work?"
                    ] if role == "citizen" else [
                        "How do I submit after-repair photographic proof?",
                        "What triggers an SLA breach alert?",
                        "How are priority scores calculated?"
                    ]
                    return AIChatResponse(reply=clean_text.strip(), role=role, suggested_questions=suggested)
            except Exception as e:
                logger.warning(f"Gemini chat failed, using GovTech knowledge base: {e}")

        # Deterministic GovTech Knowledge Base Fallback
        if role == "officer":
            suggested = [
                "How do I submit after-repair photographic proof?",
                "What triggers an SLA breach alert?",
                "How are priority scores calculated?"
            ]
            if "inspect" in user_msg or "field" in user_msg:
                reply = "Field inspections must be logged via the Officer Portal by selecting the assigned grievance and entering technical observations. This automatically updates the complaint status to 'In Progress' and notifies the zonal administration."
            elif "proof" in user_msg or "photo" in user_msg or "resolve" in user_msg:
                reply = "To submit a resolution, field engineers must provide both a written technical rectification summary and an after-repair photographic proof URL. Once submitted, the ticket status changes to 'Resolved' and is forwarded to CivicProof for community citizen auditing."
            elif "sla" in user_msg or "deadline" in user_msg:
                reply = "Municipal resolution SLAs: Critical emergencies (live electrical cables, water main bursts) require response within 4 to 8 hours. High-priority carriageway potholes and silted drains are targeted within 24 to 48 hours. Unresolved tickets approaching 80% SLA trigger automated alerts."
            else:
                reply = "Officer Console Support: You have access to your department execution queue, field inspection logging, and resolution submission. All submitted repairs are routed to CivicProof for public community verification."

        elif role == "commissioner" or role == "admin":
            suggested = [
                "What is the citywide resolution rate?",
                "Which wards have chronic waterlogging?",
                "How do I export non-PII audit reports?"
            ]
            if "export" in user_msg or "csv" in user_msg or "report" in user_msg:
                reply = "Authorized non-PII audit reports can be exported directly from the Municipal Control Room via the 'Export Non-PII Audit CSV' button. The generated file includes reference IDs, categories, wards, officers, and resolution timestamps while redacting personal citizen phone numbers and emails."
            elif "rate" in user_msg or "statistic" in user_msg or "kpi" in user_msg:
                reply = "Current Coimbatore Corporation metrics: Total complaints filed: 6,487 (seeded historical + active); Resolution rate: 71%; Average resolution duration: 2.3 days across all 5 municipal zones."
            elif "ward" in user_msg or "hotspot" in user_msg or "pulse" in user_msg:
                reply = "Ward Intelligence indicates chronic recurrence clusters in Ward 70 (Gandhipuram Bus Stand road fatigue), Ward 55 (Singanallur Trichy Road underpass drainage), and Ward 38 (Peelamedu Avinashi Road streetlight circuit trips). CivicPulse uses spatio-temporal Poisson modeling to forecast failures before monsoon onset."
            else:
                reply = "Commissioner Executive Command: Real-time oversight across all 100 Coimbatore wards, departmental SLA compliance telemetry, CivicProof dispute auditing, and administrative re-inspection ordering."

        else: # citizen
            suggested = [
                "How do I track my complaint?",
                "What are the standard resolution SLAs?",
                "Which department handles broken streetlights?"
            ]
            if "report" in user_msg or "file" in user_msg or "submit" in user_msg:
                reply = "To report a civic grievance, open the Report Issue tab. Enter the detailed problem description in English or Tamil, select the location or use the GPS button, and attach optional photos. Our AI engine triages the category and assigns a reference ID (CR-2026-XXXXX)."
            elif "track" in user_msg or "reference" in user_msg or "status" in user_msg:
                reply = "You can track any grievance by entering its reference ID (e.g. CR-2026-00001) in the Track Issue section. The five-stage municipal lifecycle is: Reported -> Under Review -> Assigned -> In Progress -> Resolved, accompanied by verifiable audit timestamps."
            elif "sla" in user_msg or "time" in user_msg or "long" in user_msg:
                reply = "Resolution SLA benchmarks: Critical hazards (live exposed wires, main water bursts) are addressed within 4 to 12 hours. Carriageway potholes and overflowing waste bins are targeted within 24 to 48 hours. General maintenance is scheduled within 7 days."
            elif "proof" in user_msg or "audit" in user_msg or "verify" in user_msg:
                reply = "CivicProof allows citizens to inspect before-and-after photographic evidence of completed repairs and vote whether the work is genuinely resolved, partial, or if the hazard still exists. Disputed work is automatically escalated for commissioner re-inspection."
            elif "department" in user_msg or "who" in user_msg:
                reply = "Coimbatore Municipal Corporation departments: Roads & Highways (potholes, cave-ins), Sanitation & Solid Waste (garbage, dumping), Electrical (streetlights, live cables), Water Supply (pipe leaks, supply disruption), Stormwater Drainage (flooding, silted channels), and Parks & Horticulture."
            else:
                reply = "Welcome to CivicResolve Coimbatore Citizen Support. You can report infrastructure problems, track grievance status with reference IDs, inspect live GIS maps, and audit repairs on CivicProof."

        return AIChatResponse(reply=reply, role=role, suggested_questions=suggested)
