import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  Check,
  X,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CollaborationProject, ProjectApplication } from '../../types';
import { CreateProjectModal } from './CreateProjectModal';
import { ProjectWorkspaceModal } from './ProjectWorkspaceModal';

export const CollaborationHub: React.FC = () => {
  const {
    currentUniversity,
    currentUser,
    projects,
    users,
    applyToProject,
    acceptApplicant,
    rejectApplicant,
    selectedProjectId,
    setSelectedProjectId,
    openAIWithPrompt,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showCrossCampusOnly, setShowCrossCampusOnly] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Application modal state
  const [applyingProject, setApplyingProject] = useState<CollaborationProject | null>(null);
  const [applyStatement, setApplyStatement] = useState('');
  const [applyHours, setApplyHours] = useState(6);

  // Active workspace modal state
  const [workspaceProject, setWorkspaceProject] = useState<CollaborationProject | null>(null);

  // When selectedProjectId changes externally, open it
  React.useEffect(() => {
    if (selectedProjectId) {
      const p = projects.find((proj) => proj.id === selectedProjectId);
      if (p) setWorkspaceProject(p);
    }
  }, [selectedProjectId, projects]);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'Hackathon', label: 'Hackathons & Tech' },
    { id: 'Music & Performance', label: 'Music & Bands' },
    { id: 'Film & Media', label: 'Film & Media' },
    { id: 'Agriculture & Sustainability', label: 'Agriculture & Earth' },
    { id: 'Sports & Tournaments', label: 'Sports & Athletics' },
    { id: 'Startup', label: 'Startups & Ventures' },
    { id: 'Research', label: 'Research & Labs' },
    { id: 'Social Impact', label: 'Social Impact' },
    { id: 'Cultural & Events', label: 'Cultural & Fests' },
  ];

  // Tenant Isolation: Only show projects belonging to current university OR explicitly approved for cross-university
  const filteredProjects = projects.filter((p) => {
    const isTenantMatch = p.universityId === currentUniversity.id || p.isCrossUniversity;
    if (!isTenantMatch) return false;

    if (showCrossCampusOnly && !p.isCrossUniversity) return false;
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;

    return true;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingProject) return;
    applyToProject(applyingProject.id, applyStatement, applyHours);
    setApplyingProject(null);
    setApplyStatement('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Collaboration Hub
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Multidisciplinary Teams
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Recruit teammates across engineering, music, filmmaking, sports, business, and agriculture in private project workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() =>
              openAIWithPrompt(
                'Help me draft a clear, engaging multidisciplinary collaboration post looking for team roles across different university faculties.'
              )
            }
            className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Multidisciplinary Pitch</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Collaboration</span>
          </button>
        </div>
      </div>

      {/* Categories & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer self-start sm:self-auto select-none px-2 flex-shrink-0">
          <input
            type="checkbox"
            checked={showCrossCampusOnly}
            onChange={(e) => setShowCrossCampusOnly(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Cross-university only</span>
        </label>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No active collaboration posts in this category</h3>
            <p className="text-xs text-slate-500 mt-1">
              Be the first to publish a project idea or team recruitment post in {currentUniversity.name}!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Collaboration</span>
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const isMember = project.currentMembers.includes(currentUser.id);
            const isCreator = project.creatorId === currentUser.id;

            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Category, scope badge, team count */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {project.category}
                      </span>
                      {project.isCrossUniversity && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Cross-Campus
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-indigo-600">
                      {project.currentMembers.length}/{project.teamSize} Members
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Open Roles Needed */}
                  {project.rolesNeeded && project.rolesNeeded.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                        Open Team Roles
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.rolesNeeded.map((r) => (
                          <span
                            key={r.id}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold"
                          >
                            🎯 {r.roleTitle} ({r.fieldOrBranch || 'Open'})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Skills */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Required Skills &amp; Proficiencies
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.requiredSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timing & Deadline details */}
                  <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{project.timeCommitment}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Deadline: {project.applicationDeadline}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Creator Info & Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={project.creatorAvatar}
                      alt={project.creatorName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-none">
                        {project.creatorName}
                      </p>
                      <p className="text-[10px] text-slate-400">Project Lead</p>
                    </div>
                  </div>

                  {/* Dynamic Action: Open Workspace (if member) vs Apply (if open) */}
                  {isMember ? (
                    <button
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setWorkspaceProject(project);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Workspace</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setApplyingProject(project)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors border border-indigo-200"
                    >
                      <span>Apply to Join</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* STEP 2 MODAL: APPLY TO JOIN PROJECT */}
      {applyingProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setApplyingProject(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                Step 2 of 5: Project Application
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Apply to join "{applyingProject.title}"
              </h3>
              <p className="text-xs text-slate-500">
                Lead: {applyingProject.creatorName} ({currentUniversity.shortName})
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Why are you interested and what skills do you bring? *
                </label>
                <textarea
                  rows={4}
                  placeholder="Mention your relevant experience with the required tech stack and what role you'd like to take..."
                  value={applyStatement}
                  onChange={(e) => setApplyStatement(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Available weekly commitment (hours)
                </label>
                <input
                  type="number"
                  min={2}
                  max={40}
                  value={applyHours}
                  onChange={(e) => setApplyHours(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>
                  Your application will be matched against the project's requirements with explainable AI scoring for the project lead.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingProject(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 1 MODAL: CREATE PROJECT */}
      {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} />}

      {/* STEP 4 & 5 MODAL: PROJECT WORKSPACE */}
      {workspaceProject && (
        <ProjectWorkspaceModal
          project={workspaceProject}
          onClose={() => {
            setWorkspaceProject(null);
            setSelectedProjectId(null);
          }}
        />
      )}
    </div>
  );
};
