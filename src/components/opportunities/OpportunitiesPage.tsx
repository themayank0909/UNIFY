import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Shield,
  Bot,
  Layers,
  ChevronRight,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';

export const OpportunitiesPage: React.FC = () => {
  const {
    currentUniversity,
    currentUser,
    opportunities,
    toggleSaveOpportunity,
    updateOpportunityApplicationStatus,
    openAIWithPrompt,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [selectedOppForFit, setSelectedOppForFit] = useState<Opportunity | null>(null);

  const categories = [
    'all',
    'Hackathon',
    'Research',
    'Open Source',
    'Competition',
    'Internship',
    'Scholarship',
  ];

  // Tenant & Filter Logic:
  // Show campus-specific opportunities for currentUniversity OR verified cross-campus listings
  const filteredOpps = opportunities.filter((o) => {
    // Tenant check
    const isTenantMatch = !o.universityId || o.universityId === currentUniversity.id || o.isCrossUniversity;
    if (!isTenantMatch) return false;

    if (showSavedOnly && !o.savedByCurrentUser) return false;
    if (selectedCategory !== 'all' && o.category !== selectedCategory) return false;
    if (selectedLocation !== 'all' && o.locationType !== selectedLocation) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = o.title.toLowerCase().includes(q);
      const matchOrg = o.organizer.toLowerCase().includes(q);
      const matchSkills = o.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchOrg && !matchSkills) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Opportunities Directory
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Listings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curated hackathons, research labs, grants, and internships with official application links.
          </p>
        </div>

        <button
          onClick={() =>
            openAIWithPrompt(
              `Analyze available opportunities against my background: ${currentUser.department}, skills in ${currentUser.skills.join(', ')}. Which should I prioritize applying for this month?`
            )
          }
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:shadow transition-all self-start md:self-auto"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Opportunity Matcher</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, organizer, or skill (e.g. TreeHacks, PyTorch, Research)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="all">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="In-Person">In-Person Campus</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSavedOnly}
              onChange={(e) => setShowSavedOnly(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show my saved bookmarks ({opportunities.filter((o) => o.savedByCurrentUser).length})</span>
          </label>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOpps.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No matching opportunities found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try broadening your category filter or search keywords.
            </p>
          </div>
        ) : (
          filteredOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header row: Category pill, verification status, save action */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {opp.category}
                    </span>
                    {opp.verificationStatus === 'verified' && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Official
                      </span>
                    )}
                    {opp.isCrossUniversity && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        Multi-Campus
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className={`p-1.5 rounded-xl transition-colors ${
                      opp.savedByCurrentUser
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    aria-label="Save opportunity"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Title & Organizer */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">{opp.title}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{opp.organizer}</p>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                {/* Eligibility & Dates */}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Deadline: <strong>{opp.deadline}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{opp.locationType} {opp.locationDetail ? `(${opp.locationDetail})` : ''}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-1">
                    Eligibility: {opp.eligibility}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {opp.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Application Tracking & External Link */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                    <select
                      value={opp.applicationStatus || 'Saved'}
                      onChange={(e) =>
                        updateOpportunityApplicationStatus(opp.id, e.target.value as any)
                      }
                      className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                    >
                      <option value="Saved">Saved</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Accepted">Accepted / Offer</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>

                  <button
                    onClick={() =>
                      openAIWithPrompt(
                        `How well does my profile match "${opp.title}"? What should I highlight in my application?`
                      )
                    }
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Fit Analysis</span>
                  </button>
                </div>

                {/* External Official Link Banner */}
                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={opp.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Visit Official Application Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
