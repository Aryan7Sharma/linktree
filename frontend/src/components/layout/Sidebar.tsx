import { Layout, Image, BarChart2, Settings, LogOut, Link2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLogout } from '@/hooks/useAuth';

type Tab = 'links' | 'appearance' | 'analytics' | 'settings';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS = [
  { id: 'links' as Tab, label: 'Links', icon: Layout },
  { id: 'appearance' as Tab, label: 'Appearance', icon: Image },
  { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart2 },
  { id: 'settings' as Tab, label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
      {/* Logo */}
      <div>
        <div className="px-5 py-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
            <Link2 size={16} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight hidden md:block">OrangeLink</span>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                activeTab === id
                  ? 'bg-orange-50 text-brand-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="hidden md:inline">Log out</span>
        </button>
      </div>
    </aside>
  );
}
