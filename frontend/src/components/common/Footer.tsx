import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin } from 'lucide-react';
import { useTranslation } from '../../i18n/translations';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[#E2ECE5] bg-white mt-16 text-slate-500 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Vision */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#167A4D] flex items-center justify-center text-white text-xs font-bold shadow-2xs">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                {t.brandName}
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Coimbatore Municipal Grievance & Public Intelligence System.
            </p>
            <p className="font-semibold text-xs text-[#167A4D]">
              "Your city. Your voice. Your impact."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Civic Services</h4>
            <ul className="space-y-2">
              <li><Link to="/report" className="hover:text-[#167A4D] transition">File Grievance</Link></li>
              <li><Link to="/track" className="hover:text-[#167A4D] transition">Track Grievance (#80019)</Link></li>
              <li><Link to="/map" className="hover:text-[#167A4D] transition">Live Coimbatore GIS Map</Link></li>
              <li><Link to="/proof" className="hover:text-[#167A4D] transition font-bold text-emerald-700">CivicProof Community Audit</Link></li>
              <li><Link to="/pulse" className="hover:text-[#167A4D] transition font-medium text-slate-700">CivicPulse Predictive Radar</Link></li>
              <li><Link to="/officer" className="hover:text-[#167A4D] transition">Officer Portal</Link></li>
              <li><Link to="/admin" className="hover:text-[#167A4D] transition">Municipal Administrator</Link></li>
            </ul>
          </div>

          {/* Coimbatore Zones */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Coimbatore Zones</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li>Central Zone · Gandhipuram, Race Course</li>
              <li>West Zone · RS Puram, Saibaba Colony</li>
              <li>North Zone · Peelamedu, Saravanampatti</li>
              <li>East Zone · Singanallur, Ramanathapuram</li>
              <li>South Zone · Ukkadam, Kuniyamuthur</li>
            </ul>
          </div>

          {/* Engineering & Credits */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Municipal Corporation</h4>
            <div className="p-3 rounded-xl bg-[#F0F8F3] border border-[#D1EAD8] text-[11px] space-y-1.5">
              <div className="font-bold text-[#12382C]">
                PromptWars × GDG on-Campus
              </div>
              <p className="text-slate-600">PSG iTech Innovation Sprint</p>
              <div className="pt-1.5 border-t border-[#D1EAD8] text-[10px] text-slate-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#167A4D]" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E2ECE5] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} CivicResolver. Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-[#167A4D]">OpenStreetMap</a> contributors.
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>Leaflet GIS</span>
            <span>·</span>
            <span>FastAPI Python</span>
            <span>·</span>
            <span>PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
