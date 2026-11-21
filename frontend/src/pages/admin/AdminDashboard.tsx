import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Search, Filter, ShieldAlert, CheckCircle2, 
  Clock, AlertTriangle, Building2, User, Eye, Check, X,
  Download, BrainCircuit, Briefcase, Compass, MapPin
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CivicApi } from '../../services/api';
import { Complaint, AdminStats } from '../../types';
import { useTranslation } from '../../i18n/translations';

const CATEGORY_COLORS: Record<string, string> = {
  Roads: '#DC2626',
  Sanitation: '#16A34A',
  Electrical: '#D97706',
  Water: '#2563EB',
  Drainage: '#7C3AED',
  Parks: '#059669',
  Other: '#64748B'
};

const DEPARTMENTS = [
  'Roads & Highways',
  'Sanitation & Waste Management',
  'Electrical & Street Lighting',
  'Water Supply & Sewerage',
  'Drainage & Flood Control',
  'Parks & Horticulture'
];

export const AdminDashboard: React.FC = () => {
  const { t, language } = useTranslation();
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

  const categoryCounts = ['Roads', 'Sanitation', 'Electrical', 'Water', 'Drainage', 'Parks'].map(cat => ({
    name: cat,
    count: complaints.filter(c => c.category === cat).length
  }));

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

  const handleExportCsv = async () => {
    await CivicApi.exportAuditCsv();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* 1. DISTINCT EXECUTIVE COMMAND BAR: Deep Forest Green (#12382C) */}
      <div className="bg-[#12382C] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold border border-emerald-700/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.adminBadge}</span>
              <span className="text-emerald-400">·</span>
              <span>Coimbatore City Corporation</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.adminTitle}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
              {t.adminSubtitle}
            </p>

            {/* Quick Command Navigation Tabs */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <span className="px-3 py-1.5 rounded-xl bg-[#167A4D] text-white text-xs font-bold shadow-xs">
                Command Console
              </span>

              <Link
                to="/officer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold transition"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Officer Execution</span>
              </Link>

              <Link
                to="/proof"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CivicProof Audits</span>
              </Link>

              <Link
                to="/pulse"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold transition"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>CivicPulse Radar</span>
              </Link>

              <Link
                to="/map"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold transition"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Live GIS</span>
              </Link>
            </div>
          </div>

          {/* Right Commissioner Badge & Audit Download */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-800/40 text-xs flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="font-bold text-white block">Dr. Anand Ramanathan, IAS</span>
                <span className="text-[10px] text-emerald-300">Municipal Commissioner • Active Session</span>
              </div>
            </div>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#167A4D] hover:bg-[#12603C] text-white text-xs font-bold transition shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportCsvBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE METRICS GRID (matching ArcGIS municipal dashboard) */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {t.totalGrievances}
            </span>
            <span className="font-black text-2xl text-slate-900 mt-1 block">
              {stats.total_complaints.toLocaleString()}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {t.inProgressCount}
            </span>
            <span className="font-black text-2xl text-blue-600 mt-1 block">
              {stats.in_progress}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {t.resolvedCount}
            </span>
            <span className="font-black text-2xl text-[#167A4D] mt-1 block">
              {stats.resolved}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {t.criticalUrgency}
            </span>
            <span className="font-black text-2xl text-red-600 mt-1 block">
              {stats.critical_count}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {t.resolutionRate}
            </span>
            <span className="font-black text-2xl text-[#167A4D] mt-1 block">
              {stats.resolution_rate_percent}%
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Active Wards
            </span>
            <span className="font-black text-2xl text-slate-900 mt-1 block">
              100 Wards
            </span>
          </div>
        </div>
      )}

      {/* 3. DEPARTMENT WORKLOAD DISTRIBUTION CHART */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            {language === 'ta' ? 'துறை வாரியாக நிலுவையில் உள்ள குறைகள்' : 'Departmental Grievance Distribution'}
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">
            Live Field Queue Allocation
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryCounts} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '11px' }} 
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {categoryCounts.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || '#167A4D'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. MUNICIPAL INCIDENT TABLE & DISPATCH CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-base text-slate-900">
              {language === 'ta' ? `அனைத்து புகார்கள் (${filtered.length})` : `Municipal Grievance Register (${filtered.length})`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live telemetry and department reassignment
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, street..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#167A4D]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="All">All Categories</option>
            {['Roads', 'Sanitation', 'Electrical', 'Water', 'Drainage', 'Parks'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="All">All Statuses</option>
            {['Reported', 'Assigned', 'In Progress', 'Resolved'].map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="All">All Priorities</option>
            {['Critical', 'High', 'Medium', 'Low'].map(pr => (
              <option key={pr} value={pr}>{pr}</option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Grievance Headline</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Ward</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-[#167A4D]">
                    {c.complaint_reference}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate" title={c.title}>
                    {c.title}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ backgroundColor: `${CATEGORY_COLORS[c.category]}15`, color: CATEGORY_COLORS[c.category] }}>
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {c.locality_name || 'Central'} (W-{c.ward_number || 70})
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      c.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium">
                    {c.department_name || 'Unassigned'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Resolved' ? 'bg-[#E8F4EC] text-[#167A4D]' :
                      c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    {c.status !== 'Resolved' && (
                      <button
                        onClick={() => {
                          setAssignModalComplaint(c);
                          setSelectedDept(c.department_name || DEPARTMENTS[0]);
                        }}
                        className="px-2.5 py-1 bg-[#12382C] hover:bg-black text-white rounded-lg text-[11px] font-bold transition shadow-2xs"
                      >
                        Reassign
                      </button>
                    )}
                    <Link
                      to={`/track?ref=${c.complaint_reference}`}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition shadow-2xs inline-block"
                    >
                      Audit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Reassignment Modal */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Department Squad Reassignment
              </h3>
              <button 
                onClick={() => setAssignModalComplaint(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Reassigning ticket <strong className="text-slate-900">{assignModalComplaint.complaint_reference}</strong>
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Responsible Municipal Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-semibold"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Assigned Executive Engineer
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Dispatch Directive / Work Order
                </label>
                <textarea
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  placeholder="e.g. Deploy emergency pothole crew within 4 hours..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#167A4D] hover:bg-[#12603C] text-white shadow-2xs"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
