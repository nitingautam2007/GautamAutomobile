import { cn } from '../../../lib/utils';

const variants = {
  filled: 'bg-m3-primary text-m3-on-primary hover:shadow-m3-1 active:shadow-m3-0',
  tonal: 'bg-m3-secondary-container text-m3-on-secondary-container hover:shadow-m3-1 active:shadow-m3-0',
  outlined: 'bg-transparent text-m3-primary border border-m3-outline hover:bg-m3-primary/8 active:bg-m3-primary/12',
  text: 'bg-transparent text-m3-primary hover:bg-m3-primary/8 active:bg-m3-primary/12',
  elevated: 'bg-m3-surface-container-high text-m3-primary hover:shadow-m3-2 active:shadow-m3-1',
  danger: 'bg-m3-error text-m3-on-error hover:shadow-m3-1 active:shadow-m3-0',
};

const sizes = {
  sm: 'h-9 px-4 text-m3-label-lg gap-2',
  md: 'h-10 px-6 text-m3-label-lg gap-2',
  lg: 'h-12 px-8 text-m3-label-lg gap-3',
  icon: 'h-10 w-10 p-0 justify-center',
  'icon-sm': 'h-9 w-9 p-0 justify-center',
};

export default function M3Button({
  variant = 'filled',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-m3-full font-medium',
        'transition-all cursor-pointer select-none',
        'duration-[var(--m3-duration-medium1)] ease-[var(--m3-easing-standard)]',
        'disabled:opacity-38 disabled:pointer-events-none disabled:shadow-none',
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
