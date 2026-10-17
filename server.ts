import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'Unify',
    tagline: 'Connect. Create. Grow.',
    geminiConfigured: !!aiClient,
  });
});

// Helper for fallback intelligent responses when API key is pending
function getContextualFallback(prompt: string, context?: any) {
  const p = prompt.toLowerCase();
  if (p.includes('hackathon') || p.includes('project') || p.includes('team')) {
    return {
      reply: `Here is a curated strategy for your university collaboration:\n\n1. **Core Roles Needed**: Frontend (React/Tailwind), Backend (Node/Python), UI/UX Designer, and Domain Specialist.\n2. **Milestones**: Week 1: Problem definition & user stories; Week 2: Prototype architecture; Week 3: Functional MVP; Week 4: University demo day.\n3. **Recommended Next Step**: Post an opening on the Unify Collaboration Hub with clear required skills to attract verified university peers.`,
      suggestions: [
        'How can I write an enticing collaboration post?',
        'What are good hackathon project ideas in AI/EdTech?',
        'Suggest sprint milestones for a 4-week student project',
      ],
    };
  } else if (p.includes('resume') || p.includes('skill') || p.includes('learn') || p.includes('roadmap')) {
    return {
      reply: `Based on your stated university track:\n\n- **Target Skills**: Full-stack TypeScript, REST/GraphQL APIs, relational database modeling, and automated testing.\n- **Portfolio Milestone**: Build 2 end-to-end verified team projects inside Unify to demonstrate cross-functional leadership.\n- **Actionable Step**: Connect with verified alumni in the Discover tab who have graduated into your target engineering domain.`,
      suggestions: [
        'Generate a 6-week roadmap for Full-stack Web Dev',
        'How to request mentorship from alumni respectfully',
        'What skills make a student stand out for summer internships?',
      ],
    };
  } else if (p.includes('proposal') || p.includes('campus') || p.includes('facility') || p.includes('voice')) {
    return {
      reply: `Campus Voice Proposal Guidance:\n\n- Ensure your proposal clearly identifies the problem, estimated impact on student life, feasible timeline, and potential cost bracket.\n- Presenting data or student poll results dramatically increases university administrator review velocity.\n- Avoid ambiguous complaints; articulate concrete solutions.`,
      suggestions: [
        'Help structure a 24/7 library access proposal',
        'How does the administrative review process work?',
        'Draft a student survey poll for campus dining improvements',
      ],
    };
  }

  return {
    reply: `Hello! I'm your Unify Academic & Collaboration Assistant. I can help you find project teammates, structure hackathon milestones, summarize complex opportunity criteria, refine campus proposals, and map out your learning goals across your university journey. What would you like to work on today?`,
    suggestions: [
      'Help me plan a cross-disciplinary AI project',
      'Recommend top opportunities for sophomore students',
      'Find teammates with complementary React & ML skills',
    ],
  };
}

// AI Assistant Chat Route
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], userContext = {} } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    if (!aiClient) {
      // Return clear demo response without simulating fake connection
      const fallback = getContextualFallback(message, userContext);
      res.json({
        reply: fallback.reply,
        suggestions: fallback.suggestions,
        model: 'unify-rule-engine-demo',
        isDemoMode: true,
        notice: 'Gemini API key is not configured in this environment. Showing intelligent contextual guidance.',
      });
      return;
    }

    const systemInstruction = `You are Unify AI, the official intelligent assistant inside Unify (tagline: "Connect. Create. Grow.") — a trusted university community and collaboration platform.
Your persona is inspiring, constructive, articulate, and pragmatic like a top-tier university career mentor and technical project architect.
Current user context:
- University: ${userContext.university || 'University Campus'}
- Department: ${userContext.department || 'Undergraduate Studies'}
- Verified Status: ${userContext.isVerified ? 'Verified Student' : 'Pending Verification'}
- Skills: ${(userContext.skills || []).join(', ') || 'Not specified'}
- Interests: ${(userContext.interests || []).join(', ') || 'General Innovation'}

Guidelines:
1. Provide actionable, concise, structured advice.
2. Emphasize teamwork, student growth, peer learning, and constructive campus impact.
3. Suggest concrete next steps inside Unify (e.g. creating a Collaboration post, saving an Opportunity, joining a Circle, drafting a Campus Voice proposal).
4. Do NOT fabricate live user messages or pretend you performed external actions (e.g. sending emails or submitting official university grants).
5. Format with readable markdown lists and bold headers.`;

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || 'I could not generate a response. Please try again.';

    res.json({
      reply: text,
      model: 'gemini-3.8-flash',
      isDemoMode: false,
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    const fallback = getContextualFallback(req.body.message || '');
    res.json({
      reply: fallback.reply,
      suggestions: fallback.suggestions,
      model: 'unify-fallback',
      isDemoMode: true,
      error: error.message || 'Error communicating with AI service. Showing curated fallback.',
    });
  }
});

// AI Project Task & Milestone Breakdown Route
app.post('/api/ai/project-plan', async (req, res) => {
  try {
    const { title, description, category, teamSize = 3, durationWeeks = 4 } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Project title is required' });
      return;
    }

    if (!aiClient) {
      res.json({
        plan: {
          summary: `4-week structured plan for "${title}" targeting a team of ${teamSize}.`,
          milestones: [
            {
              week: 1,
              title: 'Problem Scope, Architecture & Design Specs',
              description: 'Define technical stack, wireframes in Figma, and database entity relationships.',
              tasks: ['Finalize technical spec doc', 'Create initial Figma prototypes', 'Setup GitHub repo and CI/CD boilerplate'],
            },
            {
              week: 2,
              title: 'Core MVP Architecture & Component Build',
              description: 'Implement foundational APIs, core user authentication, and main application layouts.',
              tasks: ['Build backend data endpoints', 'Implement responsive layout', 'Establish state management'],
            },
            {
              week: 3,
              title: 'Integration, Polish & Team Collaboration Features',
              description: 'Connect frontend with backend services, refine edge cases, handle error boundaries.',
              tasks: ['End-to-end API integration', 'Empty states and validation feedback', 'Internal dogfooding session'],
            },
            {
              week: 4,
              title: 'Testing, Campus Showcase & Final Deliverables',
              description: 'Deploy to staging, prepare presentation pitch deck, submit to campus showcase or hackathon.',
              tasks: ['Automated tests & lighthouse audit', 'Prepare 3-minute demo video', 'Submit official project showcase entry'],
            },
          ],
          recommendedRoles: [
            { role: 'Frontend & UI Lead', skills: ['React', 'Tailwind CSS', 'Figma'] },
            { role: 'Backend & Systems Engineer', skills: ['Node.js', 'Express', 'PostgreSQL/Firestore'] },
            { role: 'Product / Domain Specialist', skills: ['User Research', 'Testing', 'Documentation'] },
          ],
        },
        isDemoMode: true,
      });
      return;
    }

    const prompt = `You are a university project mentor. Create a high-quality project execution roadmap for a student team.
Project Details:
- Title: ${title}
- Description: ${description || 'No description provided'}
- Category: ${category || 'Software / Web Application'}
- Team Size: ${teamSize}
- Duration: ${durationWeeks} weeks

Return valid JSON with:
{
  "summary": "1-2 sentence executive overview",
  "milestones": [
    {
      "week": 1,
      "title": "Milestone title",
      "description": "Short explanation",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ],
  "recommendedRoles": [
    { "role": "Role name", "skills": ["Skill 1", "Skill 2"] }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ plan: parsed, isDemoMode: false });
  } catch (err: any) {
    console.error('Project plan error:', err);
    res.status(500).json({ error: 'Failed to generate project plan' });
  }
});

// AI Proposal Polisher
app.post('/api/ai/proposal-polish', async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    if (!aiClient) {
      res.json({
        polishedTitle: title.trim().replace(/^([a-z])/, (m: string) => m.toUpperCase()),
        executiveSummary: `This proposal advocates for structured enhancements in ${category || 'Campus Experience'}, emphasizing measurable student impact, operational feasibility, and high university alignment.`,
        suggestedOutcomes: [
          'Directly impacts over 1,500 active students per semester.',
          'Utilizes existing campus infrastructure with low incremental overhead.',
          'Includes clear metrics for tracking student satisfaction and engagement.',
        ],
        isDemoMode: true,
      });
      return;
    }

    const prompt = `Refine this student campus proposal for presentation to university deans and administration.
Title: ${title}
Category: ${category}
Description: ${description}

Return JSON with:
{
  "polishedTitle": "Professional, compelling title",
  "executiveSummary": "Concise 2-sentence summary suitable for administration",
  "suggestedOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json({ ...JSON.parse(response.text || '{}'), isDemoMode: false });
  } catch (err: any) {
    console.error('Proposal polish error:', err);
    res.status(500).json({ error: 'Failed to polish proposal' });
  }
});

// ==========================================
// UNIFY UNIVERSITY AUTHENTICATION & ACCESS CONTROL
// ==========================================

interface UniRecord {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  emailDomain: string;
  location: string;
  studentCount: number;
  primaryColor: string;
  tagline: string;
  idFormatExample: string;
  idFormatRegex: string;
}

const UNIVERSITIES_DB: UniRecord[] = [
  {
    id: 'sage_indore',
    name: 'SAGE University, Indore',
    shortName: 'SAGE Indore',
    domain: 'sageuniversity.edu.in',
    emailDomain: 'sageuniversity.edu.in',
    location: 'Indore, Madhya Pradesh, India',
    studentCount: 14500,
    primaryColor: '#0F52BA',
    tagline: 'Passion for Excellence',
    idFormatExample: 'SU22CS1049',
    idFormatRegex: '^(SU|2[0-9]|SAGE)[A-Z0-9\\/\\-]+$',
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    shortName: 'Stanford',
    domain: 'stanford.edu',
    emailDomain: 'stanford.edu',
    location: 'Stanford, CA, USA',
    studentCount: 16900,
    primaryColor: '#8C1515',
    tagline: 'The Wind of Freedom Blows',
    idFormatExample: 'STAN84920',
    idFormatRegex: '^(STAN|SU)[0-9]{4,8}$',
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    domain: 'mit.edu',
    emailDomain: 'mit.edu',
    location: 'Cambridge, MA, USA',
    studentCount: 11900,
    primaryColor: '#A31F34',
    tagline: 'Mens et Manus',
    idFormatExample: 'MIT90124',
    idFormatRegex: '^(MIT)[0-9]{4,8}$',
  },
  {
    id: 'berkeley',
    name: 'University of California, Berkeley',
    shortName: 'UC Berkeley',
    domain: 'berkeley.edu',
    emailDomain: 'berkeley.edu',
    location: 'Berkeley, CA, USA',
    studentCount: 45000,
    primaryColor: '#003262',
    tagline: 'Fiat Lux',
    idFormatExample: 'CAL30491',
    idFormatRegex: '^(CAL|UCB)[0-9]{4,8}$',
  },
  {
    id: 'iit_bombay',
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    domain: 'iitb.ac.in',
    emailDomain: 'iitb.ac.in',
    location: 'Powai, Mumbai, Maharashtra, India',
    studentCount: 12000,
    primaryColor: '#1A365D',
    tagline: 'Knowledge is the Supreme Goal',
    idFormatExample: '210050042',
    idFormatRegex: '^[0-9]{8,10}$',
  },
  {
    id: 'du_delhi',
    name: 'University of Delhi',
    shortName: 'Delhi University',
    domain: 'du.ac.in',
    emailDomain: 'du.ac.in',
    location: 'New Delhi, India',
    studentCount: 132000,
    primaryColor: '#7C2D12',
    tagline: 'Dedication to Truth',
    idFormatExample: 'DU22BC3019',
    idFormatRegex: '^[A-Z0-9\\-]+$',
  },
];

interface UserAccount {
  id: string;
  uid: string;
  name: string;
  fullName: string;
  email: string;
  officialEmail: string;
  collegeId: string;
  passwordHash: string; // simulated password store
  role: 'student' | 'admin' | 'senior_alumni' | 'faculty_mentor' | 'club_org';
  universityId: string;
  universityName: string;
  department: string;
  degreeProgram: string;
  academicBranch: string;
  year: string;
  studyYear: string;
  bio: string;
  avatar: string;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'suspended';
  verificationMethod: 'email_otp' | 'student_id_doc' | 'campus_directory' | 'admin_verified';
  verificationProofUrl?: string;
  skills: string[];
  interests: string[];
  creativeInterests: string[];
  sportsLifestyle: string[];
  hobbies: string[];
  careerGoals: string[];
  collaborationPreferences: string[];
  availability: 'Available' | 'Busy' | 'Looking for Team' | 'Mentoring';
  isCrossUniversityAllowed: boolean;
  createdAt: string;
  privacy: {
    showEmail: boolean;
    allowDirectMessages: boolean;
    crossCampusDiscoverable: boolean;
  };
}

// In-Memory User Database with pre-seeded users for SAGE University and Stanford
const USERS_DB: Map<string, UserAccount> = new Map([
  [
    'user_sage_aarav',
    {
      id: 'user_sage_aarav',
      uid: 'user_sage_aarav',
      name: 'Aarav Sharma',
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@sageuniversity.edu.in',
      officialEmail: 'aarav.sharma@sageuniversity.edu.in',
      collegeId: 'SU22CS1049',
      passwordHash: 'Password123!',
      role: 'student',
      universityId: 'sage_indore',
      universityName: 'SAGE University, Indore',
      department: 'Computer Science & AI',
      degreeProgram: 'B.Tech / B.E. (Bachelor of Technology / Engineering)',
      academicBranch: 'Computer Science, IT, AI/ML, Data Science',
      year: 'Junior (3rd Year)',
      studyYear: 'Junior (3rd Year)',
      bio: 'SAGE University Indore B.Tech CSE (AI & Data Science). Building full-stack web platforms and ML prototypes. Passionate about Hackathons and Smart City Indore tech solutions.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
      verificationStatus: 'verified',
      verificationMethod: 'email_otp',
      skills: ['React', 'TypeScript', 'Python', 'FastAPI', 'Machine Learning', 'Tailwind CSS'],
      interests: ['Artificial Intelligence', 'Smart Cities', 'Web3', 'Hackathons'],
      creativeInterests: ['Photography and cinematography', 'Guitar, piano, drums and other instruments'],
      sportsLifestyle: ['Cricket, football, basketball and volleyball', 'Gym, fitness, yoga and wellness'],
      hobbies: ['Cricket, football, basketball and volleyball', 'Gym, fitness, yoga and wellness'],
      careerGoals: ['Entrepreneurship and startup building', 'Internships and placements'],
      collaborationPreferences: ['Multidisciplinary Projects', 'Hackathons & Competitions'],
      availability: 'Looking for Team',
      isCrossUniversityAllowed: true,
      createdAt: '2024-08-15T09:30:00.000Z',
      privacy: { showEmail: true, allowDirectMessages: true, crossCampusDiscoverable: true },
    },
  ],
  [
    'user_sage_admin',
    {
      id: 'user_sage_admin',
      uid: 'user_sage_admin',
      name: 'Dr. Rajesh Kulshrestha',
      fullName: 'Dr. Rajesh Kulshrestha',
      email: 'admin@sageuniversity.edu.in',
      officialEmail: 'admin@sageuniversity.edu.in',
      collegeId: 'SU-ADM-001',
      passwordHash: 'AdminPassword123!',
      role: 'admin',
      universityId: 'sage_indore',
      universityName: 'SAGE University, Indore',
      department: 'Office of the Registrar & Student Affairs',
      degreeProgram: 'Executive Administration',
      academicBranch: 'Academic Administration',
      year: 'Campus Registrar & Dean',
      studyYear: 'Dean / Administrator',
      bio: 'Chief Registrar & Academic Administrator at SAGE University, Indore. Reviewing college ID registrations, institutional verifications, and student campus voice proposals.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      verificationStatus: 'verified',
      verificationMethod: 'admin_verified',
      skills: ['University Administration', 'Academic Governance', 'Student Verification', 'Policy Management'],
      interests: ['Educational Excellence', 'Campus Infrastructure', 'Accreditation'],
      creativeInterests: ['Public speaking, debating and hosting'],
      sportsLifestyle: ['Gym, fitness, yoga and wellness'],
      hobbies: ['Reading, travel, cooking and other hobbies'],
      careerGoals: ['Leadership and community initiatives'],
      collaborationPreferences: ['Student clubs and societies'],
      availability: 'Busy',
      isCrossUniversityAllowed: false,
      createdAt: '2023-01-01T08:00:00.000Z',
      privacy: { showEmail: true, allowDirectMessages: true, crossCampusDiscoverable: false },
    },
  ],
  [
    'user_sage_neha',
    {
      id: 'user_sage_neha',
      uid: 'user_sage_neha',
      name: 'Neha Rao',
      fullName: 'Neha Rao',
      email: 'neha.rao@sageuniversity.edu.in',
      officialEmail: 'neha.rao@sageuniversity.edu.in',
      collegeId: 'SU24DS4005',
      passwordHash: 'Password123!',
      role: 'student',
      universityId: 'sage_indore',
      universityName: 'SAGE University, Indore',
      department: 'Computer Science & AI',
      degreeProgram: 'B.Tech / B.E. (Bachelor of Technology / Engineering)',
      academicBranch: 'Computer Science, IT, AI/ML, Data Science',
      year: 'Freshman (1st Year)',
      studyYear: 'Freshman (1st Year)',
      bio: 'First year student exploring robotics, Python, and UI design. Student ID card submitted for admin-assisted verification.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      verificationStatus: 'pending',
      verificationMethod: 'student_id_doc',
      verificationProofUrl: 'https://sageuniversity.edu.in/verify/id-card-SU24DS4005.pdf',
      skills: ['Python', 'HTML/CSS', 'Graphic Design'],
      interests: ['Data Science', 'Design', 'Robotics'],
      creativeInterests: ['Drawing, painting and illustration', 'Singing and vocal music'],
      sportsLifestyle: ['Badminton, tennis and other racket sports'],
      hobbies: ['Badminton, tennis and other racket sports'],
      careerGoals: ['Internships and placements', 'Open-source projects'],
      collaborationPreferences: ['Course Projects & Study Groups'],
      availability: 'Available',
      isCrossUniversityAllowed: false,
      createdAt: '2025-01-15T11:20:00.000Z',
      privacy: { showEmail: true, allowDirectMessages: true, crossCampusDiscoverable: false },
    },
  ],
  [
    'user_alex',
    {
      id: 'user_alex',
      uid: 'user_alex',
      name: 'Alex Rivera',
      fullName: 'Alex Rivera',
      email: 'arivera@stanford.edu',
      officialEmail: 'arivera@stanford.edu',
      collegeId: 'STAN84920',
      passwordHash: 'Password123!',
      role: 'student',
      universityId: 'stanford',
      universityName: 'Stanford University',
      department: 'Computer Science & AI',
      degreeProgram: 'B.Tech / B.E. (Bachelor of Technology / Engineering)',
      academicBranch: 'Computer Science, IT, AI/ML, Data Science',
      year: 'Junior (3rd Year)',
      studyYear: 'Junior (3rd Year)',
      bio: 'Passionate about multimodal AI, distributed systems, and building high-impact tools for university student life.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      verificationStatus: 'verified',
      verificationMethod: 'email_otp',
      skills: ['React', 'TypeScript', 'Python', 'PyTorch', 'Node.js'],
      interests: ['Artificial Intelligence', 'Hackathons', 'EdTech'],
      creativeInterests: ['Guitar, piano, drums and other instruments'],
      sportsLifestyle: ['Cricket, football, basketball and volleyball'],
      hobbies: ['Cricket, football, basketball and volleyball'],
      careerGoals: ['Entrepreneurship and startup building'],
      collaborationPreferences: ['Multidisciplinary Projects'],
      availability: 'Looking for Team',
      isCrossUniversityAllowed: true,
      createdAt: '2024-09-01T08:00:00.000Z',
      privacy: { showEmail: false, allowDirectMessages: true, crossCampusDiscoverable: true },
    },
  ],
]);

interface SessionRecord {
  token: string;
  userId: string;
  universityId: string;
  createdAt: number;
  expiresAt: number;
}
const SESSIONS_DB: Map<string, SessionRecord> = new Map();

interface VerificationChallenge {
  code: string;
  universityId: string;
  collegeId: string;
  officialEmail: string;
  expiresAt: number;
}
const CHALLENGES_DB: Map<string, VerificationChallenge> = new Map();

interface VerificationRequestItem {
  id: string;
  userId: string;
  fullName: string;
  collegeId: string;
  officialEmail: string;
  universityId: string;
  universityName: string;
  method: 'email_otp' | 'student_id_doc' | 'campus_directory' | 'admin_verified';
  proofUrl?: string;
  documentName?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedByAdminName?: string;
}
const VERIFICATION_REQUESTS_DB: VerificationRequestItem[] = [
  {
    id: 'vreq_sage_neha',
    userId: 'user_sage_neha',
    fullName: 'Neha Rao',
    collegeId: 'SU24DS4005',
    officialEmail: 'neha.rao@sageuniversity.edu.in',
    universityId: 'sage_indore',
    universityName: 'SAGE University, Indore',
    method: 'student_id_doc',
    documentName: 'SAGE_Student_Card_SU24DS4005.pdf',
    proofUrl: 'https://sageuniversity.edu.in/verify/id-card-SU24DS4005.pdf',
    notes: 'Submitted enrollment card issued by SAGE Registrar. Student enrolled in B.Tech CSE (Data Science) 1st Year.',
    status: 'pending',
    submittedAt: '2026-10-15T11:20:00.000Z',
  },
];

interface AuditLogRecord {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  targetId: string;
  targetType: string;
  details: string;
  timestamp: string;
  universityId: string;
}
const AUDIT_LOGS_DB: AuditLogRecord[] = [
  {
    id: 'audit_sage_1',
    action: 'VERIFY_COLLEGE_ID',
    actorName: 'Dr. Rajesh Kulshrestha',
    actorRole: 'admin',
    targetId: 'user_sage_aarav',
    targetType: 'User',
    details: 'Verified SAGE University College ID SU22CS1049 via institutional email OTP challenge.',
    timestamp: '2026-08-15T09:35:00Z',
    universityId: 'sage_indore',
  },
  {
    id: 'audit_sage_2',
    action: 'VERIFY_COLLEGE_ID',
    actorName: 'Dr. Rajesh Kulshrestha',
    actorRole: 'admin',
    targetId: 'user_sage_ananya',
    targetType: 'User',
    details: 'Verified SAGE University College ID SU23AG2081 through Registrar Directory record.',
    timestamp: '2026-09-01T10:05:00Z',
    universityId: 'sage_indore',
  },
];

// Helper: authenticate session from Bearer header
function getSessionFromRequest(req: express.Request): SessionRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const session = SESSIONS_DB.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    SESSIONS_DB.delete(token);
    return null;
  }
  return session;
}

// 1. Universities endpoint
app.get('/api/universities', (_req, res) => {
  res.json({ universities: UNIVERSITIES_DB });
});

// 2. Auth: Register Start (Initiates College ID & Email Verification)
app.post('/api/auth/register-start', (req, res) => {
  const { universityId, collegeId, officialEmail } = req.body;

  if (!universityId || !collegeId || !officialEmail) {
    res.status(400).json({ error: 'University, College ID, and Official Email are required.' });
    return;
  }

  const uni = UNIVERSITIES_DB.find((u) => u.id === universityId);
  if (!uni) {
    res.status(400).json({ error: 'Selected university is not recognized in Unify directory.' });
    return;
  }

  const cleanCollegeId = collegeId.trim().toUpperCase();
  const cleanEmail = officialEmail.trim().toLowerCase();

  // Validate format using university pattern
  const idRegex = new RegExp(uni.idFormatRegex, 'i');
  if (!idRegex.test(cleanCollegeId)) {
    res.status(400).json({
      error: `Invalid College ID format for ${uni.name}. Expected pattern like ${uni.idFormatExample}`,
    });
    return;
  }

  // Check duplicate college ID within this university
  for (const user of USERS_DB.values()) {
    if (user.universityId === universityId && user.collegeId.toUpperCase() === cleanCollegeId) {
      res.status(409).json({
        error: `An account already exists for College ID "${cleanCollegeId}" at ${uni.name}. Please sign in instead.`,
      });
      return;
    }
  }

  // Check if official email domain matches university domain
  const emailDomain = cleanEmail.split('@')[1];
  const isOfficialDomain = emailDomain && (emailDomain === uni.emailDomain || emailDomain.endsWith(`.${uni.emailDomain}`));

  // Generate 6-digit OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  CHALLENGES_DB.set(cleanEmail, {
    code,
    universityId,
    collegeId: cleanCollegeId,
    officialEmail: cleanEmail,
    expiresAt,
  });

  res.json({
    success: true,
    universityName: uni.name,
    collegeId: cleanCollegeId,
    officialEmail: cleanEmail,
    isOfficialDomain,
    verificationMethod: isOfficialDomain ? 'email_otp' : 'student_id_doc',
    message: isOfficialDomain
      ? `Verification code sent to ${cleanEmail}. Enter the 6-digit code to verify your ${uni.shortName} student status.`
      : `Email domain does not match ${uni.domain}. You may continue by uploading your Student ID card for administrator review.`,
    demoOtp: code, // Provided for effortless preview and testing in development environment
  });
});

// 3. Auth: Verify Code
app.post('/api/auth/verify-code', (req, res) => {
  const { officialEmail, code } = req.body;
  if (!officialEmail || !code) {
    res.status(400).json({ error: 'Email and verification code are required.' });
    return;
  }

  const cleanEmail = officialEmail.trim().toLowerCase();
  const challenge = CHALLENGES_DB.get(cleanEmail);

  if (!challenge) {
    res.status(400).json({ error: 'No verification request found for this email. Please request a new code.' });
    return;
  }

  if (Date.now() > challenge.expiresAt) {
    CHALLENGES_DB.delete(cleanEmail);
    res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    return;
  }

  if (challenge.code !== code.trim()) {
    res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    return;
  }

  res.json({
    success: true,
    verified: true,
    message: 'Institutional identity successfully verified.',
    universityId: challenge.universityId,
    collegeId: challenge.collegeId,
  });
});

// 4. Auth: Complete Sign Up
app.post('/api/auth/complete-signup', (req, res) => {
  const {
    universityId,
    collegeId,
    officialEmail,
    fullName,
    password,
    verificationMethod = 'email_otp',
    verificationProofUrl,
    documentName,
    degreeProgram = 'B.Tech / B.E. (Bachelor of Technology / Engineering)',
    academicBranch = 'Computer Science, IT, AI/ML, Data Science',
    department = 'Engineering & Technology',
    studyYear = 'Junior (3rd Year)',
    skills = [],
    interests = [],
    creativeInterests = [],
    sportsLifestyle = [],
    careerGoals = [],
    collaborationPreferences = [],
  } = req.body;

  if (!universityId || !collegeId || !officialEmail || !fullName || !password) {
    res.status(400).json({ error: 'Missing required sign-up fields.' });
    return;
  }

  const uni = UNIVERSITIES_DB.find((u) => u.id === universityId);
  if (!uni) {
    res.status(400).json({ error: 'Invalid university specified.' });
    return;
  }

  const cleanCollegeId = collegeId.trim().toUpperCase();
  const cleanEmail = officialEmail.trim().toLowerCase();
  const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // Determine verification status based on trusted verification path
  // If email OTP or directory -> verified; if student ID card doc -> pending admin review
  const verificationStatus: 'verified' | 'pending' =
    verificationMethod === 'email_otp' || verificationMethod === 'campus_directory' ? 'verified' : 'pending';

  const newUser: UserAccount = {
    id: newUserId,
    uid: newUserId,
    name: fullName.trim(),
    fullName: fullName.trim(),
    email: cleanEmail,
    officialEmail: cleanEmail,
    collegeId: cleanCollegeId,
    passwordHash: password, // In production this would be bcrypt
    role: 'student',
    universityId, // Immutable universityId security boundary
    universityName: uni.name,
    department: department || 'Undergraduate Studies',
    degreeProgram,
    academicBranch,
    year: studyYear,
    studyYear,
    bio: `Student at ${uni.name}. Passionate about collaboration, academic growth, and cross-disciplinary projects.`,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    verificationStatus,
    verificationMethod,
    verificationProofUrl,
    skills,
    interests,
    creativeInterests,
    sportsLifestyle,
    hobbies: sportsLifestyle,
    careerGoals,
    collaborationPreferences,
    availability: 'Looking for Team',
    isCrossUniversityAllowed: true,
    createdAt: new Date().toISOString(),
    privacy: {
      showEmail: false,
      allowDirectMessages: true,
      crossCampusDiscoverable: true,
    },
  };

  USERS_DB.set(newUserId, newUser);

  // If status is pending, record into admin review queue
  if (verificationStatus === 'pending') {
    VERIFICATION_REQUESTS_DB.push({
      id: `vreq_${Date.now()}`,
      userId: newUserId,
      fullName: newUser.fullName,
      collegeId: cleanCollegeId,
      officialEmail: cleanEmail,
      universityId,
      universityName: uni.name,
      method: verificationMethod,
      proofUrl: verificationProofUrl,
      documentName: documentName || 'Student_Enrollment_Card.pdf',
      notes: 'New account registered with student ID document. Awaiting administrator review.',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    });
  }

  // Create audit log
  AUDIT_LOGS_DB.unshift({
    id: `audit_${Date.now()}`,
    action: 'REGISTER_STUDENT_ACCOUNT',
    actorName: newUser.fullName,
    actorRole: 'student',
    targetId: newUserId,
    targetType: 'User',
    details: `Student registered for ${uni.name} with College ID: ${cleanCollegeId} (Status: ${verificationStatus.toUpperCase()}).`,
    timestamp: new Date().toISOString(),
    universityId,
  });

  // Issue session token
  const token = `unify_sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
  SESSIONS_DB.set(token, {
    token,
    userId: newUserId,
    universityId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Sanitize user before returning (omit passwordHash)
  const { passwordHash: _p, ...safeUser } = newUser;

  res.status(201).json({
    success: true,
    token,
    user: safeUser,
    university: uni,
    verificationStatus,
    message:
      verificationStatus === 'verified'
        ? `Welcome to Unify! Verified access granted to ${uni.name} community.`
        : `Account created. Your student ID is currently under review by ${uni.name} administration.`,
  });
});

// 5. Auth: Login (Validates credentials and university tenant match)
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, universityId } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ error: 'Email or College ID and password are required.' });
    return;
  }

  const cleanIdent = identifier.trim().toLowerCase();
  let matchedUser: UserAccount | null = null;

  for (const user of USERS_DB.values()) {
    const emailMatch = user.email.toLowerCase() === cleanIdent || user.officialEmail.toLowerCase() === cleanIdent;
    const idMatch = user.collegeId.toLowerCase() === cleanIdent;
    if (emailMatch || idMatch) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) {
    res.status(401).json({ error: 'Invalid credentials. No account found with that email or Student ID.' });
    return;
  }

  if (matchedUser.passwordHash !== password) {
    res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
    return;
  }

  // University tenant validation: enforce university access restrictions
  if (universityId && matchedUser.universityId !== universityId) {
    const intendedUni = UNIVERSITIES_DB.find((u) => u.id === universityId);
    const userUni = UNIVERSITIES_DB.find((u) => u.id === matchedUser?.universityId);
    res.status(403).json({
      error: `Account boundary mismatch: You are attempting to access ${intendedUni?.name || 'this university'}, but your verified student credentials belong to ${userUni?.name || 'another university'}. Unify strictly enforces campus tenant isolation.`,
    });
    return;
  }

  const uni = UNIVERSITIES_DB.find((u) => u.id === matchedUser.universityId);

  // Issue session token
  const token = `unify_sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
  SESSIONS_DB.set(token, {
    token,
    userId: matchedUser.id,
    universityId: matchedUser.universityId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  // Audit log
  AUDIT_LOGS_DB.unshift({
    id: `audit_${Date.now()}`,
    action: 'USER_LOGIN',
    actorName: matchedUser.fullName,
    actorRole: matchedUser.role,
    targetId: matchedUser.id,
    targetType: 'User',
    details: `Signed in to ${uni?.name || 'University'} workspace.`,
    timestamp: new Date().toISOString(),
    universityId: matchedUser.universityId,
  });

  const { passwordHash: _p, ...safeUser } = matchedUser;
  res.json({
    success: true,
    token,
    user: safeUser,
    university: uni,
  });
});

// 6. Auth: Current Session (GET /api/auth/me)
app.get('/api/auth/me', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'No active session or session has expired.' });
    return;
  }

  const user = USERS_DB.get(session.userId);
  if (!user) {
    SESSIONS_DB.delete(session.token);
    res.status(401).json({ error: 'User account not found.' });
    return;
  }

  const uni = UNIVERSITIES_DB.find((u) => u.id === user.universityId);
  const { passwordHash: _p, ...safeUser } = user;

  res.json({
    user: safeUser,
    university: uni,
  });
});

// 7. Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  const session = getSessionFromRequest(req);
  if (session) {
    SESSIONS_DB.delete(session.token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 8. Auth: Password Reset Request & Confirmation
app.post('/api/auth/reset-password-request', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    res.status(400).json({ error: 'Email or College ID is required.' });
    return;
  }

  const cleanIdent = identifier.trim().toLowerCase();
  let userFound = false;
  let userEmail = '';

  for (const u of USERS_DB.values()) {
    if (u.email.toLowerCase() === cleanIdent || u.collegeId.toLowerCase() === cleanIdent) {
      userFound = true;
      userEmail = u.email;
      break;
    }
  }

  if (!userFound) {
    res.status(404).json({ error: 'No account registered with that email or Student ID.' });
    return;
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  CHALLENGES_DB.set(`reset_${userEmail}`, {
    code: resetCode,
    universityId: '',
    collegeId: '',
    officialEmail: userEmail,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  res.json({
    success: true,
    message: `Password reset instructions sent to ${userEmail}.`,
    demoResetCode: resetCode,
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    res.status(400).json({ error: 'Missing required reset fields.' });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const challenge = CHALLENGES_DB.get(`reset_${cleanEmail}`);

  if (!challenge || challenge.code !== code.trim() || Date.now() > challenge.expiresAt) {
    res.status(400).json({ error: 'Invalid or expired password reset code.' });
    return;
  }

  for (const user of USERS_DB.values()) {
    if (user.email.toLowerCase() === cleanEmail) {
      user.passwordHash = newPassword;
      CHALLENGES_DB.delete(`reset_${cleanEmail}`);
      res.json({ success: true, message: 'Password updated successfully. Please sign in.' });
      return;
    }
  }

  res.status(404).json({ error: 'User account not found.' });
});

// 9. Auth: Submit Verification Document (For pending or manual review appeals)
app.post('/api/auth/submit-verification-doc', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const { proofUrl, documentName, notes } = req.body;
  const user = USERS_DB.get(session.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  user.verificationStatus = 'pending';
  user.verificationMethod = 'student_id_doc';
  user.verificationProofUrl = proofUrl || 'https://verify.university.edu/student-proof.pdf';

  const reqItem: VerificationRequestItem = {
    id: `vreq_${Date.now()}`,
    userId: user.id,
    fullName: user.fullName,
    collegeId: user.collegeId,
    officialEmail: user.officialEmail,
    universityId: user.universityId,
    universityName: user.universityName,
    method: 'student_id_doc',
    proofUrl: user.verificationProofUrl,
    documentName: documentName || 'Student_Enrollment_Card.pdf',
    notes: notes || 'Student submitted ID proof for administrator review.',
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  VERIFICATION_REQUESTS_DB.unshift(reqItem);

  AUDIT_LOGS_DB.unshift({
    id: `audit_${Date.now()}`,
    action: 'SUBMIT_VERIFICATION_DOC',
    actorName: user.fullName,
    actorRole: user.role,
    targetId: user.id,
    targetType: 'User',
    details: `Submitted student credential document for ${user.universityName} manual review.`,
    timestamp: new Date().toISOString(),
    universityId: user.universityId,
  });

  res.json({
    success: true,
    message: 'Verification document submitted to university administration. Status is now Pending Review.',
    verificationStatus: 'pending',
  });
});

// 10. Admin: Get Pending Verification Requests (Strict university boundary enforcement)
app.get('/api/admin/verifications', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const user = USERS_DB.get(session.userId);
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Restricted: University administrator permissions required.' });
    return;
  }

  // Strict tenant boundary: only return verifications for admin's universityId
  const scopedRequests = VERIFICATION_REQUESTS_DB.filter(
    (v) => v.universityId === user.universityId && v.status === 'pending'
  );

  res.json({
    universityId: user.universityId,
    universityName: user.universityName,
    verifications: scopedRequests,
  });
});

// 11. Admin: Decision on Verification Request
app.post('/api/admin/verifications/decision', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const admin = USERS_DB.get(session.userId);
  if (!admin || admin.role !== 'admin') {
    res.status(403).json({ error: 'Restricted: University administrator permissions required.' });
    return;
  }

  const { requestId, decision, notes } = req.body;
  if (!requestId || !decision || !['approved', 'rejected'].includes(decision)) {
    res.status(400).json({ error: 'Valid requestId and decision (approved | rejected) are required.' });
    return;
  }

  const targetReq = VERIFICATION_REQUESTS_DB.find((v) => v.id === requestId);
  if (!targetReq) {
    res.status(404).json({ error: 'Verification request not found.' });
    return;
  }

  // Cross-university safety check
  if (targetReq.universityId !== admin.universityId) {
    res.status(403).json({ error: 'Cross-university violation: Cannot moderate requests outside your university.' });
    return;
  }

  targetReq.status = decision;
  targetReq.reviewedAt = new Date().toISOString();
  targetReq.reviewedByAdminName = admin.fullName;
  if (notes) targetReq.notes = notes;

  const targetUser = USERS_DB.get(targetReq.userId);
  if (targetUser) {
    targetUser.verificationStatus = decision === 'approved' ? 'verified' : 'rejected';
    targetUser.verificationMethod = 'admin_verified';
  }

  AUDIT_LOGS_DB.unshift({
    id: `audit_${Date.now()}`,
    action: decision === 'approved' ? 'APPROVE_VERIFICATION' : 'REJECT_VERIFICATION',
    actorName: admin.fullName,
    actorRole: 'admin',
    targetId: targetReq.userId,
    targetType: 'User',
    details: `${decision === 'approved' ? 'Approved' : 'Rejected'} enrollment for student ${targetReq.fullName} (ID: ${targetReq.collegeId}). ${notes || ''}`,
    timestamp: new Date().toISOString(),
    universityId: admin.universityId,
  });

  res.json({
    success: true,
    decision,
    requestId,
    targetUserId: targetReq.userId,
    newStatus: targetUser?.verificationStatus,
    message: `Verification ${decision === 'approved' ? 'approved' : 'rejected'} for student ${targetReq.fullName}.`,
  });
});

// 12. Admin: Get Audit Logs (Strict university boundary enforcement)
app.get('/api/admin/audit-logs', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const user = USERS_DB.get(session.userId);
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Restricted: Administrator privileges required.' });
    return;
  }

  const scopedLogs = AUDIT_LOGS_DB.filter((l) => l.universityId === user.universityId);
  res.json({ auditLogs: scopedLogs });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unify server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
