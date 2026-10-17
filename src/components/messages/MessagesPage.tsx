import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  Search,
  CheckCircle2,
  Shield,
  Layers,
  MoreVertical,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Conversation, Message } from '../../types';

export const MessagesPage: React.FC = () => {
  const {
    currentUser,
    users,
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    blockUser,
    showToast,
  } = useApp();

  const [input, setInput] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConv
    ? messages.filter((m) => m.conversationId === activeConv.id)
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConv) return;
    sendMessage(activeConv.id, input.trim());
    setInput('');
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8.5rem)] bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs overflow-hidden flex flex-col md:flex-row">
      {/* Conversations Left Panel */}
      <div className="w-full md:w-80 border-r border-[#E5E7EB] flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-[#E5E7EB] space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Messages</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Verified Chat
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations found. Connect with peers to chat!
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      conv.type === 'project'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {conv.type === 'project' ? (
                      <Layers className="w-5 h-5 text-purple-600" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{conv.title}</h4>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Messages Right Panel */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-[#F8FAFC]">
          {/* Header */}
          <div className="p-4 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  activeConv.type === 'project'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {activeConv.type === 'project' ? <Layers className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{activeConv.title}</h3>
                <p className="text-[10px] text-slate-400">
                  {activeConv.type === 'project'
                    ? 'Project Workspace Channel'
                    : 'Direct Student Connection'}
                </p>
              </div>
            </div>

            {activeConv.targetUserId && (
              <button
                onClick={() => {
                  blockUser(activeConv.targetUserId!);
                }}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                title="Block user"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Block / Report</span>
              </button>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                <span>This is the beginning of your conversation. Send a message!</span>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isSelf = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 mt-1"
                    />

                    <div className={`max-w-[75%] flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                      {!isSelf && (
                        <span className="text-[10px] font-semibold text-slate-500 mb-0.5 px-1">
                          {msg.senderName}
                        </span>
                      )}
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isSelf
                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-2xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Message ${activeConv.title}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Select a conversation to start messaging.
        </div>
      )}
    </div>
  );
};
