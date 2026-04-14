import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCardBlocked, updateCardLimits } from "../../features/authSlice";

import "../../components/ui/styles/card.css";
import "../../components/ui/styles/button.css";
import "./cards.css";

function formatCardNumber(number) {
  const digits = String(number ?? "").replace(/\s+/g, "");
  if (digits.length < 12) return digits || "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022";
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function maskCardNumber(number) {
  const digits = String(number ?? "").replace(/\s+/g, "");
  const last4 = digits.slice(-4).padStart(4, "\u2022");
  return `\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ${last4}`;
}

function maskCvv() {
  return "\u2022\u2022\u2022";
}

export default function Cards() {
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.auth?.cards) || [];
  const userName = useSelector((state) => state.auth?.user?.name) || "User";
  const accountId = useSelector((state) => state.auth?.account?.id) || "\u2014";

  const safeCards = Array.isArray(cards) ? cards : [];
  const normalizedCards = safeCards.map((card) => ({
    ...card,
    limits: card?.limits || { online: 0, withdrawals: 0 },
  }));

  return (
    <div className="cards-view">
      <header className="cards-view__header">
        <div>
          <h1 className="cards-view__title">Cards</h1>
          <p className="cards-view__subtitle text-muted">
            Your physical and virtual cards.
          </p>
        </div>
      </header>

      <div className="cards-view__grid">
        {normalizedCards.length === 0 ? (
          <p className="text-muted">No cards available (mock).</p>
        ) : (
          normalizedCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              userName={userName}
              accountId={accountId}
              onUpdateLimits={(limits) =>
                dispatch(updateCardLimits({ cardId: card.id, limits }))
              }
              onSetBlocked={(blocked) =>
                dispatch(setCardBlocked({ cardId: card.id, blocked }))
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function CardItem({ card, userName, accountId, onUpdateLimits, onSetBlocked }) {
  const [flipped, setFlipped] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [onlineLimit, setOnlineLimit] = useState(String(card?.limits?.online ?? 0));
  const [withdrawalLimit, setWithdrawalLimit] = useState(
    String(card?.limits?.withdrawals ?? 0)
  );

  const isBlocked = Boolean(card?.blocked);
  const canWithdraw = Number(card?.limits?.withdrawals ?? 0) > 0;

  const handleSaveLimits = () => {
    const online = Math.max(0, Number(onlineLimit));
    const withdrawals = Math.max(0, Number(withdrawalLimit));
    onUpdateLimits({
      online: Number.isFinite(online) ? online : card?.limits?.online ?? 0,
      withdrawals: Number.isFinite(withdrawals)
        ? withdrawals
        : card?.limits?.withdrawals ?? 0,
    });
  };

  const toggleBlocked = () => {
    const next = !isBlocked;
    const ok = window.confirm(
      next
        ? "Block this card? You can unblock it later (mock)."
        : "Unblock this card? (mock)"
    );
    if (!ok) return;
    onSetBlocked(next);
  };

  return (
    <section className="card cards-view__card">
      <div className="cards-view__card-top">
        <span className="pill pill--type">{card.label}</span>
        <span className={`pill${isBlocked ? " pill--muted" : ""}`}>{card.status}</span>
      </div>

      <div className="cards-view__card-stage">
        <div className={`cards-view__flip${flipped ? " is-flipped" : ""}`}>
          <div className="cards-view__face cards-view__face--front" aria-label="Card front">
            <div className="cards-view__brand">
              <span className="cards-view__brand-mark" aria-hidden="true" />
              <span className="cards-view__brand-name">NovaBank</span>
            </div>

            <div className="cards-view__front-meta">
              <div className="cards-view__front-row">
                <span className="cards-view__front-label">Cardholder</span>
                <span className="cards-view__front-value">{userName}</span>
              </div>
              <div className="cards-view__front-row">
                <span className="cards-view__front-label">Account</span>
                <span className="cards-view__front-value cards-view__mono">
                  {accountId}
                </span>
              </div>
            </div>
          </div>

          <div className="cards-view__face cards-view__face--back" aria-label="Card back">
            <div className="cards-view__magstripe" aria-hidden="true" />

            <div className="cards-view__back-fields">
              <div className="cards-view__field">
                <span className="cards-view__field-label">Card number</span>
                <span className="cards-view__field-value cards-view__mono">
                  {showNumber ? formatCardNumber(card.number) : maskCardNumber(card.number)}
                </span>
              </div>

              <div className="cards-view__field-row">
                <div className="cards-view__field">
                  <span className="cards-view__field-label">Expiry</span>
                  <span className="cards-view__field-value cards-view__mono">
                    {card.expiry}
                  </span>
                </div>
                <div className="cards-view__field">
                  <span className="cards-view__field-label">CVV</span>
                  <span className="cards-view__field-value cards-view__mono">
                    {showCvv ? String(card.cvv ?? "\u2014") : maskCvv()}
                  </span>
                </div>
              </div>
            </div>

            <div className="cards-view__toggles">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setShowNumber((v) => !v)}
                aria-pressed={showNumber}
              >
                {showNumber ? "Hide number" : "Show number"}
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setShowCvv((v) => !v)}
                aria-pressed={showCvv}
              >
                {showCvv ? "Hide CVV" : "Show CVV"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="cards-view__card-actions">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => setFlipped((v) => !v)}
        >
          {flipped ? "View front" : "View back"}
        </button>

        <button
          type="button"
          className={`btn btn--sm${isBlocked ? "" : " btn--danger"}`}
          onClick={toggleBlocked}
        >
          {isBlocked ? "Unblock card" : "Block card"}
        </button>
      </div>

      <div className={`cards-view__limits${isBlocked ? " is-disabled" : ""}`}>
        <div className="cards-view__limits-head">
          <h3 className="cards-view__limits-title">Limits</h3>
          <span className="text-muted">Online / withdrawals</span>
        </div>

        <div className="cards-view__limits-grid">
          <label className="cards-view__limit">
            <span className="cards-view__limit-label">Online</span>
            <input
              className="cards-view__limit-input"
              type="number"
              min="0"
              step="100"
              value={onlineLimit}
              onChange={(e) => setOnlineLimit(e.target.value)}
              disabled={isBlocked}
            />
          </label>

          <label className="cards-view__limit">
            <span className="cards-view__limit-label">Withdrawals</span>
            <input
              className="cards-view__limit-input"
              type="number"
              min="0"
              step="100"
              value={withdrawalLimit}
              onChange={(e) => setWithdrawalLimit(e.target.value)}
              disabled={isBlocked}
            />
          </label>
        </div>

        {!canWithdraw && (
          <p className="text-muted cards-view__hint">
            Virtual cards typically can’t withdraw cash (mock).
          </p>
        )}

        <div className="cards-view__limits-actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleSaveLimits}
            disabled={isBlocked}
          >
            Update limits
          </button>
        </div>
      </div>
    </section>
  );
}

