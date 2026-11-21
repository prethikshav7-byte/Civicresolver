import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, TrendingUp, ShieldAlert, CheckCircle2, 
  MapPin, Clock, BrainCircuit, Sparkles, Building2, Layers, Compass
} from 'lucide-react';
import { CivicApi } from '../../services/api';
import { CivicPulseOverview, PredictiveHotspotItem, RecurringClusterItem } from '../../types';

export const CivicPulsePage: React.FC = () => {
  const [pulseData, setPulseData] = useState<CivicPulseOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'predictive' | 'recurring' | 'backlog'>('predictive');

  useEffect(() => {
    const fetchPulse = async () => {
      setLoading(true);
      const data = await CivicApi.getPulseOverview();
      setPulseData(data);
      setLoading(false);
    };
    fetchPulse();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-civic-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-civic-primary text-xs font-semibold mb-3 border border-blue-100">
              <BrainCircuit className="w-4 h-4 text-civic-primary" />
              <span>Predictive GovTech Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-civic-text tracking-tight">
              CivicPulse: Predictive Infrastructure Radar
            </h1>
            <p className="text-sm text-civic-muted mt-1 max-w-2xl leading-relaxed">
              Moving municipal governance from reactive complaint-handling to proactive failure prevention. 
              CivicPulse synthesizes multi-year incident density, monsoon hydrology, and pavement fatigue to forecast urban failures before citizens suffer.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-civic-bg p-4 rounded-xl border border-civic-border shrink-0 self-start">
            <div className="text-center px-3 border-r border-civic-border">
              <div className="text-2xl font-bold text-civic-primary">1,420</div>
              <div className="text-[11px] text-civic-muted uppercase font-medium">Incidents Mapped</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-bold text-amber-600">88%</div>
              <div className="text-[11px] text-civic-muted uppercase font-medium">Max Forecast Risk</div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-civic-border">
          <button
            onClick={() => setActiveTab('predictive')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'predictive'
                ? 'bg-civic-primary text-white shadow-xs'
                : 'bg-civic-bg text-civic-muted hover:text-civic-text'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Predictive Hotspot Forecasts (3)
          </button>
          <button
            onClick={() => setActiveTab('recurring')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'recurring'
                ? 'bg-civic-primary text-white shadow-xs'
                : 'bg-civic-bg text-civic-muted hover:text-civic-text'
            }`}
          >
            <Layers className="w-4 h-4" />
            Chronic Failure Clusters (4)
          </button>
          <button
            onClick={() => setActiveTab('backlog')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'backlog'
                ? 'bg-civic-primary text-white shadow-xs'
                : 'bg-civic-bg text-civic-muted hover:text-civic-text'
            }`}
          >
            <Activity className="w-4 h-4" />
            Department Backlog Telemetry
          </button>
        </div>
      </div>

      {loading || !pulseData ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-civic-border">
          <div className="w-8 h-8 border-4 border-civic-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-civic-muted">Computing spatio-temporal Poisson regressions...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: PREDICTIVE FORECASTS */}
          {activeTab === 'predictive' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-civic-text">
                    Forecasted Infrastructure Vulnerabilities
                  </h2>
                  <p className="text-xs text-civic-muted">
                    Pre-emptive intervention targets generated using mathematical models with transparent methodology.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-50 text-civic-primary border border-blue-200">
                  Model: Poisson Spatio-Temporal v2.4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pulseData.predictive_hotspots.map((item) => {
                  const riskColor = 
                    item.risk_probability_percent >= 80 ? 'text-red-600' :
                    item.risk_probability_percent >= 70 ? 'text-amber-600' : 'text-blue-600';
                  
                  const riskBg = 
                    item.risk_probability_percent >= 80 ? 'bg-red-50 border-red-200' :
                    item.risk_probability_percent >= 70 ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200';

                  return (
                    <div 
                      key={item.hotspot_id}
                      className="bg-white border border-civic-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
                    >
                      <div>
                        {/* Header Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-civic-muted">
                            <MapPin className="w-3.5 h-3.5 text-civic-primary" />
                            {item.locality_name} (Ward {item.ward_number})
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${riskBg} ${riskColor}`}>
                            {item.risk_probability_percent}% Risk
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-civic-text mb-2">
                          {item.predicted_issue_type}
                        </h3>

                        <div className="text-xs text-civic-muted mb-3 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-civic-muted" />
                          <span>Window: <strong>{item.forecast_window}</strong></span>
                        </div>

                        {/* Trigger Factors */}
                        <div className="space-y-1.5 mb-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-civic-muted block">
                            Key Sensor & Model Triggers:
                          </span>
                          {item.trigger_factors.map((tf, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-civic-text">
                              <span className="text-amber-500 font-bold shrink-0">•</span>
                              <span>{tf}</span>
                            </div>
                          ))}
                        </div>

                        {/* Recommended Action */}
                        <div className="p-3 bg-civic-bg rounded-xl border border-civic-border mb-3">
                          <span className="text-[10px] font-bold text-civic-primary uppercase tracking-wider block mb-1">
                            Recommended Pre-emptive Action:
                          </span>
                          <p className="text-xs text-civic-text leading-relaxed">
                            {item.recommended_preventive_action}
                          </p>
                        </div>
                      </div>

                      {/* Methodology Footer */}
                      <div className="pt-3 border-t border-civic-border text-[10px] text-civic-muted">
                        <span className="font-semibold text-civic-text">Methodology:</span> {item.methodology}
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          <span>Confidence: <strong>{item.confidence_level}</strong></span>
                          <span className="text-civic-primary font-semibold">Priority Action</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: RECURRING CHRONIC CLUSTERS */}
          {activeTab === 'recurring' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-civic-text">
                  Chronic Infrastructure Breakdown Clusters
                </h2>
                <p className="text-xs text-civic-muted">
                  Municipal assets requiring structural redesign or capital replacement rather than short-term patches.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pulseData.recurring_clusters.map((cluster) => (
                  <div 
                    key={cluster.cluster_id}
                    className="bg-white border border-civic-border rounded-2xl p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-civic-primary">
                            Cluster #{cluster.cluster_id}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-semibold">
                            {cluster.recurrence_count} Repeat Grievances
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-civic-text">
                          {cluster.locality_name} (Ward {cluster.ward_number})
                        </h3>
                        <p className="text-xs font-medium text-amber-700 mt-0.5">
                          {cluster.primary_issue}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-civic-text">Asset Age</div>
                        <div className="text-sm font-semibold text-civic-muted">{cluster.infrastructure_age_years} Years</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-civic-border rounded-xl">
                      <span className="text-[11px] font-bold text-civic-text uppercase tracking-wider block mb-1">
                        Root-Cause AI Diagnostic:
                      </span>
                      <p className="text-xs text-civic-text leading-relaxed">
                        "{cluster.ai_pattern_analysis}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-civic-muted pt-2 border-t border-civic-border">
                      <span>First logged: {cluster.first_reported}</span>
                      <span>Latest recurrence: {cluster.latest_reported}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DEPARTMENT BACKLOG TELEMETRY */}
          {activeTab === 'backlog' && (
            <div className="bg-white border border-civic-border rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-civic-text">
                  Departmental SLA Backlog Telemetry
                </h2>
                <p className="text-xs text-civic-muted">
                  Live operational capacity, active field squads, and resolution turnaround across Coimbatore municipal wings.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-civic-muted font-bold uppercase tracking-wider border-b border-civic-border">
                    <tr>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Open Incidents</th>
                      <th className="py-3 px-4">SLA Breaches</th>
                      <th className="py-3 px-4">Avg Resolution Time</th>
                      <th className="py-3 px-4">Active Field Squads</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-civic-border">
                    {pulseData.department_backlogs.map((dept, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4 font-bold text-civic-text flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-civic-primary" />
                          {dept.department}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-civic-text">{dept.open_count}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            dept.sla_breached_count > 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {dept.sla_breached_count} Overdue
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-civic-muted">{dept.avg_resolution_days} Days</td>
                        <td className="py-3.5 px-4 font-semibold text-civic-primary">{dept.active_squads} Crews Deployed</td>
                        <td className="py-3.5 px-4">
                          {dept.sla_breached_count === 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5" /> Lagging
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
