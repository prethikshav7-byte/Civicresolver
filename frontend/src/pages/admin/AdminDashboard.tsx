import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Search, Filter, ShieldAlert, CheckCircle2, 
  Clock, AlertTriangle, Building2, User, Eye, Check, X, ArrowUpDown 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CivicApi } from '../../services/api';
import { Complaint, AdminStats } from '../../types';

const CATEGORY_COLORS: Record<string, string> = {
  Roads: '#D9534F',
  Sanitation: '#5B9A5B',
  Electrical: '#E0A526',
  Water: '#3B82C4',
  Drainage: '#8A63C9',
  Parks: '#2F8F83',
  Other: '#68736E'
};

const DEPARTMENTS = [
  'Roads Department',
  'Sanitation Department',
  'Electrical Department',
  'Water Supply Department',
  'Drainage Department',
  'Parks & Horticulture'
];

export const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals state
  const [assignModalComplaint, setAssignModalComplaint] = useState<Complaint | null>(null);
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [officerName, setOfficerName] = useState('Er. Vigneshwaran K.');
  const [assignInstructions, setAssignInstructions] = useState('');

  const [resolveModalComplaint, setResolveModalComplaint] = useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolveOfficer, setResolveOfficer] = useState('Er. Vigneshwaran K.');

  const loadAdminData = async () => {
    const [compData, statsData] = await Promise.all([
      CivicApi.getComplaints(),
      CivicApi.getAdminStats()
    ]);
    setComplaints(compData.items);
    setStats(statsData);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Filter complaints
  const filtered = complaints.filter(c => {
    const matchCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.complaint_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchPriority && matchSearch;
  });

  // Calculate Chart Data
  const categoryCounts = ['Roads', 'Sanitation', 'Electrical', 'Water', 'Drainage', 'Parks'].map(cat => ({
    name: cat,
    count: complaints.filter(c => c.category === cat).length
  }));

  // Handle Department Assignment
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalComplaint) return;
    await CivicApi.assignDepartment(
      assignModalComplaint.complaint_reference,
      selectedDept,
      officerName,
      assignInstructions || `Allocated to ${selectedDept}`
    );
    setAssignModalComplaint(null);
    setAssignInstructions('');
    await loadAdminData();
  };

  // Handle Resolution
  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveModalComplaint || !resolutionNotes.trim()) return;
    await CivicApi.resolveComplaint(
      resolveModalComplaint.complaint_reference,
      resolutionNotes,
      resolveOfficer
    );
    setResolveModalComplaint(null);
    setResolutionNotes('');
    await loadAdminData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-soft text-civic-brand text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Coimbatore Corporation Control Room</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-civic-text tracking-tight">
            Municipal Administration Portal
          </h1>
          <p className="text-xs text-civic-muted mt-1">
            Authoritative triage, departmental assignment, officer dispatch and resolution verification.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-civic-surface border border-civic-border text-xs flex items-center gap-3 shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-left">
            <span className="font-semibold text-civic-text block">Live Municipal Feed</span>
            <span className="text-[10px] text-civic-muted">Dr. Anand Ramanathan, IAS (Commissioner)</span>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-civic-surface p-4 rounded-xl border border-civic-border shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-civic-muted block">Total Filed</span>
            <span className="font-display font-bold text-2xl text-civic-text mt-1 block">{stats.total_complaints}</span>
          </div>
          <div className="bg-civic-surface p-4 rounded-xl border border-civic-border shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-civic-muted block">New Reported</span>
            <span className="font-display font-bold text-2xl text-amber-600 mt-1 block">{stats.new_reported}</span>
          </div>
          <div className="bg-civic-surface p-4 rounded-xl border border-civic-border shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-civic-muted block">In Progress</span>
            <span className="font-display font-bold text-2xl text-blue-600 mt-1 block">{stats.in_progress}</span>
          </div>
          <div className="bg-civic-surface p-4 rounded-xl border border-civic-border shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-civic-muted block">Resolved</span>
            <span className="font-display font-bold text-2xl text-civic-resolved mt-1 block">{stats.resolved}</span>
          </div>
          <div className="bg-civic-surface p-4 rounded-xl border border-civic-border shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-civic-muted block">Critical Urgency</span>
            <span className="font-display font-bold text-2xl text-civic-critical mt-1 block">{stats.critical_count}</span>
          </div>
          <div className="bg-civic-surface p-4 rounded-xl border border-civic-border shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-civic-muted block">Resolution Rate</span>
            <span className="font-display font-bold text-2xl text-civic-brand mt-1 block">{stats.resolution_rate_percent}%</span>
          </div>
        </div>
      )}

      {/* Category Chart Section */}
      <div className="bg-civic-surface border border-civic-border rounded-xl p-5 shadow-card space-y-4">
        <h3 className="font-display font-bold text-sm text-civic-text">
          Grievance Distribution Across Departments (Coimbatore Corporation)
        </h3>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryCounts} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#87998C" fontSize={11} tickLine={false} />
              <YAxis stroke="#87998C" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3E4DE', borderRadius: '8px', fontSize: '11px' }} 
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {categoryCounts.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || '#203D32'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complaint Management Table */}
      <div className="bg-civic-surface border border-civic-border rounded-xl shadow-card overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-display font-bold text-base text-civic-text">
            All Municipal Grievances ({filtered.length})
          </h3>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-civic-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ref, keyword, street..."
              className="w-full pl-9 pr-3 py-1.5 bg-civic-bg border border-civic-border rounded-lg text-xs text-civic-text focus:outline-none focus:border-civic-brand"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-civic-muted text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-civic-bg border border-civic-border rounded px-2 py-1 text-xs"
            >
              <option value="All">All Categories</option>
              {['Roads', 'Sanitation', 'Electrical', 'Water', 'Drainage', 'Parks'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-civic-muted text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-civic-bg border border-civic-border rounded px-2 py-1 text-xs"
            >
              <option value="All">All Statuses</option>
              {['Reported', 'Assigned', 'In Progress', 'Resolved'].map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-civic-muted text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-civic-bg border border-civic-border rounded px-2 py-1 text-xs"
            >
              <option value="All">All Priorities</option>
              {['Critical', 'High', 'Medium', 'Low'].map(pr => (
                <option key={pr} value={pr}>{pr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-civic-border text-civic-muted font-medium bg-civic-bg/50">
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Grievance Title</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Location / Ward</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-civic-border/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-civic-soft/30 transition">
                  <td className="py-3 px-3 font-mono font-semibold text-civic-brand">
                    {c.complaint_reference}
                  </td>
                  <td className="py-3 px-3 font-medium text-civic-text max-w-xs truncate" title={c.title}>
                    {c.title}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${CATEGORY_COLORS[c.category]}15`, color: CATEGORY_COLORS[c.category] }}>
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-civic-muted">
                    {c.locality_name || 'Central'} (W-{c.ward_number || 70})
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      c.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-civic-text font-medium">
                    {c.department_name || 'Unassigned'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    {c.status !== 'Resolved' && (
                      <>
                        <button
                          onClick={() => {
                            setAssignModalComplaint(c);
                            setSelectedDept(c.department_name || DEPARTMENTS[0]);
                          }}
                          className="px-2.5 py-1 rounded bg-civic-bg hover:bg-civic-soft border border-civic-border text-civic-brand text-[11px] font-medium transition"
                        >
                          Assign Dept
                        </button>
                        <button
                          onClick={() => {
                            setResolveModalComplaint(c);
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition"
                        >
                          Verify & Resolve
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Assign Modal */}
      {assignModalComplaint && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-civic-surface border border-civic-border rounded-2xl p-6 max-w-md w-full shadow-panel space-y-4">
            <div className="flex items-center justify-between border-b border-civic-border pb-3">
              <h3 className="font-display font-bold text-sm text-civic-text">
                Assign Department & Officer
              </h3>
              <button onClick={() => setAssignModalComplaint(null)} className="text-civic-muted hover:text-civic-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-civic-muted">
              Grievance: <span className="font-semibold text-civic-text">{assignModalComplaint.complaint_reference}</span> - {assignModalComplaint.title}
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-civic-text mb-1.5">Target Department *</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 bg-civic-bg border border-civic-border rounded-lg text-xs"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-civic-text mb-1.5">Responsible Officer *</label>
                <input
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 bg-civic-bg border border-civic-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-civic-text mb-1.5">Dispatch Instructions</label>
                <textarea
                  rows={2}
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  placeholder="e.g. Inspect site immediately and dispatch bitumen repair vehicle"
                  className="w-full px-3 py-2 bg-civic-bg border border-civic-border rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="px-4 py-2 rounded-lg bg-civic-bg border border-civic-border font-medium text-civic-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-civic-brand text-white font-semibold hover:bg-civic-brand-hover"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolution Verification Modal */}
      {resolveModalComplaint && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-civic-surface border border-civic-border rounded-2xl p-6 max-w-md w-full shadow-panel space-y-4">
            <div className="flex items-center justify-between border-b border-civic-border pb-3">
              <h3 className="font-display font-bold text-sm text-civic-text">
                Verify & Record Grievance Resolution
              </h3>
              <button onClick={() => setResolveModalComplaint(null)} className="text-civic-muted hover:text-civic-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-civic-muted">
              Closing <span className="font-semibold text-civic-text">{resolveModalComplaint.complaint_reference}</span> with municipal audit sign-off.
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-civic-text mb-1.5">Verifying Officer Name *</label>
                <input
                  type="text"
                  required
                  value={resolveOfficer}
                  onChange={(e) => setResolveOfficer(e.target.value)}
                  className="w-full px-3 py-2 bg-civic-bg border border-civic-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-civic-text mb-1.5">Resolution Description & Rectification Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail work performed: e.g. Hot mix bitumen patch completed across 4 sq.m cavity, compaction rolled and tested."
                  className="w-full px-3 py-2 bg-civic-bg border border-civic-border rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalComplaint(null)}
                  className="px-4 py-2 rounded-lg bg-civic-bg border border-civic-border font-medium text-civic-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Verify & Mark Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
