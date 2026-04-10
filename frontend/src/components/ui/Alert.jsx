import React from 'react';
import './styles/alert.css';

const VARIANTS = {
  success: { icon: '✓' },
  error:   { icon: '✕' },
  warning: { icon: '⚠' },
  info:    { icon: 'i' },
};

export default function Alert({ variant = 'info', children }) {
  const { icon } = VARIANTS[variant] ?? VARIANTS.info;

  return (
    <div className={`alert alert--${variant}`}>
      <span className="alert__icon">{icon}</span>
      <span className="alert__message">{children}</span>
    </div>
  );
}