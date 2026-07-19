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
  const isActive = focused || (value && String(value).length > 0);

  const handleFocus = () => { setFocused(true); onFocusProp?.(); };
  const handleBlur = () => { setFocused(false); onBlurProp?.(); };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative w-full rounded-m3-md',
          'bg-transparent border',
          'transition-all duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)]',
          disabled ? 'opacity-38 cursor-not-allowed' : 'cursor-text',
          error
            ? 'border-m3-error ring-1 ring-m3-error/30'
            : focused
              ? 'border-m3-outline ring-2 ring-m3-primary/20'
              : 'border-m3-outline hover:border-m3-on-surface',
        )}
      >
        <div className="flex items-center">
          {icon && (
            <span className="pl-4 pr-1 text-m3-on-surface-variant flex-shrink-0 flex items-center h-[56px]">
              {icon}
            </span>
          )}
          <div className="flex-1 relative">
            <label
              htmlFor={id}
              className={cn(
                'absolute left-4 transition-all duration-[var(--m3-duration-short4)] ease-[var(--m3-easing-standard)] pointer-events-none origin-left',
                isActive
                  ? 'text-[12px] top-[8px] text-m3-on-surface-variant scale-85'
                  : 'text-m3-body-lg top-[16px] text-m3-on-surface-variant',
                icon && 'left-0',
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
                  isActive ? 'pt-[30px] pb-[10px]' : 'pt-[18px] pb-[18px]',
                  icon ? 'pr-4 pl-0' : 'px-4',
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
                  'text-m3-body-lg text-m3-on-surface',
                  'placeholder:text-transparent',
                  isActive ? 'pt-[30px] pb-[10px]' : 'pt-[18px] pb-[18px]',
                  icon ? 'pr-4 pl-0' : 'px-4',
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
          'mt-1 ml-4 text-m3-body-sm',
          error ? 'text-m3-error' : 'text-m3-on-surface-variant'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
