import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isDemo?: boolean;
}

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    aiInitialPrompt,
    currentUser,
    currentUniversity,
    setCurrentTab,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I am Unify AI, your university collaboration and academic growth advisor for ${currentUniversity.shortName}.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen]);

  useEffect(() => {
    if (aiInitialPrompt && isAIAssistantOpen) {
      setInput(aiInitialPrompt);
    }
  }, [aiInitialPrompt, isAIAssistantOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: MessageItem = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-4),
          userContext: {
            university: currentUniversity.name,
            department: currentUser.department,
            skills: currentUser.skills,
            interests: currentUser.interests,
            isVerified: currentUser.verificationStatus === 'verified',
          },
        }),
      });

      const data = await response.json();

      if (data.notice) {
        setDemoNotice(data.notice);
      }

      const botMsg: MessageItem = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I could not process that request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: data.isDemoMode,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const botMsg: MessageItem = {
        id: `ai_err_${Date.now()}`,
        sender: 'assistant',
        text: 'Could not connect to AI service. Ensure dev server is running and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: true,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    'How do I find hackathon teammates for TreeHacks?',
    'Break down a 4-week student project into milestones',
    'Recommend learning steps for PyTorch and distributed AI',
    'How to write a high-impact campus voice proposal',
  ];

  if (!isAIAssistantOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white border-l border-[#E5E7EB] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-[#10132B] text-white flex items-center justify-between border-b border-[#1E2347]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white">Unify AI Assistant</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[10px] text-slate-300">University collaboration &amp; project mentor</p>
          </div>
        </div>

        <button
          onClick={() => setIsAIAssistantOpen(false)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Demo notification banner if key is offline */}
      {demoNotice && (
        <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-800 text-[10px] flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>{demoNotice}</span>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                  isUser ? 'bg-indigo-600 text-white' : 'bg-[#10132B] text-indigo-300'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-[#E5E7EB] rounded-tl-none shadow-sm whitespace-pre-wrap'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 items-center text-slate-500 text-xs py-2">
            <div className="w-7 h-7 rounded-full bg-[#10132B] text-indigo-300 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-2.5 bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-600 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-500 ml-1">Analyzing campus context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick prompt chips */}
      <div className="p-2.5 bg-white border-t border-[#E5E7EB]">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
          Suggested Topics
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] text-left px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg transition-colors border border-slate-200"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="p-3 bg-white border-t border-[#E5E7EB]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Unify AI about teams, opportunities..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
