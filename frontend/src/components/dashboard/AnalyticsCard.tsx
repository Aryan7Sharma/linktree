import { cn } from '@/utils/cn';

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  change?: number;
  suffix?: string;
}

export function AnalyticsCard({ label, value, change, suffix }: AnalyticsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2 text-gray-900">
        {value}
        {suffix && <span className="text-lg ml-1">{suffix}</span>}
      </p>
      {change !== undefined && (
        <p
          className={cn(
            'text-xs font-bold mt-1',
            isPositive && 'text-green-600',
            isNegative && 'text-red-500',
            !isPositive && !isNegative && 'text-gray-400'
          )}
        >
          {isPositive && '↑ '}
          {isNegative && '↓ '}
          {Math.abs(change)}% from last week
        </p>
      )}
    </div>
  );
}
