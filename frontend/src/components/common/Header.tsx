import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, Landmark, MapPin, ShieldAlert, FileText, BarChart3, 
  LayoutDashboard, ChevronDown, Check, ShieldCheck, BrainCircuit, 
  Briefcase, Menu, X, Sun, Eye, ZoomIn 
} from 'lucide-react';

interface HeaderProps {
  currentRole: 'citizen' | 'admin' | 'officer';
  onRoleChange: (role: 'citizen' | 'admin' | 'officer') => void;
  highContrast?: boolean;
  onToggleHighContrast?: () => void;
  fontScale?: boolean;
  onToggleFontScale?: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentRole, 
  onRoleChange,
  highContrast = false,
  onToggleHighContrast,
  fontScale = false,
  onToggleFontScale,
  language = 'en',
  onLanguageChange
}) => {
  const location = useLocation();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles = [
    { id: 'citizen', name: 'Citizen Portal', identity: 'Priya Sundaram (Ward 70)', badge: 'Public User' },
    { id: 'officer', name: 'Officer Portal', identity: 'Er. Vigneshwaran K.', badge: 'Roads Dept' },
    { id: 'admin', name: 'Commissioner Portal', identity: 'Dr. Anand Ramanathan, IAS', badge: 'Municipal Admin' },
  ] as const;

  const activeRoleInfo = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-2xs">
      {/* 1. Top DEMO MODE Banner (Exact match to Opponent Reference Image 1) */}
      <div className="bg-[#1E293B] text-slate-200 text-[11px] py-1.5 px-4 font-mono flex items-center justify-center flex-wrap gap-2 border-b border-slate-700">
        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wide uppercase">
          DEMO MODE
        </span>
        <span className="text-slate-300">
          Active in Coimbatore. Storage: In-Memory (data resets on restart). AI: Rule Heuristics (Add GEMINI_API_KEY for live GenAI). Admin demo password: civic-demo-2026
        </span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo with Classical Pillar Icon */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-blue-100/90 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs group-hover:scale-105 transition">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block">
                Civic<span className="text-blue-600">Resolve</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-tight">
                AI-Powered Municipal Grievance Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Pills */}
          <nav className="hidden xl:flex items-center space-x-1.5">
            <Link
              to="/report"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs ${
                location.pathname === '/report'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              Report Issue
            </Link>

            <Link
              to="/track"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/track'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Track Issue
            </Link>

            <Link
              to="/analytics"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/analytics'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Public Dashboard
            </Link>

            <Link
              to="/map"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/map'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Live GIS Map
            </Link>

            <Link
              to="/proof"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/proof'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                  : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/70'
              }`}
            >
              CivicProof
            </Link>

            <Link
              to="/pulse"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                location.pathname === '/pulse'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-blue-700 hover:text-blue-800 hover:bg-blue-50/70'
              }`}
            >
              CivicPulse
            </Link>

            <Link
              to="/officer"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                location.pathname === '/officer'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Officer Portal
            </Link>

            <Link
              to="/admin"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                location.pathname === '/admin'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Commissioner Portal
            </Link>
          </nav>

          {/* Right Action Tools: Language, Contrast, A+, Role Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
              title="Select application language"
            >
              <option value="en">English ▾</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>

            {/* High Contrast Toggle */}
            <button
              onClick={onToggleHighContrast}
              className={`hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 border rounded-lg font-medium transition shadow-2xs ${
                highContrast
                  ? 'bg-black text-white border-black font-bold'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle high contrast accessibility mode"
            >
              <span>High Contrast</span>
            </button>

            {/* A+ Font Size Toggle */}
            <button
              onClick={onToggleFontScale}
              className={`hidden sm:inline-flex items-center justify-center text-xs px-2.5 py-1 border rounded-lg font-bold transition shadow-2xs ${
                fontScale
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle larger font size scaling"
            >
              <span>A+</span>
            </button>

            {/* Role Persona Switcher for Evaluation */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs hover:border-slate-400 transition shadow-2xs"
                title="Switch test role persona"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800 text-[11px] hidden md:inline">
                  {activeRoleInfo.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Evaluate RBAC Portals
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition ${
                        currentRole === r.id ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-800'
                      }`}
                    >
                      <div>
                        <div>{r.name}</div>
                        <div className="text-[10px] text-slate-500">{r.identity}</div>
                      </div>
                      {currentRole === r.id && <Check className="w-4 h-4 text-blue-600" />}
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
              className="block px-3 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white"
            >
              Report Issue
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Track Issue
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Public Dashboard
            </Link>
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Live GIS Map
            </Link>
            <Link
              to="/proof"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-emerald-800 hover:bg-emerald-50"
            >
              CivicProof
            </Link>
            <Link
              to="/pulse"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-blue-800 hover:bg-blue-50"
            >
              CivicPulse
            </Link>
            <Link
              to="/officer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Officer Portal
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Commissioner Portal
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
