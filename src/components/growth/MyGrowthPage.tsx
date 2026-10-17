import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  ExternalLink,
  BookOpen,
  Briefcase,
  Layers,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Achievement, UserSkillGrowth } from '../../types';

export const MyGrowthPage: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    skills,
    achievements,
    addAchievement,
    projects,
    openAIWithPrompt,
    showToast,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [achTitle, setAchTitle] = useState('');
  const [achIssuer, setAchIssuer] = useState('');
  const [achDescription, setAchDescription] = useState('');
  const [achCredentialUrl, setAchCredentialUrl] = useState('');

  const completedProjects = projects.filter(
    (p) => p.currentMembers.includes(currentUser.id) && p.status === 'completed'
  );

  const activeProjects = projects.filter(
    (p) => p.currentMembers.includes(currentUser.id) && p.status !== 'completed'
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim() || !achIssuer.trim()) return;

    addAchievement({
      title: achTitle.trim(),
      issuer: achIssuer.trim(),
      description: achDescription.trim(),
      date: new Date().toLocaleDateString([], { month: 'short', year: 'numeric' }),
      verificationLevel: achCredentialUrl ? 'evidence_submitted' : 'self_reported',
      credentialUrl: achCredentialUrl || undefined,
    });

    setAchTitle('');
    setAchIssuer('');
    setAchDescription('');
    setAchCredentialUrl('');
    setShowAddModal(false);
  };

  const getVerificationPill = (level: Achievement['verificationLevel']) => {
    switch (level) {
      case 'verified':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified by Reviewer
          </span>
        );
      case 'evidence_submitted':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Evidence Submitted
          </span>
        );
      case 'self_reported':
        return (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Self-Reported
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              My Growth &amp; Portfolio
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              3-Tier Verified Growth
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track real university competencies, milestone sign-offs, and verifiable credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() =>
              openAIWithPrompt(
                `Generate a personalized 6-week technical learning roadmap for my current skillset in ${currentUser.skills.join(
                  ', '
                )} targeting frontier software engineering.`
              )
            }
            className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Learning Roadmap</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        </div>
      </div>

      {/* Grid: Skill Matrix + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Matrix */}
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Competency Matrix</h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Grounded in verified project tasks, code reviews, and course deliverables.
            </p>

            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{skill.skill}</span>
                    <span className="font-bold text-slate-600">{skill.level}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 capitalize">{skill.category}</span>
                    {getVerificationPill(skill.verificationLevel)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Collaborations Snapshot */}
          <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Team Collaborations</h3>
            <div className="space-y-2">
              {activeProjects.map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">{p.title}</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {p.milestones.filter((m) => m.completed).length} of {p.milestones.length} milestones complete
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Credentials Portfolio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Achievements &amp; Honors</h3>
                <p className="text-xs text-slate-500">
                  Strictly distinguishes self-reported items from authorized reviewer verifications
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900">{ach.title}</h4>
                          {getVerificationPill(ach.verificationLevel)}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {ach.issuer} • {ach.date}
                        </p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {ach.description}
                        </p>
                      </div>
                    </div>

                    {ach.credentialUrl && (
                      <a
                        href={ach.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-600 flex-shrink-0"
                        title="View credential evidence"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD ACHIEVEMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Add Growth Achievement</h3>
            <p className="text-xs text-slate-500 mb-4">
              Achievements with verifiable links/evidence can be approved by faculty or club reviewers.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TreeHacks 1st Place EdTech Track"
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issuing Organization / Program *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanford ACM Chapter"
                  value={achIssuer}
                  onChange={(e) => setAchIssuer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your role, contribution, and key deliverables..."
                  value={achDescription}
                  onChange={(e) => setAchDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Credential / Evidence URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://devpost.com/software/... or certificate link"
                  value={achCredentialUrl}
                  onChange={(e) => setAchCredentialUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Providing an evidence URL moves the item to "Evidence Submitted" status for peer review.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
