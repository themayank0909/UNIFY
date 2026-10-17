import React, { useState } from 'react';
import {
  X,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';
import { CollaborationProject, ProjectTask, User } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProjectWorkspaceModalProps {
  project: CollaborationProject;
  onClose: () => void;
}

export const ProjectWorkspaceModal: React.FC<ProjectWorkspaceModalProps> = ({
  project,
  onClose,
}) => {
  const {
    currentUser,
    users,
    updateTaskStatus,
    addTaskToProject,
    toggleMilestone,
    startDirectConversation,
    openAIWithPrompt,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'board' | 'milestones' | 'members' | 'resources'>('board');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>(currentUser.id);

  // Roster of accepted members
  const memberUsers = users.filter((u) => project.currentMembers.includes(u.id));
  const isCreator = project.creatorId === currentUser.id;
  const isMember = project.currentMembers.includes(currentUser.id);

  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const milestoneProgress = project.milestones.length > 0
    ? Math.round((completedMilestones / project.milestones.length) * 100)
    : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTaskToProject(project.id, newTaskTitle.trim(), newTaskPriority, newTaskAssignee);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const columns: { id: ProjectTask['status']; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'bg-slate-100 text-slate-700' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
    { id: 'in_review', label: 'In Review', color: 'bg-amber-50 text-amber-700' },
    { id: 'completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl relative overflow-hidden border border-slate-200">
        {/* Workspace Top Bar */}
        <div className="px-6 py-4 bg-[#10132B] text-white flex items-center justify-between border-b border-[#1E2347] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
              {project.title.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {project.category}
                </span>
                <span className="text-xs text-slate-300">
                  {project.currentMembers.length}/{project.teamSize} Members
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                openAIWithPrompt(
                  `Break down the next sprint tasks for our project: "${project.title}" (${project.category}).`
                )
              }
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">AI Sprint Assistant</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="px-6 py-2 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900 flex-shrink-0">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold">Project Milestones Progress:</span>
            <span>
              {completedMilestones} of {project.milestones.length} completed ({milestoneProgress}%)
            </span>
          </div>

          <div className="w-32 sm:w-48 h-2 bg-indigo-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-4 bg-white flex-shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('board')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'board'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kanban Task Board ({project.tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'milestones'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Milestones &amp; Roadmap ({project.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'members'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Team Roster ({memberUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'resources'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Resources &amp; Specs ({project.resources.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC]">
          {/* TAB 1: KANBAN TASK BOARD */}
          {activeTab === 'board' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sprint Task Board</h3>
                  <p className="text-xs text-slate-500">Track and advance task deliverables</p>
                </div>
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Add Task Form Drawer */}
              {showAddTask && (
                <form
                  onSubmit={handleCreateTask}
                  className="p-4 bg-white rounded-2xl border border-indigo-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">New Workspace Task</h4>
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Task title (e.g. Implement OAuth bearer header validation)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Priority
                      </label>
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Assignee
                      </label>
                      <select
                        value={newTaskAssignee}
                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                      >
                        {memberUsers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.department})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              )}

              {/* 4-column Board */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {columns.map((col) => {
                  const colTasks = project.tasks.filter((t) => t.status === col.id);
                  return (
                    <div key={col.id} className="bg-slate-100/70 rounded-2xl p-3 flex flex-col min-h-[320px]">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-xs font-bold text-slate-700">{col.label}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-2xs">
                          {colTasks.length}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1">
                        {colTasks.length === 0 ? (
                          <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-xl">
                            Empty
                          </div>
                        ) : (
                          colTasks.map((task) => (
                            <div
                              key={task.id}
                              className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:border-indigo-300 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <h5 className="text-xs font-semibold text-slate-800 leading-snug">
                                  {task.title}
                                </h5>
                                <span
                                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    task.priority === 'high'
                                      ? 'bg-rose-50 text-rose-700'
                                      : task.priority === 'medium'
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                                <span>{task.assignedToName || 'Unassigned'}</span>
                                {/* Quick status advance buttons */}
                                <div className="flex gap-1">
                                  {col.id !== 'todo' && (
                                    <button
                                      onClick={() => {
                                        const prevStatus =
                                          col.id === 'completed'
                                            ? 'in_review'
                                            : col.id === 'in_review'
                                            ? 'in_progress'
                                            : 'todo';
                                        updateTaskStatus(project.id, task.id, prevStatus);
                                      }}
                                      className="p-1 text-slate-400 hover:text-slate-700"
                                      title="Move back"
                                    >
                                      &larr;
                                    </button>
                                  )}
                                  {col.id !== 'completed' && (
                                    <button
                                      onClick={() => {
                                        const nextStatus =
                                          col.id === 'todo'
                                            ? 'in_progress'
                                            : col.id === 'in_progress'
                                            ? 'in_review'
                                            : 'completed';
                                        updateTaskStatus(project.id, task.id, nextStatus);
                                      }}
                                      className="p-1 text-indigo-600 hover:text-indigo-800 font-bold"
                                      title="Advance task"
                                    >
                                      &rarr;
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES & ROADMAP */}
          {activeTab === 'milestones' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Project Milestones</h3>
                  <p className="text-xs text-slate-500">
                    Sign off on deliverables to unlock verified growth badges
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {project.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      m.completed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleMilestone(project.id, m.id)}
                          className={`mt-0.5 p-1 rounded-lg border transition-colors ${
                            m.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                              Phase {idx + 1}
                            </span>
                            <h4
                              className={`text-xs font-bold ${
                                m.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                              }`}
                            >
                              {m.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{m.description}</p>
                        </div>
                      </div>

                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        Due {m.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEAM MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Project Team Roster</h3>
                <p className="text-xs text-slate-500">
                  Accepted collaborators with authorized workspace access
                </p>
              </div>

              <div className="space-y-3">
                {memberUsers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                          {member.id === project.creatorId && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">
                              Project Lead
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">{member.department}</p>
                      </div>
                    </div>

                    {member.id !== currentUser.id && (
                      <button
                        onClick={() => {
                          startDirectConversation(member.id);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RESOURCES & SPECS */}
          {activeTab === 'resources' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Shared Links &amp; Documentation</h3>
                <p className="text-xs text-slate-500">Centralized repository for design specs, repos, and cloud keys</p>
              </div>

              <div className="space-y-2">
                {project.resources.length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                    No resources added yet.
                  </div>
                ) : (
                  project.resources.map((r, idx) => (
                    <a
                      key={idx}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
                    >
                      <span>{r.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
