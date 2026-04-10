import React from 'react';
import './styles/button.css';

export default function Button({
  variant  = 'primary',
  size,
  full     = false,
  disabled = false,
  loading  = false,
  type     = 'button',
  onClick,
  children,
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size   ? `btn--${size}`  : '',
    full   ? 'btn--full'     : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}