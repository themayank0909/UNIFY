import React, { useState } from 'react';
import {
  Vote,
  FileText,
  ThumbsUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  Building,
  Shield,
  HelpCircle,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Proposal, Poll } from '../../types';

export const CampusVoicePage: React.FC = () => {
  const {
    currentUniversity,
    currentUser,
    polls,
    voteInPoll,
    proposals,
    submitProposal,
    upvoteProposal,
    openAIWithPrompt,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'proposals' | 'polls'>('proposals');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);

  // New proposal form state
  const [propTitle, setPropTitle] = useState('');
  const [propCategory, setPropCategory] = useState<Proposal['category']>('Facilities & Campus');
  const [propDescription, setPropDescription] = useState('');
  const [polishingProposal, setPolishingProposal] = useState(false);

  // Filter polls and proposals strictly by university tenant
  const tenantPolls = polls.filter((p) => p.universityId === currentUniversity.id);
  const tenantProposals = proposals.filter((p) => p.universityId === currentUniversity.id);

  const handlePolishWithAI = async () => {
    if (!propTitle || !propDescription) {
      showToast('Enter a draft title and description first');
      return;
    }
    setPolishingProposal(true);
    try {
      const res = await fetch('/api/ai/proposal-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: propTitle,
          description: propDescription,
          category: propCategory,
        }),
      });
      const data = await res.json();
      if (data.polishedTitle) {
        setPropTitle(data.polishedTitle);
      }
      if (data.executiveSummary) {
        setPropDescription(
          `${data.executiveSummary}\n\nAnticipated Outcomes:\n${(data.suggestedOutcomes || [])
            .map((o: string) => `• ${o}`)
            .join('\n')}`
        );
      }
      showToast('Proposal polished with administrative formatting!');
    } catch (e) {
      showToast('Could not polish proposal with AI. Using current text.');
    } finally {
      setPolishingProposal(false);
    }
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim() || !propDescription.trim()) {
      showToast('Please provide a title and description');
      return;
    }
    submitProposal(propTitle.trim(), propDescription.trim(), propCategory);
    setPropTitle('');
    setPropDescription('');
    setShowSubmitModal(false);
  };

  const getStatusBadge = (status: Proposal['currentStatus']) => {
    switch (status) {
      case 'Submitted':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Campus Voice
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              {currentUniversity.shortName} Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official student polls and administrative proposal tracking for campus improvements.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Campus Proposal</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'proposals'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Student Proposals ({tenantProposals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('polls')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'polls'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>Campus Polls ({tenantPolls.length})</span>
        </button>
      </div>

      {/* PROPOSALS VIEW */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {tenantProposals.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No proposals submitted yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Have an idea to improve student life or campus facilities at {currentUniversity.shortName}? Submit a proposal!
              </p>
            </div>
          ) : (
            tenantProposals.map((prop) => {
              const isExpanded = expandedProposalId === prop.id;
              const hasUpvoted = prop.upvoterUserIds.includes(currentUser.id);

              return (
                <div
                  key={prop.id}
                  className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-slate-300 shadow-2xs overflow-hidden transition-all"
                >
                  <div className="p-5">
                    {/* Top Row: Category, Status badge, Timestamp */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {prop.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                            prop.currentStatus
                          )}`}
                        >
                          {prop.currentStatus}
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        {new Date(prop.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900">{prop.title}</h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                      {prop.description}
                    </p>

                    {/* Official Response Banner (if reviewed by admin) */}
                    {prop.officialResponse && (
                      <div className="mt-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-950">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-0.5">
                          <Shield className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Official University Response ({prop.reviewedByAdminName || 'Administration'}):</span>
                        </div>
                        <p className="text-[11px] text-indigo-800 leading-relaxed">
                          {prop.officialResponse}
                        </p>
                      </div>
                    )}

                    {/* Footer Controls: Upvote + Expand History */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => upvoteProposal(prop.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            hasUpvoted
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{prop.upvotes} Support</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <img
                            src={prop.creatorAvatar}
                            alt={prop.creatorName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span>Proposed by {prop.creatorName}</span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedProposalId(isExpanded ? null : prop.id)
                        }
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                      >
                        <span>Official Timeline ({prop.statusHistory.length})</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Status History Timeline */}
                  {isExpanded && (
                    <div className="bg-slate-50 p-5 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                        Audit &amp; Decision History
                      </h4>
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {prop.statusHistory.map((step, idx) => (
                          <div key={idx} className="relative">
                            <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-slate-800">{step.status}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(step.timestamp).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">By {step.updatedBy}</p>
                            {step.officialNote && (
                              <p className="text-xs text-slate-700 mt-1 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                                {step.officialNote}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* POLLS VIEW */}
      {activeTab === 'polls' && (
        <div className="space-y-4">
          {tenantPolls.map((poll) => {
            const hasVoted = poll.voterUserIds.includes(currentUser.id);

            return (
              <div
                key={poll.id}
                className="bg-white rounded-3xl border border-[#E5E7EB] p-5 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {poll.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Closes: {new Date(poll.endsAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{poll.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{poll.description}</p>
                </div>

                {/* Poll Options */}
                <div className="space-y-2.5">
                  {poll.options.map((option) => {
                    const percentage = poll.totalVotes > 0
                      ? Math.round((option.votes / poll.totalVotes) * 100)
                      : 0;
                    const isSelected = poll.votedOptionId === option.id;

                    return (
                      <div
                        key={option.id}
                        onClick={() => !hasVoted && voteInPoll(poll.id, option.id)}
                        className={`p-3 rounded-2xl border transition-all relative overflow-hidden ${
                          hasVoted
                            ? 'cursor-default'
                            : 'cursor-pointer hover:border-indigo-400 hover:bg-slate-50'
                        } ${isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 bg-white'}`}
                      >
                        {/* Progress Bar background if voted */}
                        {hasVoted && (
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-500 opacity-20 ${
                              isSelected ? 'bg-indigo-600' : 'bg-slate-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-600 text-white font-bold'
                                  : 'border-slate-300'
                              }`}
                            >
                              {isSelected ? '✓' : ''}
                            </span>
                            <span className={`font-medium ${isSelected ? 'font-bold text-indigo-900' : 'text-slate-800'}`}>
                              {option.text}
                            </span>
                          </div>

                          {hasVoted && (
                            <span className="font-bold text-slate-700">
                              {percentage}% ({option.votes})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                  <span>Total votes: {poll.totalVotes} students</span>
                  <span>{hasVoted ? '✓ Your single vote is recorded' : '1 vote per verified student'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBMIT PROPOSAL MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">Submit Campus Improvement Proposal</h3>
              <p className="text-xs text-slate-500">
                Directly submitted to {currentUniversity.name} Student Affairs &amp; Administration
              </p>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Expand Campus Electric Shuttle Route to Graduate Housing"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={propCategory}
                  onChange={(e) => setPropCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="Facilities & Campus">Facilities &amp; Campus</option>
                  <option value="Academics & Tech">Academics &amp; Tech</option>
                  <option value="Student Life & Dining">Student Life &amp; Dining</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Accessibility">Accessibility</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Description &amp; Concrete Solution *
                  </label>
                  <button
                    type="button"
                    onClick={handlePolishWithAI}
                    disabled={polishingProposal}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{polishingProposal ? 'Polishing...' : 'AI Proposal Polisher'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Articulate the student issue, proposed change, and measurable outcomes..."
                  value={propDescription}
                  onChange={(e) => setPropDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
