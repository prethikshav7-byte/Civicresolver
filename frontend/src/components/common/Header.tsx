import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, ShieldAlert, FileText, BarChart3, LayoutDashboard, UserCheck, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  currentRole: 'citizen' | 'admin' | 'officer';
  onRoleChange: (role: 'citizen' | 'admin' | 'officer') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const location = useLocation();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles = [
    { id: 'citizen', name: 'Citizen', identity: 'Priya Sundaram (Ward 70)', badge: 'Public' },
    { id: 'admin', name: 'Admin', identity: 'Dr. Anand Ramanathan, IAS', badge: 'Municipal Comm.' },
    { id: 'officer', name: 'Department Officer', identity: 'Er. Vigneshwaran K.', badge: 'Roads Dept' },
  ] as const;

  const activeRoleInfo = roles.find(r => r.id === currentRole) || roles[0];

  const navLinks = [
    { to: '/map', label: 'Live Map', icon: MapPin },
    { to: '/report', label: 'Report Grievance', icon: ShieldAlert, highlight: true },
    { to: '/track', label: 'Track CR', icon: FileText },
    { to: '/dashboard', label: 'My Complaints', icon: LayoutDashboard, roleRestricted: 'citizen' },
    { to: '/analytics', label: 'Civic Analytics', icon: BarChart3 },
    { to: '/admin', label: 'Admin Portal', icon: LayoutDashboard, roleRestricted: 'admin' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F3F2EE]/90 backdrop-blur-md border-b border-civic-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-civic-brand flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="#2F8F68"/>
                <line x1="12" y1="3" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="21"/>
                <line x1="3" y1="12" x2="6" y2="12"/>
                <line x1="18" y1="12" x2="21" y2="12"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-civic-text">
                Civic<span className="text-civic-brand">Resolve</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-civic-soft text-civic-brand border border-civic-brand/10">
                Coimbatore
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              if (link.roleRestricted && link.roleRestricted !== currentRole && currentRole !== 'admin') {
                return null;
              }
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    link.highlight
                      ? 'bg-civic-brand text-white shadow-sm hover:bg-civic-brand-hover'
                      : isActive
                      ? 'bg-civic-surface text-civic-brand border border-civic-border shadow-xs'
                      : 'text-civic-muted hover:text-civic-text hover:bg-civic-surface/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Role Switcher for instant judging */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-civic-surface border border-civic-border rounded-full text-xs hover:border-civic-secondary transition shadow-xs"
              title="Switch demo persona to test Citizen, Admin, or Officer views"
            >
              <span className="w-2 h-2 rounded-full bg-civic-resolved animate-pulse" />
              <div className="text-left leading-none">
                <span className="font-semibold text-civic-text block">{activeRoleInfo.name}</span>
                <span className="text-[10px] text-civic-muted">{activeRoleInfo.badge}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-civic-muted" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-civic-surface border border-civic-border rounded-xl shadow-panel py-2 z-50">
                <div className="px-3 py-1.5 border-b border-civic-border/60">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-civic-muted">
                    Switch Test Persona
                  </p>
                  <p className="text-[10px] text-civic-muted">
                    Simulates RBAC workflows across Coimbatore
                  </p>
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onRoleChange(r.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-civic-soft/50 transition ${
                      currentRole === r.id ? 'bg-civic-soft font-semibold text-civic-brand' : 'text-civic-text'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{r.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-civic-bg text-civic-muted border border-civic-border">
                          {r.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-civic-muted block">{r.identity}</span>
                    </div>
                    {currentRole === r.id && <Check className="w-4 h-4 text-civic-brand" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-civic-border bg-civic-surface py-2 px-2 text-xs">
        <Link to="/map" className="flex flex-col items-center text-civic-muted hover:text-civic-brand">
          <MapPin className="w-4 h-4" />
          <span className="text-[10px]">Map</span>
        </Link>
        <Link to="/report" className="flex flex-col items-center text-civic-brand font-semibold">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[10px]">Report</span>
        </Link>
        <Link to="/track" className="flex flex-col items-center text-civic-muted hover:text-civic-brand">
          <FileText className="w-4 h-4" />
          <span className="text-[10px]">Track</span>
        </Link>
        <Link to="/analytics" className="flex flex-col items-center text-civic-muted hover:text-civic-brand">
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">Analytics</span>
        </Link>
        {currentRole === 'admin' && (
          <Link to="/admin" className="flex flex-col items-center text-civic-brand">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
};
