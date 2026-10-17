import React, { useState } from 'react';
import { Home, Users, Briefcase, Sparkles, MoreHorizontal, Vote, MessageSquare, TrendingUp, Shield, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, conversations } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const unreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const primaryItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Users },
    { id: 'collaboration', label: 'Collab', icon: Briefcase },
    { id: 'opportunities', label: 'Opps', icon: Sparkles },
  ];

  const moreItems = [
    { id: 'campus-voice', label: 'Campus Voice', icon: Vote },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { id: 'growth', label: 'My Growth', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Settings', icon: UserCheck },
    { id: 'admin', label: 'Admin Dashboard', icon: Shield },
  ];

  return (
    <>
      {/* More items drawer for mobile */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden flex flex-col justify-end"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="bg-white rounded-t-2xl p-4 space-y-2 border-t border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3" />
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">More Features</h4>
            {moreItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id as any);
                    setShowMoreMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    currentTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-indigo-600 text-white font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main bottom 5-destination navigation bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E5E7EB] z-30 flex items-center justify-around px-2">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id as any);
                setShowMoreMenu(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            showMoreMenu || ['campus-voice', 'messages', 'growth', 'profile', 'admin'].includes(currentTab)
              ? 'text-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">More</span>
        </button>
      </nav>
    </>
  );
};
