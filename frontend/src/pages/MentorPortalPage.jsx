import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  Clock, 
  FileText, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function MentorPortalPage({ activeRole }) {
  const [requests, setRequests] = useState([]);
  const [mentoredProjects, setMentoredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transition to completed modal state
  const [selectedCompleteProject, setSelectedCompleteProject] = useState(null);
  const [findings, setFindings] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [paperUrl, setPaperUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch mentorship requests
      const reqResp = await fetch('/api/mentors/requests');
      const reqData = await reqResp.json();
      setRequests(reqData);

      // Fetch ongoing projects mentored
      const projResp = await fetch('/api/projects/?status=ONGOING');
      const projData = await projResp.json();
      setMentoredProjects(projData);
    } catch (err) {
      console.error("Error loading mentor portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespond = async (requestId, action) => {
    try {
      const resp = await fetch('/api/mentors/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          action,
          response_note: action === 'ACCEPT' ? 'Accepted for supervision.' : 'Capacity limit reached.'
        })
      });
      const data = await resp.json();
      alert(`Status updated: ${data.message}`);
      fetchData();
    } catch (err) {
      alert(`Action error: ${err.message}`);
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompleteProject) return;
    setIsSubmitting(true);

    try {
      const resp = await fetch(`/api/projects/${selectedCompleteProject.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome_findings: findings,
          deliverables: deliverables,
          paper_url: paperUrl || null,
          github_url: githubUrl || null
        })
      });
      const data = await resp.json();
      alert(`Project Completed! ${data.message}`);
      setSelectedCompleteProject(null);
      fetchData();
    } catch (err) {
      alert(`Completion failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 border border-slate-800/80 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Faculty Supervision & Mentorship Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Faculty Mentor Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Review automated project mentorship matches, accept supervision requests, monitor active student research teams, and transition completed projects to the permanent Islington Institutional Archive.
          </p>
        </div>
      </div>

      {/* Grid: Pending Requests & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section 1: Mentorship Requests Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Mentorship Requests ({requests.filter(r => r.status === 'PENDING').length})</span>
            </h2>
            <span className="text-xs text-slate-400">Automated Skill Matching</span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading requests...</p>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center glass-card rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400">No pending mentorship requests in queue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r.request_id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-submitted text-[10px]">
                      {r.status}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                      {Math.round(r.match_score * 100)}% Algorithm Match
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{r.project_title}</h3>
                    <p className="text-xs text-slate-400">Student Creator: <strong className="text-slate-200">{r.creator_name}</strong></p>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">{r.problem_statement}</p>
                  </div>

                  {r.status === 'PENDING' ? (
                    <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => handleRespond(r.request_id, 'ACCEPT')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Supervision</span>
                      </button>
                      <button
                        onClick={() => handleRespond(r.request_id, 'REJECT')}
                        className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 text-xs font-semibold text-emerald-400">
                      ✓ Response Recorded: {r.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Mentored Projects & Complete Transition */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Mentored Active Projects ({mentoredProjects.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Lifecycle Management</span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading active projects...</p>
          ) : mentoredProjects.length === 0 ? (
            <div className="p-6 text-center glass-card rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400">No active ongoing projects being mentored.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mentoredProjects.map((p) => (
                <div key={p.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-ongoing">
                      {p.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {p.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{p.short_description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Supervisor: <strong className="text-indigo-300">{p.mentor_name}</strong>
                    </span>

                    <button
                      onClick={() => setSelectedCompleteProject(p)}
                      className="gradient-btn text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Mark as Completed</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Completion Modal */}
      {selectedCompleteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-modal w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Transition to Permanent Institutional Archive</span>
            </h3>
            <p className="text-xs text-slate-300">
              Complete research project: <strong className="text-indigo-300">{selectedCompleteProject.title}</strong>
            </p>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Key Findings & Results *</label>
                <textarea 
                  rows={3}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  placeholder="Summarize the core research findings, accuracy metrics, or project build outcome."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Final Deliverables *</label>
                <input 
                  type="text"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="e.g., Capstone Paper, Code Repository, Dataset, Demo Video"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Research Paper Link / DOI</label>
                  <input 
                    type="url"
                    value={paperUrl}
                    onChange={(e) => setPaperUrl(e.target.value)}
                    placeholder="https://doi.org/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">GitHub Repository Link</label>
                  <input 
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedCompleteProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-btn text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
                >
                  {isSubmitting ? "Archiving..." : "Archive Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
