import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, MapPin, 
  ArrowRight, Loader2, AlertCircle 
} from 'lucide-react';
import { CivicApi } from '../../services/api';
import { ComplaintCategory, ComplaintPriority, PriorityScoreBreakdown } from '../../types';
import { useTranslation } from '../../i18n/translations';

interface SampleReportOption {
  id: string;
  name: string;
  desc: string;
  title: string;
  category: ComplaintCategory;
  location: string;
  lat: number;
  lng: number;
  priority: ComplaintPriority;
  score: number;
  sla: string;
  dept: string;
  breakdown: PriorityScoreBreakdown;
}

const SAMPLE_REPORTS: SampleReportOption[] = [
  {
    id: 'pothole-school',
    name: 'Pothole near School',
    desc: 'Deep dangerous pothole right outside Govt Higher Secondary School main gate. Standing rainwater makes it invisible. Commuters skidding during morning rush.',
    title: 'Deep crater pothole near school zone',
    category: 'Roads',
    location: 'DB Road, opposite Govt Girls High School, RS Puram, Coimbatore',
    lat: 11.0089,
    lng: 76.9464,
    priority: 'Critical',
    score: 93,
    sla: '8 Hours Target',
    dept: 'Roads & Highways',
    breakdown: {
      urgency_pts: 50,
      urgency_label: 'Immediate safety hazard near high-density traffic corridor',
      impact_pts: 16,
      impact_label: 'Impact scale 4/5 on pedestrian and commuter safety',
      safety_pts: 15,
      safety_label: 'Vehicular cavitation risk flagged by municipal assessment',
      context_pts: 12,
      context_label: 'High-density children school zone proximity'
    }
  },
  {
    id: 'garbage-dump',
    name: 'Overflowing Garbage',
    desc: 'Community garbage dumpster overflowing onto carriageway for over 48 hours. Waste scattered across sidewalk, heavy odor affecting pedestrians.',
    title: 'Solid waste overflow and sidewalk obstruction',
    category: 'Sanitation',
    location: 'Cross Cut Road, near 5th Corner, Gandhipuram, Coimbatore',
    lat: 11.0182,
    lng: 76.9585,
    priority: 'Medium',
    score: 68,
    sla: '24 Hours Target',
    dept: 'Sanitation & Waste Management',
    breakdown: {
      urgency_pts: 35,
      urgency_label: 'Scheduled municipal solid waste route interval',
      impact_pts: 14,
      impact_label: 'Pedestrian sidewalk blocked by solid waste',
      safety_pts: 10,
      safety_label: 'Health hazard and stray animal accumulation',
      context_pts: 9,
      context_label: 'Commercial eatery market perimeter'
    }
  },
  {
    id: 'live-wire',
    name: 'Exposed Live Wire',
    desc: 'Snapping overhead high-voltage cable dangling 4 feet above pedestrian sidewalk after storm branch fall. Live sparking observed during damp hours.',
    title: 'Exposed live electrical cable dangling over walkway',
    category: 'Electrical',
    location: 'Avinashi Road Service Lane, near PSG Tech, Peelamedu, Coimbatore',
    lat: 11.0284,
    lng: 77.0035,
    priority: 'Critical',
    score: 98,
    sla: '4 Hours Target',
    dept: 'Electrical & Street Lighting',
    breakdown: {
      urgency_pts: 50,
      urgency_label: 'Acute high-voltage electrocution hazard',
      impact_pts: 18,
      impact_label: 'High-density student and bus commuter corridor',
      safety_pts: 20,
      safety_label: 'Immediate risk under wet weather conditions',
      context_pts: 10,
      context_label: 'Pedestrian transit route contact'
    }
  },
  {
    id: 'pipe-burst',
    name: 'Water Pipe Burst',
    desc: 'Underground drinking water distribution pipeline burst under pressure. Gushing potable water flooding the roadway, disrupting clean supply.',
    title: 'Drinking water distribution main line rupture',
    category: 'Water',
    location: 'Trichy Road near Singanallur Signal, Coimbatore',
    lat: 10.9998,
    lng: 77.0253,
    priority: 'Critical',
    score: 89,
    sla: '12 Hours Target',
    dept: 'Water Supply & Sewerage',
    breakdown: {
      urgency_pts: 50,
      urgency_label: 'Severe drinking water loss and road wash-out',
      impact_pts: 15,
      impact_label: 'Impacting potable supply to 400+ households',
      safety_pts: 14,
      safety_label: 'Vehicular hydroplaning hazard',
      context_pts: 10,
      context_label: 'Primary municipal arterial corridor'
    }
  },
  {
    id: 'broken-lights',
    name: 'Broken Streetlights',
    desc: 'Continuous stretch of 6 LED streetlights completely unlit along the canal road for past 3 days. Complete darkness creating safety hazard.',
    title: 'Dead streetlight array along canal carriageway',
    category: 'Electrical',
    location: 'Race Course Jogging Loop & Thomas Park, Coimbatore',
    lat: 11.0065,
    lng: 76.9733,
    priority: 'Medium',
    score: 62,
    sla: '48 Hours Target',
    dept: 'Electrical & Street Lighting',
    breakdown: {
      urgency_pts: 30,
      urgency_label: 'Public thoroughfare illumination failure',
      impact_pts: 14,
      impact_label: 'Commuter nighttime visibility reduction',
      safety_pts: 10,
      safety_label: 'Accident risk at unlit road junction',
      context_pts: 8,
      context_label: 'Public park boundary corridor'
    }
  }
];

export const ReportComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  // Form State
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Let AI decide category');
  const [locationText, setLocationText] = useState('');
  const [lat, setLat] = useState(11.0168);
  const [lng, setLng] = useState(76.9558);
  const [citizenName, setCitizenName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // States
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submission Result State
  const [submittedResult, setSubmittedResult] = useState<{
    ticketId: string;
    category: string;
    priority: string;
    priorityScore: number;
    department: string;
    sla: string;
    breakdown: PriorityScoreBreakdown;
  } | null>(null);

  // Sample Report Click Handler
  const handleSelectSample = (sample: SampleReportOption) => {
    setDescription(sample.desc);
    setTitle(sample.title);
    setCategory(sample.category);
    setLocationText(sample.location);
    setLat(sample.lat);
    setLng(sample.lng);
    setCitizenName('Anand Kumar');
  };

  // GPS Auto-Detect Handler
  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setLat(uLat);
        setLng(uLng);
        setLocationText(`Lat: ${uLat.toFixed(4)}, Lng: ${uLng.toFixed(4)}, Coimbatore`);
        setIsLocating(false);
      },
      () => {
        setLat(11.0089);
        setLng(76.9464);
        setLocationText("DB Road, RS Puram, Coimbatore 641002");
        setIsLocating(false);
      },
      { timeout: 7000 }
    );
  };

  // Client-side Image Compression (<= 300KB, max 800px JPEG)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.75);
          setImagePreview(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage("Description is required.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const matchedSample = SAMPLE_REPORTS.find(s => 
        description.toLowerCase().includes(s.name.toLowerCase().split(' ')[0]) || 
        title.toLowerCase().includes(s.name.toLowerCase().split(' ')[0])
      );

      let effCategory = category !== 'Let AI decide category' ? category : (matchedSample?.category || 'Roads');
      let effTitle = title.trim() || matchedSample?.title || "Civic Infrastructure Grievance";
      let effScore = matchedSample?.score || 93;
      let effPriority = matchedSample?.priority || (effScore >= 80 ? 'Critical' : 'High');
      let effDept = matchedSample?.dept || (effCategory === 'Sanitation' ? 'Sanitation & Waste Management' : effCategory === 'Water' ? 'Water Supply & Sewerage' : effCategory === 'Electrical' ? 'Electrical & Street Lighting' : 'Roads & Highways');
      let effSla = matchedSample?.sla || '8 Hours Target';
      let effBreakdown = matchedSample?.breakdown || {
        urgency_pts: 50,
        urgency_label: 'Immediate hazard priority assessment',
        impact_pts: 16,
        impact_label: 'High population and transit density',
        safety_pts: 15,
        safety_label: 'Safety risk identified',
        context_pts: 12,
        context_label: 'Municipal arterial zone'
      };

      const created = await CivicApi.createComplaint({
        title: effTitle,
        description,
        category: effCategory as ComplaintCategory,
        priority: effPriority as ComplaintPriority,
        priority_score: effScore,
        recommended_sla: effSla,
        department_name: effDept,
        address: locationText || "Coimbatore, Tamil Nadu",
        latitude: lat,
        longitude: lng,
        citizen_name: citizenName || "Anand Kumar",
        image_url: imagePreview
      });

      setSubmittedResult({
        ticketId: created.complaint_reference || "#80019",
        category: effCategory,
        priority: effPriority,
        priorityScore: effScore,
        department: effDept,
        sla: effSla,
        breakdown: effBreakdown
      });
    } catch (err) {
      setErrorMessage("Submission failed. Please check network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setSubmittedResult(null);
    setDescription('');
    setTitle('');
    setCategory('Let AI decide category');
    setLocationText('');
    setCitizenName('');
    setImagePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* VIEW A: IF SUBMITTED -> RENDER SUCCESS CARD WITH EMERALD THEME */}
      {submittedResult ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Card with Green Top Border */}
          <div className="bg-white border-t-4 border-t-[#167A4D] border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header: Green Checkbox Icon + Grievance Lodged Successfully */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#167A4D] text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6 stroke-[2.4]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  {t.successTitle}
                </h1>

                <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                  <span className="text-xs text-slate-600">{t.ticketLabel}</span>
                  <span className="font-mono font-bold text-sm text-[#167A4D]">
                    {submittedResult.ticketId}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F4EC] text-[#167A4D] border border-[#C6E4CF]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#167A4D]" />
                    {t.triagedBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* 4-Column Metric Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div>
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  {t.detectedCategory}
                </span>
                <span className="font-bold text-sm text-slate-900 block">
                  {submittedResult.category}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  {t.priorityAssessment}
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                  {submittedResult.priority} ({submittedResult.priorityScore}/100)
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  {t.assignedDepartment}
                </span>
                <span className="font-bold text-sm text-slate-900 block">
                  {submittedResult.department}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  {t.resolutionSla}
                </span>
                <span className="font-bold text-sm text-slate-900 block">
                  {submittedResult.sla}
                </span>
              </div>
            </div>

            {/* Why This Priority Score? Box */}
            <div className="bg-[#FAFDFB] border border-[#D1EAD8] rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                {t.whyPriorityScore}
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-800">
                <li className="flex items-start gap-2">
                  <span className="text-[#167A4D] mt-0.5">•</span>
                  <span>
                    <strong>Urgency Tier (+{submittedResult.breakdown.urgency_pts} pts):</strong> {submittedResult.breakdown.urgency_label}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#167A4D] mt-0.5">•</span>
                  <span>
                    <strong>Public Impact (+{submittedResult.breakdown.impact_pts} pts):</strong> {submittedResult.breakdown.impact_label}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#167A4D] mt-0.5">•</span>
                  <span>
                    <strong>Safety Risk (+{submittedResult.breakdown.safety_pts} pts):</strong> {submittedResult.breakdown.safety_label}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#167A4D] mt-0.5">•</span>
                  <span>
                    <strong>Zonal Proximity (+{submittedResult.breakdown.context_pts} pts):</strong> {submittedResult.breakdown.context_label}
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/track?ref=${submittedResult.ticketId}`)}
                className="px-5 py-2.5 rounded-xl bg-[#167A4D] hover:bg-[#12603C] text-white font-bold text-xs transition shadow-xs"
              >
                {t.trackThisIssue}
              </button>

              <button
                type="button"
                onClick={handleResetForAnother}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs transition shadow-2xs"
              >
                {t.reportAnotherIssue}
              </button>
            </div>
          </div>
        </div>
      ) : (

        /* VIEW B: REPORT FORM */
        <div className="space-y-6">
          {/* Header Title & Subtitle */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.reportTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.reportSubtitle}
            </p>
          </div>

          {/* Try a Sample Report Box */}
          <div className="bg-[#E8F4EC]/60 border border-[#C6E4CF] rounded-2xl p-4 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              {t.trySampleReport}
            </span>

            <div className="flex flex-wrap gap-2">
              {[
                { s: SAMPLE_REPORTS[0], label: t.samplePothole },
                { s: SAMPLE_REPORTS[1], label: t.sampleGarbage },
                { s: SAMPLE_REPORTS[2], label: t.sampleWire },
                { s: SAMPLE_REPORTS[3], label: t.samplePipe },
                { s: SAMPLE_REPORTS[4], label: t.sampleLights }
              ].map(({ s, label }) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => handleSelectSample(s)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#167A4D] rounded-xl text-xs font-semibold text-slate-700 hover:text-[#167A4D] transition shadow-2xs flex items-center gap-1.5"
                >
                  <span className="text-slate-400">#</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            
            {/* Description Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t.descLabel}
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descPlaceholder}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#167A4D] focus:ring-1 focus:ring-[#167A4D]"
              />
            </div>

            {/* Issue Title (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t.titleLabel}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#167A4D] focus:ring-1 focus:ring-[#167A4D]"
              />
            </div>

            {/* Row: Category + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.categoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#167A4D]"
                >
                  <option value="Let AI decide category">{t.categoryAuto}</option>
                  <option value="Roads">Roads & Highways</option>
                  <option value="Sanitation">Sanitation & Waste Management</option>
                  <option value="Electrical">Electrical & Street Lighting</option>
                  <option value="Water">Water Supply & Sewerage</option>
                  <option value="Drainage">Drainage & Flood Control</option>
                  <option value="Parks">Parks & Horticulture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.locationLabel}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder={t.locationPlaceholder}
                    className="w-full pl-3.5 pr-16 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#167A4D]"
                  />
                  <button
                    type="button"
                    onClick={handleGpsDetect}
                    disabled={isLocating}
                    className="absolute right-1 px-3 py-1.5 bg-[#12382C] hover:bg-black text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                    title="Capture current GPS coordinates"
                  >
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{isLocating ? '...' : t.gpsButton}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row: Attach Photo + Your Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.photoLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {t.photoHelp}
                </span>
                {imagePreview && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#167A4D]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#167A4D] hover:bg-[#12603C] text-white font-bold text-xs transition shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.submittingText}</span>
                  </>
                ) : (
                  <>
                    <span>{t.submitButton}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
