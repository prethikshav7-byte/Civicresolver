import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, CheckCircle2, Clock, AlertCircle, MapPin, ThumbsUp, Building2, User, FileText, ArrowRight } from 'lucide-react';
import { CivicApi } from '../../services/api';
import { Complaint } from '../../types';

export const TrackComplaintPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const refFromUrl = searchParams.get('ref') || 'CR-2026-00001';

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
        setErrorMsg(`No civic complaint found with reference: ${reference}`);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-soft text-civic-brand text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Real-Time Grievance Tracker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-civic-text tracking-tight">
          Track Municipal Complaint
        </h1>
        <p className="text-sm text-civic-muted mt-1">
          Monitor your complaint lifecycle from registration to on-site municipal verification.
        </p>
      </div>

      {/* Reference Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-civic-muted" />
          <input
            type="text"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder="Enter reference ID (e.g. CR-2026-00001)"
            className="w-full pl-10 pr-4 py-2.5 bg-civic-surface border border-civic-border rounded-xl text-sm font-mono text-civic-text focus:outline-none focus:border-civic-brand focus:ring-1 focus:ring-civic-brand transition shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-civic-brand text-white font-semibold text-xs rounded-xl hover:bg-civic-brand-hover transition shadow-xs shrink-0"
        >
          {loading ? 'Searching...' : 'Track Issue'}
        </button>
      </form>

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Tracking Details */}
      {complaint && (
        <div className="bg-civic-surface border border-civic-border rounded-2xl p-6 shadow-card space-y-6">
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-civic-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-civic-soft text-civic-brand">
                  {complaint.complaint_reference}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {complaint.status}
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-civic-text mt-2">
                {complaint.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-civic-muted mt-1">
                <MapPin className="w-3.5 h-3.5 text-civic-brand shrink-0" />
                <span>{complaint.address}</span>
              </div>
            </div>

            {/* Endorsement button */}
            <button
              onClick={handleSupport}
              disabled={hasSupported}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition shrink-0 ${
                hasSupported
                  ? 'bg-civic-soft text-civic-brand border-civic-brand/20'
                  : 'bg-civic-bg text-civic-text border-civic-border hover:bg-civic-soft'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{hasSupported ? 'Endorsed by You' : 'Support this Grievance'}</span>
              <span className="font-bold">({supportCount})</span>
            </button>
          </div>

          {/* 5-Stage Visual Progress Bar */}
          <div className="py-2">
            <span className="text-[11px] font-semibold text-civic-muted uppercase tracking-wider block mb-4">
              Lifecycle Progress
            </span>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {statusLifecycle.map((stage, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={stage} className="space-y-2">
                    <div className={`h-2 rounded-full transition-all ${
                      isCompleted ? 'bg-civic-resolved' : 'bg-civic-border'
                    }`} />
                    <div className="text-[11px]">
                      <span className={`block font-medium ${
                        isCurrent ? 'text-civic-brand font-bold' : isCompleted ? 'text-civic-text' : 'text-civic-muted'
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-civic-bg/70 border border-civic-border/70 text-xs">
            <div>
              <span className="text-[10px] text-civic-muted uppercase block">Department</span>
              <span className="font-semibold text-civic-text mt-0.5 block flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-civic-brand" />
                {complaint.department_name || 'Allocating...'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-civic-muted uppercase block">Assigned Officer</span>
              <span className="font-semibold text-civic-text mt-0.5 block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-civic-brand" />
                {complaint.assigned_officer_name || 'Pending assignment'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-civic-muted uppercase block">Category & Priority</span>
              <span className="font-semibold text-civic-text mt-0.5 block">
                {complaint.category} · <span className="text-civic-critical">{complaint.priority}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-civic-muted uppercase block">Filed Date</span>
              <span className="font-semibold text-civic-text mt-0.5 block">
                {new Date(complaint.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold text-civic-text block">Grievance Description</span>
            <p className="text-civic-muted leading-relaxed p-3 rounded-lg bg-civic-bg border border-civic-border">
              {complaint.description}
            </p>
          </div>

          {/* Resolution Notes & Proof if available */}
          {complaint.resolution_notes && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Official Municipal Resolution Record</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                {complaint.resolution_notes}
              </p>
              {complaint.resolved_at && (
                <span className="text-[10px] text-emerald-700 block">
                  Verified completed on: {new Date(complaint.resolved_at).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Detailed Audit Timeline */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-civic-text block mb-3">
              Case Event Timeline
            </span>
            <div className="border-l-2 border-civic-border ml-2 pl-4 space-y-4 text-xs">
              {complaint.timeline && complaint.timeline.length > 0 ? (
                complaint.timeline.map((event, idx) => (
                  <div key={event.id || idx} className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-civic-brand absolute -left-[21px] top-1 border-2 border-white" />
                    <div className="font-semibold text-civic-text">
                      {event.new_status}
                    </div>
                    <p className="text-civic-muted text-[11px] mt-0.5">
                      {event.change_reason}
                    </p>
                    <span className="text-[10px] text-civic-muted/80 block mt-0.5">
                      {new Date(event.created_at).toLocaleString()} · Logged by {event.changed_by || 'System'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-civic-brand absolute -left-[21px] top-1 border-2 border-white" />
                  <div className="font-semibold text-civic-text">Reported</div>
                  <p className="text-civic-muted text-[11px]">Submitted via CivicResolve platform</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
