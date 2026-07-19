import { cn } from '../../../lib/utils';

const variants = {
  elevated: 'bg-m3-surface-container-low shadow-m3-1 hover:shadow-m3-2',
  filled: 'bg-m3-surface-container-highest shadow-m3-0',
  outlined: 'bg-m3-surface shadow-m3-0 border border-m3-outline-variant',
};

export default function M3Card({
  variant = 'elevated',
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-m3-md overflow-hidden',
        'transition-shadow duration-[var(--m3-duration-medium1)] ease-[var(--m3-easing-standard)]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
