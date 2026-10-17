export interface TaxonomyItem {
  id: string;
  name: string;
  group: 'academic' | 'creative' | 'sports' | 'career' | 'degree';
  faculty?: string;
  subfields?: string[];
  description?: string;
}

export interface DegreeProgram {
  id: string;
  name: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Diploma';
}

export const DEGREE_PROGRAMS: DegreeProgram[] = [
  { id: 'b_tech', name: 'B.Tech / B.E. (Bachelor of Technology / Engineering)', level: 'Undergraduate' },
  { id: 'b_sc', name: 'B.Sc. (Bachelor of Science)', level: 'Undergraduate' },
  { id: 'b_com', name: 'B.Com (Bachelor of Commerce)', level: 'Undergraduate' },
  { id: 'bba', name: 'BBA (Bachelor of Business Administration)', level: 'Undergraduate' },
  { id: 'mbbs', name: 'MBBS / BDS (Medicine / Dental Surgery)', level: 'Undergraduate' },
  { id: 'b_pharm', name: 'B.Pharm (Bachelor of Pharmacy)', level: 'Undergraduate' },
  { id: 'b_sc_agri', name: 'B.Sc. Agriculture / Allied Sciences', level: 'Undergraduate' },
  { id: 'b_arch', name: 'B.Arch / B.Des (Architecture & Design)', level: 'Undergraduate' },
  { id: 'ba', name: 'B.A. (Bachelor of Arts & Humanities)', level: 'Undergraduate' },
  { id: 'llb', name: 'LL.B. (Bachelor of Laws)', level: 'Undergraduate' },
  { id: 'b_ed', name: 'B.Ed. (Bachelor of Education)', level: 'Undergraduate' },
  { id: 'm_tech', name: 'M.Tech / M.E. (Master of Technology)', level: 'Postgraduate' },
  { id: 'mba', name: 'MBA (Master of Business Administration)', level: 'Postgraduate' },
  { id: 'm_sc', name: 'M.Sc. (Master of Science)', level: 'Postgraduate' },
  { id: 'ma', name: 'M.A. (Master of Arts)', level: 'Postgraduate' },
  { id: 'llm', name: 'LL.M. (Master of Laws)', level: 'Postgraduate' },
  { id: 'md_ms', name: 'MD / MS (Doctor of Medicine / Master of Surgery)', level: 'Postgraduate' },
  { id: 'phd', name: 'Ph.D. / Doctoral Fellowship', level: 'Doctoral' },
  { id: 'diploma', name: 'Diploma / Vocational Certificate', level: 'Diploma' },
  { id: 'other_degree', name: 'Other Academic Degree Program', level: 'Undergraduate' },
];

export const STUDY_YEARS = [
  'Freshman (1st Year)',
  'Sophomore (2nd Year)',
  'Junior (3rd Year)',
  'Senior (4th Year)',
  'Final Year (5th Year - Dual/Prof)',
  'Master’s Student (Year 1)',
  'Master’s Student (Year 2)',
  'Ph.D. / Doctoral Researcher',
  'Alumni / Graduated',
];

export interface AcademicFaculty {
  id: string;
  name: string;
  iconName: string;
  branches: string[];
}

export const ACADEMIC_FACULTIES: AcademicFaculty[] = [
  {
    id: 'engineering_tech',
    name: 'Engineering & Technology',
    iconName: 'Cpu',
    branches: [
      'Computer Science & Engineering',
      'Artificial Intelligence & Machine Learning',
      'Data Science & Analytics',
      'Information Technology & Cybersecurity',
      'Electronics & Communication Engineering',
      'Electrical & Electronics Engineering',
      'Mechanical & Automotive Engineering',
      'Civil & Structural Engineering',
      'Chemical & Biomolecular Engineering',
      'Aerospace & Aeronautical Engineering',
      'Robotics, Mechatronics & Automation',
      'Biotechnology & Genetic Engineering',
      'Environmental Engineering',
      'Mining, Materials & Metallurgy',
      'Petroleum & Energy Engineering',
      'Industrial & Manufacturing Engineering',
    ],
  },
  {
    id: 'agri_sciences',
    name: 'Agriculture & Allied Sciences',
    iconName: 'Wheat',
    branches: [
      'Agriculture & Agronomy',
      'Horticulture & Plant Breeding',
      'Agricultural Engineering & Irrigation Tech',
      'Agricultural Economics & Agribusiness',
      'Forestry & Natural Resource Management',
      'Fisheries & Aquaculture Sciences',
      'Veterinary Sciences & Animal Husbandry',
      'Dairy Technology & Production',
      'Food Science & Food Technology',
      'Soil Science & Agricultural Chemistry',
      'Crop Protection & Entomology',
      'Sustainable Farming & Permaculture',
    ],
  },
  {
    id: 'medical_health',
    name: 'Medical & Health Sciences',
    iconName: 'HeartPulse',
    branches: [
      'Medicine & Surgery (MBBS)',
      'Dental Sciences & Surgery (BDS)',
      'Pharmacy & Pharmaceutical Sciences',
      'Nursing & Patient Care',
      'Physiotherapy & Rehabilitation Sciences',
      'Public Health & Epidemiology',
      'Nutrition, Dietetics & Metabolic Health',
      'Medical Laboratory Technology & Pathology',
      'Biomedical Sciences & Genetics',
      'Clinical Psychology & Mental Health',
      'Ayurveda, Homeopathy & Integrative Medicine',
      'Optometry & Vision Science',
    ],
  },
  {
    id: 'science_research',
    name: 'Science & Research',
    iconName: 'Atom',
    branches: [
      'Physics & Quantum Science',
      'Chemistry & Material Sciences',
      'Mathematics & Applied Mathematics',
      'Statistics & Actuarial Sciences',
      'Biology & Cellular Sciences',
      'Zoology & Wildlife Biology',
      'Botany & Plant Sciences',
      'Microbiology & Immunology',
      'Biochemistry & Molecular Biology',
      'Environmental Science & Ecology',
      'Astronomy, Astrophysics & Space Science',
      'Earth Sciences, Geology & Oceanography',
    ],
  },
  {
    id: 'commerce_finance',
    name: 'Commerce, Finance & Economics',
    iconName: 'CircleDollarSign',
    branches: [
      'Commerce & Corporate Accounting',
      'Finance & Investment Banking',
      'Economics & Econometrics',
      'Taxation & Corporate Auditing',
      'Banking & Financial Services',
      'Business Analytics & Risk Management',
      'International Trade & Logistics',
      'Fintech & Digital Banking',
    ],
  },
  {
    id: 'management_business',
    name: 'Management & Business',
    iconName: 'Briefcase',
    branches: [
      'Business Administration & Management (BBA/MBA)',
      'Marketing, Brand Strategy & Advertising',
      'Human Resources & Organizational Behavior',
      'Entrepreneurship & Venture Building',
      'Product Management & Innovation',
      'Operations & Supply Chain Management',
      'Hospitality & Hotel Administration',
      'Business Strategy & Management Consulting',
      'Event & Entertainment Management',
      'Retail & E-commerce Operations',
    ],
  },
  {
    id: 'arts_humanities',
    name: 'Arts, Humanities & Social Sciences',
    iconName: 'BookOpen',
    branches: [
      'History & Archaeology',
      'Geography, GIS & Urban Planning',
      'Political Science & Governance',
      'Sociology & Anthropology',
      'Philosophy & Ethics',
      'Psychology & Behavioral Sciences',
      'Literature & Creative Writing',
      'Linguistics & Modern Languages',
      'Journalism, Mass Media & Communication',
      'Social Work, Policy & Development',
      'International Relations & Diplomacy',
    ],
  },
  {
    id: 'law_policy',
    name: 'Law & Public Policy',
    iconName: 'Scale',
    branches: [
      'Law & Legal Studies (LL.B.)',
      'Corporate Law & Intellectual Property',
      'Criminal Justice & Criminology',
      'Human Rights & International Law',
      'Constitutional & Cyber Law',
      'Public Policy, Governance & Civil Services',
      'Arbitration, Mediation & Dispute Resolution',
    ],
  },
  {
    id: 'design_architecture',
    name: 'Design, Architecture & Fine Arts',
    iconName: 'Palette',
    branches: [
      'Architecture & Urban Design',
      'Interior Design & Space Planning',
      'Fashion Design & Apparel Tech',
      'Graphic Design & Visual Communication',
      'UI/UX & Digital Product Design',
      'Fine Arts, Painting & Sculpture',
      'Animation, VFX & 3D Modeling',
      'Game Design & Interactive Media',
      'Textile & Ceramic Design',
      'Industrial & Transportation Design',
    ],
  },
  {
    id: 'education_pedagogy',
    name: 'Education',
    iconName: 'GraduationCap',
    branches: [
      'Teaching & Teacher Training (B.Ed./M.Ed.)',
      'Educational Psychology & Learning Sciences',
      'Educational Technology & Online Learning',
      'Curriculum Design & Pedagogical Research',
      'Special Education & Inclusive Learning',
      'Higher Education Administration',
    ],
  },
  {
    id: 'interdisciplinary_vocational',
    name: 'Hospitality, Aviation & Interdisciplinary',
    iconName: 'Compass',
    branches: [
      'Hospitality, Travel & Tourism',
      'Aviation Management & Aeronautical Operations',
      'Vocational Education & Applied Skills',
      'Sustainability & Climate Policy',
      'Cognitive Science & Neuroscience',
      'Liberal Arts & Interdisciplinary Studies',
    ],
  },
];

// Flat list of all academic branches with faculty reference
export const ALL_ACADEMIC_BRANCHES: { branch: string; faculty: string }[] =
  ACADEMIC_FACULTIES.flatMap((fac) =>
    fac.branches.map((b) => ({ branch: b, faculty: fac.name }))
  );

// Creative Fields & Talents
export const CREATIVE_FIELDS = [
  'Singing & Vocal Music (Classical / Contemporary)',
  'Guitar, Bass & Ukulele',
  'Piano, Keyboard & Synthesizers',
  'Drums, Percussion & Beatmaking',
  'Violin, Flute & Classical Instruments',
  'Music Production, Mixing & Songwriting',
  'Dance (Hip-Hop, Contemporary, Classical, Street)',
  'Choreography & Stage Direction',
  'Acting, Theatre, Street Play & Drama',
  'Stand-up Comedy & Improv',
  'Photography (Portrait, Street, Nature, Event)',
  'Cinematography, Drone Filming & Lighting',
  'Filmmaking, Screenwriting & Video Editing',
  'Content Creation, YouTube & Podcasting',
  'Drawing, Sketching, Painting & Murals',
  'Digital Illustration, Anime & Concept Art',
  'Graphic Design, Branding & Typography',
  '3D Animation, Motion Graphics & VFX',
  'Fashion Design, Styling & Modeling',
  'Creative Writing, Poetry & Spoken Word',
  'Public Speaking, Debating & Event Hosting (Anchor / MC)',
];

// Sports & Lifestyle Interests
export const SPORTS_AND_LIFESTYLE = [
  'Cricket',
  'Football / Soccer',
  'Basketball',
  'Volleyball',
  'Badminton',
  'Tennis & Pickleball',
  'Table Tennis',
  'Track & Field / Athletics / Marathon',
  'Swimming & Water Polo',
  'Martial Arts, Boxing & Taekwondo',
  'Gym, Weightlifting & Calisthenics',
  'Yoga, Pilates & Mindfulness Wellness',
  'Esports & Competitive Gaming (Valorant, CS, FIFA, etc.)',
  'Outdoor Adventure, Trekking & Mountaineering',
  'Cycling & Skating',
  'Chess & Strategy Board Games',
  'Reading, Book Clubs & Literature',
  'Cooking, Baking & Food Culture',
  'Travel, Backpacking & Cultural Exploration',
];

// Business, Career & Community Fields
export const BUSINESS_CAREER_COMMUNITY = [
  'Entrepreneurship & Startup Building',
  'Freelancing & Independent Consulting',
  'Internships & Campus Placement Prep',
  'Open-Source Software & Community Tech',
  'Academic Research Collaborations & Publishing',
  'Social Impact, NGO & Volunteering',
  'College Festival Organization & Event Management',
  'Student Government & Campus Leadership',
  'Finance, Stock Trading & Crypto/Fintech',
  'Case Competitions & Business Consulting',
  'Peer Mentorship & Career Guidance',
  'Environmental & Green Campus Initiatives',
];

// Multidisciplinary Collaboration Categories
export const MULTIDISCIPLINARY_COLLAB_TYPES = [
  { id: 'Hackathon', label: 'Hackathon & Technology Projects' },
  { id: 'Startup', label: 'Startup & Business Ventures' },
  { id: 'Research', label: 'Academic & Interdisciplinary Research' },
  { id: 'Agriculture & Sustainability', label: 'Agricultural & Sustainability Innovations' },
  { id: 'Music & Performance', label: 'Music Bands, Choirs & Live Performances' },
  { id: 'Film & Media', label: 'Short Films, Documentaries & Web Series' },
  { id: 'Creative', label: 'Design, Fashion & Art Showcases' },
  { id: 'Sports & Tournaments', label: 'Sports Teams & Inter-College Tournaments' },
  { id: 'Cultural & Events', label: 'College Festivals, Dramatics & Major Events' },
  { id: 'Social Impact', label: 'Social Impact, Health Camps & Rural Initiatives' },
  { id: 'Course Project', label: 'Cross-Department Capstone Projects' },
  { id: 'Open Source', label: 'Open Source & Collaborative Tools' },
];
