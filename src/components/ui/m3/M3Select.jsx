import { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

export default function M3Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  required,
  disabled,
  error,
  helperText,
  className,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);
  const isActive = !!value;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          'w-full rounded-m3-md border',
          'bg-transparent transition-all duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)]',
          'text-left cursor-pointer',
          disabled ? 'opacity-38 cursor-not-allowed' : '',
          error
            ? 'border-m3-error ring-1 ring-m3-error/30'
            : open
              ? 'border-m3-outline ring-2 ring-m3-primary/20'
              : 'border-m3-outline hover:border-m3-on-surface',
        )}
      >
        <div className="flex items-center">
          <div className="flex-1 min-w-0 px-4">
            <span className={cn(
              'block transition-all duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)]',
              isActive
                ? 'text-[12px] text-m3-on-surface-variant pt-[8px] pb-[2px] scale-85 origin-left'
                : 'text-m3-body-lg text-m3-on-surface-variant pt-[16px] pb-[16px]'
            )}>
              {label}
              {required && <span className="ml-0.5 text-m3-error">*</span>}
            </span>
            {isActive && (
              <span className="block text-m3-body-lg text-m3-on-surface -mt-1 pb-[10px]">
                {selected?.label || value}
              </span>
            )}
          </div>
          <span className="pr-4 flex items-center">
            <svg
              className={cn(
                'w-5 h-5 text-m3-on-surface-variant transition-transform duration-200',
                open && 'rotate-180'
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 10l5 5 5-5" />
            </svg>
          </span>
        </div>
      </button>

      {open && (
        <div className={cn(
          'absolute z-50 w-full mt-1',
          'bg-m3-surface-container rounded-m3-md shadow-m3-2',
          'py-2 max-h-60 overflow-y-auto',
          'animate-[m3-scale-in_var(--m3-duration-medium1)_var(--m3-easing-emphasized-decelerate)]'
        )}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange({ target: { value: option.value, name: 'select' } });
                setOpen(false);
              }}
              className={cn(
                'w-full px-4 py-3 text-left text-m3-body-lg leading-snug',
                'transition-colors duration-100 cursor-pointer',
                option.value === value
                  ? 'bg-m3-secondary-container text-m3-on-secondary-container font-medium'
                  : 'text-m3-on-surface hover:bg-m3-on-surface/8'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {(helperText || error) && (
        <p className={cn(
          'mt-1 ml-4 text-m3-body-sm',
          error ? 'text-m3-error' : 'text-m3-on-surface-variant'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
