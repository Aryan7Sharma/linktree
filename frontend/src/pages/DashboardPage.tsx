import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  Plus,
  Copy,
  CheckCircle2,
  Smartphone,
  X,
  ExternalLink,
  Sparkles,
  Loader2,
  BarChart2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Sidebar } from '@/components/layout/Sidebar';
import { PhonePreview } from '@/components/dashboard/PhonePreview';
import { LinkCard } from '@/components/dashboard/LinkCard';
import { ThemeSelector } from '@/components/dashboard/ThemeSelector';
import { AnalyticsCard } from '@/components/dashboard/AnalyticsCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

import { useAuthStore } from '@/store/authStore';
import { useMyProfile, useUpdateProfile, useAnalytics } from '@/hooks/useProfile';
import {
  useLinks,
  useCreateLink,
  useUpdateLink,
  useDeleteLink,
  useReorderLinks,
} from '@/hooks/useLinks';

import { Link, ThemeType } from '@/types';

// AI: Gemini API for bio + link title optimization
async function callGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
  if (!apiKey) return '';
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await res.json();
    return (data.candidates?.[0]?.content?.parts?.[0]?.text as string) ?? '';
  } catch {
    return '';
  }
}

type Tab = 'links' | 'appearance' | 'analytics' | 'settings';

export function DashboardPage() {
  const navigate = useNavigate();
  const storeUser = useAuthStore((s) => s.user);

  const { data: profile } = useMyProfile();
  const { data: links = [], isLoading: linksLoading } = useLinks();
  const { data: analytics } = useAnalytics();

  const { mutate: updateProfile, isPending: savingProfile } = useUpdateProfile();
  const { mutate: createLink, isPending: creatingLink } = useCreateLink();
  const { mutate: updateLink } = useUpdateLink();
  const { mutate: deleteLink } = useDeleteLink();
  const { mutate: reorderLinks } = useReorderLinks();

  const [activeTab, setActiveTab] = useState<Tab>('links');
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI states
  const [generatingBio, setGeneratingBio] = useState(false);
  const [optimizingLinkId, setOptimizingLinkId] = useState<string | null>(null);

  // Profile edit state (local draft before saving)
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');

  // Sync local draft when profile loads
  if (profile && displayName === '' && bio === '' && (profile.display_name || profile.bio)) {
    setDisplayName(profile.display_name ?? '');
    setBio(profile.bio ?? '');
  }

  const user = profile ?? storeUser;

  // =============================================
  // DnD sensors
  // =============================================
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      const reordered = arrayMove(links, oldIndex, newIndex);

      // Optimistic: update query cache directly (via reorder mutation)
      reorderLinks(reordered.map((l, i) => ({ id: l.id, sort_order: i })));
    },
    [links, reorderLinks]
  );

  // =============================================
  // Copy profile URL
  // =============================================
  const handleCopy = () => {
    if (!user) return;
    const url = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // =============================================
  // AI: Generate bio
  // =============================================
  const handleGenerateBio = async () => {
    if (!user) return;
    setGeneratingBio(true);
    const prompt = `Write a short, engaging bio (max 120 chars) for a creator named "${
      user.display_name ?? user.username
    }". Current bio: "${bio || 'creator'}". No hashtags, no quotes in response.`;
    const result = await callGemini(prompt);
    if (result) setBio(result.trim().replace(/^"|"$/g, ''));
    setGeneratingBio(false);
  };

  // =============================================
  // AI: Optimize link title
  // =============================================
  const handleOptimizeLink = async (link: Link) => {
    setOptimizingLinkId(link.id);
    const prompt = `Rewrite this link title to be catchy, short (max 40 chars), and click-worthy. Title: "${link.title}", URL: "${link.url}". Return ONLY the new title text.`;
    const result = await callGemini(prompt);
    if (result) {
      updateLink({ id: link.id, data: { title: result.trim().replace(/^"|"$/g, '') } });
    }
    setOptimizingLinkId(null);
  };

  // =============================================
  // Save profile appearance
  // =============================================
  const handleSaveProfile = () => {
    updateProfile({ display_name: displayName, bio });
  };

  const handleThemeChange = (theme: ThemeType) => {
    updateProfile({ theme });
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#f3f3f1] font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-white h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <span className="font-bold text-gray-900">OrangeLink</span>
          <button
            onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
            className="p-2 bg-gray-100 rounded-full text-gray-600"
          >
            {mobilePreviewOpen ? <X size={18} /> : <Smartphone size={18} />}
          </button>
        </header>

        {/* Desktop header */}
        <header className="hidden md:flex h-14 bg-white border-b border-gray-200 items-center justify-between px-8 shrink-0">
          <p className="text-sm font-medium text-gray-500">
            orangelink.io/<span className="text-gray-900 font-bold">{user.username}</span>
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <Copy size={14} />
              )}
              {copied ? 'Copied!' : 'Share link'}
            </button>
            <button
              onClick={() => navigate(`/${user.username}`)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={12} />
              View live
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 md:p-8 pb-24 space-y-6">

            {/* ===== LINKS TAB ===== */}
            {activeTab === 'links' && (
              <div className="space-y-5">
                <Button
                  onClick={() => createLink({ title: '', url: '' })}
                  loading={creatingLink}
                  leftIcon={<Plus size={16} />}
                  className="w-full"
                  size="lg"
                >
                  Add link
                </Button>

                {linksLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-gray-400" />
                  </div>
                ) : links.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="font-semibold">No links yet</p>
                    <p className="text-sm mt-1">Add your first link above</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={links.map((l) => l.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {links.map((link) => (
                          <LinkCard
                            key={link.id}
                            link={link}
                            onUpdate={(id, data) => updateLink({ id, data })}
                            onDelete={deleteLink}
                            onOptimize={handleOptimizeLink}
                            isOptimizing={optimizingLinkId === link.id}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}

            {/* ===== APPEARANCE TAB ===== */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                {/* Profile section */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Profile</h3>
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Avatar */}
                      <div className="shrink-0 flex flex-col items-center gap-3">
                        <img
                          src={
                            user.avatar_url ??
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                          }
                          alt={user.display_name ?? user.username}
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                        />
                        <button className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
                          Change photo
                        </button>
                      </div>

                      {/* Fields */}
                      <div className="flex-1 space-y-4">
                        <Input
                          label="Display name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Your Name"
                        />

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                              Bio
                            </label>
                            <button
                              onClick={handleGenerateBio}
                              disabled={generatingBio}
                              className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 disabled:opacity-50 transition-colors"
                            >
                              {generatingBio ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Sparkles size={12} />
                              )}
                              Magic Rewrite
                            </button>
                          </div>
                          <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell your audience about yourself..."
                            rows={3}
                          />
                          <p className="text-xs text-gray-400 text-right">{bio.length}/280</p>
                        </div>

                        <Button
                          onClick={handleSaveProfile}
                          loading={savingProfile}
                          variant="secondary"
                          size="md"
                        >
                          Save profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Theme section */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Theme</h3>
                  <ThemeSelector currentTheme={user.theme} onSelect={handleThemeChange} />
                </section>
              </div>
            )}

            {/* ===== ANALYTICS TAB ===== */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Lifetime Analytics</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AnalyticsCard
                    label="Profile views"
                    value={(analytics?.totalViews ?? 0).toLocaleString()}
                    change={analytics?.viewsChangePercent}
                  />
                  <AnalyticsCard
                    label="Link clicks"
                    value={(analytics?.totalClicks ?? 0).toLocaleString()}
                    change={analytics?.clicksChangePercent}
                  />
                  <AnalyticsCard
                    label="CTR"
                    value={analytics?.ctr ?? 0}
                    suffix="%"
                  />
                </div>

                {/* Top links */}
                {analytics?.topLinks && analytics.topLinks.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Top performing links</h4>
                    <div className="space-y-3">
                      {analytics.topLinks.map((link, i) => (
                        <div key={link.id} className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                          </div>
                          <span className="text-sm font-bold text-gray-900 shrink-0">
                            {link.clicks.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!analytics && (
                  <div className="bg-white rounded-2xl border border-gray-200 h-48 flex items-center justify-center text-gray-400">
                    <div className="text-center space-y-2">
                      <BarChart2 size={40} className="mx-auto opacity-20" />
                      <p className="text-sm">Analytics loading...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== SETTINGS TAB ===== */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Settings</h3>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">Account</p>
                    <p className="text-xs text-gray-500">Manage your account details</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm font-medium text-gray-900">
                        {user.email ?? '—'}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Username</span>
                      <span className="text-sm font-medium text-gray-900">@{user.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Desktop phone preview pane */}
      <aside className="w-[340px] border-l border-gray-200 bg-white hidden lg:flex flex-col items-center justify-center p-6 relative shrink-0">
        {user && (
          <PhonePreview user={{ ...user, display_name: displayName || user.display_name, bio: bio || user.bio }} links={links} />
        )}
        <button
          onClick={() => navigate(`/${user.username}`)}
          className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={11} />
          View live
        </button>
      </aside>

      {/* Mobile preview overlay */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="font-bold text-gray-900">Preview</span>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="p-2 bg-gray-100 rounded-full"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-hidden p-6">
            {user && <PhonePreview user={{ ...user, bio: bio || user.bio }} links={links} />}
          </div>
        </div>
      )}
    </div>
  );
}
