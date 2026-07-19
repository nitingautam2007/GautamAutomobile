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
  select,
  children,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const isActive = focused || (value && String(value).length > 0);

  const handleFocus = () => { setFocused(true); onFocusProp?.(); };
  const handleBlur = () => { setFocused(false); onBlurProp?.(); };

  const baseClasses = cn(
    'relative w-full rounded-m3-md',
    'bg-transparent border',
    'transition-all duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)]',
    disabled ? 'opacity-38 cursor-not-allowed' : 'cursor-text',
    error
      ? 'border-m3-error'
      : focused
        ? 'border-m3-primary'
        : 'border-m3-outline',
    className
  );

  return (
    <div className="relative w-full">
      <div className={baseClasses}>
        <div className="flex items-center px-4">
          {icon && (
            <span className="mr-3 text-m3-on-surface-variant flex-shrink-0">
              {icon}
            </span>
          )}
          <div className="flex-1 relative py-4">
            <label
              htmlFor={id}
              className={cn(
                'absolute left-0 transition-all duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)] pointer-events-none',
                isActive
                  ? 'text-xs top-2 text-m3-on-surface-variant'
                  : 'text-m3-body-lg top-1/2 -translate-y-1/2 text-m3-on-surface-variant',
                error && !focused && 'text-m3-error'
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
                disabled={disabled}
                required={required}
                className={cn(
                  'w-full bg-transparent border-none outline-none',
                  'text-m3-body-lg text-m3-on-surface',
                  'appearance-none cursor-inherit',
                  isActive ? 'pt-4' : 'pt-0',
                  'pb-0'
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
                  'w-full bg-transparent border-none outline-none',
                  'text-m3-body-lg text-m3-on-surface',
                  'placeholder:text-transparent',
                  isActive ? 'pt-4' : 'pt-0',
                  'pb-0'
                )}
                {...props}
              />
            )}
          </div>
        </div>
      </div>
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
