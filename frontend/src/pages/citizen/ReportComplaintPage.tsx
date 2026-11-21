import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Sparkles, MapPin, Camera, AlertCircle, CheckCircle2, 
  ArrowRight, Loader2, ThumbsUp, Navigation, Languages, Wand2, Clock 
} from 'lucide-react';
import { CivicApi } from '../../services/api';
import { ComplaintCategory, ComplaintPriority, AIAnalysisResult, DuplicateCheckResult } from '../../types';

const COIMBATORE_PRESET_LOCATIONS = [
  { name: 'Gandhipuram Central Bus Stand', lat: 11.0168, lng: 76.9558, ward: 70, zone: 'Central' },
  { name: 'DB Road, RS Puram', lat: 11.0089, lng: 76.9464, ward: 23, zone: 'West' },
  { name: 'Avinashi Road near PSG Tech, Peelamedu', lat: 11.0284, lng: 77.0035, ward: 38, zone: 'North' },
  { name: 'Trichy Road near Signal, Singanallur', lat: 10.9998, lng: 77.0253, ward: 55, zone: 'East' },
  { name: 'Periyakulam Bund, Ukkadam', lat: 10.9934, lng: 76.9602, ward: 84, zone: 'South' },
  { name: 'Race Course Jogging Loop', lat: 11.0065, lng: 76.9733, ward: 72, zone: 'Central' },
  { name: 'Saravanampatti IT Corridor', lat: 11.0797, lng: 76.9997, ward: 38, zone: 'North' }
];

const BILINGUAL_EXAMPLES = [
  {
    lang: 'ta',
    label: 'தமிழ் (சாலை குழி)',
    title: 'ரோட்டில் பெரிய குழி தண்ணீர் தேங்கி விபத்து அபாயம்',
    desc: 'காந்திபுரம் பேருந்து நிலையம் அருகே ரோட்டில் பெரிய குழி ஏற்பட்டு மழை நீர் தேங்கி உள்ளது. இருசக்கர வாகனங்கள் சறுக்கி கீழே விழுகின்றன. உடனடியாக தார் போட்டு சரிசெய்ய வேண்டும்.',
    address: 'Near Central Bus Stand Gate 2, Gandhipuram, Coimbatore 641012',
    lat: 11.0168,
    lng: 76.9558,
    ward: 70,
    loc: 'Gandhipuram'
  },
  {
    lang: 'ta',
    label: 'தமிழ் (குடிநீர் குழாய்)',
    title: 'பிரதான குடிநீர் குழாய் உடைந்து தண்ணீர் வீணாகிறது',
    desc: 'ஆர்.எஸ்.புரம் டி.பி. ரோட்டில் பிரதான குடிநீர் குழாய் உடைந்து குடிநீர் வீணாக தெருவில் வெள்ளம்போல் பாய்கிறது. குடிநீர் விநியோகம் பாதிக்கப்பட்டுள்ளது.',
    address: 'Opposite Post Office, DB Road, RS Puram, Coimbatore 641002',
    lat: 11.0089,
    lng: 76.9464,
    ward: 23,
    loc: 'RS Puram'
  },
  {
    lang: 'en',
    label: 'English (Streetlight Hazard)',
    title: 'Cluster of 5 dead LED streetlights creating dark zone',
    desc: 'Avinashi Road service lane near PSG Tech junction has complete blackout for 4 nights creating severe hazard for pedestrians and college students.',
    address: 'Avinashi Road Service Lane, Peelamedu, Coimbatore 641004',
    lat: 11.0284,
    lng: 77.0035,
    ward: 38,
    loc: 'Peelamedu'
  }
];

export const ReportComplaintPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ta'>('en');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Gandhipuram Bus Stand, Central Zone, Coimbatore');
  const [lat, setLat] = useState(11.0168);
  const [lng, setLng] = useState(76.9558);
  const [ward, setWard] = useState(70);
  const [locality, setLocality] = useState('Gandhipuram');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // AI & Duplicate State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Preset Location
  const handleLocationPreset = (preset: typeof COIMBATORE_PRESET_LOCATIONS[0]) => {
    setAddress(preset.name + ', Coimbatore');
    setLat(preset.lat);
    setLng(preset.lng);
    setWard(preset.ward);
    setLocality(preset.name.split(' ')[0]);
  };

  // GPS Auto-Detect
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setLat(uLat);
        setLng(uLng);
        setAddress(`GPS Lat: ${uLat.toFixed(4)}, Lng: ${uLng.toFixed(4)}, Coimbatore`);
        setIsDetectingGps(false);
      },
      () => {
        // Fallback to central Coimbatore
        setLat(11.0168);
        setLng(76.9558);
        setAddress("Gandhipuram, Central Zone, Coimbatore 641012");
        setIsDetectingGps(false);
      },
      { timeout: 8000 }
    );
  };

  // Auto-Title Generation
  const handleAutoTitle = () => {
    if (!description.trim()) {
      setErrorMsg("Please enter a description first to auto-generate a headline.");
      return;
    }
    const cleanDesc = description.trim();
    if (cleanDesc.includes('குழி') || cleanDesc.toLowerCase().includes('pothole')) {
      setTitle(selectedLanguage === 'ta' ? "ரோட்டில் பெரிய குழி தண்ணீர் தேங்கி விபத்து அபாயம்" : "Deep road pothole causing two-wheeler hazard");
    } else if (cleanDesc.includes('குழாய்') || cleanDesc.toLowerCase().includes('water') || cleanDesc.toLowerCase().includes('pipe')) {
      setTitle(selectedLanguage === 'ta' ? "குடிநீர் பிரதான குழாய் உடைப்பு" : "Drinking water pipeline leak on public road");
    } else if (cleanDesc.includes('விளக்கு') || cleanDesc.toLowerCase().includes('light') || cleanDesc.toLowerCase().includes('dark')) {
      setTitle(selectedLanguage === 'ta' ? "தெரு விளக்குகள் எரியவில்லை" : "Malfunctioning streetlights creating night blackout");
    } else if (cleanDesc.includes('குப்பை') || cleanDesc.toLowerCase().includes('garbage') || cleanDesc.toLowerCase().includes('waste')) {
      setTitle(selectedLanguage === 'ta' ? "குப்பை தொட்டி நிரம்பி வழிகிறது" : "Overflowing community waste container");
    } else {
      const words = cleanDesc.split(/\s+/).slice(0, 8).join(" ");
      setTitle(words + "...");
    }
  };

  // Quick bilingual example filler
  const handleFillExample = (ex: typeof BILINGUAL_EXAMPLES[0]) => {
    setSelectedLanguage(ex.lang as 'en' | 'ta');
    setTitle(ex.title);
    setDescription(ex.desc);
    setAddress(ex.address);
    setLat(ex.lat);
    setLng(ex.lng);
    setWard(ex.ward);
    setLocality(ex.loc);
    setAiResult(null);
    setDuplicateCheck(null);
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Photo size must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Civic AI Analysis & Duplicate Check
  const handleAnalyzeWithAI = async () => {
    if (!title.trim() && !description.trim()) {
      setErrorMsg("Please enter a title or description before analyzing.");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      const effTitle = title.trim() || description.slice(0, 40);
      const [aiData, dupData] = await Promise.all([
        CivicApi.analyzeWithAI(effTitle, description, address),
        CivicApi.checkDuplicates(effTitle, description, lat, lng)
      ]);
      setAiResult(aiData);
      setDuplicateCheck(dupData);
    } catch (e) {
      setErrorMsg("AI analysis request failed. You can still submit manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Title and description are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const created = await CivicApi.createComplaint({
        title,
        description,
        category: (aiResult?.category || 'Roads') as ComplaintCategory,
        priority: (aiResult?.priority || 'Medium') as ComplaintPriority,
        priority_score: aiResult?.priority_score || 70,
        urgency_reason: aiResult?.urgency_reason,
        recommended_sla: aiResult?.recommended_sla || '48 Hours',
        severity: aiResult?.severity || 3,
        latitude: lat,
        longitude: lng,
        address,
        locality_name: locality,
        ward_number: ward,
        image_url: imagePreview,
        citizen_name: "Priya Sundaram",
        citizen_email: "citizen.demo@civicresolve.in"
      });

      // Redirect to Tracking page with new reference ID
      navigate(`/track?ref=${created.complaint_reference}`);
    } catch (err: any) {
      setErrorMsg("Failed to register grievance. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-civic-primary text-xs font-semibold mb-2 border border-blue-200">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Coimbatore Municipal Corporation Citizen Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-civic-text tracking-tight">
          Report a Civic Grievance
        </h1>
        <p className="text-sm text-civic-muted mt-1 max-w-2xl leading-relaxed">
          Report infrastructure breakdowns in English or தமிழ். Our GenAI pipeline analyzes urgency, scores priority (1-100), detects duplicates, and routes to the responsible Coimbatore ward engineer.
        </p>
      </div>

      {/* Quick Fill Bilingual Examples */}
      <div className="bg-white border border-civic-border rounded-2xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-civic-text flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-civic-primary" />
            Quick-Fill Bilingual Test Cases (Click to load):
          </span>
          <span className="text-[10px] text-civic-muted">English & Tamil NLP Supported</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {BILINGUAL_EXAMPLES.map((ex, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleFillExample(ex)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-civic-bg hover:bg-blue-50 text-civic-text hover:text-civic-primary border border-civic-border transition shadow-2xs"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-civic-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Language Switcher Bar */}
          <div className="flex items-center justify-between border-b border-civic-border pb-4">
            <span className="text-xs font-semibold text-civic-muted">Preferred Input Language:</span>
            <div className="flex items-center gap-1 bg-civic-bg p-1 rounded-xl border border-civic-border">
              <button
                type="button"
                onClick={() => setSelectedLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedLanguage === 'en' ? 'bg-civic-primary text-white shadow-xs' : 'text-civic-muted hover:text-civic-text'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('ta')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedLanguage === 'ta' ? 'bg-civic-primary text-white shadow-xs' : 'text-civic-muted hover:text-civic-text'
                }`}
              >
                தமிழ் (Tamil)
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-civic-text uppercase tracking-wider">
                Detailed Grievance Description *
              </label>
              <span className="text-[11px] text-civic-muted">
                {selectedLanguage === 'ta' ? 'தமிழில் விவரிக்கலாம்' : 'Supports English & Tamil'}
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                selectedLanguage === 'ta' 
                  ? "பிரச்சனையை விரிவாக கூறவும்: குழியின் ஆழம், விபத்து அபாயம், இருப்பிடம்..."
                  : "Provide exact details: pothole depth, water stagnation, duration of issue, commuter safety risk..."
              }
              className="w-full px-4 py-3 bg-civic-bg border border-civic-border rounded-xl text-sm text-civic-text focus:outline-none focus:border-civic-primary focus:ring-2 focus:ring-civic-primary/20 transition"
            />
          </div>

          {/* Title with Auto-Generate Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-civic-text uppercase tracking-wider">
                Grievance Headline *
              </label>
              <button
                type="button"
                onClick={handleAutoTitle}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-civic-primary hover:underline"
              >
                <Wand2 className="w-3 h-3" />
                <span>Auto-generate Headline</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole with standing water near bus stand"
              className="w-full px-4 py-2.5 bg-civic-bg border border-civic-border rounded-xl text-sm text-civic-text focus:outline-none focus:border-civic-primary focus:ring-2 focus:ring-civic-primary/20 transition"
            />
          </div>

          {/* Location Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-civic-text uppercase tracking-wider">
                Incident Location in Coimbatore *
              </label>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGps}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-civic-primary text-[11px] font-semibold hover:bg-blue-100 transition border border-blue-200"
              >
                <Navigation className="w-3 h-3" />
                <span>{isDetectingGps ? 'Locating...' : 'Use Current GPS'}</span>
              </button>
            </div>
            
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-civic-bg border border-civic-border rounded-xl text-sm text-civic-text focus:outline-none focus:border-civic-primary focus:ring-2 focus:ring-civic-primary/20 transition mb-3"
            />

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-civic-muted font-medium">Quick Coimbatore Localities:</span>
              <div className="flex flex-wrap gap-1.5">
                {COIMBATORE_PRESET_LOCATIONS.map((loc) => (
                  <button
                    type="button"
                    key={loc.name}
                    onClick={() => handleLocationPreset(loc)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                      lat === loc.lat && lng === loc.lng
                        ? 'bg-civic-primary text-white border-civic-primary'
                        : 'bg-civic-bg text-civic-text border-civic-border hover:bg-slate-200'
                    }`}
                  >
                    {loc.name.split(' ')[0]} (Ward {loc.ward})
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 text-[11px] text-civic-muted flex items-center gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-civic-primary" />
              <span>Latitude: {lat.toFixed(4)}, Longitude: {lng.toFixed(4)} (Ward {ward})</span>
            </div>
          </div>

          {/* Optional Photograph */}
          <div>
            <label className="block text-xs font-bold text-civic-text uppercase tracking-wider mb-2">
              Attach Photographic Proof (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-civic-bg border border-civic-border text-xs font-semibold text-civic-text hover:bg-slate-200 transition">
                <Camera className="w-4 h-4 text-civic-primary" />
                <span>Select Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="flex items-center gap-2">
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-civic-border" />
                  <span className="text-xs text-civic-muted">Photo loaded</span>
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyzeWithAI}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 text-civic-primary border border-blue-200 text-xs font-bold hover:bg-civic-primary hover:text-white transition shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Civic GenAI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-civic-primary" />
                  <span>Run Civic AI Triage & Duplicate Check</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Structured Intelligence Card */}
        {aiResult && (
          <div className="bg-white border border-blue-300 rounded-2xl p-6 shadow-md space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-civic-border gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-civic-primary" />
                <div>
                  <h3 className="font-display font-bold text-base text-civic-text">
                    Civic AI Triage Analysis
                  </h3>
                  <span className="text-[10px] text-civic-muted">
                    Engine: {aiResult.is_fallback ? 'Deterministic GovTech Rule Engine (Fallback)' : 'Google Gemini 2.5 Pro (GenAI SDK)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Confidence: {Math.round(aiResult.confidence * 100)}%
                </span>
                {aiResult.recommended_sla && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    SLA: {aiResult.recommended_sla}
                  </span>
                )}
              </div>
            </div>

            {/* Score & Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-civic-bg border border-civic-border">
                <span className="text-[10px] text-civic-muted uppercase font-bold block">Category</span>
                <span className="font-bold text-civic-text text-sm mt-0.5 block">{aiResult.category}</span>
              </div>

              <div className="p-3 rounded-xl bg-civic-bg border border-civic-border">
                <span className="text-[10px] text-civic-muted uppercase font-bold block">Priority Score</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`font-extrabold text-base ${
                    (aiResult.priority_score || 70) >= 80 ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {aiResult.priority_score || 75}/100
                  </span>
                  <span className="text-[10px] text-civic-muted font-bold">({aiResult.priority})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-civic-bg border border-civic-border">
                <span className="text-[10px] text-civic-muted uppercase font-bold block">Assigned Wing</span>
                <span className="font-bold text-civic-primary text-xs mt-0.5 block">{aiResult.recommended_department}</span>
              </div>

              <div className="p-3 rounded-xl bg-civic-bg border border-civic-border">
                <span className="text-[10px] text-civic-muted uppercase font-bold block">Specific Issue</span>
                <span className="font-bold text-civic-text text-xs mt-0.5 block">{aiResult.issue_type}</span>
              </div>
            </div>

            {/* Detailed AI Assessment */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
              {aiResult.urgency_reason && (
                <div>
                  <span className="font-bold text-civic-text">Urgency Rationale: </span>
                  <span className="text-slate-700">{aiResult.urgency_reason}</span>
                </div>
              )}
              {aiResult.safety_risk && (
                <div>
                  <span className="font-bold text-civic-text">Safety Hazard: </span>
                  <span className="text-slate-700">{aiResult.safety_risk}</span>
                </div>
              )}
              {aiResult.suggested_action && (
                <div>
                  <span className="font-bold text-civic-text">Recommended Technical Remedy: </span>
                  <span className="text-slate-700">{aiResult.suggested_action}</span>
                </div>
              )}
              <div>
                <span className="font-bold text-civic-text">Engineering Reasoning: </span>
                <span className="text-slate-700">{aiResult.explanation}</span>
              </div>
            </div>

            {/* Proximity Duplicate Warning */}
            {duplicateCheck && duplicateCheck.has_possible_duplicates && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Proximity Duplicate Grievance Detected in Coimbatore</span>
                </div>
                <p className="text-amber-800">
                  {duplicateCheck.recommendation}
                </p>
                {duplicateCheck.matches.map((m) => (
                  <div key={m.complaint_reference} className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-civic-primary">{m.complaint_reference}</span>
                      <span className="ml-2 font-semibold text-civic-text">{m.title}</span>
                      <span className="text-civic-muted ml-2">({m.distance_meters}m away)</span>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await CivicApi.supportComplaint(m.complaint_reference);
                        navigate(`/track?ref=${m.complaint_reference}`);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Endorse Existing</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-civic-muted">
            Submission issues an immutable municipal reference ID (CR-2026-XXXXX) with blockchain-ready audit history.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-civic-primary text-white font-bold text-sm hover:bg-civic-primary-hover transition shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Complaint...</span>
              </>
            ) : (
              <>
                <span>Submit Grievance</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
