import React from 'react';
import {
  Briefcase,
  Sparkles,
  Calendar,
  Users,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Bot,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomeDashboard: React.FC = () => {
  const {
    currentUniversity,
    currentUser,
    projects,
    opportunities,
    connections,
    users,
    setCurrentTab,
    setSelectedProjectId,
    toggleSaveOpportunity,
    openAIWithPrompt,
    sendConnectionRequest,
    skills,
  } = useApp();

  // Metrics computed from actual state
  const activeProjectsCount = projects.filter((p) => p.currentMembers.includes(currentUser.id)).length;
  const savedOppsCount = opportunities.filter((o) => o.savedByCurrentUser).length;
  const pendingRequestsCount = connections.filter(
    (c) => c.status === 'pending' && c.targetUserId === currentUser.id
  ).length;
  const verifiedSkillsCount = skills.filter((s) => s.verificationLevel === 'verified').length;

  // Filter items strictly by university tenant unless cross-campus
  const tenantProjects = projects.filter(
    (p) => p.universityId === currentUniversity.id || p.isCrossUniversity
  );

  // Featured Opportunity
  const featuredOpp =
    opportunities.find((o) => o.id === 'opp_treehacks_2026') ||
    opportunities.find((o) => o.universityId === currentUniversity.id) ||
    opportunities[0];

  // Recommended connections (explainable AI reasons)
  const otherUsersInTenant = users.filter(
    (u) =>
      u.id !== currentUser.id &&
      (u.universityId === currentUniversity.id || (u.isCrossUniversityAllowed && u.privacy.crossCampusDiscoverable))
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#10132B] via-[#1E2347] to-[#141A3B] text-white shadow-xl relative overflow-hidden border border-[#2A3366]">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-10 w-60 h-60 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                {currentUniversity.name}
              </span>
              {currentUser.verificationStatus === 'verified' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified Student
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
            </h1>

            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Welcome to your university collaboration hub. Discover peers with complementary skills,
              join hackathon teams, and shape campus voice.
            </p>
          </div>

          {/* Quick AI Prompt Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAIWithPrompt('Recommend high-match hackathon teammates based on my skills')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Ask Unify AI</span>
            </button>
            <button
              onClick={() => setCurrentTab('collaboration')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Projects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Overview Metrics (No more than 4-5 compact metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setCurrentTab('collaboration')}
          className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Projects</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeProjectsCount}</span>
            <span className="text-[11px] text-slate-400">teams joined</span>
          </div>
        </div>

        <div
          onClick={() => setCurrentTab('opportunities')}
          className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Saved Opportunities</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{savedOppsCount}</span>
            <span className="text-[11px] text-slate-400">bookmarked</span>
          </div>
        </div>

        <div
          onClick={() => setCurrentTab('discover')}
          className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Requests</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingRequestsCount}</span>
            <span className="text-[11px] text-slate-400">new connections</span>
          </div>
        </div>

        <div
          onClick={() => setCurrentTab('growth')}
          className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Verified Skills</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{verifiedSkillsCount}</span>
            <span className="text-[11px] text-slate-400">peer-verified</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Featured Opportunity + Recommended People */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Featured Opportunity + Active Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Opportunity */}
          {featuredOpp && (
            <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    Featured {featuredOpp.category}
                  </span>
                  {featuredOpp.verificationStatus === 'verified' && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Official University Partner
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleSaveOpportunity(featuredOpp.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    featuredOpp.savedByCurrentUser
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  aria-label="Save opportunity"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                {featuredOpp.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">{featuredOpp.organizer}</p>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                {featuredOpp.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deadline: <strong>{featuredOpp.deadline}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{featuredOpp.locationType} ({featuredOpp.locationDetail || 'Virtual'})</span>
                </div>
              </div>

              {/* Skills tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {featuredOpp.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={featuredOpp.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <span>Official Application Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAIWithPrompt(`Help me write an application strategy for ${featuredOpp.title}`)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Fit Analysis</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('opportunities')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    View All Opportunities
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Collaboration Projects */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Campus Collaboration Posts</h3>
                <p className="text-xs text-slate-500">Student-led initiatives currently seeking teammates</p>
              </div>
              <button
                onClick={() => setCurrentTab('collaboration')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Browse Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {tenantProjects.slice(0, 2).map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setCurrentTab('collaboration');
                  }}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {proj.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{proj.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.description}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold text-indigo-600">
                        {proj.currentMembers.length}/{proj.teamSize} members
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{proj.timeCommitment}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <img
                        src={proj.creatorAvatar}
                        alt={proj.creatorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs text-slate-600 font-medium">Led by {proj.creatorName}</span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 hover:underline">
                      Open Workspace &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Connections + Growth Snapshot */}
        <div className="space-y-6">
          {/* Recommended Connections with Explainable AI Match */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recommended Connections</h3>
                <p className="text-[11px] text-slate-500">Matched by complementary skills &amp; goals</p>
              </div>
              <button
                onClick={() => setCurrentTab('discover')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {otherUsersInTenant.slice(0, 3).map((peer) => {
                const isConnected = connections.some(
                  (c) =>
                    c.status === 'accepted' &&
                    ((c.userId === currentUser.id && c.targetUserId === peer.id) ||
                      (c.userId === peer.id && c.targetUserId === currentUser.id))
                );

                const isPending = connections.some(
                  (c) =>
                    c.status === 'pending' &&
                    c.userId === currentUser.id &&
                    c.targetUserId === peer.id
                );

                return (
                  <div
                    key={peer.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-bold text-slate-900">{peer.name}</h4>
                            {peer.verificationStatus === 'verified' && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">{peer.department}</p>
                        </div>
                      </div>

                      {/* Connection Action */}
                      {isConnected ? (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Connected
                        </span>
                      ) : isPending ? (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => sendConnectionRequest(peer.id)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          Connect
                        </button>
                      )}
                    </div>

                    {/* Explainable AI Reason */}
                    <div className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-[10px] text-indigo-900 flex items-start gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>AI Reason:</strong> Complementary skills in {peer.skills.slice(0, 2).join(' & ')} with shared interest in {peer.interests[0]}.
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Growth Snapshot */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Your Growth Snapshot</h3>
              </div>
              <button
                onClick={() => setCurrentTab('growth')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Open Portfolio
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Skill progress verified through university project completion and faculty sign-offs.
            </p>

            <div className="space-y-3">
              {skills.slice(0, 3).map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{s.skill}</span>
                    <span className="text-slate-400">{s.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => openAIWithPrompt('Generate a 4-week learning roadmap for my skill gaps')}
                className="w-full py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate AI Learning Roadmap</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
