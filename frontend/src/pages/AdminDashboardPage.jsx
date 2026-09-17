import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Globe, 
  Users, 
  BookOpen,
  RefreshCw,
  Activity,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsResp, pendingResp, sourcesResp] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/pending-projects'),
        fetch('/api/opportunities/sources')
      ]);

      const statsData = await statsResp.json();
      const pendingData = await pendingResp.json();
      const sourcesData = await sourcesResp.json();

      setStats(statsData);
      setPendingProjects(pendingData);
      setSources(sourcesData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveProject = async (projectId, action) => {
    try {
      const resp = await fetch(`/api/admin/approve-project/${projectId}?action=${action}`, { method: 'POST' });
      const data = await resp.json();
      alert(`Project status updated: ${data.message}`);
      fetchAdminData();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    }
  };

  const handleTriggerScrape = async () => {
    setIsRefreshing(true);
    try {
      const resp = await fetch('/api/opportunities/trigger-scrape', { method: 'POST' });
      const data = await resp.json();
      alert(`Pipeline refresh complete! ${data.message}`);
      fetchAdminData();
    } catch (err) {
      alert(`Pipeline error: ${err.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading IRC Platform Command Center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 border border-slate-800/80 bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>IRC Administrative Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Platform Operations & Pipeline Health
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Institutional oversight for Islington College project validation, mentor assignments, global opportunity scrapers, and platform statistics.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Total Projects</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-white font-heading">{stats.total_projects}</p>
            <p className="text-[10px] text-slate-400">{stats.ongoing_projects} Ongoing | {stats.completed_projects} Archive</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Pending Validations</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-amber-400 font-heading">{stats.pending_validations}</p>
            <p className="text-[10px] text-slate-400">Requires Validation</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">External Opportunities</span>
              <Globe className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-purple-400 font-heading">{stats.total_opportunities}</p>
            <p className="text-[10px] text-slate-400">Aggregated Global Opportunities</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Faculty & Mentors</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-400 font-heading">{stats.total_mentors}</p>
            <p className="text-[10px] text-slate-400">{stats.total_applications} Collaboration Applications</p>
          </div>
        </div>
      )}

      {/* Grid: Pending Approvals & Source Pipeline Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section 1: Pending Project Validation Submissions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Pending Project Submissions ({pendingProjects.length})</span>
            </h2>
          </div>

          {pendingProjects.length === 0 ? (
            <div className="p-6 text-center glass-card rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400">All submitted projects have been validated and assigned.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingProjects.map((p) => (
                <div key={p.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-submitted text-[10px]">
                      {p.status}
                    </span>
                    <span className="text-xs text-slate-400">Submitted: {p.created_at}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400">Creator: {p.creator_name} ({p.creator_email})</p>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{p.problem_statement}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => handleApproveProject(p.id, 'APPROVE')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => handleApproveProject(p.id, 'REJECT')}
                      className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Opportunity Scraper Pipeline Health & Logs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span>External Opportunity Pipeline Sources</span>
            </h2>

            <button
              onClick={handleTriggerScrape}
              disabled={isRefreshing}
              className="gradient-btn text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Run Pipeline Scraper</span>
            </button>
          </div>

          <div className="space-y-3">
            {sources.map((src) => (
              <div key={src.id} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{src.name}</span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {src.latest_log}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 truncate">{src.url}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Type: <strong className="text-slate-300">{src.source_type}</strong></span>
                  <span>Last Sync: <strong className="text-slate-300">{src.last_fetched_at}</strong></span>
                  <span>Fetched: <strong className="text-purple-300">{src.total_fetched} items</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline Activity Logs Table */}
          {stats && stats.recent_pipeline_logs && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Recent Scraper Execution Logs
              </h3>
              <div className="space-y-2">
                {stats.recent_pipeline_logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{log.source_name}</p>
                      <p className="text-[10px] text-slate-400">{log.fetched_at}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">+{log.new_records} New</span>
                      <p className="text-[10px] text-slate-400">{log.duplicate_records} Duplicates Filtered</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
