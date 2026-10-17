import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  TrendingUp,
  History,
  Lock,
  ChevronRight,
  ExternalLink,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Proposal } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUniversity,
    currentUser,
    switchUserRole,
    users,
    proposals,
    updateProposalStatus,
    auditLogs,
    moderationReports,
    approveVerification,
    rejectVerification,
    resolveReport,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'verification' | 'proposals' | 'moderation' | 'analytics' | 'audit'
  >('verification');

  // Proposal review form
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<Proposal['currentStatus']>('Approved');
  const [decisionNote, setDecisionNote] = useState('');

  const isAdmin = currentUser.role === 'admin';

  // If user is not admin, show permission wall with quick switch button for demo testing
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-lg">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Protected University Admin Portal</h2>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Access to this dashboard is restricted to authorized university administrators, deans, and moderators.
          Your current active perspective is <strong>{currentUser.role.replace('_', ' ').toUpperCase()}</strong>.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          In accordance with Unify role-based access control, administrative tools cannot be accessed by normal students.
        </p>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
          <button
            onClick={() => switchUserRole('admin')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Switch to Administrator Perspective (Demo Mode)
          </button>
        </div>
      </div>
    );
  }

  // Filter verification queue
  const pendingUsers = users.filter(
    (u) => u.universityId === currentUniversity.id && u.verificationStatus === 'pending'
  );

  const tenantProposals = proposals.filter((p) => p.universityId === currentUniversity.id);
  const tenantAuditLogs = auditLogs.filter((a) => a.universityId === currentUniversity.id);
  const pendingReports = moderationReports.filter(
    (r) => r.universityId === currentUniversity.id && r.status === 'pending'
  );

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropId) return;
    updateProposalStatus(selectedPropId, decisionStatus, decisionNote.trim());
    setSelectedPropId(null);
    setDecisionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#10132B] via-[#1D2146] to-[#121633] text-white border border-[#2B3469] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Role: University Administrator
            </span>
            <span className="text-xs text-slate-300">{currentUniversity.name} Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
            Administrative Operations &amp; Governance
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Official enrollment verification, proposal adjudications, moderation, and aggregate analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchUserRole('student')}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Exit Admin View
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveAdminTab('verification')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
            activeAdminTab === 'verification'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Verification Queue ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('proposals')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
            activeAdminTab === 'proposals'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Proposals Desk ({tenantProposals.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('moderation')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
            activeAdminTab === 'moderation'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reports &amp; Moderation ({pendingReports.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
            activeAdminTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Aggregate Analytics</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
            activeAdminTab === 'audit'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log ({tenantAuditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: VERIFICATION REVIEW QUEUE */}
      {activeAdminTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Enrollment Verification Queue</h3>
              <p className="text-xs text-slate-500">
                Review uploaded registrar documentation or email domains before granting campus privileges.
              </p>
            </div>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Verification queue is clear</h4>
              <p className="text-xs text-slate-500 mt-1">
                All student enrollment submissions in {currentUniversity.shortName} have been processed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-5 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{user.name}</h4>
                      <p className="text-[11px] text-slate-500">{user.email} • {user.department}</p>
                      {user.verificationProofUrl && (
                        <a
                          href={user.verificationProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 mt-1 font-semibold"
                        >
                          <span>Review Document Evidence</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => rejectVerification(user.id, 'Incomplete registrar document')}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveVerification(user.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                    >
                      Approve Enrollment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROPOSALS DECISION DESK */}
      {activeAdminTab === 'proposals' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Campus Voice Proposal Decision Desk</h3>
            <p className="text-xs text-slate-500">
              Advance proposal review stages and attach official administrative notes.
            </p>
          </div>

          <div className="space-y-3">
            {tenantProposals.map((prop) => (
              <div
                key={prop.id}
                className="p-5 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {prop.category}
                    </span>
                    <span className="text-xs font-bold text-indigo-600">
                      Status: {prop.currentStatus}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{prop.upvotes} student supporters</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{prop.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{prop.description}</p>

                {/* Form to submit official decision if open */}
                {selectedPropId === prop.id ? (
                  <form
                    onSubmit={handleDecisionSubmit}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                  >
                    <h5 className="text-xs font-bold text-slate-900">Issue Administrative Decision</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          New Status
                        </label>
                        <select
                          value={decisionStatus}
                          onChange={(e) => setDecisionStatus(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Official Note / Reason for Students *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Explain committee findings, next steps, or funding approval details..."
                        value={decisionNote}
                        onChange={(e) => setDecisionNote(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPropId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Record Official Decision
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedPropId(prop.id);
                        setDecisionStatus(prop.currentStatus);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors"
                    >
                      Update Official Decision &rarr;
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MODERATION REPORTS */}
      {activeAdminTab === 'moderation' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Content Moderation &amp; Safety Queue</h3>
            <p className="text-xs text-slate-500">
              Handle student reports regarding academic integrity, harassment, or solicitation.
            </p>
          </div>

          {pendingReports.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No pending reports</h4>
              <p className="text-xs text-slate-500 mt-1">Campus community environment is safe and active.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                      Reason: {report.reason}
                    </span>
                    <span className="text-xs text-slate-400">Reported by {report.reporterName}</span>
                  </div>
                  <p className="text-xs text-slate-700">{report.details}</p>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => resolveReport(report.id, 'dismissed')}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => resolveReport(report.id, 'resolved')}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                    >
                      Take Action &amp; Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AGGREGATE PLATFORM ANALYTICS */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Privacy-Safe Aggregate Analytics</h3>
            <p className="text-xs text-slate-500">
              High-level university collaboration metrics without exposing sensitive individual student activity.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500">Enrolled Students</span>
              <p className="text-2xl font-bold text-slate-900 mt-2">{currentUniversity.studentCount.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+14% this quarter</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500">Active Collaborations</span>
              <p className="text-2xl font-bold text-slate-900 mt-2">48 Projects</p>
              <span className="text-[10px] text-indigo-600 font-semibold">92% team fill rate</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500">Proposal Resolution</span>
              <p className="text-2xl font-bold text-slate-900 mt-2">78%</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Avg 6 days to review</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500">Cross-Disciplinary Teams</span>
              <p className="text-2xl font-bold text-slate-900 mt-2">84%</p>
              <span className="text-[10px] text-slate-400">CS + Design + Engineering</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeAdminTab === 'audit' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tamper-Evident Administrative Audit Log</h3>
            <p className="text-xs text-slate-500">
              Cryptographic chronological trail of all verification, moderation, and governance decisions.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs divide-y divide-slate-100">
            {tenantAuditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {log.action}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">By {log.actorName}</span>
                    <span className="text-[10px] text-slate-400">({log.actorRole})</span>
                  </div>
                  <p className="text-xs text-slate-600">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
