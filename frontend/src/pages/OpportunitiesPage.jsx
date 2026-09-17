import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Filter, 
  ExternalLink, 
  Award, 
  Calendar, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedType, setSelectedType] = useState('All');
  const [nepalOnly, setNepalOnly] = useState(false);
  const [studentsOnly, setStudentsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const types = [
    'All',
    'Grant',
    'Hackathon',
    'Conference',
    'Call for Papers',
    'Fellowship'
  ];

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      let url = `/api/opportunities/?type=${selectedType}`;
      if (nepalOnly) url += `&nepal_only=true`;
      if (studentsOnly) url += `&students_only=true`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const resp = await fetch(url);
      const data = await resp.json();
      setOpportunities(data);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedType, nepalOnly, studentsOnly, searchQuery]);

  const handleTriggerScrape = async () => {
    setIsScraping(true);
    try {
      const resp = await fetch('/api/opportunities/trigger-scrape', { method: 'POST' });
      const data = await resp.json();
      alert(`Data Pipeline Sync Completed! ${data.message}`);
      fetchOpportunities();
    } catch (err) {
      alert(`Scraper error: ${err.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 border border-slate-800/80 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>Branch B — External Opportunity Discovery Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Global Research & Innovation Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Centralized aggregation layer periodically crawling research grants, hackathons, academic conferences, and fellowships worldwide. Normalized and filtered for Islington students and researchers.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleTriggerScrape}
              disabled={isScraping}
              className="gradient-btn text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isScraping ? 'animate-spin' : ''}`} />
              <span>{isScraping ? 'Syncing Scraper Pipeline...' : 'Run Automated Scraper Sync'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        
        {/* Search & Relevance Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grants, hackathons, conferences..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Eligibility Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300 cursor-pointer hover:border-slate-700">
              <input 
                type="checkbox"
                checked={nepalOnly}
                onChange={(e) => setNepalOnly(e.target.checked)}
                className="w-4 h-4 accent-purple-500 rounded"
              />
              <span className="font-semibold text-purple-300">Nepal Eligible Only</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300 cursor-pointer hover:border-slate-700">
              <input 
                type="checkbox"
                checked={studentsOnly}
                onChange={(e) => setStudentsOnly(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
              <span>Student Eligible Only</span>
            </label>
          </div>

        </div>

        {/* Opportunity Type Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Processing global opportunity database...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="py-16 text-center glass-card rounded-3xl border border-slate-800 p-8">
            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Opportunities Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No active opportunities match your filters. Try disabling "Nepal Eligible" or run the Automated Scraper Sync.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <div 
                key={opp.id}
                className="glass-card p-6 rounded-3xl border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="badge badge-opportunity">
                      {opp.opportunity_type}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      <span>{opp.location}</span>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs font-semibold text-purple-400 mb-3">
                    {opp.organization}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Prize / Funding Badge */}
                  {opp.prize_funding && (
                    <div className="mb-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-300">
                      <Award className="w-4 h-4 text-purple-400" />
                      <span>{opp.prize_funding}</span>
                    </div>
                  )}

                  {/* Relevance & Eligibility pills */}
                  <div className="flex flex-wrap gap-2 mb-5 text-[11px]">
                    {opp.nepal_eligible && (
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Nepal Eligible
                      </span>
                    )}
                    {opp.student_eligible && (
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Students Eligible
                      </span>
                    )}
                    <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-md">
                      Relevance: {Math.round(opp.relevance_score * 100)}%
                    </span>
                  </div>

                </div>

                {/* Footer Link & Deadline */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deadline: {opp.deadline || 'Open'}</span>
                  </div>

                  <a 
                    href={opp.application_url || opp.original_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 gradient-btn text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 hover:scale-105 transition-transform"
                  >
                    <span>View Official Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
