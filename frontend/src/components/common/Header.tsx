import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, ShieldAlert, FileText, BarChart3, LayoutDashboard, 
  ChevronDown, Check, ShieldCheck, BrainCircuit, Briefcase, Menu, X 
} from 'lucide-react';

interface HeaderProps {
  currentRole: 'citizen' | 'admin' | 'officer';
  onRoleChange: (role: 'citizen' | 'admin' | 'officer') => void;
}

interface NavLinkItem {
  to: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const location = useLocation();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles = [
    { id: 'citizen', name: 'Citizen', identity: 'Priya Sundaram (Ward 70)', badge: 'Public User' },
    { id: 'officer', name: 'Field Officer', identity: 'Er. Vigneshwaran K.', badge: 'Roads Dept' },
    { id: 'admin', name: 'Commissioner', identity: 'Dr. Anand Ramanathan, IAS', badge: 'Municipal Admin' },
  ] as const;

  const activeRoleInfo = roles.find(r => r.id === currentRole) || roles[0];

  const citizenLinks: NavLinkItem[] = [
    { to: '/map', label: 'Live GIS Map', icon: MapPin },
    { to: '/report', label: 'Report Grievance', icon: ShieldAlert, highlight: true },
    { to: '/track', label: 'Track CR', icon: FileText },
    { to: '/dashboard', label: 'My Complaints', icon: FileText },
    { to: '/proof', label: 'CivicProof', icon: ShieldCheck, badge: 'Audit' },
    { to: '/pulse', label: 'CivicPulse', icon: BrainCircuit, badge: 'AI Radar' },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const officerLinks: NavLinkItem[] = [
    { to: '/officer', label: 'Field Execution Queue', icon: Briefcase, highlight: true },
    { to: '/proof', label: 'CivicProof Audits', icon: ShieldCheck },
    { to: '/map', label: 'Live GIS Map', icon: MapPin },
    { to: '/pulse', label: 'CivicPulse Radar', icon: BrainCircuit },
  ];

  const adminLinks: NavLinkItem[] = [
    { to: '/admin', label: 'Control Room', icon: LayoutDashboard, highlight: true },
    { to: '/officer', label: 'Officer Queue', icon: Briefcase },
    { to: '/proof', label: 'CivicProof Audits', icon: ShieldCheck },
    { to: '/pulse', label: 'CivicPulse Radar', icon: BrainCircuit },
    { to: '/map', label: 'GIS Operations', icon: MapPin },
    { to: '/analytics', label: 'City Analytics', icon: BarChart3 },
  ];

  const currentNavLinks = 
    currentRole === 'officer' ? officerLinks :
    currentRole === 'admin' ? adminLinks : citizenLinks;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-civic-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-civic-primary flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="#16A36A"/>
                <line x1="12" y1="3" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="21"/>
                <line x1="3" y1="12" x2="6" y2="12"/>
                <line x1="18" y1="12" x2="21" y2="12"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-civic-text">
                Civic<span className="text-civic-primary">Resolve</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 text-civic-primary border border-blue-200">
                Coimbatore
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {currentNavLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    link.highlight
                      ? 'bg-civic-primary text-white shadow-xs hover:bg-civic-primary-hover'
                      : isActive
                      ? 'bg-blue-50 text-civic-primary border border-blue-200 shadow-xs'
                      : 'text-civic-muted hover:text-civic-text hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Persona Switcher & Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-civic-bg border border-civic-border rounded-full text-xs hover:border-civic-primary transition shadow-xs"
                title="Switch persona to evaluate Citizen, Officer, or Admin portals"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left leading-none">
                  <span className="font-bold text-civic-text block text-[11px]">{activeRoleInfo.name}</span>
                  <span className="text-[9px] text-civic-muted">{activeRoleInfo.badge}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-civic-muted" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-civic-border rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-3 py-2 border-b border-civic-border/70">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-civic-text">
                      Switch Role & Persona
                    </p>
                    <p className="text-[10px] text-civic-muted">
                      Evaluates role-based views across Coimbatore Corporation
                    </p>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between text-xs hover:bg-blue-50/60 transition ${
                        currentRole === r.id ? 'bg-blue-50 font-bold text-civic-primary' : 'text-civic-text'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-[10px] text-civic-muted">{r.identity}</div>
                      </div>
                      {currentRole === r.id && <Check className="w-4 h-4 text-civic-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-civic-muted hover:text-civic-text hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-civic-border space-y-1">
            {currentNavLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-blue-50 text-civic-primary font-bold' : 'text-civic-text hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-civic-primary" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
