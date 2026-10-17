import React from 'react';
import {
  Home,
  Users,
  Compass,
  Briefcase,
  Sparkles,
  Vote,
  MessageSquare,
  TrendingUp,
  UserCheck,
  Shield,
  Bot,
  School,
  CheckCircle2,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UnifyLogo } from '../common/UnifyLogo';
import { UserRole } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    currentUniversity,
    universities,
    switchUniversity,
    currentUser,
    switchUserRole,
    notifications,
    conversations,
    toggleAIAssistant,
  } = useApp();

  const [showUniDropdown, setShowUniDropdown] = React.useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = React.useState(false);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Users },
    { id: 'circles', label: 'Circles', icon: Compass },
    { id: 'collaboration', label: 'Collaboration', icon: Briefcase },
    { id: 'opportunities', label: 'Opportunities', icon: Sparkles },
    { id: 'campus-voice', label: 'Campus Voice', icon: Vote },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { id: 'growth', label: 'My Growth', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Settings', icon: UserCheck },
  ];

  const roles: { role: UserRole; label: string }[] = [
    { role: 'student', label: 'Student View' },
    { role: 'senior_alumni', label: 'Senior / Alumni' },
    { role: 'faculty_mentor', label: 'Faculty / Mentor' },
    { role: 'club_org', label: 'Club / Org' },
    { role: 'admin', label: 'University Admin' },
  ];

  return (
    <aside className="w-64 bg-[#10132B] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 select-none border-r border-[#1E2347]">
      {/* Brand & Wordmark */}
      <div className="p-5 pb-4 border-b border-[#1E2347]">
        <UnifyLogo variant="dark" size="md" showTagline={true} />
      </div>

      {/* University Tenant Identity Selector */}
      <div className="px-4 py-3 border-b border-[#1E2347] relative">
        <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1 flex items-center justify-between">
          <span>University Workspace</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Tenant Isolated
          </span>
        </div>

        <button
          onClick={() => setShowUniDropdown(!showUniDropdown)}
          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#181D3D] hover:bg-[#202752] border border-[#2A3366] transition-colors text-left"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <School className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{currentUniversity.name}</p>
              <p className="text-[10px] text-slate-400">{currentUniversity.location}</p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
        </button>

        {/* Dropdown to switch tenant */}
        {showUniDropdown && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-[#181D3D] border border-[#2A3366] rounded-xl shadow-2xl py-1 z-50">
            <div className="px-3 py-1.5 text-[10px] text-slate-400 border-b border-[#2A3366]">
              Switch Campus Tenant:
            </div>
            {universities.map((uni) => (
              <button
                key={uni.id}
                onClick={() => {
                  switchUniversity(uni.id);
                  setShowUniDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#202752] transition-colors ${
                  currentUniversity.id === uni.id ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-slate-300'
                }`}
              >
                <div className="truncate">
                  <p className="truncate font-medium">{uni.name}</p>
                  <p className="text-[10px] text-slate-400">@{uni.domain}</p>
                </div>
                {currentUniversity.id === uni.id && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#181D3D]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white scale-110' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Dashboard Navigation */}
        <div className="pt-2">
          <button
            onClick={() => setCurrentTab('admin')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              currentTab === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg font-semibold'
                : 'text-amber-300/90 hover:text-amber-200 hover:bg-[#181D3D] border border-amber-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>University Admin</span>
            </div>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
              Protected
            </span>
          </button>
        </div>
      </nav>

      {/* AI Assistant Quick Launcher Button */}
      <div className="px-3 py-2 border-t border-[#1E2347]">
        <button
          onClick={toggleAIAssistant}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-indigo-500/40 text-indigo-200 hover:text-white hover:border-indigo-400 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">Unify AI</p>
              <p className="text-[10px] text-indigo-300">Project &amp; Career Assistant</p>
            </div>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        </button>
      </div>

      {/* User Card & Perspective Demo Switcher */}
      <div className="p-3 border-t border-[#1E2347] bg-[#0C0E20] relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/50 flex-shrink-0"
            />
            <div className="truncate">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-white truncate">{currentUser.name}</span>
                {currentUser.verificationStatus === 'verified' && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                )}
                {currentUser.verificationStatus === 'pending' && (
                  <Clock className="w-3 h-3 text-amber-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.department}</p>
            </div>
          </div>
        </div>

        {/* Role perspective dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="w-full flex items-center justify-between px-2 py-1 rounded bg-[#181D3D] hover:bg-[#202752] text-[10px] text-slate-300 transition-colors"
          >
            <span>Role: <strong className="text-white capitalize">{currentUser.role.replace('_', ' ')}</strong></span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute left-0 right-0 bottom-full mb-1 bg-[#181D3D] border border-[#2A3366] rounded-xl shadow-2xl py-1 z-50">
              <div className="px-2.5 py-1 text-[9px] text-slate-400 border-b border-[#2A3366]">
                Demo Role Switcher:
              </div>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchUserRole(r.role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-[11px] flex items-center justify-between hover:bg-[#202752] transition-colors ${
                    currentUser.role === r.role ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-slate-300'
                  }`}
                >
                  <span>{r.label}</span>
                  {currentUser.role === r.role && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
