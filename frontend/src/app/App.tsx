import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '../i18n/translations';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { LandingPage } from '../pages/public/LandingPage';
import { LiveMapPage } from '../pages/map/LiveMapPage';
import { ReportComplaintPage } from '../pages/citizen/ReportComplaintPage';
import { TrackComplaintPage } from '../pages/citizen/TrackComplaintPage';
import { CitizenDashboard } from '../pages/citizen/CitizenDashboard';
import { CivicProofPage } from '../pages/citizen/CivicProofPage';
import { CivicPulsePage } from '../pages/analytics/CivicPulsePage';
import { CivicAnalyticsPage } from '../pages/analytics/CivicAnalyticsPage';
import { OfficerPortalPage } from '../pages/officer/OfficerPortalPage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AuthPage } from '../pages/auth/AuthPage';
import { CivicAiAssistant } from '../components/chat/CivicAiAssistant';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<'citizen' | 'admin' | 'officer'>('citizen');
  const [highContrast, setHighContrast] = useState(false);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
          highContrast ? 'high-contrast bg-black text-white' : 'bg-[#F8FAFC] text-slate-800'
        }`}>
          
          <Header 
            currentRole={currentRole} 
            onRoleChange={(role) => setCurrentRole(role)}
            highContrast={highContrast}
            onToggleHighContrast={() => setHighContrast(!highContrast)}
          />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/map" element={<LiveMapPage />} />
              <Route path="/report" element={<ReportComplaintPage />} />
              <Route path="/track" element={<TrackComplaintPage />} />
              <Route path="/dashboard" element={<CitizenDashboard />} />
              <Route path="/proof" element={<CivicProofPage />} />
              <Route path="/pulse" element={<CivicPulsePage />} />
              <Route path="/officer" element={<OfficerPortalPage />} />
              <Route path="/analytics" element={<CivicAnalyticsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/commissioner" element={<AdminDashboard />} />
              <Route path="/auth" element={<AuthPage onLogin={(role) => setCurrentRole(role)} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Global Persistent Civic AI Assistant */}
          <CivicAiAssistant currentRole={currentRole} />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};
