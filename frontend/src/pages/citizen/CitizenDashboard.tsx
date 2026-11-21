import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Clock, CheckCircle2, AlertTriangle, ArrowRight, MapPin, ThumbsUp } from 'lucide-react';
import { CivicApi } from '../../services/api';
import { Complaint } from '../../types';

export const CitizenDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<'All' | 'Reported' | 'In Progress' | 'Resolved'>('All');

  useEffect(() => {
    async function loadComplaints() {
      const data = await CivicApi.getComplaints();
      setComplaints(data.items);
    }
    loadComplaints();
  }, []);

  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const filtered = filter === 'All' 
    ? complaints 
    : filter === 'In Progress' 
    ? complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned')
    : complaints.filter(c => c.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-soft text-civic-brand text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Citizen Grievance Workspace</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-civic-text tracking-tight">
            Namaskaram, Priya Sundaram
          </h1>
          <p className="text-xs text-civic-muted mt-1">
            Ward 70 · Gandhipuram Central · Coimbatore Corporation
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-civic-brand text-white font-semibold text-xs hover:bg-civic-brand-hover transition shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Grievance</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-civic-surface p-5 rounded-xl border border-civic-border shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-civic-muted block">
            Total Filed Grievances
          </span>
          <span className="font-display font-bold text-3xl text-civic-text mt-1 block">
            {totalCount}
          </span>
          <span className="text-[11px] text-civic-muted mt-1 block">All registered in Coimbatore</span>
        </div>

        <div className="bg-civic-surface p-5 rounded-xl border border-civic-border shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-civic-muted block">
            Active / In Progress
          </span>
          <span className="font-display font-bold text-3xl text-civic-warning mt-1 block">
            {inProgressCount}
          </span>
          <span className="text-[11px] text-civic-muted mt-1 block">Under municipal field action</span>
        </div>

        <div className="bg-civic-surface p-5 rounded-xl border border-civic-border shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-civic-muted block">
            Resolved & Verified
          </span>
          <span className="font-display font-bold text-3xl text-civic-resolved mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-[11px] text-civic-muted mt-1 block">Closed with official proof</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 border-b border-civic-border pb-3">
        {(['All', 'Reported', 'In Progress', 'Resolved'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              filter === tab
                ? 'bg-civic-brand text-white shadow-xs'
                : 'bg-civic-surface text-civic-text hover:bg-civic-soft border border-civic-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filtered.map(c => (
          <div
            key={c.id}
            className="bg-civic-surface border border-civic-border rounded-xl p-5 hover:border-civic-brand/40 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-civic-soft text-civic-brand">
                  {c.complaint_reference}
                </span>
                <span className="text-xs font-medium text-civic-muted">
                  {c.category}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {c.status}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm text-civic-text">
                {c.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-civic-muted">
                <MapPin className="w-3 h-3 text-civic-brand" />
                <span>{c.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right text-xs text-civic-muted hidden sm:block">
                <span>Priority: </span>
                <span className="font-semibold text-civic-critical">{c.priority}</span>
                <span className="block text-[10px]">
                  {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <Link
                to={`/track?ref=${c.complaint_reference}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-civic-bg hover:bg-civic-soft border border-civic-border text-xs font-medium text-civic-brand transition"
              >
                <span>Track</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
