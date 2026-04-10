import React from 'react';
import './styles/input.css';

/**
 * Input
 *
 * Standalone (no prefix/suffix):
 *   <Input label="Email" placeholder="you@example.com" />
 *
 * With prefix / suffix (uses wrapper layout):
 *   <Input label="Price" prefix="$" placeholder="0.00" />
 *   <Input label="Username" suffix="@site.com" placeholder="username" />
 */
export default function Input({
  label,
  placeholder,
  prefix,
  suffix,
  error,
  hint,
  disabled = false,
  type     = 'text',
  value,
  onChange,
  id,
}) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasWrapper = prefix || suffix;

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}

      {hasWrapper ? (
        <div className={`input-wrapper${error ? ' input-wrapper--error' : ''}`}>
          {prefix && <span className="input-prefix">{prefix}</span>}
          <input
            id={inputId}
            className="form-input"
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={onChange}
          />
          {suffix && <span className="input-suffix">{suffix}</span>}
        </div>
      ) : (
        <input
          id={inputId}
          className={`form-input--standalone${error ? ' form-input--error' : ''}`}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
      )}

      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
}