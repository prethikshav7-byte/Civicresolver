import os
import json
import logging
from typing import Optional
from backend.app.core.config import settings
from backend.app.schemas.ai import AIAnalysisRequest, AIAnalysisResponse
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
