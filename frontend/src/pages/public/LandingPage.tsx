import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, ArrowRight, CheckCircle2, Sparkles, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { CoimbatoreMap } from '../../components/map/CoimbatoreMap';
import { CivicApi } from '../../services/api';
import { MapMarkerItem, HotspotItem, AdminStats } from '../../types';

export const LandingPage: React.FC = () => {
  const [markers, setMarkers] = useState<MapMarkerItem[]>([]);
  const [hotspots, setHotspots] = useState<HotspotItem[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total_complaints: 1284,
    new_reported: 210,
    under_review: 145,
    assigned: 198,
    in_progress: 312,
    resolved: 912,
    critical_count: 18,
    resolution_rate_percent: 71,
    avg_resolution_days: 3.2
  });
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerItem | null>(null);

  useEffect(() => {
    async function loadData() {
      const [markersData, hotspotsData, statsData] = await Promise.all([
        CivicApi.getMapComplaints(),
        CivicApi.getHotspots(),
        CivicApi.getAdminStats()
      ]);
      setMarkers(markersData);
      setHotspots(hotspotsData);
      setStats(statsData);
      if (markersData.length > 0) {
        setSelectedMarker(markersData[0]);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Editorial Marquee Strip */}
      <div className="border-b border-civic-border overflow-hidden py-2 bg-civic-surface/60 text-xs text-civic-muted">
        <div className="flex space-x-8 animate-marquee whitespace-nowrap">
          <span>Potholes patched across Avinashi Road · Streetlights restored in Peelamedu · Stormwater culverts cleared in Ukkadam · Water leak repaired in RS Puram · Every grievance verified on-site · 100 Wards Covered</span>
          <span>Potholes patched across Avinashi Road · Streetlights restored in Peelamedu · Stormwater culverts cleared in Ukkadam · Water leak repaired in RS Puram · Every grievance verified on-site · 100 Wards Covered</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-soft border border-civic-brand/10 text-xs font-semibold text-civic-brand">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coimbatore Civic Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-civic-text leading-[1.08] tracking-tight">
              Your city. <br />
              <span className="font-editorial italic font-normal text-civic-brand">Your voice.</span> <br />
              Your impact.
            </h1>

            <p className="text-base sm:text-lg text-civic-muted max-w-xl leading-relaxed">
              Report civic problems, track their progress and help build a better Coimbatore through intelligent civic technology. Powered by Google Gemini AI triage and live GIS mapping.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-civic-brand text-white font-medium text-sm hover:bg-civic-brand-hover transition shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Report an Issue</span>
              </Link>

              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-civic-surface text-civic-text border border-civic-border font-medium text-sm hover:bg-civic-soft transition"
              >
                <MapPin className="w-4 h-4 text-civic-brand" />
                <span>Explore Live Map</span>
              </Link>
            </div>
          </div>

          {/* Real Statistics Card Grid */}
          <div className="lg:col-span-5">
            <div className="bg-civic-surface border border-civic-border rounded-2xl p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-civic-border pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-civic-muted">
                  Corporation Performance
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live City Metrics
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="font-display font-bold text-3xl sm:text-4xl text-civic-text block">
                    {stats.total_complaints.toLocaleString()}
                  </span>
                  <span className="text-xs text-civic-muted mt-1 block">
                    Grievances registered
                  </span>
                </div>

                <div>
                  <span className="font-display font-bold text-3xl sm:text-4xl text-civic-resolved block">
                    {stats.resolution_rate_percent}%
                  </span>
                  <span className="text-xs text-civic-muted mt-1 block">
                    Resolution rate
                  </span>
                </div>

                <div>
                  <span className="font-display font-bold text-3xl sm:text-4xl text-civic-text block">
                    {stats.avg_resolution_days} <span className="text-base font-normal text-civic-muted">days</span>
                  </span>
                  <span className="text-xs text-civic-muted mt-1 block">
                    Median fix time
                  </span>
                </div>

                <div>
                  <span className="font-display font-bold text-3xl sm:text-4xl text-civic-brand block">
                    100
                  </span>
                  <span className="text-xs text-civic-muted mt-1 block">
                    Wards actively covered
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-civic-border text-xs text-civic-muted flex items-center justify-between">
                <span>Verified through municipal audit logs</span>
                <Link to="/analytics" className="font-semibold text-civic-brand hover:underline flex items-center gap-1">
                  <span>View Analytics</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-civic-brand">
                Interactive GIS Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-civic-text mt-1">
                Live Coimbatore Grievance Map
              </h2>
              <p className="text-sm text-civic-muted mt-1">
                Every pin represents a tracked public grievance. Filter by category, tap any marker to inspect resolution timeline.
              </p>
            </div>
            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-civic-brand hover:underline"
            >
              <span>Launch Full GIS Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className="lg:col-span-8">
            <CoimbatoreMap
              markers={markers}
              hotspots={hotspots}
              selectedComplaintId={selectedMarker?.id}
              onSelectComplaint={(m) => setSelectedMarker(m)}
            />
          </div>

          {/* Selected Complaint Detail Card */}
          <div className="lg:col-span-4">
            <div className="bg-civic-surface border border-civic-border rounded-xl p-5 shadow-card h-full flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-civic-border pb-3 mb-3">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-civic-soft text-civic-brand">
                    {selectedMarker?.reference || 'CR-2026-00001'}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    selectedMarker?.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    selectedMarker?.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedMarker?.status || 'In Progress'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-civic-text leading-snug">
                  {selectedMarker?.title || 'Deep crater pothole with standing water'}
                </h3>

                <p className="text-xs text-civic-muted mt-1.5">
                  {selectedMarker?.address || 'Near Central Bus Stand Gate 2, Gandhipuram, Coimbatore 641012'}
                </p>

                <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-civic-border text-xs">
                  <div>
                    <span className="text-civic-muted block text-[10px] uppercase">Category</span>
                    <span className="font-semibold text-civic-text">{selectedMarker?.category || 'Roads'}</span>
                  </div>
                  <div>
                    <span className="text-civic-muted block text-[10px] uppercase">Priority</span>
                    <span className="font-semibold text-civic-critical">{selectedMarker?.priority || 'High'}</span>
                  </div>
                  <div>
                    <span className="text-civic-muted block text-[10px] uppercase">Department</span>
                    <span className="font-semibold text-civic-text">{selectedMarker?.department || 'Roads Department'}</span>
                  </div>
                  <div>
                    <span className="text-civic-muted block text-[10px] uppercase">Community Backing</span>
                    <span className="font-semibold text-civic-text">{selectedMarker?.supports_count || 14} citizens</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-civic-text block">Resolution Progress</span>
                  <div className="space-y-1.5 text-xs text-civic-muted">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-civic-resolved" />
                      <span>Reported & verified via Civic AI triage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-civic-resolved" />
                      <span>Department engineer dispatched</span>
                    </div>
                    <div className="flex items-center gap-2 text-civic-brand font-medium">
                      <Clock className="w-3.5 h-3.5 text-civic-brand" />
                      <span>Active on-site rectification</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-civic-border">
                <Link
                  to={`/track?ref=${selectedMarker?.reference || 'CR-2026-00001'}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-civic-brand text-white font-medium text-xs hover:bg-civic-brand-hover transition shadow-xs"
                >
                  <span>Track Full Case History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-civic-primary">
            Intelligent Civic Architecture
          </span>
          <h2 className="text-3xl font-display font-extrabold text-civic-text mt-1">
            How CivicResolve Operates
          </h2>
          <p className="text-sm text-civic-muted mt-2">
            A frictionless feedback loop connecting Coimbatore citizens directly with municipal execution teams and predictive intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-civic-border shadow-xs space-y-2">
            <span className="text-xl font-display font-bold text-civic-primary/40">01</span>
            <h3 className="font-bold text-sm text-civic-text">Citizen Reports</h3>
            <p className="text-xs text-civic-muted leading-relaxed">
              Describe in English or தமிழ். Pin location on live Coimbatore map with photos.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-civic-border shadow-xs space-y-2">
            <span className="text-xl font-display font-bold text-civic-primary/40">02</span>
            <h3 className="font-bold text-sm text-civic-text">Civic AI Triage</h3>
            <p className="text-xs text-civic-muted leading-relaxed">
              GenAI classifies department, explains urgency score (1-100), and flags duplicates.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-civic-border shadow-xs space-y-2">
            <span className="text-xl font-display font-bold text-civic-primary/40">03</span>
            <h3 className="font-bold text-sm text-civic-text">Field Dispatch</h3>
            <p className="text-xs text-civic-muted leading-relaxed">
              Assigned directly to ward engineers with SLA timers and live audit trails.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-civic-border shadow-xs space-y-2">
            <span className="text-xl font-display font-bold text-civic-primary/40">04</span>
            <h3 className="font-bold text-sm text-civic-text">Officer Repair</h3>
            <p className="text-xs text-civic-muted leading-relaxed">
              Field crews complete repairs, recording technical notes and after-photo evidence.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-2">
            <span className="text-xl font-display font-bold text-emerald-600/50">05</span>
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-1">
              CivicProof Audit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Community audits before/after photos and votes whether work is genuinely resolved.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs space-y-2">
            <span className="text-xl font-display font-bold text-civic-primary/50">06</span>
            <h3 className="font-bold text-sm text-civic-primary flex items-center gap-1">
              CivicPulse Radar
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Poisson modeling forecasts infrastructure failure hotspots before breakdowns occur.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
