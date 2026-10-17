import React, { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  UserPlus,
  Clock,
  Shield,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  Palette,
  Trophy,
  Wheat,
  Scale,
  HeartPulse,
  SlidersHorizontal,
  X,
  Target,
  School,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { ProfileModal } from './ProfileModal';
import {
  ACADEMIC_FACULTIES,
  ALL_ACADEMIC_BRANCHES,
  CREATIVE_FIELDS,
  SPORTS_AND_LIFESTYLE,
  MULTIDISCIPLINARY_COLLAB_TYPES,
  STUDY_YEARS,
} from '../../data/taxonomy';

export const DiscoverPage: React.FC = () => {
  const {
    currentUniversity,
    universities,
    currentUser,
    users,
    connections,
    sendConnectionRequest,
    acceptConnection,
    declineConnection,
    startDirectConversation,
    openAIWithPrompt,
  } = useApp();

  const [search, setSearch] = useState('');

  // 8 Dedicated Filters
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedCreative, setSelectedCreative] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedGoal, setSelectedGoal] = useState<string>('all');
  const [selectedUni, setSelectedUni] = useState<string>(currentUniversity.id);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCollab, setSelectedCollab] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(true);
  const [activeModalUser, setActiveModalUser] = useState<User | null>(null);

  // Incoming pending requests
  const incomingPending = connections.filter(
    (c) => c.status === 'pending' && c.targetUserId === currentUser.id
  );

  // Dynamic lists from user pool
  const allAvailableSkills = Array.from(
    new Set(users.flatMap((u) => u.skills || []))
  ).sort();

  const allAvailableGoals = [
    'Startup Founder',
    'Industry Placement',
    'Research & Academia',
    'Creative Professional',
    'Civil Services & Policy',
    'Freelancing & Independent Consulting',
    'Social Impact, NGO & Volunteering',
    'Corporate Leadership',
  ];

  // Branches filtered by faculty if selected
  const availableBranches =
    selectedFaculty === 'all'
      ? ALL_ACADEMIC_BRANCHES
      : ALL_ACADEMIC_BRANCHES.filter((b) => {
          const fac = ACADEMIC_FACULTIES.find((f) => f.id === selectedFaculty);
          return fac ? fac.branches.includes(b.branch) : true;
        });

  // Multidisciplinary & Tenant Filtering
  const filteredUsers = users.filter((u) => {
    if (u.id === currentUser.id) return false;

    // 1. University Filter
    if (selectedUni !== 'all') {
      if (u.universityId !== selectedUni) return false;
    } else {
      // If 'all' universities selected, honor user's cross-campus privacy preferences
      if (
        u.universityId !== currentUniversity.id &&
        (!u.isCrossUniversityAllowed || !u.privacy.crossCampusDiscoverable)
      ) {
        return false;
      }
    }

    // 2. Academic Faculty & Branch Filter
    if (selectedFaculty !== 'all') {
      const fac = ACADEMIC_FACULTIES.find((f) => f.id === selectedFaculty);
      if (fac) {
        const matchesFaculty =
          fac.branches.some(
            (b) =>
              u.academicBranch?.toLowerCase().includes(b.toLowerCase()) ||
              u.department?.toLowerCase().includes(b.toLowerCase())
          ) || u.department.toLowerCase().includes(fac.name.toLowerCase());
        if (!matchesFaculty) return false;
      }
    }

    if (selectedBranch !== 'all') {
      const bLower = selectedBranch.toLowerCase();
      const matchB =
        (u.academicBranch || '').toLowerCase().includes(bLower) ||
        u.department.toLowerCase().includes(bLower);
      if (!matchB) return false;
    }

    // 3. Skills Filter
    if (selectedSkill !== 'all') {
      const matchSkill = (u.skills || []).some(
        (s) => s.toLowerCase() === selectedSkill.toLowerCase()
      );
      if (!matchSkill) return false;
    }

    // 4. Creative Talents Filter
    if (selectedCreative !== 'all') {
      const matchCreative = (u.creativeInterests || []).some((c) =>
        c.toLowerCase().includes(selectedCreative.toLowerCase())
      );
      if (!matchCreative) return false;
    }

    // 5. Sports & Lifestyle Filter
    if (selectedSport !== 'all') {
      const matchSport = (u.sportsLifestyle || []).some((s) =>
        s.toLowerCase().includes(selectedSport.toLowerCase())
      );
      if (!matchSport) return false;
    }

    // 6. Career Goals Filter
    if (selectedGoal !== 'all') {
      const matchGoal = (u.careerGoals || []).some((g) =>
        g.toLowerCase().includes(selectedGoal.toLowerCase())
      );
      if (!matchGoal) return false;
    }

    // 7. Year of Study Filter
    if (selectedYear !== 'all' && u.year !== selectedYear) return false;

    // 8. Collaboration Preferences Filter
    if (selectedCollab !== 'all') {
      const matchCollab = (u.collaborationPreferences || []).some((col) =>
        col.toLowerCase().includes(selectedCollab.toLowerCase())
      );
      if (!matchCollab) return false;
    }

    // Role check
    if (selectedRole !== 'all' && u.role !== selectedRole) return false;

    // Availability check
    if (selectedAvailability !== 'all' && u.availability !== selectedAvailability) return false;

    // Search query check across name, branch, skills, talents, and sports
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchBranchName = (u.academicBranch || '').toLowerCase().includes(q);
      const matchDept = u.department.toLowerCase().includes(q);
      const matchSkills = (u.skills || []).some((s) => s.toLowerCase().includes(q));
      const matchCreative = (u.creativeInterests || []).some((c) => c.toLowerCase().includes(q));
      const matchSports = (u.sportsLifestyle || []).some((sp) => sp.toLowerCase().includes(q));
      const matchInterests = (u.interests || []).some((i) => i.toLowerCase().includes(q));
      if (
        !matchName &&
        !matchBranchName &&
        !matchDept &&
        !matchSkills &&
        !matchCreative &&
        !matchSports &&
        !matchInterests
      ) {
        return false;
      }
    }

    return true;
  });

  const getAIMatchReason = (peer: User) => {
    // 1. Musician + Vocalist / Instrumentalist synergy
    if (
      (currentUser.creativeInterests?.some((c) => c.includes('Guitar') || c.includes('Music Production')) ||
        currentUser.skills.includes('Acoustic Guitar')) &&
      (peer.creativeInterests?.some((c) => c.includes('Singing') || c.includes('Vocals')) ||
        peer.skills.includes('Vocals'))
    ) {
      return `Musical Compatibility: Rohan’s vocals and songwriting complement your instrumentals for an original EP or live gig!`;
    }

    // 2. Photographer + Filmmaker / Video Editor synergy
    if (
      (currentUser.creativeInterests?.some((c) => c.includes('Photography')) || currentUser.skills.includes('Photography')) &&
      (peer.creativeInterests?.some((c) => c.includes('Filmmaking') || c.includes('Cinematography')) ||
        peer.academicBranch?.includes('Film'))
    ) {
      return `Film & Media Synergy: Sarah is scouting photographers and sound engineers for a 15-minute campus short film.`;
    }

    // 3. Developer / Tech + Agriculture / Sustainable Farming synergy
    if (
      (currentUser.department.includes('Computer') || currentUser.academicBranch?.includes('Computer')) &&
      (peer.academicBranch?.includes('Agriculture') || peer.department.includes('Agriculture'))
    ) {
      return `AgriTech Synergy: Pair your software/IoT automation skills with Kavita’s agronomy and plant science expertise!`;
    }

    // 4. Developer + UI/UX Designer synergy
    if (
      currentUser.skills.some((s) => ['React', 'TypeScript', 'Node.js', 'Python'].includes(s)) &&
      (peer.skills.some((s) => ['Figma', 'UI/UX', 'Product Design'].includes(s)) ||
        peer.academicBranch?.includes('Design'))
    ) {
      return `Product Team Match: Elena brings expert Figma UI/UX design to elevate your engineering prototypes.`;
    }

    // 5. Entrepreneur / Startup Founder synergy
    if (
      currentUser.careerGoals?.includes('Startup Founder') &&
      (peer.careerGoals?.includes('Startup Founder') || peer.skills.includes('Business Modeling'))
    ) {
      return `Co-Founder Match: Shared startup ambitions with complementary execution capabilities.`;
    }

    // 6. Athlete + Sports Teammates synergy
    const sharedSports = (currentUser.sportsLifestyle || []).filter((s) =>
      (peer.sportsLifestyle || []).includes(s)
    );
    if (sharedSports.length > 0) {
      return `Sports Synergy: Both play ${sharedSports[0]}. Perfect for inter-collegiate tournaments and weekend practice!`;
    }

    // 7. Shared Creative Talents
    const sharedCreative = (currentUser.creativeInterests || []).filter((c) =>
      (peer.creativeInterests || []).includes(c)
    );
    if (sharedCreative.length > 0) {
      return `Creative Synergy: Shared passion for ${sharedCreative[0]}. Great match for artistic collaborations!`;
    }

    // 8. Faculty Mentorship
    if (peer.role === 'faculty_mentor') {
      return `Academic Mentorship: Faculty guidance in ${peer.department} research initiatives.`;
    }

    return `Complementary Skills: ${peer.skills.slice(0, 2).join(' & ')} with shared drive for campus innovation.`;
  };

  const clearAllFilters = () => {
    setSelectedFaculty('all');
    setSelectedBranch('all');
    setSelectedSkill('all');
    setSelectedCreative('all');
    setSelectedSport('all');
    setSelectedGoal('all');
    setSelectedUni(currentUniversity.id);
    setSelectedYear('all');
    setSelectedCollab('all');
    setSelectedAvailability('all');
    setSelectedRole('all');
    setSearch('');
  };

  const hasActiveFilters =
    selectedFaculty !== 'all' ||
    selectedBranch !== 'all' ||
    selectedSkill !== 'all' ||
    selectedCreative !== 'all' ||
    selectedSport !== 'all' ||
    selectedGoal !== 'all' ||
    selectedUni !== currentUniversity.id ||
    selectedYear !== 'all' ||
    selectedCollab !== 'all' ||
    selectedAvailability !== 'all' ||
    selectedRole !== 'all' ||
    Boolean(search.trim());

  return (
    <div className="space-y-6">
      {/* Header & Isolation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Discover People &amp; Talents
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              {currentUniversity.shortName} Network
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Connect across academic branches, musical talents, filmmaking, sports, and startup ventures.
          </p>
        </div>

        {/* AI Teammate Finder shortcut */}
        <button
          onClick={() =>
            openAIWithPrompt(
              'Analyze my skills, creative talents, and sports interests to recommend matching teammates or collaborators across all university departments.'
            )
          }
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:shadow transition-all self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Multidisciplinary Matchmaker</span>
        </button>
      </div>

      {/* Incoming Connection Requests Banner */}
      {incomingPending.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Incoming Connection Requests ({incomingPending.length})</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {incomingPending.map((conn) => {
              const sender = users.find((u) => u.id === conn.userId);
              if (!sender) return null;
              return (
                <div
                  key={conn.id}
                  className="p-3 bg-white rounded-xl border border-indigo-100 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={sender.avatar}
                      alt={sender.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sender.name}</h4>
                      <p className="text-[10px] text-slate-500">{sender.academicBranch || sender.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => acceptConnection(conn.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineConnection(conn.id)}
                      className="px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8-Filter Comprehensive Directory Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, academic discipline, creative talent (vocals, guitar, camera), sport, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filter Controls Grid: 8 Separate Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {/* 1. Academic Faculty */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <School className="w-3 h-3 text-slate-400" />
              <span>Academic Stream</span>
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                setSelectedBranch('all');
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Academic Streams</option>
              {ACADEMIC_FACULTIES.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Specific Academic Branch */}
          <div>
            <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-indigo-500" />
              <span>Academic Branch</span>
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-indigo-50/40 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Any Branch / Department</option>
              {availableBranches.map((item, idx) => (
                <option key={idx} value={item.branch}>
                  {item.branch}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Skills Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>Skill Set</span>
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Any Skill</option>
              {allAvailableSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Creative Arts & Talents */}
          <div>
            <label className="block text-[10px] font-bold text-pink-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Palette className="w-3 h-3 text-pink-500" />
              <span>Creative Talent</span>
            </label>
            <select
              value={selectedCreative}
              onChange={(e) => setSelectedCreative(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-pink-50/50 border border-pink-200 rounded-xl text-xs text-pink-900 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            >
              <option value="all">Any Creative Field</option>
              <option value="Singing">Singing &amp; Vocal Music</option>
              <option value="Guitar">Guitar &amp; Instruments</option>
              <option value="Music Production">Music Production &amp; Beatmaking</option>
              <option value="Dance">Dance &amp; Choreography</option>
              <option value="Acting">Acting, Drama &amp; Theatre</option>
              <option value="Cinematography">Cinematography &amp; Drone</option>
              <option value="Filmmaking">Filmmaking &amp; Editing</option>
              <option value="Photography">Photography &amp; Portraits</option>
              <option value="Drawing">Drawing, Sketching &amp; Art</option>
              <option value="Design">UI/UX &amp; Fashion Styling</option>
              <option value="Writing">Creative Writing &amp; Poetry</option>
              <option value="Public Speaking">Public Speaking &amp; Debating</option>
            </select>
          </div>

          {/* 5. Sports & Lifestyle */}
          <div>
            <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-600" />
              <span>Sports &amp; Hobbies</span>
            </label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="all">Any Sport / Hobby</option>
              <option value="Cricket">Cricket</option>
              <option value="Football">Football / Soccer</option>
              <option value="Basketball">Basketball</option>
              <option value="Badminton">Badminton</option>
              <option value="Tennis">Tennis &amp; Pickleball</option>
              <option value="Gym">Gym &amp; Calisthenics</option>
              <option value="Yoga">Yoga &amp; Wellness</option>
              <option value="Esports">Esports &amp; Gaming</option>
              <option value="Adventure">Trekking &amp; Adventure</option>
              <option value="Chess">Chess &amp; Strategy Games</option>
              <option value="Reading">Reading &amp; Book Clubs</option>
            </select>
          </div>

          {/* 6. Career Goals */}
          <div>
            <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-600" />
              <span>Career Ambition</span>
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Any Career Goal</option>
              {allAvailableGoals.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* 7. University Campus Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-400" />
              <span>University Campus</span>
            </label>
            <select
              value={selectedUni}
              onChange={(e) => setSelectedUni(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value={currentUniversity.id}>{currentUniversity.name} (Current Campus)</option>
              <option value="all">All Campuses (Cross-University Collaborators)</option>
              {universities
                .filter((u) => u.id !== currentUniversity.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (Cross-Campus)
                  </option>
                ))}
            </select>
          </div>

          {/* 8. Year of Study */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Study Year</span>
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Any Study Year</option>
              {STUDY_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary row: Collaboration Preferences & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
              Collaboration Preference
            </label>
            <select
              value={selectedCollab}
              onChange={(e) => setSelectedCollab(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-indigo-50/50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium"
            >
              <option value="all">Any Project Type</option>
              {MULTIDISCIPLINARY_COLLAB_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Availability Status
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Looking for Team">Looking for Team (Active Recruiter)</option>
              <option value="Available">Available for Projects</option>
              <option value="Mentoring">Offering Mentorship</option>
            </select>
          </div>
        </div>

        {/* Bottom bar with active count and reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Showing <strong>{filteredUsers.length}</strong> university peers matching criteria
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {selectedUni === 'all' && (
            <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
              Showing cross-campus collaborators across Stanford, MIT, and UC Berkeley
            </span>
          )}
        </div>
      </div>

      {/* People Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No matching campus members found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try broadening your academic branch, creative talent, or sports filters to discover peers from other faculties.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-3 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold hover:bg-indigo-100 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const connection = connections.find(
              (c) =>
                (c.userId === currentUser.id && c.targetUserId === user.id) ||
                (c.userId === user.id && c.targetUserId === currentUser.id)
            );

            const isConnected = connection?.status === 'accepted';
            const isPendingOutgoing =
              connection?.status === 'pending' && connection?.userId === currentUser.id;

            return (
              <div
                key={user.id}
                className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top card row: Avatar, Verification, Role */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setActiveModalUser(user)}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      {user.verificationStatus === 'verified' && (
                        <div
                          className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full text-white ring-2 ring-white"
                          title="Verified University Enrollment"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
                      {user.universityId !== currentUniversity.id && (
                        <span className="block text-[9px] font-bold text-indigo-600 mt-1">
                          Cross-Campus Approved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name & Academic Discipline */}
                  <div
                    className="cursor-pointer"
                    onClick={() => setActiveModalUser(user)}
                  >
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-700 line-clamp-1">
                      {user.academicBranch || user.department}
                    </p>
                    {user.degreeProgram && (
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {user.degreeProgram} {user.year ? `• ${user.year}` : ''}
                      </p>
                    )}
                  </div>

                  {/* Availability Badge */}
                  <div className="mt-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        user.availability === 'Looking for Team'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : user.availability === 'Mentoring'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{user.availability}</span>
                    </span>
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {user.bio}
                  </p>

                  {/* Creative Talents / Instruments Tags if present */}
                  {user.creativeInterests && user.creativeInterests.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {user.creativeInterests.slice(0, 2).map((c, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-medium border border-pink-100"
                        >
                          🎵 {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sports & Lifestyle Tags if present */}
                  {user.sportsLifestyle && user.sportsLifestyle.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {user.sportsLifestyle.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium border border-amber-100"
                        >
                          🏆 {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Skills preview tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {user.skills.slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                    {user.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{user.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* AI Recommendation Explanation Card */}
                  <div className="mt-3.5 p-2.5 bg-gradient-to-r from-purple-50/70 to-indigo-50/70 rounded-2xl border border-indigo-100 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1 font-bold text-indigo-700 mb-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Why Connect:</span>
                    </div>
                    <p className="line-clamp-2">{getAIMatchReason(user)}</p>
                  </div>
                </div>

                {/* Card Action Row: Connect / Message buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalUser(user)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    View Profile
                  </button>

                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <button
                        onClick={() => startDirectConversation(user.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                    ) : isPendingOutgoing ? (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Pending</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => sendConnectionRequest(user.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comprehensive Profile Modal */}
      {activeModalUser && (
        <ProfileModal
          user={activeModalUser}
          onClose={() => setActiveModalUser(null)}
          connection={connections.find(
            (c) =>
              (c.userId === currentUser.id && c.targetUserId === activeModalUser.id) ||
              (c.userId === activeModalUser.id && c.targetUserId === currentUser.id)
          )}
        />
      )}
    </div>
  );
};
