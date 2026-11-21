import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapMarkerItem, HotspotItem, ComplaintCategory, ComplaintStatus } from '../../types';
import { Layers, Search, Filter, ShieldAlert, ArrowUpRight, Flame, Maximize2, Minimize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Category color tokens matching the CivicResolve Design System
const CATEGORY_COLORS: Record<string, string> = {
  Roads: '#D9534F',
  Sanitation: '#5B9A5B',
  Electrical: '#E0A526',
  Water: '#3B82C4',
  Drainage: '#8A63C9',
  Parks: '#2F8F83',
  'Public Infrastructure': '#4A5568',
  Other: '#68736E'
};

const COIMBATORE_LOCALITIES = [
  { name: 'Gandhipuram (Central)', coords: [11.0168, 76.9558] as [number, number] },
  { name: 'RS Puram (West)', coords: [11.0089, 76.9464] as [number, number] },
  { name: 'Peelamedu (North)', coords: [11.0284, 77.0035] as [number, number] },
  { name: 'Singanallur (East)', coords: [10.9998, 77.0253] as [number, number] },
  { name: 'Ukkadam (South)', coords: [10.9934, 76.9602] as [number, number] },
  { name: 'Race Course (Central)', coords: [11.0065, 76.9733] as [number, number] },
];

// Helper to pan map dynamically
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// Generate custom SVG Marker DivIcon
function createMarkerIcon(category: string, priority: string, isSelected: boolean) {
  const col = CATEGORY_COLORS[category] || '#203D32';
  const isCrit = priority === 'Critical';
  const size = isSelected ? 34 : 28;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position:relative; width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center;">
        ${isCrit ? `<div style="position:absolute; width:100%; height:100%; border-radius:50%; background:${col}; opacity:0.35; animation:pulse-ring 1.8s infinite ease-in-out;"></div>` : ''}
        <div style="width:${size - 6}px; height:${size - 6}px; border-radius:50%; background:${col}; border:2.5px solid #FFFFFF; box-shadow:0 2px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:#FFFFFF; font-weight:bold; font-size:10px;">
          ${category.charAt(0)}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

interface CoimbatoreMapProps {
  markers: MapMarkerItem[];
  hotspots?: HotspotItem[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (marker: MapMarkerItem) => void;
  showFilters?: boolean;
}

export const CoimbatoreMap: React.FC<CoimbatoreMapProps> = ({
  markers,
  hotspots = [],
  selectedComplaintId,
  onSelectComplaint,
  showFilters = true
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.0168, 76.9558]); // Coimbatore center
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter markers based on category and status
  const filteredMarkers = markers.filter(m => {
    const matchCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || m.status === selectedStatus;
    const matchSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.locality || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const categories = ['All', 'Roads', 'Sanitation', 'Electrical', 'Water', 'Drainage', 'Parks'];
  const statuses = ['All', 'Reported', 'Assigned', 'In Progress', 'Resolved'];

  const handleLocalitySelect = (coords: [number, number]) => {
    setMapCenter(coords);
    setMapZoom(15);
  };

  return (
    <div className={`relative flex flex-col bg-civic-surface rounded-xl border border-civic-border overflow-hidden shadow-card transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[620px] w-full'
    }`}>
      {/* Top Controls Toolbar */}
      {showFilters && (
        <div className="p-3 bg-civic-surface border-b border-civic-border flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Locality Jump */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <span className="text-[11px] font-semibold text-civic-muted uppercase tracking-wider whitespace-nowrap">
              Jump:
            </span>
            {COIMBATORE_LOCALITIES.map(loc => (
              <button
                key={loc.name}
                onClick={() => handleLocalitySelect(loc.coords)}
                className="px-2.5 py-1 rounded-full bg-civic-bg hover:bg-civic-soft text-civic-text font-medium text-[11px] border border-civic-border transition whitespace-nowrap"
              >
                {loc.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Action Toggles */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition ${
                showHeatmap 
                  ? 'bg-civic-critical text-white border-civic-critical shadow-xs' 
                  : 'bg-civic-bg text-civic-text border-civic-border hover:bg-civic-soft'
              }`}
              title="Toggle complaint density hotspot zones"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hotspots ({showHeatmap ? 'ON' : 'OFF'})</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-civic-bg border border-civic-border text-civic-muted hover:text-civic-text transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Map Canvas */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />
          
          {/* CartoDB Positron / OpenStreetMap Clean Soft Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Heatmap / Intensity Circles Overlay */}
          {showHeatmap && hotspots.map((h, i) => (
            <Circle
              key={`hotspot-${i}`}
              center={[h.lat, h.lng]}
              radius={350 + h.intensity * 250}
              pathOptions={{
                color: '#D9534F',
                fillColor: '#D9534F',
                fillOpacity: 0.22 * h.intensity,
                weight: 1,
                dashArray: '4, 4'
              }}
            />
          ))}

          {/* Live Complaint Markers */}
          {filteredMarkers.map((marker) => {
            const isSelected = selectedComplaintId === marker.id || selectedComplaintId === marker.reference;
            const icon = createMarkerIcon(marker.category, marker.priority, isSelected);

            return (
              <Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    onSelectComplaint?.(marker);
                  }
                }}
              >
                <Popup className="civic-popup">
                  <div className="p-1 space-y-2 max-w-[240px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-civic-soft text-civic-brand">
                        {marker.reference}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        marker.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        marker.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {marker.priority}
                      </span>
                    </div>

                    <h4 className="font-semibold text-xs text-civic-text leading-tight">
                      {marker.title}
                    </h4>

                    <p className="text-[11px] text-civic-muted line-clamp-2">
                      {marker.address}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-civic-border text-[10px]">
                      <span className="font-medium text-civic-brand">
                        {marker.category}
                      </span>
                      <span className={`font-semibold ${
                        marker.status === 'Resolved' ? 'text-civic-resolved' : 'text-civic-warning'
                      }`}>
                        {marker.status}
                      </span>
                    </div>

                    <Link
                      to={`/track?ref=${marker.reference}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-civic-brand hover:underline pt-1"
                    >
                      <span>Track grievance status</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Category Filter Chips (UI Reference Direction) */}
        {showFilters && (
          <div className="absolute top-4 left-4 z-[400] flex flex-wrap gap-1.5 max-w-[calc(100%-80px)] bg-civic-surface/90 backdrop-blur-md p-2 rounded-xl border border-civic-border shadow-card">
            {categories.map((cat) => {
              const col = CATEGORY_COLORS[cat] || '#203D32';
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                    isActive
                      ? 'bg-civic-brand text-white shadow-xs'
                      : 'bg-civic-bg text-civic-text hover:bg-civic-soft border border-civic-border/60'
                  }`}
                >
                  {cat !== 'All' && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col }} />
                  )}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] bg-civic-surface/95 backdrop-blur-md px-3 py-2 rounded-lg border border-civic-border text-[11px] shadow-sm flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-civic-critical animate-pulse" />
            <span className="text-civic-muted">Critical (Priority 1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-civic-warning" />
            <span className="text-civic-muted">High / Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-civic-resolved" />
            <span className="text-civic-muted">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
