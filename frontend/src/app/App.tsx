import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { LandingPage } from '../pages/public/LandingPage';
import { LiveMapPage } from '../pages/map/LiveMapPage';
import { ReportComplaintPage } from '../pages/citizen/ReportComplaintPage';
import { TrackComplaintPage } from '../pages/citizen/TrackComplaintPage';
import { CitizenDashboard } from '../pages/citizen/CitizenDashboard';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { CivicAnalyticsPage } from '../pages/analytics/CivicAnalyticsPage';
import { AuthPage } from '../pages/auth/AuthPage';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<'citizen' | 'admin' | 'officer'>('citizen');

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-civic-bg text-civic-text font-sans">
        <Header currentRole={currentRole} onRoleChange={(role) => setCurrentRole(role)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<LiveMapPage />} />
            <Route path="/report" element={<ReportComplaintPage />} />
            <Route path="/track" element={<TrackComplaintPage />} />
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/analytics" element={<CivicAnalyticsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth" element={<AuthPage onLogin={(role) => setCurrentRole(role)} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
