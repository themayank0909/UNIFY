import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Users,
  Clock,
  Globe,
  Shield,
  Layers,
  Music,
  Film,
  Wheat,
  Trophy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CollaborationCategory, ProjectRoleNeeded } from '../../types';
import { MULTIDISCIPLINARY_COLLAB_TYPES, ACADEMIC_FACULTIES } from '../../data/taxonomy';

interface CreateProjectModalProps {
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const { currentUniversity, createProject, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CollaborationCategory>('Hackathon');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript']);
  const [teamSize, setTeamSize] = useState<number>(4);
  const [timeCommitment, setTimeCommitment] = useState('5-8 hrs/week');
  const [duration, setDuration] = useState('4 weeks');
  const [deadline, setDeadline] = useState('2026-11-20');
  const [isCrossUniversity, setIsCrossUniversity] = useState(false);

  // Multidisciplinary roles needed
  const [roleTitle, setRoleTitle] = useState('');
  const [roleField, setRoleField] = useState('');
  const [rolesList, setRolesList] = useState<ProjectRoleNeeded[]>([
    {
      id: 'r_init_1',
      roleTitle: 'Core Lead / Architect',
      fieldOrBranch: 'Technical / Creative Lead',
      skills: ['Architecture', 'Planning'],
      slotsTotal: 1,
      slotsFilled: 1,
    },
  ]);

  const [aiGeneratingPlan, setAiGeneratingPlan] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddRole = () => {
    if (!roleTitle.trim()) return;
    const newRole: ProjectRoleNeeded = {
      id: `r_${Date.now()}`,
      roleTitle: roleTitle.trim(),
      fieldOrBranch: roleField.trim() || 'Any Relevant Field',
      skills: [],
      slotsTotal: 1,
      slotsFilled: 0,
    };
    setRolesList([...rolesList, newRole]);
    setRoleTitle('');
    setRoleField('');
  };

  const handleRemoveRole = (roleId: string) => {
    setRolesList(rolesList.filter((r) => r.id !== roleId));
  };

  const handleAISuggestMilestones = async () => {
    if (!title) {
      showToast('Please enter a project title first');
      return;
    }
    setAiGeneratingPlan(true);
    try {
      const res = await fetch('/api/ai/project-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          teamSize,
        }),
      });
      const data = await res.json();
      if (data.plan?.recommendedRoles) {
        const suggestedSkills = data.plan.recommendedRoles.flatMap((r: any) => r.skills);
        const combined = Array.from(new Set([...skills, ...suggestedSkills])).slice(0, 8);
        setSkills(combined);

        // Also populate suggested multidisciplinary roles
        const suggestedRoles: ProjectRoleNeeded[] = data.plan.recommendedRoles.map(
          (r: any, idx: number) => ({
            id: `ai_r_${idx}_${Date.now()}`,
            roleTitle: r.role,
            fieldOrBranch: r.role,
            skills: r.skills || [],
            slotsTotal: 1,
            slotsFilled: 0,
          })
        );
        setRolesList([rolesList[0], ...suggestedRoles]);
        showToast('AI analyzed project requirements & suggested multidisciplinary roles!');
      }
    } catch (e) {
      showToast('Could not fetch AI plan suggestions. Continuing with manual input.');
    } finally {
      setAiGeneratingPlan(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in title and description.');
      return;
    }

    createProject({
      title: title.trim(),
      description: description.trim(),
      category,
      requiredSkills: skills,
      rolesNeeded: rolesList,
      teamSize,
      timeCommitment,
      duration,
      applicationDeadline: deadline,
      isCrossUniversity,
      universityId: currentUniversity.id,
      creatorId: '',
      creatorName: '',
      creatorAvatar: '',
      status: 'recruiting',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Publish Multidisciplinary Collaboration</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
              Across All Fields
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Recruit teammates across engineering, arts, music, filmmaking, sports, business, or agriculture in {currentUniversity.shortName}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Short Film: Echoes of Campus | Campus Indie Rock Band | Smart Farming IoT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Category & Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Collaboration Field
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {MULTIDISCIPLINARY_COLLAB_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Team Size
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value={2}>2 Members (Duo / Pair)</option>
                <option value={3}>3 Members (Trio / Small Team)</option>
                <option value={4}>4 Members (Standard Crew)</option>
                <option value={5}>5 Members (Full Squad)</option>
                <option value={6}>6+ Members (Large Group / Production)</option>
              </select>
            </div>
          </div>

          {/* Multidisciplinary Team Roles Needed */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Multidisciplinary Roles Needed
              </label>
              <span className="text-[10px] text-slate-500">e.g. Director, Drummer, Agronomist, Designer</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Role Title (e.g. Drummer, Lead Actor, UI/UX Designer, Agronomist)"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="Discipline / Field (e.g. Music, Film, Drama, Engineering)"
                value={roleField}
                onChange={(e) => setRoleField(e.target.value)}
                className="w-full sm:w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            {/* List of roles */}
            <div className="space-y-1.5 pt-1">
              {rolesList.map((r) => (
                <div
                  key={r.id}
                  className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{r.roleTitle}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {r.fieldOrBranch}
                    </span>
                  </div>
                  {r.id !== 'r_init_1' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(r.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description with AI Assistant prompt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Project Description *</label>
              <button
                type="button"
                onClick={handleAISuggestMilestones}
                disabled={aiGeneratingPlan}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{aiGeneratingPlan ? 'Analyzing...' : 'AI Role & Milestone Suggestions'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Explain the project objective, storyline, research problem, or musical vibe, and what each teammate will do..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Required Skills tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skills, Instruments or Talents Required
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Vocals, Cinematography, Python, Soil Testing, Stage Acting..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium flex items-center gap-1"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Time Commitment, Duration, Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Commitment
              </label>
              <input
                type="text"
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Apply Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Cross-University Scope */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="crossUni"
              checked={isCrossUniversity}
              onChange={(e) => setIsCrossUniversity(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="crossUni" className="text-xs text-slate-700 cursor-pointer">
              <strong className="block text-slate-900">Allow Cross-University Applicants</strong>
              Allow verified students from partner universities (e.g. MIT, Berkeley) to discover and apply for this team.
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
            >
              Publish Collaboration Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
