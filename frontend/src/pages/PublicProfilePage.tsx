import { useParams, Navigate } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { usePublicProfile } from '@/hooks/useProfile';
import { usePublicLinks } from '@/hooks/useLinks';
import { THEMES } from '@/utils/themes';
import { linksApi } from '@/api/links';

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = usePublicProfile(username ?? '');

  const { data: links = [], isLoading: linksLoading } = usePublicLinks(username ?? '');

  if (!username) return <Navigate to="/" replace />;

  if (profileLoading || linksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
        <p className="text-2xl font-bold text-gray-700">Profile not found</p>
        <p className="text-gray-500">@{username} doesn't exist on OrangeLink</p>
      </div>
    );
  }

  const theme = THEMES[profile.theme];
  const displayName = profile.display_name ?? `@${profile.username}`;

  const handleLinkClick = async (linkId: string, url: string) => {
    // Fire-and-forget analytics
    linksApi.trackClick(linkId).catch(() => {});
    // Open the link
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center px-4 py-12 ${theme.bg}`}
      // SEO: dynamic title is set in helmet or via useEffect
    >
      <title>{`${displayName} | OrangeLink`}</title>

      <div className="w-full max-w-[680px] flex flex-col items-center space-y-6">
        {/* Avatar */}
        <img
          src={
            profile.avatar_url ??
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
          }
          alt={displayName}
          className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl object-cover"
        />

        {/* Bio */}
        <div className={`text-center space-y-2 ${theme.text}`}>
          <h1 className="text-xl font-bold tracking-tight">{displayName}</h1>
          {profile.bio && (
            <p className="text-sm opacity-85 max-w-sm mx-auto leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="w-full space-y-3 pt-2">
          {links.length === 0 && (
            <p className={`text-center text-sm opacity-50 py-4 ${theme.text}`}>
              No links yet
            </p>
          )}
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className={`block w-full py-4 px-6 rounded-full text-center transition-all duration-200 ${theme.button} ${theme.buttonText} cursor-pointer`}
            >
              <span className="font-semibold text-sm sm:text-base">{link.title}</span>
            </button>
          ))}
        </div>

        {/* Watermark */}
        <div className={`pt-8 flex items-center gap-1.5 ${theme.text} opacity-50`}>
          <div className="w-4 h-4 bg-brand-500 rounded flex items-center justify-center">
            <Link2 size={10} className="text-white" />
          </div>
          <span className="text-xs font-bold">OrangeLink</span>
        </div>
      </div>
    </div>
  );
}
