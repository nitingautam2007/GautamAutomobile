import { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import M3Button from './M3Button';

export default function M3Dialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setExiting(false);
      document.body.style.overflow = 'hidden';
    } else if (visible) {
      setExiting(true);
      document.body.style.overflow = '';
      setTimeout(() => setVisible(false), 200);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div
        className={cn(
          'absolute inset-0 bg-black/40',
          'transition-opacity duration-[var(--m3-duration-medium2)]',
          exiting ? 'opacity-0' : 'opacity-100'
        )}
        onClick={onCancel}
      />
      <div
        className={cn(
          'relative bg-m3-surface-container-high rounded-m3-xl shadow-m3-3',
          'p-6 w-full max-w-md',
          'transition-all duration-[var(--m3-duration-medium2)] ease-[var(--m3-easing-emphasized-decelerate)]',
          exiting
            ? 'opacity-0 scale-90'
            : 'opacity-100 scale-100'
        )}
      >
        <h2 className="text-m3-headline-sm text-m3-on-surface mb-2">
          {title}
        </h2>
        <p className="text-m3-body-lg text-m3-on-surface-variant mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <M3Button variant="text" onClick={onCancel}>
            {cancelLabel}
          </M3Button>
          <M3Button
            variant={danger ? 'danger' : 'filled'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </M3Button>
        </div>
      </div>
    </div>
  );
}
