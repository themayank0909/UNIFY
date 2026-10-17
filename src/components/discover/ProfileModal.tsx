import React from 'react';
import {
  X,
  CheckCircle2,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  Sparkles,
  MessageSquare,
  UserPlus,
  UserX,
  ShieldAlert,
} from 'lucide-react';
import { User, Connection } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  connection?: Connection;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  connection,
}) => {
  const {
    currentUser,
    sendConnectionRequest,
    acceptConnection,
    removeConnection,
    blockUser,
    startDirectConversation,
    projects,
    showToast,
  } = useApp();

  const isSelf = user.id === currentUser.id;
  const isConnected = connection?.status === 'accepted';
  const isPending = connection?.status === 'pending';

  const userProjects = projects.filter((p) => p.currentMembers.includes(user.id));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Banner with gradient */}
        <div className="h-28 bg-gradient-to-r from-[#10132B] via-indigo-900 to-purple-900 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar floating over banner */}
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              {user.verificationStatus === 'verified' && (
                <div
                  className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white shadow-sm ring-2 ring-white"
                  title="Verified University Enrollment"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {!isSelf && (
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <button
                    onClick={() => {
                      startDirectConversation(user.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                ) : isPending ? (
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                    Request Pending
                  </span>
                ) : (
                  <button
                    onClick={() => sendConnectionRequest(user.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Name & Academic details */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs font-semibold text-indigo-700 mt-0.5">
              {user.academicBranch || user.department}
            </p>

            {user.degreeProgram && (
              <p className="text-[11px] text-slate-500 font-medium">
                {user.degreeProgram} {user.year ? `• ${user.year}` : ''}
              </p>
            )}

            {user.privacy.showEmail && (
              <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{user.email}</span>
              </p>
            )}
          </div>

          {/* Stated Availability */}
          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                user.availability === 'Looking for Team'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : user.availability === 'Mentoring'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{user.availability}</span>
            </span>
          </div>

          {/* Bio */}
          <p className="text-xs text-slate-600 mt-3 leading-relaxed">{user.bio}</p>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="mt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Core Skills &amp; Proficiencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creative Talents & Instruments */}
          {user.creativeInterests && user.creativeInterests.length > 0 && (
            <div className="mt-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-pink-600 mb-1.5">
                Creative Talents &amp; Arts
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.creativeInterests.map((c, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 font-medium border border-pink-100"
                  >
                    🎵 {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sports & Lifestyle */}
          {user.sportsLifestyle && user.sportsLifestyle.length > 0 && (
            <div className="mt-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1.5">
                Sports &amp; Fitness
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.sportsLifestyle.map((sp, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-100"
                  >
                    ⚽ {sp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Career Goals */}
          {user.careerGoals && user.careerGoals.length > 0 && (
            <div className="mt-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1.5">
                Career Ambitions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.careerGoals.map((g, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-100"
                  >
                    🎯 {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collaboration Preferences */}
          {user.collaborationPreferences && user.collaborationPreferences.length > 0 && (
            <div className="mt-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1.5">
                Looking to Collaborate on
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.collaborationPreferences.map((pref, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-100"
                  >
                    🤝 {pref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Projects */}
          {userProjects.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Active Campus Collaborations
              </h4>
              <div className="space-y-2">
                {userProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{p.title}</p>
                      <p className="text-[10px] text-slate-400">{p.category} • {p.timeCommitment}</p>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Controls: Remove Connection / Block User */}
          {!isSelf && (
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              {isConnected && (
                <button
                  onClick={() => {
                    removeConnection(user.id);
                    onClose();
                  }}
                  className="text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Remove Connection
                </button>
              )}
              <button
                onClick={() => {
                  blockUser(user.id);
                  onClose();
                }}
                className="text-slate-400 hover:text-rose-600 transition-colors ml-auto flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report / Block</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
