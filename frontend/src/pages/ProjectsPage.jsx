import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Users,
  PlusCircle,
  FolderGit2
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';

export default function ProjectsPage({ activeRole, onOpenSubmitModal }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [statusTab, setStatusTab] = useState('ONGOING'); // ONGOING or COMPLETED
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    'All',
    'Artificial Intelligence',
    'Natural Language Processing',
    'Computer Vision',
    'Medical AI',
    'Internet of Things & Data Science'
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = `/api/projects/?status=${statusTab}`;
      if (selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (acceptingOnly) url += `&accepting_only=true`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const resp = await fetch(url);
      const data = await resp.json();
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusTab, selectedCategory, acceptingOnly, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 border border-slate-800/80 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Branch A — Institutional Research Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Islington Research & Project Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Discover active ongoing research projects, request to join student developer teams, and explore completed capstones archived in the official Islington College Knowledge Base.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSubmitModal}
              className="gradient-btn text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Project Proposal</span>
            </button>
            <div className="text-xs text-slate-400 font-medium">
              Verified Islington College Credentials Required
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        
        {/* Status Toggle & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          
          {/* Ongoing vs Completed Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setStatusTab('ONGOING')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                statusTab === 'ONGOING'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Ongoing Projects</span>
            </button>

            <button
              onClick={() => setStatusTab('COMPLETED')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                statusTab === 'COMPLETED'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed Archive</span>
            </button>
          </div>

          {/* Search & Checkbox Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title, tech stack..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {statusTab === 'ONGOING' && (
              <label className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                <input 
                  type="checkbox"
                  checked={acceptingOnly}
                  onChange={(e) => setAcceptingOnly(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span>Accepting Collaborators</span>
              </label>
            )}
          </div>

        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading Islington Project Repository...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center glass-card rounded-3xl border border-slate-800 p-8">
            <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Projects Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No projects match your current status or category filter. Try clearing filters or submit a new proposal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <ProjectCard 
                key={proj.id} 
                project={proj} 
                onClick={(p) => setSelectedProject(p)} 
              />
            ))}
          </div>
        )}

      </div>

      {/* Detail Drawer Modal */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          activeRole={activeRole}
          onApplySuccess={() => {
            fetchProjects();
          }}
        />
      )}

    </div>
  );
}
