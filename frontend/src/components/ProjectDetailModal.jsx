import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Github, 
  ExternalLink, 
  FileText, 
  Database, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Send,
  Building,
  Target,
  FlaskConical,
  Award
} from 'lucide-react';

export default function ProjectDetailModal({ project, onClose, activeRole, onApplySuccess }) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicantName, setApplicantName] = useState('Kabir Thapa');
  const [applicantEmail, setApplicantEmail] = useState('kabir.thapa@islingtoncollege.edu.np');
  const [program, setProgram] = useState('BSc (Hons) Computer Science');
  const [skills, setSkills] = useState('Python, PyTorch, Data Cleaning');
  const [motivation, setMotivation] = useState('I am keen on applying machine learning to real-world datasets and want to collaborate with the Islington research team.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!project) return null;

  const isOngoing = project.status === 'ONGOING';
  const isCompleted = project.status === 'COMPLETED';

  const handleApply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const resp = await fetch(`/api/projects/${project.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_name: applicantName,
          applicant_email: applicantEmail,
          program,
          skills,
          motivation,
          desired_role: 'Collaborator / Researcher'
        })
      });
      const data = await resp.json();
      alert(`Application Submitted! ${data.message}`);
      setShowApplyForm(false);
      if (onApplySuccess) onApplySuccess();
    } catch (err) {
      alert(`Error submitting application: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-modal w-full max-w-4xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-700/80 shadow-2xl relative my-auto animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-ongoing'}`}>
            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {project.status}
          </span>
          <span className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
            {project.category}
          </span>
          <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
            {project.department}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mb-4">
          {project.title}
        </h2>

        {/* Lead Mentor & Academic Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Faculty Supervisor</p>
              <p className="font-bold text-white">{project.mentor_name || "Assigned Faculty"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Academic Session</p>
              <p className="font-bold text-white">{project.academic_year || "2025-2026"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Research Domain</p>
              <p className="font-bold text-white">{project.research_area}</p>
            </div>
          </div>
        </div>

        {/* Deliverables / Links if available */}
        {(project.paper_url || project.github_url || project.demo_url || project.dataset_url) && (
          <div className="mb-6 flex flex-wrap gap-3">
            {project.paper_url && (
              <a href={project.paper_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition-colors">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Research Paper</span>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors">
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3.5 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold transition-colors">
                <ExternalLink className="w-4 h-4 text-purple-400" />
                <span>Live Project Demo</span>
              </a>
            )}
            {project.dataset_url && (
              <a href={project.dataset_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold transition-colors">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Research Dataset</span>
              </a>
            )}
          </div>
        )}

        {/* Grid Sections: Problem, Methodology, Outcome */}
        <div className="space-y-6">

          {/* Section 1: Problem Definition */}
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Problem Statement & Background</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3 font-medium">
              {project.problem_statement || project.short_description}
            </p>
            {project.full_description && (
              <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed border-t border-slate-800/80 pt-3">
                {project.full_description}
              </p>
            )}
          </div>

          {/* Section 2: Methodology & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                <span>Research Methodology</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {project.methodology || "Experimental development utilizing transfer learning and dataset curation."}
              </p>
            </div>

            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Technology Stack</span>
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technology_stack.split(',').map((tech, idx) => (
                  <span key={idx} className="text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1 rounded-lg">
                    {tech.strip ? tech.strip() : tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Outcomes (if completed) or Collaboration Offer (if ongoing) */}
          {isCompleted ? (
            <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 p-5 rounded-2xl border border-blue-500/30">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Key Findings & Institutional Impact</span>
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {project.outcome_findings || "Project completed with distinction and archived in Islington permanent research repository."}
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 p-5 rounded-2xl border border-emerald-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Research Collaboration Marketplace</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Seeking <strong className="text-emerald-300">{project.roles_needed || "Student Collaborators"}</strong> ({project.available_positions} positions available).
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Required skills: {project.required_skills}
                  </p>
                </div>

                {!showApplyForm && (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="gradient-btn text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 whitespace-nowrap hover:scale-105 transition-transform"
                  >
                    Express Interest / Join Team
                  </button>
                )}
              </div>

              {/* Express Interest Form */}
              {showApplyForm && (
                <form onSubmit={handleApply} className="mt-5 pt-5 border-t border-emerald-500/20 space-y-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Submit Collaboration Expression of Interest
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        value={applicantName} 
                        onChange={(e) => setApplicantName(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Islington Email</label>
                      <input 
                        type="email" 
                        value={applicantEmail} 
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Relevant Skills</label>
                    <input 
                      type="text" 
                      value={skills} 
                      onChange={(e) => setSkills(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Why do you want to join this research project?</label>
                    <textarea 
                      rows={3}
                      value={motivation} 
                      onChange={(e) => setMotivation(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 gradient-btn text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Submitting..." : "Send Application"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
