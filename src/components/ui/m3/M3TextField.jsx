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
            'relative w-full rounded-m3-lg',
            'bg-m3-surface-container-high border',
            'transition-all duration-300 ease-[var(--m3-easing-standard)]',
            disabled ? 'opacity-38 cursor-not-allowed' : 'cursor-text',
            error
              ? 'border-m3-error shadow-[0_0_0_1px_var(--m3-error)]'
              : focused
                ? 'border-m3-primary shadow-[0_0_0_1px_var(--m3-primary)]'
                : 'border-m3-outline-variant/50 hover:border-m3-outline-variant hover:shadow-sm',
          )}
        >
        <div className="flex items-center">
          {icon && (
            <span className="pl-3 pr-1 text-m3-on-surface-variant flex-shrink-0 flex items-center self-stretch">
              {icon}
            </span>
          )}
          <div className="flex-1 relative">
            <label
              htmlFor={id}
              className={cn(
                'absolute left-3 transition-all duration-300 ease-[var(--m3-easing-standard)] pointer-events-none origin-left',
                isActive
                  ? 'text-[11px] top-[3px] text-m3-primary font-medium'
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
                  isActive ? 'pt-[22px] pb-[8px]' : 'py-[14px]',
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
                  'transition-all duration-300 ease-[var(--m3-easing-standard)]',
                  isActive ? 'pt-[22px] pb-[8px]' : 'py-[14px]',
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
