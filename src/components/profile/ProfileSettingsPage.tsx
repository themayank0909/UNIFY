import React, { useState } from 'react';
import {
  User,
  Shield,
  CheckCircle2,
  Clock,
  Mail,
  Lock,
  Bell,
  Eye,
  Sliders,
  Save,
  Globe,
  Upload,
  Sparkles,
  Palette,
  Trophy,
  Target,
  Users,
  Search,
  BookOpen,
  GraduationCap,
  Plus,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  DEGREE_PROGRAMS,
  STUDY_YEARS,
  ALL_ACADEMIC_BRANCHES,
  ACADEMIC_FACULTIES,
  CREATIVE_FIELDS,
  SPORTS_AND_LIFESTYLE,
  MULTIDISCIPLINARY_COLLAB_TYPES,
} from '../../data/taxonomy';

export const ProfileSettingsPage: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    updateCurrentUser,
    requestVerification,
    switchUserRole,
    openOnboarding,
    showToast,
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [degreeProgram, setDegreeProgram] = useState(
    currentUser.degreeProgram || 'B.Tech / B.E. (Bachelor of Technology / Engineering)'
  );
  const [academicBranch, setAcademicBranch] = useState(
    currentUser.academicBranch || currentUser.department || 'Computer Science & Engineering'
  );
  const [customBranch, setCustomBranch] = useState('');
  const [year, setYear] = useState(currentUser.year || 'Junior (3rd Year)');
  const [bio, setBio] = useState(currentUser.bio);
  const [availability, setAvailability] = useState(currentUser.availability);

  // Multi-select categories
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [creativeInterests, setCreativeInterests] = useState<string[]>(
    currentUser.creativeInterests || []
  );
  const [newCreativeInput, setNewCreativeInput] = useState('');

  const [sportsLifestyle, setSportsLifestyle] = useState<string[]>(
    currentUser.sportsLifestyle || []
  );
  const [newSportInput, setNewSportInput] = useState('');

  const [careerGoals, setCareerGoals] = useState<string[]>(
    currentUser.careerGoals || ['Startup Founder', 'Industry Placement']
  );
  const [newGoalInput, setNewGoalInput] = useState('');

  const [collabPrefs, setCollabPrefs] = useState<string[]>(
    currentUser.collaborationPreferences || ['Multidisciplinary Projects']
  );

  // Privacy toggles
  const [showEmail, setShowEmail] = useState(currentUser.privacy.showEmail);
  const [allowDMs, setAllowDMs] = useState(currentUser.privacy.allowDirectMessages);
  const [crossCampus, setCrossCampus] = useState(currentUser.privacy.crossCampusDiscoverable);

  const toggleArrayItem = (list: string[], setList: (arr: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCustomItem = (
    list: string[],
    setList: (arr: string[]) => void,
    val: string,
    setVal: (v: string) => void
  ) => {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setVal('');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBranch =
      academicBranch === 'Other' ? customBranch.trim() || 'Interdisciplinary Studies' : academicBranch;

    updateCurrentUser({
      name: name.trim(),
      degreeProgram,
      academicBranch: finalBranch,
      department: finalBranch,
      year: year.trim(),
      bio: bio.trim(),
      availability: availability as any,
      skills,
      interests: [...creativeInterests, ...sportsLifestyle],
      creativeInterests,
      sportsLifestyle,
      careerGoals,
      collaborationPreferences: collabPrefs,
      privacy: {
        showEmail,
        allowDirectMessages: allowDMs,
        crossCampusDiscoverable: crossCampus,
      },
    });

    showToast('Profile and university talent preferences saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Wizard Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Profile &amp; Talent Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your academic branch, creative talents, sports interests, and collaboration preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={openOnboarding}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Interactive Onboarding Wizard</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Verification Status Card */}
        <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200"
              />
              {currentUser.verificationStatus === 'verified' && (
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] text-slate-600 font-medium">
                  {currentUniversity.name}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">• Tenant Verified</span>
              </div>
            </div>
          </div>

          <div>
            {currentUser.verificationStatus === 'verified' ? (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Enrollment</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => requestVerification()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Re-submit Proof
              </button>
            )}
          </div>
        </div>

        {/* 1. Academic Credentials & Program */}
        <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">1. Academic Branch &amp; Degree Program</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Looking for Team">Looking for Team (Active Recruiter)</option>
                <option value="Available">Available for Projects</option>
                <option value="Busy">Busy (Coursework / Exams)</option>
                <option value="Mentoring">Offering Mentorship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree Program
              </label>
              <select
                value={degreeProgram}
                onChange={(e) => setDegreeProgram(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {DEGREE_PROGRAMS.map((dp) => (
                  <option key={dp.id} value={dp.name}>
                    {dp.name} ({dp.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {STUDY_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Branch / Department (All Disciplines)
              </label>
              <select
                value={academicBranch}
                onChange={(e) => setAcademicBranch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {ALL_ACADEMIC_BRANCHES.map((b, idx) => (
                  <option key={idx} value={b.branch}>
                    {b.branch} — [{b.faculty}]
                  </option>
                ))}
                <option value="Other">Other (Custom Specialization / Major)</option>
              </select>

              {academicBranch === 'Other' && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter custom academic discipline or interdisciplinary program..."
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Briefly describe what you study, your active projects, and what kind of collaborators you are excited to meet..."
              />
            </div>
          </div>
        </div>

        {/* 2. Technical & Clinical Skills */}
        <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">2. Technical &amp; Professional Skills</h3>
          </div>
          <p className="text-xs text-slate-500">
            Skills related to your major, technical tools, clinical competencies, or frameworks.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. React, GIS, Soil Testing, CAD, PyTorch, Moot Court)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomItem(skills, setSkills, newSkillInput, setNewSkillInput);
                }
              }}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={() => addCustomItem(skills, setSkills, newSkillInput, setNewSkillInput)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => setSkills(skills.filter((s) => s !== skill))}
                  className="text-indigo-400 hover:text-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 3. Creative Talents & Arts */}
        <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-600" />
              <h3 className="text-sm font-bold text-slate-900">3. Creative Talents &amp; Arts</h3>
            </div>
            <span className="text-[11px] font-semibold text-pink-600">
              {creativeInterests.length} selected
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Music, singing, filmmaking, photography, drama, writing, dance, or visual design.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add other talent or instrument (e.g. Drums, Synthesizers, Stand-up)..."
              value={newCreativeInput}
              onChange={(e) => setNewCreativeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomItem(creativeInterests, setCreativeInterests, newCreativeInput, setNewCreativeInput);
                }
              }}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
            <button
              type="button"
              onClick={() =>
                addCustomItem(creativeInterests, setCreativeInterests, newCreativeInput, setNewCreativeInput)
              }
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
            {CREATIVE_FIELDS.map((field) => {
              const isSelected = creativeInterests.includes(field);
              return (
                <button
                  key={field}
                  type="button"
                  onClick={() => toggleArrayItem(creativeInterests, setCreativeInterests, field)}
                  className={`text-xs px-2.5 py-1 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {field}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Sports & Lifestyle Hobbies */}
        <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">4. Sports, Athletics &amp; Lifestyle</h3>
            </div>
            <span className="text-[11px] font-semibold text-amber-700">
              {sportsLifestyle.length} selected
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Intramural games, gym, outdoor recreation, running, chess, or esports.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add other sport or recreational hobby (e.g. Rowing, Pickleball)..."
              value={newSportInput}
              onChange={(e) => setNewSportInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomItem(sportsLifestyle, setSportsLifestyle, newSportInput, setNewSportInput);
                }
              }}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
            <button
              type="button"
              onClick={() =>
                addCustomItem(sportsLifestyle, setSportsLifestyle, newSportInput, setNewSportInput)
              }
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
            {SPORTS_AND_LIFESTYLE.map((sport) => {
              const isSelected = sportsLifestyle.includes(sport);
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => toggleArrayItem(sportsLifestyle, setSportsLifestyle, sport)}
                  className={`text-xs px-2.5 py-1 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {sport}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Career Goals & Collaboration Preferences */}
        <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">5. Goals &amp; Collaboration Types</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Career &amp; Growth Ambitions
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Startup Founder',
                'Industry Placement',
                'Research & Academia',
                'Creative Professional',
                'Civil Services & Policy',
                'Freelancing & Consulting',
                'Social Impact & Non-Profit',
                'Corporate Leadership',
              ].map((g) => {
                const isSelected = careerGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleArrayItem(careerGoals, setCareerGoals, g)}
                    className={`text-xs px-2.5 py-1 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Preferred Collaboration Projects
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MULTIDISCIPLINARY_COLLAB_TYPES.map((type) => {
                const isSelected = collabPrefs.includes(type.label);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleArrayItem(collabPrefs, setCollabPrefs, type.label)}
                    className={`text-xs px-2.5 py-1 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6. Privacy & Visibility Settings */}
        <div className="p-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Privacy &amp; Safety Controls</h3>
            <p className="text-xs text-slate-500">
              Control what information is shared with peers across your university and partner campuses.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-800">Show University Email on Profile</p>
                <p className="text-[11px] text-slate-500">
                  Allow verified connections to view your official campus email.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showEmail}
                onChange={(e) => setShowEmail(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-800">Allow Direct Messaging</p>
                <p className="text-[11px] text-slate-500">
                  Permit incoming message requests from accepted student connections.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowDMs}
                onChange={(e) => setAllowDMs(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-800">Cross-Campus Discoverability</p>
                <p className="text-[11px] text-slate-500">
                  Allow verified students from partner universities (e.g. MIT, Berkeley) to view your profile for approved inter-university hackathon teams.
                </p>
              </div>
              <input
                type="checkbox"
                checked={crossCampus}
                onChange={(e) => setCrossCampus(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Save Changes button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile &amp; Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
