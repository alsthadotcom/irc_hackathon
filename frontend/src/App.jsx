import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProjectsPage from './pages/ProjectsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import MentorPortalPage from './pages/MentorPortalPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SubmitProjectPage from './pages/SubmitProjectPage';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [activeRole, setActiveRole] = useState('STUDENT');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      <div>
        {/* Navigation Header */}
        <Navbar 
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setShowSubmitModal(false);
          }}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          onOpenSubmitModal={() => setShowSubmitModal(true)}
        />

        {/* Dynamic Tab Body */}
        <main className="pb-16">
          {showSubmitModal ? (
            <SubmitProjectPage 
              onSubmitted={() => {
                setShowSubmitModal(false);
                setActiveTab('projects');
              }}
              onCancel={() => setShowSubmitModal(false)}
            />
          ) : (
            <>
              {activeTab === 'projects' && (
                <ProjectsPage 
                  activeRole={activeRole}
                  onOpenSubmitModal={() => setShowSubmitModal(true)}
                />
              )}
              {activeTab === 'opportunities' && <OpportunitiesPage />}
              {activeTab === 'mentor-portal' && <MentorPortalPage activeRole={activeRole} />}
              {activeTab === 'admin' && <AdminDashboardPage />}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-[10px]">
              IRC
            </div>
            <span className="font-bold text-slate-300">Islington College Research & Innovation Center</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Centralized Research Repository & Global Opportunity Discovery Layer © 2026 Islington College.
          </p>
        </div>
      </footer>

    </div>
  );
}
