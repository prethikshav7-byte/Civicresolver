import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-civic-border bg-civic-surface/70 mt-16 text-civic-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Vision */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-civic-brand flex items-center justify-center text-white text-xs font-bold">
                CR
              </div>
              <span className="font-display font-bold text-base text-civic-text tracking-tight">CivicResolve</span>
            </div>
            <p className="text-civic-muted text-xs leading-relaxed">
              AI-Powered Citizen Grievance & Civic Intelligence Platform for Coimbatore Municipal Corporation.
            </p>
            <p className="font-editorial italic text-sm text-civic-brand">
              "Your city. Your voice. Your impact."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-civic-text mb-3">Civic Services</h4>
            <ul className="space-y-2">
              <li><Link to="/report" className="hover:text-civic-brand transition">File Infrastructure Grievance</Link></li>
              <li><Link to="/track" className="hover:text-civic-brand transition">Track Reference CR-2026</Link></li>
              <li><Link to="/map" className="hover:text-civic-brand transition">Live Coimbatore GIS Map</Link></li>
              <li><Link to="/analytics" className="hover:text-civic-brand transition">Public Transparency Portal</Link></li>
            </ul>
          </div>

          {/* Coimbatore Zones */}
          <div>
            <h4 className="font-semibold text-civic-text mb-3">Coimbatore Zones</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Central Zone · Gandhipuram, Race Course</li>
              <li>West Zone · RS Puram, Saibaba Colony</li>
              <li>North Zone · Peelamedu, Saravanampatti</li>
              <li>East Zone · Singanallur, Ramanathapuram</li>
              <li>South Zone · Ukkadam, Kuniyamuthur</li>
            </ul>
          </div>

          {/* Engineering & Credits */}
          <div className="space-y-2">
            <h4 className="font-semibold text-civic-text mb-3">Submission Details</h4>
            <div className="p-3 rounded-lg bg-civic-bg border border-civic-border text-[11px] space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-civic-text">
                <Sparkles className="w-3.5 h-3.5 text-civic-brand" />
                <span>PromptWars × GDG on-Campus</span>
              </div>
              <p className="text-civic-muted">PSG iTech Innovation Sprint</p>
              <div className="pt-1.5 border-t border-civic-border/60 text-[10px] text-civic-muted flex items-center gap-1">
                <MapPin className="w-3 h-3 text-civic-brand" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-civic-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} CivicResolve. Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-civic-brand">OpenStreetMap</a> contributors.
          </div>
          <div className="flex items-center gap-4 text-civic-muted">
            <span>Leaflet GIS</span>
            <span>·</span>
            <span>Google Gemini AI</span>
            <span>·</span>
            <span>PostgreSQL RLS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
