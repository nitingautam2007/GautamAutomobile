import { useState, useId } from 'react';
import { cn } from '../../../lib/utils';

export default function M3TextField({
  label,
  type = 'text',
  value,
  onChange,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  placeholder,
  required,
  disabled,
  error,
  helperText,
  icon,
  className,
  inputClassName,
  select,
  children,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const isActive = focused || select || (value && String(value).length > 0);

  const handleFocus = () => { setFocused(true); onFocusProp?.(); };
  const handleBlur = () => { setFocused(false); onBlurProp?.(); };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative w-full rounded-m3-sm',
          'bg-m3-surface-container-high border',
          'transition-colors duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)]',
          disabled ? 'opacity-38 cursor-not-allowed' : 'cursor-text',
          error
            ? 'border-m3-error'
            : 'border-transparent hover:border-m3-outline-variant',
        )}
      >
        <div className="flex items-center">
          {icon && (
            <span className="pl-3 pr-1 text-m3-on-surface-variant flex-shrink-0 flex items-center h-10">
              {icon}
            </span>
          )}
          <div className="flex-1 relative">
            <label
              htmlFor={id}
              className={cn(
                'absolute left-3 transition-all duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)] pointer-events-none origin-left',
                isActive
                  ? 'text-[11px] top-[3px] text-m3-on-surface-variant'
                  : 'text-m3-body-md top-1/2 -translate-y-1/2 text-m3-on-surface-variant',
                icon && 'left-0',
                error && 'text-m3-error'
              )}
            >
              {label}
              {required && <span className="ml-0.5 text-m3-error">*</span>}
            </label>
            {select ? (
              <select
                id={id}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                required={required}
                className={cn(
                  'w-full bg-transparent border-none outline-none',
                  'text-m3-body-md text-m3-on-surface',
                  'appearance-none cursor-inherit',
                  isActive ? 'pt-[20px] pb-[6px]' : 'pt-[12px] pb-[12px]',
                  icon ? 'pr-4 pl-0' : 'px-3',
                )}
                {...props}
              >
                {children}
              </select>
            ) : (
              <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={focused ? placeholder : ''}
                disabled={disabled}
                required={required}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={cn(
                  'w-full bg-transparent border-none outline-none ring-0',
                  'text-m3-body-md text-m3-on-surface',
                  'placeholder:text-transparent',
                  isActive ? 'pt-[20px] pb-[6px]' : 'pt-[12px] pb-[12px]',
                  icon ? 'pr-3 pl-0' : 'px-3',
                  inputClassName
                )}
                {...props}
              />
            )}
          </div>
        </div>
      </div>
      {(helperText || error) && (
        <p className={cn(
          'mt-0.5 ml-3 text-m3-body-sm',
          error ? 'text-m3-error' : 'text-m3-on-surface-variant'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
