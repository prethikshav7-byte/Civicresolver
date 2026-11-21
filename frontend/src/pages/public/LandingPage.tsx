import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { CoimbatoreMap } from '../../components/map/CoimbatoreMap';
import { CivicApi } from '../../services/api';
import { MapMarkerItem, HotspotItem, AdminStats } from '../../types';
import { useTranslation } from '../../i18n/translations';

export const LandingPage: React.FC = () => {
  const { t, language } = useTranslation();
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
    <div className="space-y-12 font-sans">
      
      {/* Editorial Marquee Strip */}
      <div className="border-b border-[#E2ECE5] overflow-hidden py-2 bg-white text-xs text-slate-500 font-medium">
        <div className="flex space-x-8 animate-marquee whitespace-nowrap">
          <span>Potholes patched across Avinashi Road · Streetlights restored in Peelamedu · Stormwater culverts cleared in Ukkadam · Water leak repaired in RS Puram · 100 Wards Covered</span>
          <span>Potholes patched across Avinashi Road · Streetlights restored in Peelamedu · Stormwater culverts cleared in Ukkadam · Water leak repaired in RS Puram · 100 Wards Covered</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F4EC] border border-[#C6E4CF] text-xs font-bold text-[#167A4D]">
              <span className="w-2 h-2 rounded-full bg-[#167A4D]" />
              <span>Coimbatore Municipal Grievance System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
              Your city. <br />
              <span className="font-serif italic font-normal text-[#167A4D]">Your voice.</span> <br />
              Your impact.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
              Report civic problems, monitor live repair progress, and inspect verified field photo evidence across all 100 wards in Coimbatore.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#167A4D] text-white font-bold text-xs hover:bg-[#12603C] transition shadow-md"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{t.navReport}</span>
              </Link>

              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-800 border border-slate-300 font-bold text-xs hover:bg-slate-50 transition shadow-2xs"
              >
                <MapPin className="w-4 h-4 text-[#167A4D]" />
                <span>{t.navMap}</span>
              </Link>

              <Link
                to="/track"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#12382C] text-white font-bold text-xs hover:bg-black transition shadow-2xs"
              >
                <span>{t.navTrackComplaintBtn}</span>
              </Link>
            </div>
          </div>

          {/* Real Statistics Card Grid */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Corporation Performance
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F4EC] text-[#167A4D] border border-[#C6E4CF]">
                  Live Wards
                </span>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <span className="font-black text-3xl text-slate-900 block">
                    {stats.total_complaints.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 block font-medium">
                    Grievances registered
                  </span>
                </div>

                <div>
                  <span className="font-black text-3xl text-[#167A4D] block">
                    {stats.resolution_rate_percent}%
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 block font-medium">
                    Resolution rate
                  </span>
                </div>

                <div>
                  <span className="font-black text-3xl text-slate-900 block">
                    {stats.avg_resolution_days} <span className="text-sm font-normal text-slate-400">days</span>
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 block font-medium">
                    Median fix time
                  </span>
                </div>

                <div>
                  <span className="font-black text-3xl text-[#167A4D] block">
                    100
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 block font-medium">
                    Wards actively covered
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Verified through municipal logs</span>
                <Link to="/analytics" className="font-bold text-[#167A4D] hover:underline flex items-center gap-1">
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
        <div className="space-y-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#167A4D]">
                Interactive GIS Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                Live Coimbatore Grievance Map
              </h2>
            </div>
            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167A4D] hover:underline"
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
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm h-full flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-[#E8F4EC] text-[#167A4D] border border-[#C6E4CF]">
                    {selectedMarker?.reference || '#80001'}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    selectedMarker?.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    selectedMarker?.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedMarker?.status || 'In Progress'}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {selectedMarker?.title || 'Deep crater pothole with standing water'}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {selectedMarker?.address || 'Near Central Bus Stand Gate 2, Gandhipuram, Coimbatore'}
                </p>

                <div className="grid grid-cols-2 gap-3 my-3 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-bold text-slate-800">{selectedMarker?.category || 'Roads'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Priority</span>
                    <span className="font-bold text-red-600">{selectedMarker?.priority || 'High'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                    <span className="font-bold text-slate-800">{selectedMarker?.department || 'Roads & Highways'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Backing</span>
                    <span className="font-bold text-slate-800">{selectedMarker?.supports_count || 14} citizens</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 block">Field Status</span>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#167A4D]" />
                      <span>Reported & priority assessed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#167A4D]" />
                      <span>Department squad assigned</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#167A4D] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Active field rectification</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  to={`/track?ref=${selectedMarker?.reference || '#80001'}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#167A4D] text-white font-bold text-xs hover:bg-[#12603C] transition shadow-xs"
                >
                  <span>Track Full Case History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Operates Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#167A4D]">
            Civic Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            How CivicResolver Operates
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <span className="text-lg font-black text-[#167A4D]/40">01</span>
            <h3 className="font-bold text-sm text-slate-900">Citizen Reports</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Describe in English, Tamil, or Hindi. Pin location on live map with photo evidence.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <span className="text-lg font-black text-[#167A4D]/40">02</span>
            <h3 className="font-bold text-sm text-slate-900">Priority Triage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated classification assigns responsible department and calculates SLA score.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <span className="text-lg font-black text-[#167A4D]/40">03</span>
            <h3 className="font-bold text-sm text-slate-900">Field Squad Dispatch</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Directly routed to ward executive engineers with active countdown SLA timers.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <span className="text-lg font-black text-[#167A4D]/40">04</span>
            <h3 className="font-bold text-sm text-slate-900">On-Site Rectification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Crews execute physical repairs, recording technical notes and after-photo evidence.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#C6E4CF] bg-[#FAFDFB] shadow-xs space-y-1.5">
            <span className="text-lg font-black text-[#167A4D]">05</span>
            <h3 className="font-bold text-sm text-[#167A4D]">CivicProof Community Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens audit before & after photos and vote whether work is genuinely resolved.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <span className="text-lg font-black text-slate-400">06</span>
            <h3 className="font-bold text-sm text-slate-900">CivicPulse Predictive Radar</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Poisson modeling forecasts infrastructure failure hotspots before breakdowns occur.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
