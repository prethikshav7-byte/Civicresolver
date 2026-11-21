import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, ShieldAlert, CheckCircle2, Compass, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/translations';

interface AuthPageProps {
  onLogin: (role: 'citizen' | 'admin') => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'citizen' | 'admin'>('citizen');
  const [isRegister, setIsRegister] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [zone, setZone] = useState('East');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'admin') {
      onLogin('admin');
      navigate('/admin');
    } else {
      onLogin('citizen');
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col justify-between bg-[#DCF2E4] font-sans">
      
      {/* Cadastral Polygon Map Background (matching Image 4) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-90 overflow-hidden">
        {/* Hexagonal cadastral mesh */}
        <svg className="w-full h-full object-cover" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <pattern id="hex-grid" width="120" height="104" patternUnits="userSpaceOnUse">
              <path d="M60 0 L120 34.6 L120 104 L60 69.3 L0 104 L0 34.6 Z" fill="none" stroke="#C2E5D0" strokeWidth="2.5" />
            </pattern>
            <pattern id="road-dashes" width="400" height="400" patternUnits="userSpaceOnUse">
              <path d="M -50,150 Q 200,80 450,220" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="14 10" opacity="0.85" />
              <path d="M 120,-50 Q 180,200 140,450" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="14 10" opacity="0.85" />
              <path d="M 280,-50 Q 340,180 300,450" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeDasharray="12 8" opacity="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="#E3F4EA" />
          <rect width="100%" height="100%" fill="url(#hex-grid)" opacity="0.7" />
          <rect width="100%" height="100%" fill="url(#road-dashes)" />
        </svg>

        {/* Cadastral Location Pin Labels (from Image 4) */}
        {/* Pin 1: Drain blocked */}
        <div className="absolute top-[48%] left-[7%] sm:left-[14%] flex items-center gap-2 transform -translate-y-1/2">
          <div className="w-8 h-8 rounded-full bg-[#E07A1E] text-white flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 fill-current" />
          </div>
          <span className="bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
            Drain blocked • High
          </span>
        </div>

        {/* Pin 2: Water leakage */}
        <div className="absolute top-[58%] left-[5%] sm:left-[11%] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E07A1E] text-white flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 fill-current" />
          </div>
          <span className="bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
            Water leakage • High
          </span>
        </div>

        {/* Pin 3: Water leakage Right side */}
        <div className="absolute top-[28%] right-[8%] sm:right-[15%] hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E07A1E] text-white flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 fill-current" />
          </div>
          <span className="bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
            Water leakage • High
          </span>
        </div>

        {/* Pin 4: Resolved green pin */}
        <div className="absolute top-[22%] right-[4%] sm:right-[9%] hidden md:flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#167A4D] text-white flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Centered Card matching Image 4 */}
      <div className="relative z-10 max-w-md w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white/98 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 backdrop-blur-md">
          
          {/* Citizen / Admin Pill Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('citizen')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'citizen'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.authTabCitizen}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'admin'
                  ? 'bg-[#12382C] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.authTabAdmin}
            </button>
          </div>

          {/* Heading & Subtitle */}
          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
              {activeTab === 'admin'
                ? 'Municipal Officer & Admin Login'
                : isRegister 
                  ? t.authTitleCreate 
                  : t.authTitleLogin
              }
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {activeTab === 'admin'
                ? 'Authoritative dispatch, dispute review and zonal telemetry.'
                : t.authSubtitle
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'citizen' && isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.authFullName}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.authFullNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167A4D] transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.authEmail}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.authEmailPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167A4D] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.authPassword}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.authPasswordPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167A4D] transition"
              />
            </div>

            {activeTab === 'citizen' && isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t.authMobile}
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#167A4D] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t.authZone}
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#167A4D] transition cursor-pointer"
                  >
                    <option value="East">East Zone</option>
                    <option value="West">West Zone</option>
                    <option value="North">North Zone</option>
                    <option value="South">South Zone</option>
                    <option value="Central">Central Zone</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#167A4D] hover:bg-[#12603C] text-white text-xs font-bold transition shadow-md hover:shadow-lg mt-2"
            >
              {isRegister ? t.authCreateBtn : t.authLoginBtn}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs font-medium text-slate-600 hover:text-[#167A4D] transition"
              >
                {isRegister ? t.authAlreadyRegistered : t.authDontHaveAccount}
              </button>
            </div>
          </form>

          {/* Quick Demo Evaluation Persona Shortcut */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Demo Quick Access:</span>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => { onLogin('citizen'); navigate('/dashboard'); }}
                className="text-[#167A4D] font-bold hover:underline"
              >
                Citizen
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => { onLogin('admin'); navigate('/admin'); }}
                className="text-[#12382C] font-bold hover:underline"
              >
                Administrator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Navigation Pill (Exact match to Image 4) */}
      <div className="relative z-10 pb-6 flex justify-center">
        <div className="bg-[#12382C] text-white rounded-full p-1.5 flex items-center gap-1 shadow-xl border border-emerald-900/40">
          <Link
            to="/map"
            className="px-4 py-1.5 rounded-full bg-[#167A4D] text-white text-xs font-bold transition hover:bg-[#198d5a]"
          >
            {t.pillGisMap}
          </Link>
          <Link
            to="/report"
            className="px-4 py-1.5 rounded-full text-emerald-100 hover:text-white text-xs font-medium transition"
          >
            {t.pillAiPipeline}
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-1.5 rounded-full text-emerald-100 hover:text-white text-xs font-medium transition"
          >
            {t.pillDashboard}
          </Link>
        </div>
      </div>

    </div>
  );
};
