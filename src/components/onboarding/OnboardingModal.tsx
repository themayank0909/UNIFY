import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  School,
  GraduationCap,
  BookOpen,
  Palette,
  Trophy,
  Target,
  Users,
  Search,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ACADEMIC_FACULTIES,
  ALL_ACADEMIC_BRANCHES,
  DEGREE_PROGRAMS,
  STUDY_YEARS,
  CREATIVE_FIELDS,
  SPORTS_AND_LIFESTYLE,
  BUSINESS_CAREER_COMMUNITY,
  MULTIDISCIPLINARY_COLLAB_TYPES,
} from '../../data/taxonomy';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInitial?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  isInitial = false,
}) => {
  const {
    currentUniversity,
    universities,
    switchUniversity,
    currentUser,
    updateCurrentUser,
    showToast,
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedUniId, setSelectedUniId] = useState(currentUser.universityId);
  const [degreeProgram, setDegreeProgram] = useState(
    currentUser.degreeProgram || 'B.Tech / B.E. (Bachelor of Technology / Engineering)'
  );
  const [academicBranch, setAcademicBranch] = useState(
    currentUser.academicBranch || 'Computer Science & Engineering'
  );
  const [customBranch, setCustomBranch] = useState('');
  const [studyYear, setStudyYear] = useState(currentUser.year || 'Junior (3rd Year)');

  // Multi-select items
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentUser.skills || []);
  const [customSkill, setCustomSkill] = useState('');

  const [selectedCreative, setSelectedCreative] = useState<string[]>(
    currentUser.creativeInterests || []
  );
  const [customCreative, setCustomCreative] = useState('');

  const [selectedSports, setSelectedSports] = useState<string[]>(
    currentUser.sportsLifestyle || []
  );
  const [customSport, setCustomSport] = useState('');

  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    currentUser.careerGoals || ['Startup Founder', 'Industry Placement']
  );

  const [selectedCollab, setSelectedCollab] = useState<string[]>(
    currentUser.collaborationPreferences || ['Multidisciplinary Projects', 'Hackathons & Competitions']
  );

  // Search queries for multi-select dropdowns
  const [branchSearch, setBranchSearch] = useState('');
  const [creativeSearch, setCreativeSearch] = useState('');
  const [sportsSearch, setSportsSearch] = useState('');

  if (!isOpen) return null;

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCustomItem = (
    list: string[],
    setList: (l: string[]) => void,
    val: string,
    setVal: (v: string) => void
  ) => {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setVal('');
    }
  };

  const handleFinish = () => {
    const finalBranch = academicBranch === 'Other' ? customBranch || 'Interdisciplinary Studies' : academicBranch;

    if (selectedUniId !== currentUniversity.id) {
      switchUniversity(selectedUniId);
    }

    updateCurrentUser({
      degreeProgram,
      academicBranch: finalBranch,
      department: finalBranch,
      year: studyYear,
      skills: selectedSkills,
      creativeInterests: selectedCreative,
      sportsLifestyle: selectedSports,
      careerGoals: selectedGoals,
      collaborationPreferences: selectedCollab,
    });

    showToast('Your academic and talent profile has been updated!');
    onClose();
  };

  // Filtered branches for searchable selection
  const filteredBranches = ALL_ACADEMIC_BRANCHES.filter(
    (b) =>
      b.branch.toLowerCase().includes(branchSearch.toLowerCase()) ||
      b.faculty.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#10132B] text-white flex items-center justify-between border-b border-[#1E2347] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-xs">
              U
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Customize Your Campus &amp; Talent Profile
              </h2>
              <p className="text-[11px] text-slate-300">
                Step {step} of 4: {step === 1 ? 'Degree & Branch' : step === 2 ? 'Creative Talents' : step === 3 ? 'Sports & Lifestyle' : 'Goals & Collaboration'}
              </p>
            </div>
          </div>

          {!isInitial && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 flex-shrink-0">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8FAFC]">
          {/* STEP 1: University, Degree, Branch & Year */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-indigo-600" />
                  <span>1. University Workspace (Tenant)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unify provides isolated campus workspaces with verified peer discovery.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  {universities.map((uni) => (
                    <button
                      key={uni.id}
                      type="button"
                      onClick={() => setSelectedUniId(uni.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedUniId === uni.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/10'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-800">{uni.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{uni.location}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Degree Program */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  2. Degree Program
                </label>
                <select
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {DEGREE_PROGRAMS.map((dp) => (
                    <option key={dp.id} value={dp.name}>
                      {dp.name} ({dp.level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Branch / Discipline */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    3. Academic Branch or Discipline
                  </label>
                  <span className="text-[11px] text-slate-400">Searchable across all faculties</span>
                </div>

                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search engineering, agriculture, medicine, commerce, law, design..."
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl bg-white p-1 divide-y divide-slate-100">
                  {filteredBranches.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setAcademicBranch(item.branch);
                      }}
                      className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center justify-between ${
                        academicBranch === item.branch
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{item.branch}</span>
                      <span className="text-[10px] text-slate-400">{item.faculty}</span>
                    </div>
                  ))}

                  <div
                    onClick={() => setAcademicBranch('Other')}
                    className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center justify-between ${
                      academicBranch === 'Other' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>Other (Enter custom field below)</span>
                  </div>
                </div>

                {academicBranch === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Specify your academic branch or major..."
                      value={customBranch}
                      onChange={(e) => setCustomBranch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* Study Year */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  4. Current Year of Study
                </label>
                <select
                  value={studyYear}
                  onChange={(e) => setStudyYear(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  {STUDY_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Creative Fields, Talents & Skills */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-pink-600" />
                    <span>Creative Fields, Music, Arts &amp; Talents</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {selectedCreative.length} selected
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Select talents beyond your academic degree (music, filmmaking, dance, theatre, design, writing, speaking).
                </p>

                <div className="relative my-2">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search music, instruments, dance, photography, filmmaking..."
                    value={creativeSearch}
                    onChange={(e) => setCreativeSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-white flex flex-wrap gap-1.5">
                  {CREATIVE_FIELDS.filter((f) =>
                    f.toLowerCase().includes(creativeSearch.toLowerCase())
                  ).map((talent) => {
                    const isSelected = selectedCreative.includes(talent);
                    return (
                      <button
                        key={talent}
                        type="button"
                        onClick={() => toggleItem(selectedCreative, setSelectedCreative, talent)}
                        className={`text-xs px-2.5 py-1 rounded-xl border text-left transition-colors ${
                          isSelected
                            ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {talent}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Creative Talent */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add other creative talent or instrument..."
                    value={customCreative}
                    onChange={(e) => setCustomCreative(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomItem(selectedCreative, setSelectedCreative, customCreative, setCustomCreative);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addCustomItem(selectedCreative, setSelectedCreative, customCreative, setCustomCreative)
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Technical & Professional Skills */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Technical, Clinical or Professional Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. PyTorch, DaVinci Resolve, Soil Testing, CAD, Moot Court..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomItem(selectedSkills, setSelectedSkills, customSkill, setCustomSkill);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addCustomItem(selectedSkills, setSelectedSkills, customSkill, setCustomSkill)
                    }
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                        className="text-indigo-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Sports & Lifestyle Interests */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Sports, Fitness &amp; Lifestyle Hobbies</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {selectedSports.length} selected
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Find teammates for intramural matches, gym partners, outdoor adventures, or board game sessions.
              </p>

              <div className="relative my-2">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cricket, football, badminton, gym, trekking, esports..."
                  value={sportsSearch}
                  onChange={(e) => setSportsSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-white flex flex-wrap gap-1.5">
                {SPORTS_AND_LIFESTYLE.filter((s) =>
                  s.toLowerCase().includes(sportsSearch.toLowerCase())
                ).map((sport) => {
                  const isSelected = selectedSports.includes(sport);
                  return (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleItem(selectedSports, setSelectedSports, sport)}
                      className={`text-xs px-2.5 py-1 rounded-xl border text-left transition-colors ${
                        isSelected
                          ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {sport}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Sport/Hobby */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add other sport or recreational hobby..."
                  value={customSport}
                  onChange={(e) => setCustomSport(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomItem(selectedSports, setSelectedSports, customSport, setCustomSport);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={() =>
                    addCustomItem(selectedSports, setSelectedSports, customSport, setCustomSport)
                  }
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Career Goals & Collaboration Preferences */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Career Ambitions &amp; Growth Goals</span>
                </h3>
                <p className="text-xs text-slate-500 mb-2">
                  Helps Unify connect you with peers with shared ambitions or alumni mentors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BUSINESS_CAREER_COMMUNITY.map((goal) => {
                    const isSelected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleItem(selectedGoals, setSelectedGoals, goal)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{goal}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Preferred Collaboration Types</span>
                </h3>
                <p className="text-xs text-slate-500 mb-2">
                  What kinds of teams and multidisciplinary initiatives do you want to join?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MULTIDISCIPLINARY_COLLAB_TYPES.map((type) => {
                    const isSelected = selectedCollab.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => toggleItem(selectedCollab, setSelectedCollab, type.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{type.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save &amp; Complete Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
