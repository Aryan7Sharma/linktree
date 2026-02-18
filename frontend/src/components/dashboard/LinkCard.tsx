import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { Link } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/utils/cn';

interface LinkCardProps {
  link: Link;
  onUpdate: (id: string, data: Partial<Pick<Link, 'title' | 'url' | 'is_active'>>) => void;
  onDelete: (id: string) => void;
  onOptimize: (link: Link) => void;
  isOptimizing: boolean;
}

export function LinkCard({ link, onUpdate, onDelete, onOptimize, isOptimizing }: LinkCardProps) {
  const [titleDraft, setTitleDraft] = useState(link.title);
  const [urlDraft, setUrlDraft] = useState(link.url);

  // DnD-kit sortable setup
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleBlur = () => {
    if (titleDraft !== link.title) {
      onUpdate(link.id, { title: titleDraft });
    }
  };

  const handleUrlBlur = () => {
    if (urlDraft !== link.url) {
      onUpdate(link.id, { url: urlDraft });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white rounded-2xl border border-gray-200 p-4 transition-all duration-150',
        'hover:border-gray-300 hover:shadow-sm',
        isDragging && 'shadow-xl opacity-90 rotate-1 z-50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="mt-3 text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-500 transition-colors touch-none"
        >
          <GripVertical size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Link title"
              className="flex-1 font-semibold text-gray-900 placeholder-gray-400 bg-transparent border-none p-0 focus:ring-0 text-sm min-w-0"
            />

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* AI Optimize */}
              <button
                onClick={() => onOptimize(link)}
                disabled={isOptimizing}
                title="Optimize with AI"
                className="text-purple-500 hover:text-purple-700 hover:bg-purple-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isOptimizing ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Sparkles size={15} />
                )}
              </button>

              {/* Toggle active */}
              <Toggle
                checked={link.is_active}
                onChange={(val) => onUpdate(link.id, { is_active: val })}
                size="sm"
              />
            </div>
          </div>

          {/* URL row */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://example.com"
              className="flex-1 text-xs text-gray-500 placeholder-gray-300 bg-transparent border-none p-0 focus:ring-0 min-w-0"
            />
            {link.url && (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-brand-500 transition-colors"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <span className="text-xs text-gray-400">{link.click_count} clicks</span>
            <button
              onClick={() => onDelete(link.id)}
              className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
