import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  University,
  User,
  UserRole,
  VerificationStatus,
  Connection,
  CollaborationProject,
  Opportunity,
  Circle,
  CirclePost,
  Poll,
  Proposal,
  Conversation,
  Message,
  NotificationItem,
  UserSkillGrowth,
  Achievement,
  AuditLogItem,
  ModerationReport,
  ProjectTask,
} from '../types';
import {
  SEED_UNIVERSITIES,
  SEED_USERS,
  INITIAL_CURRENT_USER,
  SEED_CONNECTIONS,
  SEED_PROJECTS,
  SEED_OPPORTUNITIES,
  SEED_CIRCLES,
  SEED_CIRCLE_POSTS,
  SEED_POLLS,
  SEED_PROPOSALS,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS,
  SEED_SKILLS,
  SEED_ACHIEVEMENTS,
  SEED_AUDIT_LOGS,
  SEED_MODERATION_REPORTS,
} from '../data/seedData';

type TabType =
  | 'home'
  | 'discover'
  | 'circles'
  | 'collaboration'
  | 'opportunities'
  | 'campus-voice'
  | 'messages'
  | 'growth'
  | 'profile'
  | 'admin';

interface AppContextType {
  // Navigation
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedCircleId: string | null;
  setSelectedCircleId: (id: string | null) => void;

  // University Tenant & Auth
  currentUniversity: University;
  universities: University[];
  switchUniversity: (universityId: string) => void;
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  requestVerification: (proofUrl?: string) => void;

  // People & Connections
  users: User[];
  connections: Connection[];
  sendConnectionRequest: (targetUserId: string, note?: string) => void;
  acceptConnection: (connectionId: string) => void;
  declineConnection: (connectionId: string) => void;
  removeConnection: (targetUserId: string) => void;
  blockUser: (targetUserId: string) => void;

  // Collaboration Hub
  projects: CollaborationProject[];
  createProject: (data: Omit<CollaborationProject, 'id' | 'createdAt' | 'currentMembers' | 'tasks' | 'milestones' | 'resources'>) => string;
  applyToProject: (projectId: string, statement: string, availabilityHours: number) => void;
  acceptApplicant: (projectId: string, applicantId: string) => void;
  rejectApplicant: (projectId: string, applicantId: string) => void;
  updateTaskStatus: (projectId: string, taskId: string, newStatus: ProjectTask['status']) => void;
  addTaskToProject: (projectId: string, title: string, priority: 'low' | 'medium' | 'high', assignedTo?: string) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;

  // Opportunities
  opportunities: Opportunity[];
  toggleSaveOpportunity: (id: string) => void;
  updateOpportunityApplicationStatus: (id: string, status: Opportunity['applicationStatus']) => void;
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => void;

  // Campus Voice (Polls & Proposals)
  polls: Poll[];
  voteInPoll: (pollId: string, optionId: string) => void;
  proposals: Proposal[];
  submitProposal: (title: string, description: string, category: Proposal['category']) => string;
  upvoteProposal: (proposalId: string) => void;
  updateProposalStatus: (proposalId: string, newStatus: Proposal['currentStatus'], officialNote?: string) => void;

  // Circles
  circles: Circle[];
  joinedCircleIds: string[];
  joinCircle: (circleId: string) => void;
  leaveCircle: (circleId: string) => void;
  createCircle: (data: Omit<Circle, 'id' | 'memberCount'>) => string;
  circlePosts: CirclePost[];
  createCirclePost: (circleId: string, content: string, attachments?: any[]) => void;
  likeCirclePost: (postId: string) => void;

  // Messages & Notifications
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string) => void;
  startDirectConversation: (targetUserId: string) => string;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Growth & Skills
  skills: UserSkillGrowth[];
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;

  // Admin Dashboard
  auditLogs: AuditLogItem[];
  moderationReports: ModerationReport[];
  approveVerification: (userId: string) => void;
  rejectVerification: (userId: string, reason: string) => void;
  resolveReport: (reportId: string, action: 'dismissed' | 'resolved') => void;

  // AI Assistant Drawer
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  toggleAIAssistant: () => void;
  aiInitialPrompt: string | null;
  openAIWithPrompt: (prompt: string) => void;

  // Onboarding Wizard
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  openOnboarding: () => void;

  // Helpers
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);

  // University Tenant & Auth
  const [universities] = useState<University[]>(SEED_UNIVERSITIES);
  const [currentUniversity, setCurrentUniversity] = useState<University>(SEED_UNIVERSITIES[0]);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_CURRENT_USER);
  const [users, setUsers] = useState<User[]>(SEED_USERS);

  // Entities
  const [connections, setConnections] = useState<Connection[]>(SEED_CONNECTIONS);
  const [projects, setProjects] = useState<CollaborationProject[]>(SEED_PROJECTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(SEED_OPPORTUNITIES);
  const [polls, setPolls] = useState<Poll[]>(SEED_POLLS);
  const [proposals, setProposals] = useState<Proposal[]>(SEED_PROPOSALS);
  const [circles, setCircles] = useState<Circle[]>(SEED_CIRCLES);
  const [joinedCircleIds, setJoinedCircleIds] = useState<string[]>(['circle_ai', 'circle_web']);
  const [circlePosts, setCirclePosts] = useState<CirclePost[]>(SEED_CIRCLE_POSTS);
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_priya');
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [skills, setSkills] = useState<UserSkillGrowth[]>(SEED_SKILLS);
  const [achievements, setAchievements] = useState<Achievement[]>(SEED_ACHIEVEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(SEED_AUDIT_LOGS);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(SEED_MODERATION_REPORTS);

  // AI Assistant & Feedback
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Onboarding Wizard modal state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const openOnboarding = () => setIsOnboardingOpen(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // University Switcher (Tenant Isolation demonstration)
  const switchUniversity = (universityId: string) => {
    const uni = universities.find((u) => u.id === universityId);
    if (!uni) return;
    setCurrentUniversity(uni);

    // Update current user to belong to this university context
    setCurrentUser((prev) => ({
      ...prev,
      universityId: uni.id,
      email: `${prev.name.toLowerCase().replace(' ', '.')}@${uni.domain}`,
    }));

    showToast(`Switched university workspace to ${uni.name}. Tenant isolation active.`);
  };

  // Role Switcher
  const switchUserRole = (newRole: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
      department:
        newRole === 'faculty_mentor'
          ? 'Computer Science & AI Faculty'
          : newRole === 'admin'
          ? 'Office of the Vice Provost'
          : newRole === 'senior_alumni'
          ? 'Class of 2023 Alumni'
          : newRole === 'club_org'
          ? 'Student Organization Officers'
          : 'Computer Science & AI',
    }));
    showToast(`Active perspective changed to: ${newRole.toUpperCase().replace('_', ' ')}`);
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === updated.id ? updated : u)));
      return updated;
    });
    showToast('Profile updated successfully.');
  };

  const requestVerification = (proofUrl?: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      verificationStatus: 'pending',
      verificationProofUrl: proofUrl || 'https://verify.university.edu/student-card.png',
    }));
    showToast('University verification proof submitted for administrator review.');
  };

  // Connections
  const sendConnectionRequest = (targetUserId: string, note?: string) => {
    const existing = connections.find(
      (c) =>
        (c.userId === currentUser.id && c.targetUserId === targetUserId) ||
        (c.userId === targetUserId && c.targetUserId === currentUser.id)
    );

    if (existing) {
      showToast('A connection or pending request already exists with this user.');
      return;
    }

    const targetUser = users.find((u) => u.id === targetUserId);
    const newConn: Connection = {
      id: `conn_${Date.now()}`,
      userId: currentUser.id,
      targetUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      note,
      aiMatchReason: targetUser
        ? `Shared interests in ${(targetUser.interests || []).slice(0, 2).join(' and ')}`
        : 'University peer recommendation',
      aiMatchScore: 89,
    };

    setConnections((prev) => [newConn, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: targetUserId,
      title: 'New Connection Request',
      message: `${currentUser.name} sent you a connection request.`,
      type: 'connection',
      targetTab: 'discover',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Connection request sent to ${targetUser?.name || 'peer'}!`);
  };

  const acceptConnection = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === connectionId ? { ...c, status: 'accepted' } : c))
    );
    showToast('Connection accepted! You can now message each other.');
  };

  const declineConnection = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === connectionId ? { ...c, status: 'declined' } : c))
    );
    showToast('Connection request declined.');
  };

  const removeConnection = (targetUserId: string) => {
    setConnections((prev) =>
      prev.filter(
        (c) =>
          !(
            (c.userId === currentUser.id && c.targetUserId === targetUserId) ||
            (c.userId === targetUserId && c.targetUserId === currentUser.id)
          )
      )
    );
    showToast('Connection removed.');
  };

  const blockUser = (targetUserId: string) => {
    removeConnection(targetUserId);
    showToast('User has been blocked. They will no longer be able to message or view your profile.');
  };

  // Collaboration Hub
  const createProject = (
    data: Omit<CollaborationProject, 'id' | 'createdAt' | 'currentMembers' | 'tasks' | 'milestones' | 'resources'>
  ): string => {
    const id = `proj_${Date.now()}`;
    const newProj: CollaborationProject = {
      ...data,
      id,
      universityId: currentUniversity.id,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      currentMembers: [currentUser.id],
      status: 'recruiting',
      milestones: [
        {
          id: `m_${Date.now()}_1`,
          title: 'Sprint 1: Architecture & Design Specs',
          description: 'Establish repository, tech stack, and user stories',
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          completed: false,
        },
      ],
      tasks: [
        {
          id: `t_${Date.now()}_1`,
          projectId: id,
          title: 'Initialize repository and CI/CD',
          status: 'todo',
          priority: 'high',
          assignedTo: currentUser.id,
          assignedToName: currentUser.name,
        },
      ],
      resources: [],
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProj, ...prev]);

    // Automatically create a project team conversation
    const newConv: Conversation = {
      id: `conv_${id}`,
      type: 'project',
      title: `Team: ${newProj.title.slice(0, 24)}`,
      projectId: id,
      participantIds: [currentUser.id],
      lastMessage: 'Project workspace created.',
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };
    setConversations((prev) => [newConv, ...prev]);

    showToast('Collaboration project published to university directory!');
    return id;
  };

  const applyToProject = (projectId: string, statement: string, availabilityHours: number) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    if (proj.currentMembers.includes(currentUser.id)) {
      showToast('You are already a member of this project!');
      return;
    }

    // Add notification to project creator
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: proj.creatorId,
      title: 'New Project Application',
      message: `${currentUser.name} applied to join "${proj.title}".`,
      type: 'project',
      targetTab: 'collaboration',
      targetId: projectId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Application submitted successfully! The project owner has been notified.');
  };

  const acceptApplicant = (projectId: string, applicantId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          if (!p.currentMembers.includes(applicantId)) {
            return {
              ...p,
              currentMembers: [...p.currentMembers, applicantId],
            };
          }
        }
        return p;
      })
    );

    // Add applicant to conversation
    setConversations((prev) =>
      prev.map((c) => {
        if (c.projectId === projectId && !c.participantIds.includes(applicantId)) {
          return { ...c, participantIds: [...c.participantIds, applicantId] };
        }
        return c;
      })
    );

    // Notify applicant
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: applicantId,
      title: 'Application Accepted!',
      message: 'You have been accepted to join the project workspace.',
      type: 'project',
      targetTab: 'collaboration',
      targetId: projectId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Member added to project workspace!');
  };

  const rejectApplicant = (projectId: string, applicantId: string) => {
    showToast('Applicant declined.');
  };

  const updateTaskStatus = (projectId: string, taskId: string, newStatus: ProjectTask['status']) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
          };
        }
        return p;
      })
    );
  };

  const addTaskToProject = (
    projectId: string,
    title: string,
    priority: 'low' | 'medium' | 'high',
    assignedTo?: string
  ) => {
    const assignedUser = users.find((u) => u.id === assignedTo);
    const newTask: ProjectTask = {
      id: `t_${Date.now()}`,
      projectId,
      title,
      status: 'todo',
      priority,
      assignedTo,
      assignedToName: assignedUser?.name,
      assignedToAvatar: assignedUser?.avatar,
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, tasks: [...p.tasks, newTask] };
        }
        return p;
      })
    );
    showToast('New task added to project board.');
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            milestones: p.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            ),
          };
        }
        return p;
      })
    );
    showToast('Project milestone updated!');
  };

  // Opportunities
  const toggleSaveOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const isSaved = !o.savedByCurrentUser;
          return {
            ...o,
            savedByCurrentUser: isSaved,
            applicationStatus: isSaved ? o.applicationStatus || 'Saved' : undefined,
          };
        }
        return o;
      })
    );
    showToast('Opportunity bookmark updated.');
  };

  const updateOpportunityApplicationStatus = (
    id: string,
    status: Opportunity['applicationStatus']
  ) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          return {
            ...o,
            appliedByCurrentUser: status === 'Applied' || status === 'Interviewing' || status === 'Accepted',
            applicationStatus: status,
          };
        }
        return o;
      })
    );
    showToast(`Application status updated to: ${status}`);
  };

  const addOpportunity = (opp: Omit<Opportunity, 'id' | 'createdAt'>) => {
    const newOpp: Opportunity = {
      ...opp,
      id: `opp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    showToast('Opportunity added to university directory.');
  };

  // Campus Voice (Polls & Proposals)
  const voteInPoll = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id === pollId) {
          if (p.voterUserIds.includes(currentUser.id)) {
            showToast('You have already cast your single vote in this official campus poll.');
            return p;
          }
          return {
            ...p,
            totalVotes: p.totalVotes + 1,
            votedOptionId: optionId,
            voterUserIds: [...p.voterUserIds, currentUser.id],
            options: p.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        }
        return p;
      })
    );
    showToast('Vote officially recorded!');
  };

  const submitProposal = (
    title: string,
    description: string,
    category: Proposal['category']
  ): string => {
    const id = `prop_${Date.now()}`;
    const newProp: Proposal = {
      id,
      universityId: currentUniversity.id,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      title,
      description,
      category,
      currentStatus: 'Submitted',
      upvotes: 1,
      upvotedByCurrentUser: true,
      upvoterUserIds: [currentUser.id],
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          updatedBy: currentUser.name,
          officialNote: 'Proposal submitted by verified student for campus review.',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setProposals((prev) => [newProp, ...prev]);
    showToast('Proposal submitted to Campus Voice! University administrators will review.');
    return id;
  };

  const upvoteProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          const isUpvoted = p.upvoterUserIds.includes(currentUser.id);
          const newUpvoterUserIds = isUpvoted
            ? p.upvoterUserIds.filter((uid) => uid !== currentUser.id)
            : [...p.upvoterUserIds, currentUser.id];
          return {
            ...p,
            upvotes: isUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            upvotedByCurrentUser: !isUpvoted,
            upvoterUserIds: newUpvoterUserIds,
          };
        }
        return p;
      })
    );
  };

  const updateProposalStatus = (
    proposalId: string,
    newStatus: Proposal['currentStatus'],
    officialNote?: string
  ) => {
    if (currentUser.role !== 'admin') {
      showToast('Error: Only authorized university administrators may update proposal decisions.');
      return;
    }

    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          const newHistory = [
            ...p.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              updatedBy: currentUser.name,
              officialNote: officialNote || `Status officially advanced to ${newStatus}.`,
            },
          ];
          return {
            ...p,
            currentStatus: newStatus,
            officialResponse: officialNote || p.officialResponse,
            reviewedByAdminName: currentUser.name,
            statusHistory: newHistory,
          };
        }
        return p;
      })
    );

    // Add to audit log
    const auditItem: AuditLogItem = {
      id: `audit_${Date.now()}`,
      action: 'UPDATE_PROPOSAL_STATUS',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      targetId: proposalId,
      targetType: 'Proposal',
      details: `Status set to ${newStatus}. Note: ${officialNote || 'None'}`,
      timestamp: new Date().toISOString(),
      universityId: currentUniversity.id,
    };
    setAuditLogs((prev) => [auditItem, ...prev]);

    showToast(`Proposal status updated to ${newStatus}. Logged in audit trail.`);
  };

  // Circles
  const joinCircle = (circleId: string) => {
    if (!joinedCircleIds.includes(circleId)) {
      setJoinedCircleIds((prev) => [...prev, circleId]);
      setCircles((prev) =>
        prev.map((c) => (c.id === circleId ? { ...c, memberCount: c.memberCount + 1 } : c))
      );
      showToast('Joined circle community!');
    }
  };

  const leaveCircle = (circleId: string) => {
    setJoinedCircleIds((prev) => prev.filter((id) => id !== circleId));
    setCircles((prev) =>
      prev.map((c) => (c.id === circleId ? { ...c, memberCount: Math.max(0, c.memberCount - 1) } : c))
    );
    showToast('Left circle community.');
  };

  const createCircle = (data: Omit<Circle, 'id' | 'memberCount'>): string => {
    const id = `circle_${Date.now()}`;
    const newCircle: Circle = {
      ...data,
      id,
      memberCount: 1,
    };
    setCircles((prev) => [newCircle, ...prev]);
    setJoinedCircleIds((prev) => [...prev, id]);
    setSelectedCircleId(id);
    showToast(`Created circle: ${data.name}! You are now a founding member.`);
    return id;
  };

  const createCirclePost = (circleId: string, content: string, attachments?: any[]) => {
    const newPost: CirclePost = {
      id: `post_${Date.now()}`,
      circleId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      universityId: currentUniversity.id,
      content,
      likes: 1,
      likedByCurrentUser: true,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      attachments,
    };
    setCirclePosts((prev) => [newPost, ...prev]);
    showToast('Discussion post published to Circle!');
  };

  const likeCirclePost = (postId: string) => {
    setCirclePosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.likedByCurrentUser;
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedByCurrentUser: !isLiked,
          };
        }
        return p;
      })
    );
  };

  // Messages & Conversations
  const sendMessage = (conversationId: string, content: string) => {
    if (!content.trim()) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: content.slice(0, 48),
            lastMessageTime: 'Just now',
          };
        }
        return c;
      })
    );
  };

  const startDirectConversation = (targetUserId: string): string => {
    const existing = conversations.find(
      (c) => c.type === 'direct' && c.participantIds.includes(targetUserId)
    );
    if (existing) {
      setActiveConversationId(existing.id);
      setCurrentTab('messages');
      return existing.id;
    }

    const targetUser = users.find((u) => u.id === targetUserId);
    const newConvId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      type: 'direct',
      title: targetUser ? targetUser.name : 'Direct Chat',
      targetUserId,
      participantIds: [currentUser.id, targetUserId],
      lastMessage: 'Conversation opened',
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setCurrentTab('messages');
    return newConvId;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // Growth & Achievements
  const addAchievement = (achievement: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = {
      ...achievement,
      id: `ach_${Date.now()}`,
    };
    setAchievements((prev) => [newAch, ...prev]);
    showToast('Achievement recorded in your growth portfolio!');
  };

  // Admin Actions
  const approveVerification = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verificationStatus: 'verified' } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, verificationStatus: 'verified' }));
    }

    // Audit log
    const auditItem: AuditLogItem = {
      id: `audit_${Date.now()}`,
      action: 'APPROVE_STUDENT_VERIFICATION',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      targetId: userId,
      targetType: 'User',
      details: 'Approved university enrollment credentials.',
      timestamp: new Date().toISOString(),
      universityId: currentUniversity.id,
    };
    setAuditLogs((prev) => [auditItem, ...prev]);
    showToast('Student enrollment officially verified!');
  };

  const rejectVerification = (userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verificationStatus: 'rejected' } : u))
    );
    showToast(`Verification rejected: ${reason}`);
  };

  const resolveReport = (reportId: string, action: 'dismissed' | 'resolved') => {
    setModerationReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
    showToast(`Report marked as ${action}.`);
  };

  // AI Assistant Launcher
  const toggleAIAssistant = () => {
    setIsAIAssistantOpen((prev) => !prev);
  };

  const openAIWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setIsAIAssistantOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedCircleId,
        setSelectedCircleId,
        currentUniversity,
        universities,
        switchUniversity,
        currentUser,
        switchUserRole,
        updateCurrentUser,
        requestVerification,
        users,
        connections,
        sendConnectionRequest,
        acceptConnection,
        declineConnection,
        removeConnection,
        blockUser,
        projects,
        createProject,
        applyToProject,
        acceptApplicant,
        rejectApplicant,
        updateTaskStatus,
        addTaskToProject,
        toggleMilestone,
        opportunities,
        toggleSaveOpportunity,
        updateOpportunityApplicationStatus,
        addOpportunity,
        polls,
        voteInPoll,
        proposals,
        submitProposal,
        upvoteProposal,
        updateProposalStatus,
        circles,
        joinedCircleIds,
        joinCircle,
        leaveCircle,
        createCircle,
        circlePosts,
        createCirclePost,
        likeCirclePost,
        isOnboardingOpen,
        setIsOnboardingOpen,
        openOnboarding,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startDirectConversation,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        skills,
        achievements,
        addAchievement,
        auditLogs,
        moderationReports,
        approveVerification,
        rejectVerification,
        resolveReport,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        toggleAIAssistant,
        aiInitialPrompt,
        openAIWithPrompt,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
