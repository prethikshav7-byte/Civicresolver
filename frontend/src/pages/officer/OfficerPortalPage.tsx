import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Wrench, CheckCircle2, Clock, MapPin, 
  Camera, FileText, AlertTriangle, ArrowRight, ShieldCheck, UserCheck, RefreshCw 
} from 'lucide-react';
import { CivicApi } from '../../services/api';
import { Complaint, OfficerQueueResponse } from '../../types';

export const OfficerPortalPage: React.FC = () => {
  const [queueData, setQueueData] = useState<OfficerQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("Roads Department");

  // Inspection Modal State
  const [inspectTarget, setInspectTarget] = useState<Complaint | null>(null);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [isInspecting, setIsInspecting] = useState(false);

  // Resolution Modal State
  const [resolveTarget, setResolveTarget] = useState<Complaint | null>(null);
  const [rectificationSummary, setRectificationSummary] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80');
  const [isResolving, setIsResolving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadQueue = async () => {
    setLoading(true);
    const data = await CivicApi.getOfficerQueue(selectedDept);
    setQueueData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadQueue();
  }, [selectedDept]);

  const handleInspectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectTarget || !inspectionNotes.trim()) return;

    setIsInspecting(true);
    const updated = await CivicApi.recordInspection(inspectTarget.complaint_reference, inspectionNotes);
    if (updated) {
      setSuccessMsg(`Inspection recorded for ${inspectTarget.complaint_reference}. Status updated to In Progress.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      setInspectTarget(null);
      setInspectionNotes('');
      await loadQueue();
    }
    setIsInspecting(false);
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveTarget || !rectificationSummary.trim()) return;

    setIsResolving(true);
    const updated = await CivicApi.submitOfficerResolution(
      resolveTarget.complaint_reference,
      rectificationSummary,
      afterPhotoUrl
    );
    if (updated) {
      setSuccessMsg(`Resolution submitted for ${resolveTarget.complaint_reference} with photo proof. Dispatched to CivicProof for citizen audit.`);
      setTimeout(() => setSuccessMsg(null), 5000);
      setResolveTarget(null);
      setRectificationSummary('');
      await loadQueue();
    }
    setIsResolving(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Profile Header */}
      <div className="bg-white border border-civic-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-civic-primary/10 border border-civic-primary/20 flex items-center justify-center text-civic-primary shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-civic-primary text-xs font-semibold mb-1 border border-blue-100">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Executive Engineer Field Console</span>
              </div>
              <h1 className="text-2xl font-display font-extrabold text-civic-text">
                Er. Vigneshwaran K.
              </h1>
              <p className="text-xs text-civic-muted mt-0.5">
                Central Zone Squad 4 • Roads & Carriageway Engineering Wing • Coimbatore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-civic-bg p-3.5 rounded-xl border border-civic-border self-start">
            <div className="text-center px-3 border-r border-civic-border">
              <div className="text-xl font-bold text-civic-primary">{queueData?.count || 0}</div>
              <div className="text-[10px] text-civic-muted uppercase font-medium">Assigned Tasks</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl font-bold text-emerald-600">48h</div>
              <div className="text-[10px] text-civic-muted uppercase font-medium">SLA Target</div>
            </div>
          </div>
        </div>

        {/* Department Switcher */}
        <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-civic-border flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-civic-muted">Department Queue:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs py-1.5 px-3 bg-civic-bg border border-civic-border rounded-xl font-medium text-civic-text focus:outline-none focus:ring-1 focus:ring-civic-primary"
            >
              <option value="Roads Department">Roads Department</option>
              <option value="Drainage Department">Drainage Department</option>
              <option value="Sanitation Department">Sanitation Department</option>
              <option value="Electrical Department">Electrical Department</option>
              <option value="Water Supply Department">Water Supply Department</option>
            </select>
          </div>

          <button
            onClick={loadQueue}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-civic-muted hover:text-civic-text transition rounded-lg hover:bg-slate-100"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Execution Queue */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-civic-border">
          <div className="w-8 h-8 border-4 border-civic-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-civic-muted">Retrieving field dispatch orders...</p>
        </div>
      ) : !queueData || queueData.items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-civic-border">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="font-semibold text-civic-text">No pending assignments in {selectedDept}</p>
          <p className="text-xs text-civic-muted mt-1">All field tickets are currently up to date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-civic-text">
              Active Field Tickets ({queueData.count})
            </h2>
            <span className="text-xs text-civic-muted">
              Sorted by urgency score & SLA countdown
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {queueData.items.map((c) => {
              const isUrgent = c.priority === 'Critical' || c.priority === 'High';
              return (
                <div 
                  key={c.id}
                  className="bg-white border border-civic-border rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-civic-primary border border-blue-200">
                          {c.complaint_reference}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          c.status === 'In Progress' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : c.status === 'Reopened'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {c.status}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          isUrgent ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.priority} Priority {c.priority_score ? `(${c.priority_score}/100)` : ''}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-civic-text">
                        {c.title}
                      </h3>
                      <p className="text-xs text-civic-muted mt-1 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-civic-muted flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-civic-primary" />
                          {c.address}
                        </span>
                        {c.ward_number && <span>Ward {c.ward_number}</span>}
                        {c.recommended_sla && (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            SLA: {c.recommended_sla}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      {c.status !== 'In Progress' && (
                        <button
                          onClick={() => setInspectTarget(c)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-civic-bg hover:bg-slate-200 text-civic-text border border-civic-border transition shadow-xs flex items-center gap-1.5"
                        >
                          <Wrench className="w-3.5 h-3.5 text-civic-primary" />
                          <span>Record Inspection</span>
                        </button>
                      )}

                      <button
                        onClick={() => setResolveTarget(c)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-civic-primary hover:bg-civic-primary-hover text-white transition shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Submit Resolution</span>
                      </button>
                    </div>
                  </div>

                  {/* Timeline preview if available */}
                  {c.timeline && c.timeline.length > 0 && (
                    <div className="pt-3 border-t border-civic-border text-[11px] text-civic-muted flex items-center gap-2">
                      <span className="font-semibold text-civic-text">Latest audit update:</span>
                      <span>{c.timeline[c.timeline.length - 1].change_reason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: Field Inspection Notes */}
      {inspectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-civic-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-civic-border">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-civic-primary" />
                <h3 className="font-bold text-base text-civic-text">
                  Record On-Site Field Inspection
                </h3>
              </div>
              <button onClick={() => setInspectTarget(null)} className="text-civic-muted hover:text-civic-text font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-civic-muted">
              Ticket: <strong className="text-civic-text">{inspectTarget.complaint_reference}</strong> ({inspectTarget.title})
            </p>

            <form onSubmit={handleInspectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-civic-text mb-1">
                  Field Observations & Squad Dispatch Details *
                </label>
                <textarea
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="e.g. Inspected site with asphalt crew. Trench length 2.4m, cold-mix base required before bitumen topcoat..."
                  rows={3}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-civic-border focus:ring-2 focus:ring-civic-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-civic-border text-civic-text hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInspecting || !inspectionNotes.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-civic-primary text-white hover:bg-civic-primary-hover shadow-sm"
                >
                  {isInspecting ? 'Recording...' : 'Update to In Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Submit Resolution */}
      {resolveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-civic-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-civic-border">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-civic-text">
                  Complete Resolution & Submit Proof
                </h3>
              </div>
              <button onClick={() => setResolveTarget(null)} className="text-civic-muted hover:text-civic-text font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-civic-muted">
              Ticket: <strong className="text-civic-text">{resolveTarget.complaint_reference}</strong> ({resolveTarget.title})
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-civic-text mb-1">
                  Rectification Summary (Mandatory for CivicProof) *
                </label>
                <textarea
                  value={rectificationSummary}
                  onChange={(e) => setRectificationSummary(e.target.value)}
                  placeholder="Describe technical work executed: e.g. Bitumen compaction completed, flush with surrounding asphalt. Debris cleared..."
                  rows={3}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-civic-border focus:ring-2 focus:ring-civic-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-civic-text mb-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-civic-primary" />
                  After-Repair Photographic Proof URL *
                </label>
                <input
                  type="url"
                  value={afterPhotoUrl}
                  onChange={(e) => setAfterPhotoUrl(e.target.value)}
                  placeholder="https://... photo link of completed work"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-civic-border focus:ring-2 focus:ring-civic-primary focus:outline-none"
                />
                <span className="text-[10px] text-civic-muted mt-1 block">
                  This photo will be displayed on CivicProof for public community voting.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-civic-border text-civic-text hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResolving || !rectificationSummary.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                >
                  {isResolving ? 'Submitting...' : 'Mark Resolved & Dispatch to CivicProof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
