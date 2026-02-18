import { cn } from '@/utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, disabled = false, size = 'md' }: ToggleProps) {
  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex items-center rounded-full transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-green-500' : 'bg-gray-200',
        isSmall ? 'w-8 h-4' : 'w-10 h-6'
      )}
    >
      <span
        className={cn(
          'inline-block bg-white rounded-full shadow-sm transition-transform duration-200',
          isSmall ? 'w-3 h-3' : 'w-4 h-4',
          checked
            ? isSmall ? 'translate-x-4' : 'translate-x-5'
            : isSmall ? 'translate-x-0.5' : 'translate-x-1'
        )}
      />
    </button>
  );
}
