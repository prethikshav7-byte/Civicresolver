import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Sparkles, MapPin, Camera, AlertCircle, CheckCircle2, ArrowRight, Loader2, ThumbsUp } from 'lucide-react';
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

export const ReportComplaintPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
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
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Preset Location Select
  const handleLocationPreset = (preset: typeof COIMBATORE_PRESET_LOCATIONS[0]) => {
    setAddress(preset.name + ', Coimbatore');
    setLat(preset.lat);
    setLng(preset.lng);
    setWard(preset.ward);
    setLocality(preset.name.split(' ')[0]);
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
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Please enter both a title and description before analyzing.");
      return;
    }
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      const [aiData, dupData] = await Promise.all([
        CivicApi.analyzeWithAI(title, description, address),
        CivicApi.checkDuplicates(title, description, lat, lng)
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-soft text-civic-brand text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Municipal Citizen Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-civic-text tracking-tight">
          Report a Civic Grievance
        </h1>
        <p className="text-sm text-civic-muted mt-1">
          Describe the problem in English or Tamil. Our AI engine verifies urgency and routes it to the responsible Coimbatore department.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-civic-surface border border-civic-border rounded-2xl p-6 shadow-card space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-civic-text uppercase tracking-wider mb-2">
              Grievance Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole with standing water causing two-wheelers to slip"
              className="w-full px-4 py-2.5 bg-civic-bg/50 border border-civic-border rounded-lg text-sm text-civic-text focus:outline-none focus:border-civic-brand focus:ring-1 focus:ring-civic-brand transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-civic-text uppercase tracking-wider mb-2">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details: size of pothole, duration of issue, safety risks to commuters, landmark proximity..."
              className="w-full px-4 py-2.5 bg-civic-bg/50 border border-civic-border rounded-lg text-sm text-civic-text focus:outline-none focus:border-civic-brand focus:ring-1 focus:ring-civic-brand transition"
            />
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-xs font-semibold text-civic-text uppercase tracking-wider mb-2">
              Location in Coimbatore *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-civic-bg/50 border border-civic-border rounded-lg text-sm text-civic-text focus:outline-none focus:border-civic-brand focus:ring-1 focus:ring-civic-brand transition mb-3"
            />

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-civic-muted font-medium">Quick Localities:</span>
              <div className="flex flex-wrap gap-1.5">
                {COIMBATORE_PRESET_LOCATIONS.map((loc) => (
                  <button
                    type="button"
                    key={loc.name}
                    onClick={() => handleLocationPreset(loc)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                      lat === loc.lat && lng === loc.lng
                        ? 'bg-civic-brand text-white border-civic-brand'
                        : 'bg-civic-bg text-civic-text border-civic-border hover:bg-civic-soft'
                    }`}
                  >
                    {loc.name.split(' ')[0]} (Ward {loc.ward})
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 text-[11px] text-civic-muted flex items-center gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-civic-brand" />
              <span>Latitude: {lat.toFixed(4)}, Longitude: {lng.toFixed(4)} (Ward {ward})</span>
            </div>
          </div>

          {/* Optional Photograph */}
          <div>
            <label className="block text-xs font-semibold text-civic-text uppercase tracking-wider mb-2">
              Attach Photographic Proof (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-civic-bg border border-civic-border text-xs font-medium text-civic-text hover:bg-civic-soft transition">
                <Camera className="w-4 h-4 text-civic-brand" />
                <span>Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="flex items-center gap-2">
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-civic-border" />
                  <span className="text-[11px] text-civic-muted">Photo loaded</span>
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="text-[11px] text-red-600 hover:underline"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-civic-soft text-civic-brand border border-civic-brand/20 text-xs font-semibold hover:bg-civic-brand hover:text-white transition shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Civic AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyse with Civic AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Structured Intelligence Card */}
        {aiResult && (
          <div className="bg-civic-surface border border-civic-brand/30 rounded-2xl p-6 shadow-panel space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-civic-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-civic-brand" />
                <h3 className="font-display font-bold text-sm text-civic-text">
                  Civic AI Triage Result
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Confidence: {Math.round(aiResult.confidence * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-civic-bg border border-civic-border/60">
                <span className="text-[10px] text-civic-muted uppercase block">Detected Category</span>
                <span className="font-semibold text-civic-text mt-0.5 block">{aiResult.category}</span>
              </div>
              <div className="p-3 rounded-lg bg-civic-bg border border-civic-border/60">
                <span className="text-[10px] text-civic-muted uppercase block">Urgency / Priority</span>
                <span className={`font-semibold mt-0.5 block ${
                  aiResult.priority === 'Critical' ? 'text-civic-critical' : 'text-civic-warning'
                }`}>
                  {aiResult.priority} (Severity {aiResult.severity}/5)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-civic-bg border border-civic-border/60">
                <span className="text-[10px] text-civic-muted uppercase block">Target Department</span>
                <span className="font-semibold text-civic-text mt-0.5 block">{aiResult.recommended_department}</span>
              </div>
              <div className="p-3 rounded-lg bg-civic-bg border border-civic-border/60">
                <span className="text-[10px] text-civic-muted uppercase block">Specific Issue</span>
                <span className="font-semibold text-civic-text mt-0.5 block">{aiResult.issue_type}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-civic-soft/50 border border-civic-brand/10 space-y-1.5 text-xs">
              <div>
                <span className="font-semibold text-civic-text">Safety Risk Assessment: </span>
                <span className="text-civic-muted">{aiResult.safety_risk}</span>
              </div>
              <div>
                <span className="font-semibold text-civic-text">Recommended Action: </span>
                <span className="text-civic-muted">{aiResult.suggested_action}</span>
              </div>
              <div>
                <span className="font-semibold text-civic-text">Engineering Reasoning: </span>
                <span className="text-civic-muted">{aiResult.explanation}</span>
              </div>
            </div>

            {/* Duplicate Advisory Warning */}
            {duplicateCheck && duplicateCheck.has_possible_duplicates && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Possible Duplicate Grievance Detected in Immediate Vicinity</span>
                </div>
                <p className="text-amber-800">
                  {duplicateCheck.recommendation}
                </p>
                {duplicateCheck.matches.map((m) => (
                  <div key={m.complaint_reference} className="p-2.5 rounded bg-white/80 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-semibold text-civic-brand">{m.complaint_reference}</span>
                      <span className="ml-2 font-medium text-civic-text">{m.title}</span>
                      <span className="text-civic-muted ml-2">({m.distance_meters}m away)</span>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await CivicApi.supportComplaint(m.complaint_reference);
                        navigate(`/track?ref=${m.complaint_reference}`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium text-[11px] transition"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Endorse Existing</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-civic-muted">
            Submission creates an immutable municipal reference ID and audit log entry.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-civic-brand text-white font-semibold text-sm hover:bg-civic-brand-hover transition shadow-sm"
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
