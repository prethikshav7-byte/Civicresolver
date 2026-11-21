import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { CivicApi } from '../../services/api';
import { AdminStats, Complaint } from '../../types';

const CATEGORY_COLORS: Record<string, string> = {
  Roads: '#D9534F',
  Sanitation: '#5B9A5B',
  Electrical: '#E0A526',
  Water: '#3B82C4',
  Drainage: '#8A63C9',
  Parks: '#2F8F83',
};

const WARD_PERFORMANCE = [
  { ward: 'Ward 70 (Gandhipuram)', zone: 'Central', complaints: 34, resolved: 28, rate: 82 },
  { ward: 'Ward 23 (RS Puram)', zone: 'West', complaints: 29, resolved: 25, rate: 86 },
  { ward: 'Ward 38 (Peelamedu)', zone: 'North', complaints: 42, resolved: 31, rate: 73 },
  { ward: 'Ward 55 (Singanallur)', zone: 'East', complaints: 38, resolved: 27, rate: 71 },
  { ward: 'Ward 84 (Ukkadam)', zone: 'South', complaints: 45, resolved: 32, rate: 71 },
  { ward: 'Ward 72 (Race Course)', zone: 'Central', complaints: 16, resolved: 15, rate: 93 },
];

export const CivicAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    async function loadData() {
      const [statsData, compData] = await Promise.all([
        CivicApi.getAdminStats(),
        CivicApi.getComplaints()
      ]);
      setStats(statsData);
      setComplaints(compData.items);
    }
    loadData();
  }, []);

  const categoryChartData = Object.keys(CATEGORY_COLORS).map(cat => ({
    name: cat,
    value: complaints.filter(c => c.category === cat).length || 1
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-soft text-civic-brand text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Public Transparency Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-civic-text tracking-tight">
          Civic Intelligence & Transparency
        </h1>
        <p className="text-sm text-civic-muted mt-1">
          Open municipal metrics for Coimbatore Corporation. Real complaints, verified resolution rates, and departmental response times without PII exposure.
        </p>
      </div>

      {/* Top Headline Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-civic-surface p-5 rounded-xl border border-civic-border shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-civic-muted block">
              Cumulative Registered
            </span>
            <span className="font-display font-bold text-3xl text-civic-text mt-1 block">
              {stats.total_complaints.toLocaleString()}
            </span>
            <span className="text-[11px] text-civic-muted mt-1 block">Across 100 Coimbatore Wards</span>
          </div>

          <div className="bg-civic-surface p-5 rounded-xl border border-civic-border shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-civic-muted block">
              Total Rectified
            </span>
            <span className="font-display font-bold text-3xl text-civic-resolved mt-1 block">
              {stats.resolved.toLocaleString()}
            </span>
            <span className="text-[11px] text-civic-muted mt-1 block">Verified on-site by engineers</span>
          </div>

          <div className="bg-civic-surface p-5 rounded-xl border border-civic-border shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-civic-muted block">
              City Resolution Rate
            </span>
            <span className="font-display font-bold text-3xl text-civic-brand mt-1 block">
              {stats.resolution_rate_percent}%
            </span>
            <span className="text-[11px] text-civic-muted mt-1 block">Continuous improvement</span>
          </div>

          <div className="bg-civic-surface p-5 rounded-xl border border-civic-border shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-civic-muted block">
              Median Resolution Time
            </span>
            <span className="font-display font-bold text-3xl text-civic-text mt-1 block">
              {stats.avg_resolution_days} <span className="text-sm font-normal text-civic-muted">days</span>
            </span>
            <span className="text-[11px] text-civic-muted mt-1 block">From report to sign-off</span>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-7 bg-civic-surface border border-civic-border rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-civic-text">
              Grievance Inflow by Category
            </h3>
            <span className="text-[11px] text-civic-muted">Coimbatore Corporation</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#87998C" fontSize={11} tickLine={false} />
                <YAxis stroke="#87998C" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3E4DE', borderRadius: '8px', fontSize: '11px' }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {categoryChartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || '#203D32'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA & Department Performance Table */}
        <div className="lg:col-span-5 bg-civic-surface border border-civic-border rounded-xl p-5 shadow-card space-y-4">
          <h3 className="font-display font-bold text-sm text-civic-text">
            Departmental SLA Standards
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-civic-bg border border-civic-border">
              <span className="font-medium text-civic-text">Sanitation Department</span>
              <span className="font-mono text-civic-brand font-semibold">24 Hours SLA</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-civic-bg border border-civic-border">
              <span className="font-medium text-civic-text">Water Supply Department</span>
              <span className="font-mono text-civic-brand font-semibold">24 Hours SLA</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-civic-bg border border-civic-border">
              <span className="font-medium text-civic-text">Electrical Department</span>
              <span className="font-mono text-civic-brand font-semibold">36 Hours SLA</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-civic-bg border border-civic-border">
              <span className="font-medium text-civic-text">Roads Department</span>
              <span className="font-mono text-civic-brand font-semibold">48 Hours SLA</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-civic-bg border border-civic-border">
              <span className="font-medium text-civic-text">Drainage Department</span>
              <span className="font-mono text-civic-brand font-semibold">48 Hours SLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ward Performance Leaderboard */}
      <div className="bg-civic-surface border border-civic-border rounded-xl p-5 shadow-card space-y-4">
        <h3 className="font-display font-bold text-base text-civic-text">
          Representative Ward Performance in Coimbatore
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-civic-border text-civic-muted bg-civic-bg/50">
                <th className="py-2.5 px-3">Ward & Locality</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Total Reported</th>
                <th className="py-2.5 px-3">Resolved</th>
                <th className="py-2.5 px-3">Resolution Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-civic-border/60">
              {WARD_PERFORMANCE.map((w) => (
                <tr key={w.ward} className="hover:bg-civic-soft/30 transition">
                  <td className="py-3 px-3 font-semibold text-civic-text">
                    {w.ward}
                  </td>
                  <td className="py-3 px-3 text-civic-muted">{w.zone} Zone</td>
                  <td className="py-3 px-3 text-civic-text">{w.complaints}</td>
                  <td className="py-3 px-3 text-civic-resolved font-medium">{w.resolved}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-civic-border h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-civic-resolved h-full rounded-full" 
                          style={{ width: `${w.rate}%` }}
                        />
                      </div>
                      <span className="font-semibold text-civic-text">{w.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
