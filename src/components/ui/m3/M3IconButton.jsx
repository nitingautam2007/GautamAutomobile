import { cn } from '../../../lib/utils';

const variants = {
  standard: 'bg-transparent text-m3-on-surface-variant hover:bg-m3-on-surface/8 active:bg-m3-on-surface/12',
  filled: 'bg-m3-primary text-m3-on-primary hover:shadow-m3-1 active:shadow-m3-0',
  tonal: 'bg-m3-secondary-container text-m3-on-secondary-container hover:shadow-m3-1 active:shadow-m3-0',
  outlined: 'bg-transparent text-m3-on-surface-variant border border-m3-outline-variant hover:bg-m3-on-surface/8 active:bg-m3-on-surface/12',
};

const sizes = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export default function M3IconButton({
  variant = 'standard',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-m3-full',
        'transition-all cursor-pointer select-none',
        'duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)]',
        'disabled:opacity-38 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
