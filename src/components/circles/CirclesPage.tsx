import React, { useState } from 'react';
import {
  Compass,
  Users,
  MessageSquare,
  Plus,
  Heart,
  Share2,
  ExternalLink,
  Shield,
  BookOpen,
  Send,
  Sparkles,
  Check,
  Search,
  Filter,
  X,
  Lock,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Circle, CirclePost } from '../../types';

export const CirclesPage: React.FC = () => {
  const {
    currentUniversity,
    currentUser,
    circles,
    joinedCircleIds,
    joinCircle,
    leaveCircle,
    createCircle,
    circlePosts,
    createCirclePost,
    likeCirclePost,
    selectedCircleId,
    setSelectedCircleId,
    showToast,
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterMembership, setFilterMembership] = useState<'all' | 'joined'>('all');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleTagline, setNewCircleTagline] = useState('');
  const [newCircleDesc, setNewCircleDesc] = useState('');
  const [newCircleCategory, setNewCircleCategory] = useState('Creative Arts & Talents');
  const [newCirclePrivate, setNewCirclePrivate] = useState(false);
  const [newCircleTags, setNewCircleTags] = useState('');
  const [newCircleRules, setNewCircleRules] = useState('');

  // Tenant Isolation: circles for currentUniversity or open/cross-campus
  const tenantCircles = circles.filter(
    (c) => !c.universityId || c.universityId === currentUniversity.id
  );

  const filteredCircles = tenantCircles.filter((c) => {
    if (selectedCategory !== 'all') {
      const catLower = c.category.toLowerCase();
      const selLower = selectedCategory.toLowerCase();
      if (!catLower.includes(selLower)) return false;
    }

    if (filterMembership === 'joined' && !joinedCircleIds.includes(c.id)) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchTagline = c.tagline.toLowerCase().includes(q);
      const matchTags = c.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchTagline && !matchTags) return false;
    }

    return true;
  });

  const [activeCircleId, setActiveCircleId] = useState<string>(
    selectedCircleId || tenantCircles[0]?.id || 'circle_ai'
  );
  const [postContent, setPostContent] = useState('');

  const currentCircle = circles.find((c) => c.id === activeCircleId) || filteredCircles[0] || tenantCircles[0];
  const isJoined = currentCircle ? joinedCircleIds.includes(currentCircle.id) : false;

  const currentPosts = currentCircle ? circlePosts.filter((p) => p.circleId === currentCircle.id) : [];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !currentCircle) return;
    createCirclePost(currentCircle.id, postContent.trim());
    setPostContent('');
  };

  const handleCreateCircleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim()) return;

    const tags = newCircleTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const rules = newCircleRules
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const newId = createCircle({
      name: newCircleName.trim(),
      tagline: newCircleTagline.trim() || 'University community & discussion space',
      description: newCircleDesc.trim() || 'A student circle for collaboration and sharing.',
      category: newCircleCategory,
      universityId: newCirclePrivate ? currentUniversity.id : undefined,
      isPrivate: newCirclePrivate,
      iconName: 'Users',
      bannerColor: 'from-purple-600 to-indigo-600',
      tags: tags.length > 0 ? tags : ['Campus', 'Community'],
      rules: rules.length > 0 ? rules : ['Be respectful and support all members.'],
    });

    setActiveCircleId(newId);
    setShowCreateModal(false);
    setNewCircleName('');
    setNewCircleTagline('');
    setNewCircleDesc('');
    setNewCircleTags('');
    setNewCircleRules('');
  };

  const categories = [
    { id: 'all', label: 'All Circles' },
    { id: 'Creative Arts', label: 'Music & Creative Arts' },
    { id: 'Engineering', label: 'AI & Engineering' },
    { id: 'Agriculture', label: 'Agriculture & Earth' },
    { id: 'Sports', label: 'Sports & Lifestyle' },
    { id: 'Management', label: 'Startups & Business' },
    { id: 'Humanities', label: 'Literature & Culture' },
    { id: 'Medical', label: 'Medical & Health' },
    { id: 'Research', label: 'Academic & Research' },
    { id: 'Design', label: 'Design & Visual Arts' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Circles &amp; Communities
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              {currentUniversity.shortName} Chapters
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Academic guilds, music &amp; performing arts clubs, sports unions, and student founder collectives.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Circle</span>
        </button>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="p-4 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search circles by name, topic, or tag (e.g. Band, Agronomy, AI, Football, Poetry)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setFilterMembership('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterMembership === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMembership('joined')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterMembership === 'joined'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              My Joined ({joinedCircleIds.length})
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1 rounded-xl whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat.id
                  ? 'bg-indigo-50 border border-indigo-300 text-indigo-700 font-bold'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Circle Selector on Left/Top + Discussion Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Circles Directory List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Campus Communities ({filteredCircles.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredCircles.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No circles match your search query. Try another keyword or create a new community!
              </div>
            ) : (
              filteredCircles.map((circle) => {
                const joined = joinedCircleIds.includes(circle.id);
                const isSelected = circle.id === activeCircleId;

                return (
                  <div
                    key={circle.id}
                    onClick={() => setActiveCircleId(circle.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-indigo-500 shadow-sm ring-2 ring-indigo-500/10'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {circle.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5">{circle.name}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {circle.tagline}
                        </p>
                      </div>

                      {joined && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5 flex-shrink-0">
                          <Check className="w-2.5 h-2.5" />
                          Joined
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {circle.memberCount} members
                      </span>
                      <span className="flex items-center gap-1">
                        {circle.isPrivate ? (
                          <>
                            <Lock className="w-2.5 h-2.5 text-amber-500" />
                            <span>Campus Only</span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-2.5 h-2.5 text-slate-400" />
                            <span>Open Circle</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Circle Details & Community Board */}
        {currentCircle ? (
          <div className="lg:col-span-2 space-y-5">
            {/* Banner card */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {currentCircle.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{currentCircle.name}</h2>
                  <p className="text-xs text-slate-600 mt-1">{currentCircle.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isJoined ? (
                    <button
                      onClick={() => leaveCircle(currentCircle.id)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Leave Circle
                    </button>
                  ) : (
                    <button
                      onClick={() => joinCircle(currentCircle.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs"
                    >
                      Join Circle
                    </button>
                  )}
                </div>
              </div>

              {/* Rules & Tags */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                {currentCircle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Post Creation Form */}
            {isJoined ? (
              <form
                onSubmit={handleCreatePost}
                className="p-4 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <textarea
                    rows={2}
                    placeholder={`Share an audio track, rehearsal update, research paper, match fixture, or question in ${currentCircle.name}...`}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={!postContent.trim()}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post to Circle</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center text-xs text-indigo-900">
                Join this circle to participate in discussions and share resources with peers.
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
              {currentPosts.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
                  No discussions posted yet in this circle. Be the first to share an update!
                </div>
              ) : (
                currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{post.authorName}</h4>
                          <p className="text-[10px] text-slate-400 capitalize">
                            {post.authorRole.replace('_', ' ')} • {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Attachments if any */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="space-y-1">
                        {post.attachments.map((att, idx) => (
                          <a
                            key={idx}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-slate-100"
                          >
                            <span>{att.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Like & Comment action row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                      <button
                        onClick={() => likeCirclePost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          post.likedByCurrentUser
                            ? 'text-rose-600 font-semibold'
                            : 'hover:text-slate-800'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-current' : ''}`}
                        />
                        <span>{post.likes}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>{post.commentCount} comments</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
            Select a community on the left to view discussions.
          </div>
        )}
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Campus Circle</h3>
                <p className="text-xs text-slate-500">
                  Launch a new student community, club chapter, or interest group.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCircleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Community Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Campus Indie Filmmakers Guild, Solar Car Team..."
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="Brief one-liner summary of your community's purpose..."
                  value={newCircleTagline}
                  onChange={(e) => setNewCircleTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCircleCategory}
                    onChange={(e) => setNewCircleCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    <option value="Creative Arts & Talents">Creative Arts & Talents</option>
                    <option value="Music & Performance">Music & Performance</option>
                    <option value="Sports & Lifestyle">Sports & Lifestyle</option>
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Agriculture & Sciences">Agriculture & Sciences</option>
                    <option value="Management & Business">Management & Business</option>
                    <option value="Humanities & Culture">Humanities & Culture</option>
                    <option value="Medical & Health">Medical & Health</option>
                    <option value="Academic & Research">Academic & Research</option>
                    <option value="Design & Fine Arts">Design & Fine Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Access Level
                  </label>
                  <select
                    value={newCirclePrivate ? 'private' : 'public'}
                    onChange={(e) => setNewCirclePrivate(e.target.value === 'private')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    <option value="public">Open Circle (All Campuses)</option>
                    <option value="private">{currentUniversity.shortName} Verified Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What will members do? Meeting times, goals, projects..."
                  value={newCircleDesc}
                  onChange={(e) => setNewCircleDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ShortFilm, Cinematography, Screenwriting, 4K"
                  value={newCircleTags}
                  onChange={(e) => setNewCircleTags(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Community Rules (one per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Be welcoming to beginners&#10;Respect rehearsal spaces"
                  value={newCircleRules}
                  onChange={(e) => setNewCircleRules(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Publish Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
