import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, RotateCcw, Share2, Download, 
  MapPin, CheckSquare, Square, ChevronDown, ChevronUp, Layers 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line 
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { CivicApi } from '../../services/api';
import { MapMarkerItem } from '../../types';

const INITIAL_CATEGORIES = [
  { name: 'Accessibility', count: 182, checked: true },
  { name: 'Animal Issues', count: 245, checked: true },
  { name: 'Ask Us / General FAQs', count: 310, checked: true },
  { name: 'Building Maintenance', count: 420, checked: true },
  { name: 'Business Issues', count: 165, checked: true },
  { name: 'City Facilities & Infrastructure', count: 580, checked: true },
  { name: 'Drainage & Stormwater', count: 890, checked: true },
  { name: 'Electrical & Street Lighting', count: 960, checked: true },
  { name: 'Parks & Horticulture', count: 340, checked: true },
  { name: 'Roads & Carriageways', count: 1420, checked: true },
  { name: 'Sanitation & Solid Waste', count: 1120, checked: true },
  { name: 'Water Supply & Sewerage', count: 855, checked: true },
];

const MONTHLY_REQUESTS_DATA = [
  { month: 'Jan', requests: 380 },
  { month: 'Feb', requests: 460 },
  { month: 'Mar', requests: 520 },
  { month: 'Apr', requests: 410 },
  { month: 'May', requests: 480 },
  { month: 'Jun', requests: 620 },
  { month: 'Jul', requests: 590 },
  { month: 'Aug', requests: 640 },
  { month: 'Sep', requests: 780 },
  { month: 'Oct', requests: 510 },
  { month: 'Nov', requests: 590 },
  { month: 'Dec', requests: 497 }
];

const STATUS_DATA = [
  { status: 'On Hold', count: 24, fill: '#94A3B8' },
  { status: 'Open', count: 1420, fill: '#38BDF8' },
  { status: 'In Progress', count: 1612, fill: '#60A5FA' },
  { status: 'Closed', count: 3431, fill: '#4F8096' }
];

const CATEGORY_PIE_DATA = [
  { name: 'Roads', value: 1420, color: '#3B82C4' },
  { name: 'Sanitation', value: 1120, color: '#4F8096' },
  { name: 'Electrical', value: 960, color: '#639FAB' },
  { name: 'Drainage', value: 890, color: '#88B7B5' },
  { name: 'Water', value: 855, color: '#A7D7C5' },
  { name: 'Other', value: 1242, color: '#CBD5E1' }
];

const TOP_DEPARTMENTS = [
  { name: 'DPW - Refuse (Sanitation)', count: 1840, pct: 90 },
  { name: 'PLI - Building Inspections', count: 1420, pct: 75 },
  { name: 'DPW - Street Mtn (Roads)', count: 1390, pct: 72 },
  { name: 'Police - Central Zones 1-6', count: 820, pct: 48 },
  { name: 'DOMI - Street Infrastructure', count: 760, pct: 42 },
  { name: '311 Municipal Control Room', count: 680, pct: 38 },
  { name: 'TWAD - Water & Sewerage', count: 650, pct: 36 },
  { name: 'Police - Traffic AVU', count: 510, pct: 28 },
  { name: 'DOMI - Traffic & Signals', count: 440, pct: 24 },
  { name: 'TANGEDCO - Electric Grid', count: 390, pct: 20 },
];

export const CivicAnalyticsPage: React.FC = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchFilter, setSearchFilter] = useState('');
  const [mapMarkers, setMapMarkers] = useState<MapMarkerItem[]>([]);

  useEffect(() => {
    async function loadMapData() {
      const markers = await CivicApi.getMapComplaints();
      setMapMarkers(markers);
    }
    loadMapData();
  }, []);

  const toggleCategory = (name: string) => {
    setCategories(prev => prev.map(c => c.name === name ? { ...c, checked: !c.checked } : c));
  };

  const handleSelectAll = () => {
    setCategories(prev => prev.map(c => ({ ...c, checked: true })));
  };

  const handleReset = () => {
    setCategories(prev => prev.map(c => ({ ...c, checked: false })));
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalRequestsCount = 6487;

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      
      {/* Top Banner (ArcGIS 311 Title Header) */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              311 Requests
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Coimbatore Municipal Corporation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly Review Dashboard • Spatial incident density & operational fulfillment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => CivicApi.exportAuditCsv()}
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition shadow-2xs" 
            title="Download Report Data"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert("Public dashboard URL copied to clipboard.");
            }}
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition shadow-2xs" 
            title="Share Dashboard"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Filters Sidebar (22%) + Right Analytics Canvas (78%) */}
      <div className="flex flex-col lg:flex-row">
        
        {/* ============================================================== */}
        {/* LEFT FILTER SIDEBAR (Exact Image 3 ArcGIS Style) */}
        {/* ============================================================== */}
        <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-4 space-y-5 shrink-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-500" />
              Filters
            </span>
            <div className="flex items-center gap-2 text-xs">
              <button 
                onClick={handleReset} 
                className="text-slate-500 hover:text-blue-600 underline font-medium"
              >
                Reset
              </button>
              <span className="text-slate-300">|</span>
              <button 
                onClick={handleSelectAll} 
                className="text-blue-600 hover:underline font-semibold"
              >
                Select all
              </button>
            </div>
          </div>

          {/* Request Category Filter */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-800">
              Request Category
            </label>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search category..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Checklist */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {filteredCategories.map((cat) => (
                <label 
                  key={cat.name} 
                  className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <input 
                      type="checkbox" 
                      checked={cat.checked}
                      onChange={() => toggleCategory(cat.name)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
                    />
                    <span className="truncate text-slate-700 group-hover:text-slate-900 text-[11px]">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                    {cat.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional ArcGIS Accordion Filter Sections */}
          <div className="pt-2 border-t border-slate-100 space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 text-slate-700 font-semibold cursor-pointer">
              <span>Request Type</span>
              <span className="text-[11px] text-slate-400">All (100+)</span>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-700 font-semibold cursor-pointer">
              <span>Division (Zone)</span>
              <span className="text-[11px] text-slate-400">All 5 Zones</span>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-700 font-semibold cursor-pointer">
              <span>Neighborhood / Ward</span>
              <span className="text-[11px] text-slate-400">100 Wards</span>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-700 font-semibold cursor-pointer">
              <span>Origin of Request</span>
              <span className="text-[11px] text-slate-400">Web & Mobile</span>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-700 font-semibold cursor-pointer">
              <span>Status</span>
              <span className="text-[11px] text-slate-400">All Statuses</span>
            </div>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* RIGHT ANALYTICS CANVAS (Exact Image 3 Layout) */}
        {/* ============================================================== */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-hidden">
          
          {/* TOP ROW: Requests KPI + GIS Leaflet Map + Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* 1. Requests KPI Counter Card (col-span-3) */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Requests
                </span>
                <span className="font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight block">
                  {totalRequestsCount.toLocaleString()}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Coimbatore Corporation verified incidents across all 5 municipal zones.
              </div>
            </div>

            {/* 2. Embedded GIS Leaflet Map (col-span-6) */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs relative h-72">
              <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-300 text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-2xs">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span>Coimbatore GIS Density Map</span>
              </div>

              <MapContainer 
                center={[11.0168, 76.9558]} 
                zoom={12} 
                scrollWheelZoom={false}
                className="w-full h-full z-0"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Dense Scatter Points */}
                {mapMarkers.map((m) => (
                  <CircleMarker
                    key={m.id}
                    center={[m.latitude, m.longitude]}
                    radius={5}
                    pathOptions={{
                      fillColor: m.priority === 'Critical' ? '#EF4444' : '#3B82F6',
                      fillOpacity: 0.8,
                      color: '#FFFFFF',
                      weight: 1
                    }}
                  >
                    <Popup>
                      <div className="text-xs">
                        <strong className="block">{m.reference}</strong>
                        <span>{m.title}</span>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>

            {/* 3. Requests by Category Pie Chart (col-span-3) */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-800 block mb-1">
                Requests by Category
              </span>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {CATEGORY_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                {CATEGORY_PIE_DATA.slice(0, 4).map(item => (
                  <div key={item.name} className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Requests by Status Bar + Requests per Month Line + Top 10 Departments */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* 1. Requests by Status Bar Chart (col-span-4) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Requests by Status
              </span>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STATUS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="status" fontSize={10} stroke="#64748B" tickLine={false} />
                    <YAxis fontSize={10} stroke="#64748B" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px' }} 
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {STATUS_DATA.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Requests per Month Line Chart (col-span-4) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Requests per Month
              </span>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_REQUESTS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" fontSize={10} stroke="#64748B" tickLine={false} />
                    <YAxis fontSize={10} stroke="#64748B" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#4F8096" 
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#4F8096' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Top 10 Departments Ranking List (col-span-4) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Top 10 Departments
              </span>

              <div className="h-48 overflow-y-auto space-y-2 pr-1 text-xs">
                {TOP_DEPARTMENTS.map((dept, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-slate-700">
                      <span className="truncate max-w-[190px] font-medium">{dept.name}</span>
                      <span className="font-mono text-slate-500">{dept.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${dept.pct}%` }} 
                        className="h-full bg-[#4F8096] rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
