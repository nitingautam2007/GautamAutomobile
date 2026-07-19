import { cn } from '../../../lib/utils';

const sizes = {
  sm: 'h-14 w-14',
  md: 'h-16 w-16',
  lg: 'h-[96px] w-[96px]',
};

const variants = {
  primary: 'bg-m3-primary-container text-m3-on-primary-container shadow-m3-3 hover:shadow-m3-4',
  secondary: 'bg-m3-secondary-container text-m3-on-secondary-container shadow-m3-3 hover:shadow-m3-4',
  tertiary: 'bg-m3-tertiary-container text-m3-on-tertiary shadow-m3-3 hover:shadow-m3-4',
  surface: 'bg-m3-surface-container-high text-m3-primary shadow-m3-3 hover:shadow-m3-4',
};

export default function M3Fab({
  variant = 'primary',
  size = 'md',
  children,
  className,
  extended = false,
  label,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-m3-lg',
        'transition-all cursor-pointer select-none',
        'duration-[var(--m3-duration-medium1)] ease-[var(--m3-easing-standard)]',
        'hover:shadow-m3-4 active:shadow-m3-3',
        extended ? 'h-14 px-4 gap-3' : sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {extended && label && (
        <span className="text-m3-label-lg font-medium">{label}</span>
      )}
    </button>
  );
}
