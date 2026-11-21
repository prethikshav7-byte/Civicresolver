import React, { useState, useEffect } from 'react';
import { CoimbatoreMap } from '../../components/map/CoimbatoreMap';
import { CivicApi } from '../../services/api';
import { MapMarkerItem, HotspotItem } from '../../types';
import { MapPin, Search, Filter, ShieldAlert, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveMapPage: React.FC = () => {
  const [markers, setMarkers] = useState<MapMarkerItem[]>([]);
  const [hotspots, setHotspots] = useState<HotspotItem[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);
      try {
        const [markersData, hotspotsData] = await Promise.all([
          CivicApi.getMapComplaints(),
          CivicApi.getHotspots()
        ]);
        setMarkers(markersData);
        setHotspots(hotspotsData);
        if (markersData.length > 0) {
          setSelectedMarker(markersData[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-soft text-civic-brand text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>GIS Operational Console</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-civic-text tracking-tight">
            Live Coimbatore Geographical Intelligence
          </h1>
          <p className="text-xs text-civic-muted mt-1">
            Real-time visual map of grievances across Coimbatore Corporation zones, wards, and arterial roads.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-civic-brand text-white font-semibold text-xs hover:bg-civic-brand-hover transition shadow-sm shrink-0"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Report at Location</span>
        </Link>
      </div>

      {/* Main GIS Layout: Map + Interactive Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Leaflet Map */}
        <div className="lg:col-span-8 h-[650px]">
          <CoimbatoreMap
            markers={markers}
            hotspots={hotspots}
            selectedComplaintId={selectedMarker?.id}
            onSelectComplaint={(m) => setSelectedMarker(m)}
          />
        </div>

        {/* Selected Complaint Detail Panel */}
        <div className="lg:col-span-4 h-[650px] overflow-y-auto bg-civic-surface border border-civic-border rounded-xl p-5 shadow-card flex flex-col justify-between">
          {selectedMarker ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-civic-border pb-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-civic-soft text-civic-brand">
                  {selectedMarker.reference}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  selectedMarker.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  selectedMarker.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {selectedMarker.status}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-civic-text leading-snug">
                  {selectedMarker.title}
                </h3>
                <p className="text-xs text-civic-muted mt-1.5 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-civic-brand shrink-0 mt-0.5" />
                  <span>{selectedMarker.address}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-civic-bg border border-civic-border text-xs">
                <div>
                  <span className="text-[10px] text-civic-muted uppercase block">Category</span>
                  <span className="font-semibold text-civic-text">{selectedMarker.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-civic-muted uppercase block">Priority</span>
                  <span className={`font-semibold ${
                    selectedMarker.priority === 'Critical' ? 'text-civic-critical' : 'text-civic-warning'
                  }`}>
                    {selectedMarker.priority}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-civic-muted uppercase block">Locality & Ward</span>
                  <span className="font-semibold text-civic-text">{selectedMarker.locality || 'Central'} (Ward {selectedMarker.ward || 70})</span>
                </div>
                <div>
                  <span className="text-[10px] text-civic-muted uppercase block">Department</span>
                  <span className="font-semibold text-civic-text">{selectedMarker.department || 'Roads'}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-semibold text-civic-text block">Coordinates:</span>
                <p className="font-mono text-[11px] text-civic-muted p-2 rounded bg-civic-bg border border-civic-border">
                  Lat: {selectedMarker.latitude.toFixed(5)}, Lng: {selectedMarker.longitude.toFixed(5)}
                </p>
              </div>

              <div className="pt-2 border-t border-civic-border">
                <span className="text-xs font-semibold text-civic-text block mb-2">Community Validation:</span>
                <p className="text-xs text-civic-muted">
                  Supported by <span className="font-bold text-civic-brand">{selectedMarker.supports_count}</span> citizens in this ward.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-civic-muted text-xs">
              <MapPin className="w-8 h-8 mx-auto text-civic-muted/40 mb-2" />
              <p>Select any pin on the map to inspect grievance status</p>
            </div>
          )}

          {selectedMarker && (
            <div className="pt-4 border-t border-civic-border">
              <Link
                to={`/track?ref=${selectedMarker.reference}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-civic-brand text-white font-medium text-xs hover:bg-civic-brand-hover transition shadow-xs"
              >
                <span>Track Full History</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
