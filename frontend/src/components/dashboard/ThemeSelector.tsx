import { THEMES } from '@/utils/themes';
import { ThemeType } from '@/types';
import { cn } from '@/utils/cn';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onSelect: (theme: ThemeType) => void;
}

export function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {(Object.keys(THEMES) as ThemeType[]).map((themeKey) => {
        const theme = THEMES[themeKey];
        const isActive = currentTheme === themeKey;

        return (
          <button
            key={themeKey}
            onClick={() => onSelect(themeKey)}
            className={cn(
              'group relative aspect-[3/5] rounded-2xl border-2 overflow-hidden transition-all duration-200',
              isActive
                ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                : 'border-transparent hover:border-gray-300'
            )}
          >
            {/* Theme preview background */}
            <div className={`absolute inset-0 ${theme.bg}`}>
              <div className="flex flex-col items-center justify-center h-full gap-2 p-3">
                {/* Fake avatar */}
                <div className="w-8 h-8 rounded-full bg-white/30" />
                {/* Fake name */}
                <div className="w-14 h-1.5 rounded-full bg-white/30" />
                {/* Fake links */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-full h-7 rounded-full ${theme.button} opacity-90`}
                  />
                ))}
              </div>
            </div>

            {/* Theme label overlay */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 backdrop-blur-sm">
              <p className="text-xs font-bold text-gray-900 capitalize">{theme.label}</p>
            </div>

            {/* Active checkmark */}
            {isActive && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
