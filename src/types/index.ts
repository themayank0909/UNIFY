export type UserRole = 'student' | 'senior_alumni' | 'faculty_mentor' | 'club_org' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'suspended';

export type VerificationMethod = 'email_otp' | 'student_id_doc' | 'campus_directory' | 'admin_verified';

export interface University {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  logoUrl?: string;
  location: string;
  studentCount: number;
  primaryColor: string;
  tagline?: string;
  idFormatExample?: string;
  idFormatRegex?: string;
  emailDomain?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  fullName: string;
  collegeId: string;
  officialEmail: string;
  universityId: string;
  universityName: string;
  method: VerificationMethod;
  proofUrl?: string;
  documentName?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedByAdminName?: string;
}

export interface User {
  id: string;
  uid?: string;
  name: string;
  fullName?: string;
  email: string;
  officialEmail?: string;
  collegeId?: string; // Private student identifier
  role: UserRole;
  universityId: string;
  universityName?: string;
  department: string;
  degreeProgram?: string;
  academicBranch?: string;
  year?: string;
  studyYear?: string;
  bio: string;
  avatar: string;
  verificationStatus: VerificationStatus;
  verificationMethod?: VerificationMethod;
  verificationProofUrl?: string;
  skills: string[];
  interests: string[];
  creativeInterests?: string[];
  sportsLifestyle?: string[];
  hobbies?: string[];
  careerGoals?: string[];
  collaborationPreferences?: string[];
  availability: 'Available' | 'Busy' | 'Looking for Team' | 'Mentoring';
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  isCrossUniversityAllowed: boolean;
  createdAt?: string;
  privacy: {
    showEmail: boolean;
    allowDirectMessages: boolean;
    crossCampusDiscoverable: boolean;
  };
}

export interface Connection {
  id: string;
  userId: string;
  targetUserId: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  createdAt: string;
  note?: string;
  aiMatchReason?: string;
  aiMatchScore?: number;
}

export interface Circle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  universityId?: string; // If undefined, cross-university / open
  isPrivate: boolean;
  memberCount: number;
  iconName: string;
  bannerColor: string;
  tags: string[];
  rules: string[];
}

export interface CirclePost {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  universityId: string;
  content: string;
  likes: number;
  likedByCurrentUser?: boolean;
  commentCount: number;
  createdAt: string;
  attachments?: { title: string; url: string; type: string }[];
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed';
  assignedTo?: string; // userId
  assignedToName?: string;
  assignedToAvatar?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar: string;
  applicantDepartment: string;
  applicantSkills: string[];
  statement: string;
  availabilityHours: number;
  status: 'pending' | 'accepted' | 'declined';
  aiMatchScore?: number;
  aiMatchNotes?: string;
  createdAt: string;
}

export type CollaborationCategory =
  | 'Hackathon'
  | 'Startup'
  | 'Research'
  | 'Open Source'
  | 'Course Project'
  | 'Creative'
  | 'Music & Performance'
  | 'Film & Media'
  | 'Agriculture & Sustainability'
  | 'Sports & Tournaments'
  | 'Cultural & Events'
  | 'Social Impact';

export interface ProjectRoleNeeded {
  id: string;
  roleTitle: string;
  fieldOrBranch?: string;
  skills: string[];
  slotsTotal: number;
  slotsFilled: number;
}

export interface CollaborationProject {
  id: string;
  universityId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  category: CollaborationCategory;
  requiredSkills: string[];
  targetBranches?: string[];
  rolesNeeded?: ProjectRoleNeeded[];
  teamSize: number;
  currentMembers: string[]; // userIds
  timeCommitment: string; // e.g. "5-10 hrs/week"
  duration: string; // e.g. "4 weeks"
  isCrossUniversity: boolean;
  applicationDeadline: string;
  status: 'recruiting' | 'in_progress' | 'completed';
  tasks: ProjectTask[];
  milestones: ProjectMilestone[];
  resources: { title: string; url: string }[];
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  organizerLogo?: string;
  description: string;
  category: 'Hackathon' | 'Internship' | 'Scholarship' | 'Research' | 'Workshop' | 'Competition' | 'Grant' | 'Open Source';
  deadline: string;
  locationType: 'Remote' | 'Hybrid' | 'In-Person';
  locationDetail?: string;
  universityId?: string; // if local campus event
  isCrossUniversity: boolean;
  eligibility: string;
  skills: string[];
  officialUrl: string;
  verificationStatus: 'verified' | 'pending' | 'partner' | 'expired';
  isDemoData: boolean;
  savedByCurrentUser?: boolean;
  appliedByCurrentUser?: boolean;
  applicationStatus?: 'Saved' | 'Applied' | 'Interviewing' | 'Accepted' | 'Declined';
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  universityId: string;
  creatorId: string;
  creatorName: string;
  creatorRole: UserRole;
  title: string;
  description: string;
  category: string;
  options: PollOption[];
  totalVotes: number;
  votedOptionId?: string; // Current user's vote
  voterUserIds: string[];
  endsAt: string;
  createdAt: string;
}

export interface ProposalStatusHistory {
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';
  timestamp: string;
  updatedBy: string;
  officialNote?: string;
}

export interface Proposal {
  id: string;
  universityId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  category: 'Facilities & Campus' | 'Academics & Tech' | 'Student Life & Dining' | 'Sustainability' | 'Accessibility';
  currentStatus: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';
  upvotes: number;
  upvotedByCurrentUser?: boolean;
  upvoterUserIds: string[];
  statusHistory: ProposalStatusHistory[];
  officialResponse?: string;
  reviewedByAdminName?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'project' | 'circle';
  title: string;
  targetUserId?: string; // For direct
  projectId?: string;
  circleId?: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'connection' | 'project' | 'task' | 'proposal' | 'event' | 'system';
  targetTab?: string;
  targetId?: string;
  read: boolean;
  createdAt: string;
}

export interface UserSkillGrowth {
  skill: string;
  level: number; // 0-100
  category: 'Frontend' | 'Backend' | 'AI / Data' | 'Design' | 'Leadership' | 'Research';
  verificationLevel: 'self_reported' | 'evidence_submitted' | 'verified';
  evidenceCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verificationLevel: 'self_reported' | 'evidence_submitted' | 'verified';
  description: string;
  credentialUrl?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  targetId: string;
  targetType: string;
  details: string;
  timestamp: string;
  universityId: string;
}

export interface ModerationReport {
  id: string;
  reportedItemId: string;
  reportedItemType: 'post' | 'user' | 'project' | 'comment';
  reporterId: string;
  reporterName: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  universityId: string;
}
