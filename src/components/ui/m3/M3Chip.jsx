import { cn } from '../../../lib/utils';

const variants = {
  assist: 'bg-transparent border border-m3-outline text-m3-on-surface',
  filter: '',
  input: 'bg-transparent border border-m3-outline text-m3-on-surface',
  suggestion: 'bg-m3-surface-container-high text-m3-on-surface-variant',
};

export default function M3Chip({
  variant = 'suggestion',
  selected = false,
  label,
  icon,
  trailingIcon,
  onClick,
  onTrailingClick,
  className,
  ...props
}) {
  const isFilter = variant === 'filter';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-m3-sm',
        'text-m3-label-lg font-medium leading-none',
        'transition-all duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)]',
        'cursor-pointer select-none whitespace-nowrap',
        isFilter && selected
          ? 'bg-m3-secondary-container text-m3-on-secondary-container border border-transparent'
          : isFilter
            ? 'bg-transparent border border-m3-outline text-m3-on-surface hover:bg-m3-on-surface/8'
            : variants[variant],
        !isFilter && 'hover:bg-m3-on-surface/8',
        onClick && 'active:scale-95',
        className
      )}
      {...props}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{icon}</span>}
      <span className="leading-none flex items-center">{label}</span>
      {trailingIcon && (
        <span
          className="w-4 h-4 flex-shrink-0 cursor-pointer hover:text-m3-on-surface flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onTrailingClick?.();
          }}
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
}
