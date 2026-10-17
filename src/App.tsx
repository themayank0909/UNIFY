import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';
import { HomeDashboard } from './components/home/HomeDashboard';
import { DiscoverPage } from './components/discover/DiscoverPage';
import { CirclesPage } from './components/circles/CirclesPage';
import { CollaborationHub } from './components/collaboration/CollaborationHub';
import { OpportunitiesPage } from './components/opportunities/OpportunitiesPage';
import { CampusVoicePage } from './components/campus-voice/CampusVoicePage';
import { MessagesPage } from './components/messages/MessagesPage';
import { MyGrowthPage } from './components/growth/MyGrowthPage';
import { ProfileSettingsPage } from './components/profile/ProfileSettingsPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CreateProjectModal } from './components/collaboration/CreateProjectModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { CheckCircle2, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentTab, toastMessage, showToast, isOnboardingOpen, setIsOnboardingOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'home':
        return <HomeDashboard />;
      case 'discover':
        return <DiscoverPage />;
      case 'circles':
        return <CirclesPage />;
      case 'collaboration':
        return <CollaborationHub />;
      case 'opportunities':
        return <OpportunitiesPage />;
      case 'campus-voice':
        return <CampusVoicePage />;
      case 'messages':
        return <MessagesPage />;
      case 'growth':
        return <MyGrowthPage />;
      case 'profile':
        return <ProfileSettingsPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-['Inter',sans-serif]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#10132B] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs border border-indigo-500/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Slide-over Sidebar Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-[#10132B] h-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-3 top-4 p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Workspace (Offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCreateProject={() => setShowCreateProjectModal(true)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </main>
      </div>

      {/* AI Assistant Sliding Drawer */}
      <AIAssistantDrawer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Direct Collaboration Creation Modal from Header */}
      {showCreateProjectModal && (
        <CreateProjectModal onClose={() => setShowCreateProjectModal(false)} />
      )}

      {/* Campus Life & Academic Onboarding / Profile Customizer Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
