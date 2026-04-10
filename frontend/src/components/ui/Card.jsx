import React from 'react';
import './styles/card.css';

export default function Card({
  title,
  subtitle,
  footer,
  variant,        // 'raised' | 'gold' | undefined
  narrow = false,
  children,
}) {
  const classes = [
    'card',
    variant ? `card--${variant}` : '',
    narrow  ? 'card--narrow'     : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {(title || subtitle) && (
        <div className="card__header">
          {title    && <h2 className="card__title">{title}</h2>}
          {subtitle && <p  className="card__subtitle">{subtitle}</p>}
        </div>
      )}

      <div className="card__body">{children}</div>

      {footer && (
        <div className="card__footer">{footer}</div>
      )}
    </div>
  );
}