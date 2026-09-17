import React, { useState } from 'react';
import { 
  Compass, 
  Globe, 
  UserCheck, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles,
  ChevronDown,
  User,
  GraduationCap,
  BookOpen
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, activeRole, setActiveRole, onOpenSubmitModal }) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles = [
    {
      id: 'STUDENT',
      name: 'Aarav Shrestha',
      title: 'Student Researcher',
      email: 'aarav.shrestha@islingtoncollege.edu.np',
      badge: 'BSc (Hons) Computer Science',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'FACULTY',
      name: 'Dr. Rajesh Sharma',
      title: 'Faculty / Supervisor',
      email: 'dr.sharma@islingtoncollege.edu.np',
      badge: 'Department of Computing',
      icon: UserCheck,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'IRC_ADMIN',
      name: 'IRC Admin',
      title: 'R&I Platform Director',
      email: 'irc.admin@islingtoncollege.edu.np',
      badge: 'Innovation & Research Center',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const currentRoleInfo = roles.find(r => r.id === activeRole) || roles[0];

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('projects')}>
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-heading">
                  ISLINGTON <span className="gradient-text">IRC</span>
                </span>
                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">
                  Platform
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Research & Opportunity Discovery</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Islington Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('opportunities')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'opportunities'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Global Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('mentor-portal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'mentor-portal'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Faculty Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Center</span>
            </button>
          </div>

          {/* Right Action & Role Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSubmitModal}
              className="hidden sm:flex items-center gap-2 gradient-btn text-white px-4 py-2.2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Project</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2.5 bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 px-3.5 py-2 rounded-xl transition-all"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentRoleInfo.color} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                  {currentRoleInfo.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-200 leading-tight">{currentRoleInfo.name}</p>
                  <p className="text-[10px] text-indigo-400 font-semibold">{currentRoleInfo.title}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {/* Role Selector Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 glass-modal rounded-2xl p-2 z-50 border border-slate-700/80 shadow-2xl animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Switch Ecosystem User</p>
                  </div>
                  <div className="space-y-1 mt-1">
                    {roles.map(r => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setActiveRole(r.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all text-left ${
                          activeRole === r.id
                            ? 'bg-indigo-600/20 border border-indigo-500/30'
                            : 'hover:bg-slate-800/60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${r.color} flex items-center justify-center text-white font-bold text-xs mt-0.5`}>
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{r.name}</p>
                          <p className="text-[11px] text-slate-300">{r.title}</p>
                          <p className="text-[10px] text-slate-400">{r.badge}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
