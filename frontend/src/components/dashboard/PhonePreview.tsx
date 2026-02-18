import { User, Link } from '@/types';
import { THEMES } from '@/utils/themes';

interface PhonePreviewProps {
  user: User;
  links: Link[];
}

export function PhonePreview({ user, links }: PhonePreviewProps) {
  const theme = THEMES[user.theme];
  const activeLinks = links.filter((l) => l.is_active);
  const displayName = user.display_name ?? `@${user.username}`;

  return (
    <div className="relative w-[270px] h-[555px] border-[10px] border-gray-900 rounded-[2.8rem] overflow-hidden shadow-2xl bg-white ring-1 ring-gray-200 mx-auto">
      {/* Phone notch */}
      <div className="absolute top-0 inset-x-0 h-5 bg-gray-900 z-10 flex justify-center">
        <div className="w-24 h-4 bg-gray-900 rounded-b-xl" />
      </div>

      {/* Scrollable content */}
      <div className={`absolute inset-0 pt-5 overflow-y-auto no-scrollbar ${theme.bg}`}>
        <div className="flex flex-col items-center px-4 py-8 space-y-4">
          {/* Avatar */}
          <img
            src={user.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={displayName}
            className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg object-cover"
          />

          {/* Bio */}
          <div className={`text-center space-y-1 ${theme.text}`}>
            <p className="font-bold text-sm">{displayName}</p>
            {user.bio && (
              <p className="text-xs opacity-80 max-w-[200px] leading-snug">{user.bio}</p>
            )}
          </div>

          {/* Links */}
          <div className="w-full space-y-2.5">
            {activeLinks.length === 0 && (
              <div className={`text-center text-xs opacity-50 py-4 ${theme.text}`}>
                No links yet
              </div>
            )}
            {activeLinks.slice(0, 6).map((link) => (
              <div
                key={link.id}
                className={`w-full py-2.5 px-4 rounded-full text-center text-xs font-semibold ${theme.button} ${theme.buttonText}`}
              >
                {link.title || 'Untitled'}
              </div>
            ))}
          </div>

          {/* OrangeLink watermark */}
          <div className={`pt-4 ${theme.text} opacity-60`}>
            <p className="text-[10px] font-bold">OrangeLink</p>
          </div>
        </div>
      </div>
    </div>
  );
}
