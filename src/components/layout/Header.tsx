import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
  Menu,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UnifyLogo } from '../common/UnifyLogo';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenCreateProject?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenCreateProject,
}) => {
  const {
    currentUniversity,
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentTab,
    requestVerification,
    openOnboarding,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [proofUrl, setProofUrl] = useState('');

  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route to Discover with search
    setCurrentTab('discover');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestVerification(proofUrl || 'https://verify.university.edu/student-card-8491.pdf');
    setShowVerifyModal(false);
    setProofUrl('');
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E5E7EB] sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8">
        {/* Left: Mobile hamburger + breadcrumb / search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo for mobile view */}
          <div className="lg:hidden">
            <UnifyLogo variant="compact" size="xs" />
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${currentUniversity.shortName} students, projects, hackathons, or circles...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </form>
        </div>

        {/* Right: Verification Status, Create Project Action, Notifications */}
        <div className="flex items-center gap-3">
          {/* University Verification Badge */}
          {currentUser.verificationStatus === 'verified' && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified @{currentUniversity.shortName}</span>
            </div>
          )}

          {currentUser.verificationStatus === 'pending' && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>Verification Pending</span>
            </div>
          )}

          {currentUser.verificationStatus === 'rejected' && (
            <button
              onClick={() => setShowVerifyModal(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-100 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Verify Enrollment</span>
            </button>
          )}

          {/* Onboarding & Profile Customizer Shortcut */}
          <button
            onClick={openOnboarding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition-colors shadow-2xs"
            title="Update your university, academic branch, creative talents, and sports profile"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Setup Profile</span>
          </button>

          {/* Post Collaboration Button */}
          {onOpenCreateProject && (
            <button
              onClick={onOpenCreateProject}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-semibold shadow-sm hover:from-indigo-700 hover:to-indigo-800 transition-all hover:shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post Collaboration</span>
              <span className="sm:hidden">Post</span>
            </button>
          )}

          {/* Notifications Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 relative transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.targetTab) setCurrentTab(notif.targetTab as any);
                          setShowNotifications(false);
                        }}
                        className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* University Verification Submission Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Verify University Enrollment</h3>
                <p className="text-xs text-slate-500">Workspace: {currentUniversity.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Unify maintains strict campus tenant isolation. Submit your university enrollment proof
              (e.g., student ID photo, tuition receipt, or registrar statement link) for administrator review.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active University Email
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Credential Document URL or Upload Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://verify.stanford.edu/card-scan.jpg"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Our automated OCR and campus administrator queue will verify within 24 hours.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
