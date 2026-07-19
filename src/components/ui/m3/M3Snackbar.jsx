import { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';

export default function M3Snackbar({
  open,
  message,
  type = 'default',
  actionLabel,
  onAction,
  onClose,
  duration = 4000,
}) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setExiting(false);
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setVisible(false);
          onClose?.();
        }, 200);
      }, duration);
      return () => clearTimeout(timer);
    } else if (visible) {
      setExiting(true);
      setTimeout(() => setVisible(false), 200);
    }
  }, [open, duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-[9999] flex justify-center sm:block">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-m3-md',
          'shadow-m3-3 sm:min-w-[300px] sm:max-w-[560px] w-full',
          'text-m3-inverse-on-surface bg-m3-inverse-surface',
          'transition-all duration-[var(--m3-duration-medium2)] ease-[var(--m3-easing-emphasized-decelerate)]',
          exiting
            ? 'opacity-0 translate-y-2'
            : 'opacity-100 translate-y-0'
        )}
      >
        {type === 'error' && (
          <svg className="w-5 h-5 text-m3-error flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        )}
        {type === 'success' && (
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        )}
        <span className="flex-1 text-m3-body-md leading-snug">{message}</span>
        {actionLabel && (
          <button
            onClick={onAction}
            className="text-m3-inverse-primary text-m3-label-lg font-medium hover:underline flex-shrink-0 ml-2"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
