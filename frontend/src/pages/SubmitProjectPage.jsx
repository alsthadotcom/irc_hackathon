import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Target,
  Code2,
  Users
} from 'lucide-react';

export default function SubmitProjectPage({ onSubmitted, onCancel }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence');
  const [researchArea, setResearchArea] = useState('Machine Learning');
  const [techStack, setTechStack] = useState('Python, PyTorch, React, FastAPI');
  
  const [problemStatement, setProblemStatement] = useState('');
  const [background, setBackground] = useState('');
  const [objectives, setObjectives] = useState('');
  const [methodology, setMethodology] = useState('');

  const [acceptingCollaborators, setAcceptingCollaborators] = useState(true);
  const [requiredSkills, setRequiredSkills] = useState('Python, Data Analysis, PyTorch');
  const [rolesNeeded, setRolesNeeded] = useState('1 Research Assistant, 1 Frontend Engineer');
  const [availablePositions, setAvailablePositions] = useState(2);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const resp = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          short_description: shortDesc,
          full_description: fullDesc,
          category,
          research_area: researchArea,
          technology_stack: techStack,
          problem_statement: problemStatement,
          background,
          objectives,
          methodology,
          creator_id: 1, // Student Aarav Shrestha
          accepting_collaborators: acceptingCollaborators,
          required_skills: requiredSkills,
          roles_needed: rolesNeeded,
          available_positions: Number(availablePositions)
        })
      });

      const data = await resp.json();
      setSubmissionResult(data);
      setStep(5); // Success step
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Islington Project Validation Pipeline</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Submit Research or Innovation Project
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto mt-2">
          Projects go through automated faculty mentor matching, validation, and discovery. Once approved, your project becomes part of the permanent Islington Research Repository.
        </p>
      </div>

      {/* Step Indicator */}
      {step < 5 && (
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { num: 1, label: "Identity & Domain" },
            { num: 2, label: "Problem & Scope" },
            { num: 3, label: "Methodology & Tech" },
            { num: 4, label: "Team & Collaborators" }
          ].map((s) => (
            <div 
              key={s.num}
              className={`p-3 rounded-2xl border text-center transition-all ${
                step === s.num
                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                  : step > s.num
                  ? 'bg-slate-900 border-slate-700 text-slate-400'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider">Step {s.num}</p>
              <p className="text-xs font-semibold mt-0.5 truncate">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Wizard Form Container */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/80">

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Project Identity & Domain</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Project Title *</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Autonomous Nepali Dialect Translator"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Natural Language Processing">Natural Language Processing</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Medical AI">Medical AI</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                  <option value="Data Science & Analytics">Data Science & Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Research Area</label>
                <input 
                  type="text"
                  value={researchArea}
                  onChange={(e) => setResearchArea(e.target.value)}
                  placeholder="e.g., Machine Learning / NLP"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Short Description / Summary *</label>
              <textarea 
                rows={3}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Provide a concise 2-3 sentence overview of what your project aims to research or construct."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!title || !shortDesc) {
                    alert("Please fill in the project title and short summary.");
                    return;
                  }
                  setStep(2);
                }}
                className="flex items-center gap-2 gradient-btn text-white px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                <span>Next: Problem Definition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span>Problem Statement & Background</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Problem Statement *</label>
              <textarea 
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="What specific research gap or technological problem does this project address?"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Background & Relevance</label>
              <textarea 
                rows={2}
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Why does this problem matter for Islington College, Nepal, or the broader tech ecosystem?"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Project Objectives</label>
              <textarea 
                rows={2}
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="1. Objective A. 2. Objective B."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!problemStatement) {
                    alert("Please provide the problem statement.");
                    return;
                  }
                  setStep(3);
                }}
                className="flex items-center gap-2 gradient-btn text-white px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                <span>Next: Methodology & Tech</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span>Methodology & Technology Stack</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Research & Development Methodology</label>
              <textarea 
                rows={3}
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="Describe your experimental approach, data collection method, model architecture, or software methodology."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Technologies & Frameworks *</label>
              <input 
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., Python, PyTorch, Transformers, React, FastAPI"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-2 gradient-btn text-white px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                <span>Next: Team & Mentor Matching</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Collaboration & Faculty Mentorship</span>
            </h3>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Accept Student Collaborators?</p>
                  <p className="text-[11px] text-slate-400">Allow other Islington students to apply and join your project team.</p>
                </div>
                <input 
                  type="checkbox"
                  checked={acceptingCollaborators}
                  onChange={(e) => setAcceptingCollaborators(e.target.checked)}
                  className="w-5 h-5 accent-indigo-500 rounded"
                />
              </div>

              {acceptingCollaborators && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Required Skills</label>
                    <input 
                      type="text"
                      value={requiredSkills}
                      onChange={(e) => setRequiredSkills(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Available Positions</label>
                    <input 
                      type="number"
                      min={1}
                      max={10}
                      value={availablePositions}
                      onChange={(e) => setAvailablePositions(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Automated Mentor Assignment Preview */}
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Automated Mentor Assignment Engine</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upon submission, the system will match your project domains (<span className="text-indigo-300 font-semibold">{category} / {requiredSkills}</span>) with eligible Islington faculty members (e.g. Dr. Rajesh Sharma, Er. Sunita Adhikari) and dispatch a review invitation.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 gradient-btn text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting into Pipeline..." : "Submit Project"}</span>
              </button>
            </div>
          </div>
        )}

        {step === 5 && submissionResult && (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white font-heading">
                Project Successfully Submitted!
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Your project has entered the <strong className="text-indigo-300">{submissionResult.status}</strong> validation state.
              </p>
            </div>

            {submissionResult.mentor_match && (
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-indigo-500/30 max-w-md mx-auto text-left space-y-1">
                <span className="badge badge-ongoing text-[10px]">Automated Faculty Match</span>
                <p className="text-xs font-bold text-white mt-1">
                  Matched Mentor: {submissionResult.mentor_match.mentor_name}
                </p>
                <p className="text-[11px] text-slate-400">
                  Match Algorithm Score: <strong className="text-emerald-400">{intToPercent(submissionResult.mentor_match.score)} Match</strong>
                </p>
                <p className="text-[10px] text-slate-400 italic mt-1">
                  An automated email request has been dispatched to {submissionResult.mentor_match.mentor_name}.
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onSubmitted}
                className="gradient-btn text-white px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                View Repository Feed
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function intToPercent(score) {
  return `${Math.round(score * 100)}%`;
}
