import React from 'react';
import { 
  Users, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Layers,
  Code2
} from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const isOngoing = project.status === 'ONGOING';
  const isCompleted = project.status === 'COMPLETED';

  return (
    <div 
      onClick={() => onClick(project)}
      className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden border border-slate-800/80 hover:border-indigo-500/40"
    >
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
        isCompleted ? 'from-blue-500 to-cyan-400' : 'from-emerald-400 to-indigo-500'
      }`} />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-ongoing'}`}>
            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {project.status}
          </span>
          <span className="text-xs font-semibold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            {project.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
          {project.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
          {project.short_description}
        </p>

        {/* Required Skills / Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technology_stack.split(',').slice(0, 4).map((tech, idx) => (
            <span key={idx} className="text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md">
              {tech.strip ? tech.strip() : tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        
        {/* Mentor & Team */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate max-w-[140px]">{project.mentor_name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{project.members ? project.members.length : 1} Members</span>
          </div>
        </div>

        {/* Collaboration Banner if ongoing */}
        {isOngoing && project.accepting_collaborators && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-semibold">Seeking Collaborators</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md text-[10px]">
              {project.available_positions} positions
            </span>
          </div>
        )}

        {/* Action link */}
        <div className="flex items-center justify-end text-xs font-bold text-indigo-400 group-hover:text-indigo-300 pt-1">
          <span>View Project Details</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>

      </div>

    </div>
  );
}
