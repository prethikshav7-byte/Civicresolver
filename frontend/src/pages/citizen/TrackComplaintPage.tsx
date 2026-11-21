import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, CheckCircle2, Clock, AlertCircle, MapPin, ThumbsUp, Building2, User, FileText, ArrowRight } from 'lucide-react';
import { CivicApi } from '../../services/api';
import { Complaint } from '../../types';
import { useTranslation } from '../../i18n/translations';

export const TrackComplaintPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [searchParams] = useSearchParams();
  const refFromUrl = searchParams.get('ref') || '#80001';

  const [searchRef, setSearchRef] = useState(refFromUrl);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);

  const fetchComplaint = async (reference: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await CivicApi.getComplaint(reference);
      if (data) {
        setComplaint(data);
        setSupportCount(data.supports_count || 1);
      } else {
        setErrorMsg(`No record found with reference: ${reference}`);
        setComplaint(null);
      }
    } catch (e) {
      setErrorMsg("Failed to retrieve complaint record.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refFromUrl) {
      setSearchRef(refFromUrl);
      fetchComplaint(refFromUrl);
    }
  }, [refFromUrl]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.trim()) {
      fetchComplaint(searchRef.trim());
    }
  };

  const handleSupport = async () => {
    if (!complaint || hasSupported) return;
    const newCount = await CivicApi.supportComplaint(complaint.complaint_reference);
    setSupportCount(newCount);
    setHasSupported(true);
  };

  const statusLifecycle = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

  const getStatusStepIndex = (status: string) => {
    const idx = statusLifecycle.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const currentStep = complaint ? getStatusStepIndex(complaint.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F4EC] text-[#167A4D] text-xs font-bold mb-2 border border-[#C6E4CF]">
          <FileText className="w-3.5 h-3.5" />
          <span>Real-Time Grievance Tracker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.trackTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t.trackSubtitle}
        </p>
      </div>

      {/* Reference Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder={t.trackInputPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#167A4D] focus:ring-1 focus:ring-[#167A4D] transition shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#167A4D] hover:bg-[#12603C] text-white font-bold text-xs rounded-2xl transition shadow-xs shrink-0"
        >
          {loading ? 'Searching...' : t.trackSearchBtn}
        </button>
      </form>

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Tracking Details */}
      {complaint && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#E8F4EC] text-[#167A4D] border border-[#C6E4CF]">
                  {complaint.complaint_reference}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {complaint.status}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                {complaint.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#167A4D] shrink-0" />
                <span>{complaint.address}</span>
              </div>
            </div>

            {/* Endorsement button */}
            <button
              onClick={handleSupport}
              disabled={hasSupported}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition shrink-0 ${
                hasSupported
                  ? 'bg-[#E8F4EC] text-[#167A4D] border-[#C6E4CF]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{hasSupported ? 'Endorsed by You' : 'Support this Grievance'}</span>
              <span className="font-bold">({supportCount})</span>
            </button>
          </div>

          {/* 5-Stage Visual Progress Bar */}
          <div className="py-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
              Lifecycle Progress
            </span>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {statusLifecycle.map((stage, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={stage} className="space-y-2">
                    <div className={`h-2 rounded-full transition-all ${
                      isCompleted ? 'bg-[#167A4D]' : 'bg-slate-200'
                    }`} />
                    <div className="text-[11px]">
                      <span className={`block font-medium ${
                        isCurrent ? 'text-[#167A4D] font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {stage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grievance Details Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Department</span>
              <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#167A4D]" />
                {complaint.department_name || 'Allocating...'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Assigned Squad</span>
              <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#167A4D]" />
                {complaint.assigned_officer_name || 'Pending assignment'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Category & Priority</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {complaint.category} · <span className="text-red-600">{complaint.priority}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Registered Date</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {new Date(complaint.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-800 block">Reported Grievance Summary</span>
            <p className="text-slate-600 leading-relaxed p-3 rounded-2xl bg-white border border-slate-200">
              {complaint.description}
            </p>
          </div>

          {/* Resolution Notes & Proof if available */}
          {complaint.resolution_notes && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-[#167A4D]" />
                <span>Field Resolution Summary</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                {complaint.resolution_notes}
              </p>
            </div>
          )}

          {/* Detailed Audit Timeline */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-800 block mb-3">
              Case Event Timeline
            </span>
            <div className="border-l-2 border-slate-200 ml-2 pl-4 space-y-4 text-xs">
              {complaint.timeline && complaint.timeline.length > 0 ? (
                complaint.timeline.map((event, idx) => (
                  <div key={event.id || idx} className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#167A4D] absolute -left-[21px] top-1 border-2 border-white" />
                    <div className="font-bold text-slate-900">
                      {event.new_status}
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {event.change_reason}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {new Date(event.created_at).toLocaleString()} · {event.changed_by || 'System'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#167A4D] absolute -left-[21px] top-1 border-2 border-white" />
                  <div className="font-bold text-slate-900">Reported</div>
                  <p className="text-slate-500 text-[11px]">Submitted via CivicResolver platform</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
