import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, ThumbsUp, ShieldCheck, 
  RotateCcw, Sparkles, Filter, Building2, User, MapPin, Calendar, Info
} from 'lucide-react';
import { CivicApi } from '../../services/api';
import { CivicProofItem, CivicProofStatus } from '../../types';

export const CivicProofPage: React.FC = () => {
  const [proofItems, setProofItems] = useState<CivicProofItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [voteSuccessMsg, setVoteSuccessMsg] = useState<string | null>(null);

  // Admin Reopen Modal State
  const [reopenTarget, setReopenTarget] = useState<CivicProofItem | null>(null);
  const [reopenReason, setReopenReason] = useState('');
  const [isReopening, setIsReopening] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await CivicApi.getProofList(filterStatus);
    setProofItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const handleVote = async (id: string, vote: 'Resolved' | 'Partially resolved' | 'Still exists') => {
    setVotingId(id);
    const updated = await CivicApi.voteProof(id, {
      citizen_name: "Priya Sundaram",
      citizen_id: "cit-user-70",
      vote
    });
    if (updated) {
      setProofItems(prev => prev.map(p => p.id === id ? updated : p));
      setVoteSuccessMsg(`Thank you! Your community vote ("${vote}") was securely recorded.`);
      setTimeout(() => setVoteSuccessMsg(null), 4000);
    }
    setVotingId(null);
  };

  const handleAdminReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenTarget || !reopenReason.trim()) return;

    setIsReopening(true);
    const updated = await CivicApi.reopenProof(reopenTarget.id, {
      reason: reopenReason,
      reopened_by: "Dr. Anand Ramanathan, IAS (Municipal Commissioner)"
    });

    if (updated) {
      setProofItems(prev => prev.map(p => p.id === reopenTarget.id ? updated : p));
      setReopenTarget(null);
      setReopenReason('');
      setVoteSuccessMsg(`Complaint ${reopenTarget.complaint_reference} has been reopened for mandatory re-inspection.`);
      setTimeout(() => setVoteSuccessMsg(null), 5000);
    }
    setIsReopening(false);
  };

  const getStatusBadge = (status: CivicProofStatus) => {
    switch (status) {
      case 'Community Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Community Verified
          </span>
        );
      case 'Disputed / Escalated':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Disputed / Escalated
          </span>
        );
      case 'Reopened for Reinspection':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <RotateCcw className="w-3.5 h-3.5" />
            Reopened for Reinspection
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Awaiting Verification
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white border border-civic-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-civic-primary text-xs font-semibold mb-3 border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-civic-primary" />
              <span>Coimbatore Public Verification Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-civic-text tracking-tight">
              CivicProof: Community Resolution Audit
            </h1>
            <p className="text-sm text-civic-muted mt-1 max-w-2xl leading-relaxed">
              Before a municipal complaint is officially closed, citizens audit the actual field repair evidence. 
              Vote whether the work is genuinely resolved, partial, or if the hazard still exists.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-civic-bg p-4 rounded-xl border border-civic-border self-start">
            <div className="text-center px-3 border-r border-civic-border">
              <div className="text-2xl font-bold text-emerald-600">82%</div>
              <div className="text-[11px] text-civic-muted uppercase font-medium">Verify Rate</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-bold text-civic-primary">48h</div>
              <div className="text-[11px] text-civic-muted uppercase font-medium">Audit Window</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-civic-border flex-wrap">
          <span className="text-xs font-semibold text-civic-muted flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>
          {['All', 'Community Verified', 'Awaiting Community Verification', 'Disputed / Escalated', 'Reopened for Reinspection'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                filterStatus === st
                  ? 'bg-civic-primary text-white shadow-xs'
                  : 'bg-civic-bg text-civic-muted hover:text-civic-text hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification */}
      {voteSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{voteSuccessMsg}</span>
        </div>
      )}

      {/* Proof List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-civic-border">
          <div className="w-8 h-8 border-4 border-civic-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-civic-muted">Loading verified resolution audit stream...</p>
        </div>
      ) : proofItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-civic-border">
          <ShieldCheck className="w-12 h-12 text-civic-muted mx-auto mb-3" />
          <p className="font-semibold text-civic-text">No resolution items match this filter</p>
          <p className="text-xs text-civic-muted mt-1">Try selecting another status tab above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {proofItems.map((item) => {
            const totalVotes = item.votes_resolved + item.votes_partial + item.votes_still_exists;
            const pctResolved = totalVotes > 0 ? Math.round((item.votes_resolved / totalVotes) * 100) : 0;
            const pctPartial = totalVotes > 0 ? Math.round((item.votes_partial / totalVotes) * 100) : 0;
            const pctStill = totalVotes > 0 ? Math.round((item.votes_still_exists / totalVotes) * 100) : 0;

            return (
              <div 
                key={item.id} 
                className="bg-white border border-civic-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Header Bar */}
                <div className="p-5 sm:p-6 border-b border-civic-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-white text-civic-primary border border-civic-border">
                        {item.complaint_reference}
                      </span>
                      {getStatusBadge(item.proof_status)}
                      <span className="inline-flex items-center gap-1 text-xs text-civic-muted">
                        <MapPin className="w-3 h-3 text-civic-muted" />
                        {item.locality_name} (Ward {item.ward_number})
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-civic-text">
                      {item.title}
                    </h2>
                  </div>

                  <div className="text-xs text-civic-muted space-y-1 sm:text-right shrink-0">
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-civic-primary" />
                      <span className="font-medium text-civic-text">{item.department_name}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <User className="w-3.5 h-3.5 text-civic-muted" />
                      <span>{item.assigned_officer_name}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Photo Comparison: Side-by-Side */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-civic-muted mb-3">
                      Photographic Evidence: Before & After Field Rectification
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Before Photo */}
                      <div className="rounded-xl border border-red-200 overflow-hidden bg-slate-100 group">
                        <div className="relative aspect-video">
                          <img 
                            src={item.before_image_url} 
                            alt="Before field repair" 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-red-600/90 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
                            Before Repair
                          </span>
                        </div>
                        <div className="p-2.5 text-xs text-civic-muted bg-white border-t border-red-100">
                          Initial reported condition
                        </div>
                      </div>

                      {/* After Photo */}
                      <div className="rounded-xl border border-emerald-200 overflow-hidden bg-slate-100 group">
                        <div className="relative aspect-video">
                          <img 
                            src={item.after_image_url} 
                            alt="After field repair" 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-emerald-600/90 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
                            Field Rectification (After)
                          </span>
                        </div>
                        <div className="p-2.5 text-xs text-civic-muted bg-white border-t border-emerald-100">
                          Officer submitted resolution proof
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rectification Notes & AI Assessment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-civic-bg border border-civic-border">
                      <div className="text-xs font-bold text-civic-text mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-civic-primary" />
                        Official Rectification Summary:
                      </div>
                      <p className="text-xs text-civic-text leading-relaxed">
                        "{item.rectification_summary}"
                      </p>
                      <div className="mt-2 text-[10px] text-civic-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Completed: {new Date(item.resolved_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                      <div className="text-xs font-bold text-civic-primary mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-civic-primary" />
                        AI Vision Verification Assessment:
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {item.ai_vision_assessment || "Visual features corroborate structural intervention. Ground level surface continuous."}
                      </p>
                      <div className="mt-2 text-[10px] text-blue-700 font-medium">
                        Automated edge-inspection protocol
                      </div>
                    </div>
                  </div>

                  {/* Reopened Alert */}
                  {item.admin_reopened_reason && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                      <span className="font-bold block mb-0.5">Municipal Reopening Order:</span>
                      {item.admin_reopened_reason}
                    </div>
                  )}

                  {/* Community Audit & Voting Section */}
                  <div className="pt-4 border-t border-civic-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-civic-text">
                          Citizen Community Voting ({totalVotes} votes recorded)
                        </h4>
                        <p className="text-[11px] text-civic-muted">
                          Public audit requires &gt;70% consensus to mark permanently verified.
                        </p>
                      </div>

                      {/* Vote Progress Bar */}
                      <div className="w-full sm:w-64 space-y-1">
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                          <div style={{ width: `${pctResolved}%` }} className="bg-emerald-500 h-full" title={`Resolved: ${pctResolved}%`} />
                          <div style={{ width: `${pctPartial}%` }} className="bg-amber-400 h-full" title={`Partial: ${pctPartial}%`} />
                          <div style={{ width: `${pctStill}%` }} className="bg-red-500 h-full" title={`Still exists: ${pctStill}%`} />
                        </div>
                        <div className="flex justify-between text-[10px] text-civic-muted">
                          <span className="text-emerald-700 font-semibold">{pctResolved}% Resolved</span>
                          <span className="text-amber-700 font-semibold">{pctPartial}% Partial</span>
                          <span className="text-red-700 font-semibold">{pctStill}% Failed</span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => handleVote(item.id, 'Resolved')}
                        disabled={votingId === item.id}
                        className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-xs"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Resolved ({item.votes_resolved})</span>
                      </button>

                      <button
                        onClick={() => handleVote(item.id, 'Partially resolved')}
                        disabled={votingId === item.id}
                        className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition shadow-xs"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Partially ({item.votes_partial})</span>
                      </button>

                      <button
                        onClick={() => handleVote(item.id, 'Still exists')}
                        disabled={votingId === item.id}
                        className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Still Exists ({item.votes_still_exists})</span>
                      </button>

                      {/* Admin Dispute Reopen Button */}
                      {(item.proof_status === 'Disputed / Escalated' || item.votes_still_exists >= 1) && (
                        <button
                          onClick={() => setReopenTarget(item)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-black transition shadow-xs flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                          <span>Admin Reopen</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Reopen Modal */}
      {reopenTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-civic-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-civic-border">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-civic-text">
                  Reopen Complaint for Official Re-Inspection
                </h3>
              </div>
              <button 
                onClick={() => setReopenTarget(null)}
                className="text-civic-muted hover:text-civic-text text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-civic-muted">
              Reference: <strong className="text-civic-text">{reopenTarget.complaint_reference}</strong> ({reopenTarget.title})
            </p>

            <form onSubmit={handleAdminReopen} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-civic-text mb-1">
                  Reason for Rejecting Resolution / Community Grievance Notice *
                </label>
                <textarea
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="Specify why the repair is defective or incomplete (e.g. Patch is sinking under bus traffic, cold-mix disintegrated after rain)..."
                  rows={3}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-civic-border focus:ring-2 focus:ring-civic-primary focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-civic-border rounded-xl text-[11px] text-civic-muted flex items-start gap-2">
                <Info className="w-4 h-4 text-civic-primary shrink-0 mt-0.5" />
                <span>
                  Authorizing officer: <strong>Dr. Anand Ramanathan, IAS (Municipal Commissioner)</strong>. 
                  The grievance will be returned to the department queue as <em>Reopened</em> with high audit priority.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReopenTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-civic-border text-civic-text hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReopening || !reopenReason.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm flex items-center gap-1.5"
                >
                  {isReopening ? 'Issuing Order...' : 'Confirm Reopen Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
