import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, ShieldAlert, FileText, BarChart3, 
  LayoutDashboard, ChevronDown, Check, ShieldCheck, BrainCircuit, 
  Briefcase, Menu, X, Landmark, Compass
} from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../../i18n/translations';

interface HeaderProps {
  currentRole: 'citizen' | 'admin';
  onRoleChange: (role: 'citizen' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentRole, 
  onRoleChange
}) => {
  const location = useLocation();
  const { language, setLanguage, t } = useTranslation();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles = [
    { id: 'citizen', name: 'Citizen', identity: 'Priya Sundaram (Ward 70)', badge: 'Public' },
    { id: 'admin', name: 'Administrator', identity: 'Dr. Anand Ramanathan, IAS', badge: 'Municipal Admin' },
  ] as const;

  const activeRoleInfo = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2ECE5] shadow-2xs font-sans">
      
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo matching 4th Reference Image: Emerald badge with MapPin */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#167A4D] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block">
                {t.brandName}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {t.brandCity}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            <Link
              to="/report"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                location.pathname === '/report'
                  ? 'bg-[#167A4D] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-[#167A4D] hover:bg-[#F0F8F3]'
              }`}
            >
              {t.navReport}
            </Link>

            <Link
              to="/track"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/track'
                  ? 'bg-[#E8F4EC] text-[#167A4D] font-bold border border-[#C6E4CF]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navTrack}
            </Link>

            <Link
              to="/map"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/map'
                  ? 'bg-[#E8F4EC] text-[#167A4D] font-bold border border-[#C6E4CF]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navMap}
            </Link>

            <Link
              to="/proof"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/proof'
                  ? 'bg-emerald-100/80 text-emerald-900 font-bold border border-emerald-300'
                  : 'text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              {t.navProof}
            </Link>

            <Link
              to="/pulse"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/pulse'
                  ? 'bg-[#E8F4EC] text-[#167A4D] font-bold border border-[#C6E4CF]'
                  : 'text-slate-700 hover:text-[#167A4D] hover:bg-slate-50'
              }`}
            >
              {t.navPulse}
            </Link>

            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                location.pathname === '/admin'
                  ? 'bg-[#12382C] text-white border-[#12382C]'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.navAdmin}
            </Link>
          </nav>

          {/* Right Action Tools: Track complaint Button, Language, Role */}
          <div className="flex items-center gap-2.5">
            
            {/* Prominent Track Complaint Button (from 4th image) */}
            <Link
              to="/track"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#167A4D] hover:bg-[#12603C] text-white rounded-xl text-xs font-bold transition shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.navTrackComplaintBtn}</span>
            </Link>

            {/* Language Selector (Seamlessly translates entire dashboard) */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#167A4D] cursor-pointer shadow-2xs"
              title="Select language (English, Tamil, Hindi)"
            >
              <option value="en">English ▾</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F0F8F3] border border-[#C6E4CF] rounded-xl text-xs hover:border-[#167A4D] transition shadow-2xs"
                title="Switch role mode"
              >
                <span className="w-2 h-2 rounded-full bg-[#167A4D]" />
                <span className="font-bold text-[#12382C] text-[11px] hidden lg:inline">
                  {activeRoleInfo.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Switch Role Portal
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#F0F8F3] transition ${
                        currentRole === r.id ? 'bg-[#E8F4EC] font-bold text-[#167A4D]' : 'text-slate-800'
                      }`}
                    >
                      <div>
                        <div>{r.name}</div>
                        <div className="text-[10px] text-slate-500">{r.identity}</div>
                      </div>
                      {currentRole === r.id && <Check className="w-4 h-4 text-[#167A4D]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-slate-200 space-y-1">
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold bg-[#167A4D] text-white"
            >
              {t.navReport}
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.navTrack}
            </Link>
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.navMap}
            </Link>
            <Link
              to="/proof"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-emerald-800 hover:bg-emerald-50"
            >
              {t.navProof}
            </Link>
            <Link
              to="/pulse"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-800 hover:bg-slate-100"
            >
              {t.navPulse}
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t.navAdmin}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
