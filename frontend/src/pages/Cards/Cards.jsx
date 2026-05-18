import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCards,
  setCardBlocked,
  updateCardLimits,
} from "../../features/cardSlice";
import { fetchAccounts } from "../../features/accountSlice";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/button.css";
import "./cards.css";

function formatCardNumber(number) {
  const digits = String(number ?? "").replace(/\s+/g, "");

  if (digits.length < 12) {
    return "•••• •••• •••• ••••";
  }

  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function maskCardNumber(number) {
  const digits = String(number ?? "").replace(/\s+/g, "");
  const last4 = digits.slice(-4).padStart(4, "•");

  return `•••• •••• •••• ${last4}`;
}

function maskCvv() {
  return "•••";
}

export default function Cards() {
  const dispatch = useDispatch();

  const {
    cards = [],
    isLoading,
    error,
  } = useSelector((state) => state.cards);

  const user = useSelector((state) => state.auth?.user || {});
  console.log("user: ", user)

  const selectedAccount = useSelector(
    (state) => state.accounts?.selectedAccount || {}
  );

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchCards());
  }, [dispatch]);

  const userName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    "User";

  const accountNumber =
    selectedAccount?.accountNumber ;
    console.log("cards acc: ", accountNumber)

  return (
    <div className="cards-view">
      <header className="cards-view__header">
        <div>
          <h1 className="cards-view__title">Cards</h1>

          <p className="cards-view__subtitle text-muted">
            Manage your physical and virtual cards.
          </p>
        </div>
      </header>

      {isLoading && (
        <div className="card">
          <p className="text-muted">Loading cards...</p>
        </div>
      )}

      {error && (
        <div className="card">
          <p className="text-danger">{error}</p>
        </div>
      )}

      {!isLoading && cards.length === 0 && (
        <div className="card">
          <p className="text-muted">No cards available.</p>
        </div>
      )}

      <div className="cards-view__grid">
        {cards.map((card) => (
          <CardItem
            key={card._id}
            card={card}
            userName={userName}
            accountNumber={accountNumber}
            onUpdateLimits={(limits) =>
              dispatch(
                updateCardLimits({
                  cardId: card._id,
                  limits,
                })
              )
            }
            onSetBlocked={(blocked) =>
              dispatch(
                setCardBlocked({
                  cardId: card._id,
                  blocked,
                })
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

function CardItem({
  card,
  userName,
  accountNumber,
  onUpdateLimits,
  onSetBlocked,
}) {
  const [flipped, setFlipped] = useState(false);

  const [showNumber, setShowNumber] = useState(false);

  const [showCvv, setShowCvv] = useState(false);

  const [onlineLimit, setOnlineLimit] = useState(
    String(card?.limits?.online ?? 0)
  );

  const [withdrawalLimit, setWithdrawalLimit] = useState(
    String(card?.limits?.withdrawals ?? 0)
  );

  const isBlocked =
    card?.status === "blocked" || card?.blocked === true;

  const canWithdraw =
    Number(card?.limits?.withdrawals ?? 0) > 0;

  const handleSaveLimits = () => {
    const online = Math.max(0, Number(onlineLimit));

    const withdrawals = Math.max(
      0,
      Number(withdrawalLimit)
    );

    onUpdateLimits({
      online: Number.isFinite(online)
        ? online
        : card?.limits?.online ?? 0,

      withdrawals: Number.isFinite(withdrawals)
        ? withdrawals
        : card?.limits?.withdrawals ?? 0,
    });
  };

  const toggleBlocked = () => {
    const next = !isBlocked;

    const ok = window.confirm(
      next
        ? "Block this card?"
        : "Unblock this card?"
    );

    if (!ok) return;

    onSetBlocked(next);
  };

  return (
    <section className="card cards-view__card">
      <div className="cards-view__card-top">
        <span className="pill pill--type">
          {card?.cardType || "Virtual"}
        </span>

        <span
          className={`pill ${
            isBlocked ? "pill--muted" : ""
          }`}
        >
          {card?.status || "active"}
        </span>
      </div>

      <div className="cards-view__card-stage">
        <div
          className={`cards-view__flip ${
            flipped ? "is-flipped" : ""
          }`}
        >
          {/* FRONT */}
          <div
            className="cards-view__face cards-view__face--front"
            aria-label="Card front"
          >
            <div className="cards-view__brand">
              <span
                className="cards-view__brand-mark"
                aria-hidden="true"
              />

              <span className="cards-view__brand-name">
                NovaBank
              </span>
            </div>

            <div className="cards-view__chip" />

            <div className="cards-view__front-meta">
              <div className="cards-view__front-row">
                <span className="cards-view__front-label">
                  Cardholder
                </span>

                <span className="cards-view__front-value">
                  {userName}
                </span>
              </div>

              <div className="cards-view__front-row">
                <span className="cards-view__front-label">
                  Account
                </span>

                <span className="cards-view__front-value cards-view__mono">
                  {accountNumber}
                </span>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="cards-view__face cards-view__face--back"
            aria-label="Card back"
          >
            <div
              className="cards-view__magstripe"
              aria-hidden="true"
            />

            <div className="cards-view__back-fields">
              <div className="cards-view__field">
                <span className="cards-view__field-label">
                  Card number
                </span>

                <span className="cards-view__field-value cards-view__mono">
                  {showNumber
                    ? card?.cardNumber || card?.maskedCardNumber
                    : card?.maskedCardNumber}
                </span>
              </div>

              <div className="cards-view__field-row">
                <div className="cards-view__field">
                  <span className="cards-view__field-label">
                    Expiry
                  </span>

                  <span className="cards-view__field-value cards-view__mono">
                    {card?.expiryDate || "--/--"}
                  </span>
                </div>

                <div className="cards-view__field">
                  <span className="cards-view__field-label">
                    CVV
                  </span>

                  <span className="cards-view__field-value cards-view__mono">
                    {showCvv
                      ? card?.cvv || "***"
                      : maskCvv()}
                  </span>
                </div>
              </div>
            </div>

            <div className="cards-view__toggles">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() =>
                  setShowNumber((v) => !v)
                }
              >
                {showNumber
                  ? "Hide number"
                  : "Show number"}
              </button>

              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() =>
                  setShowCvv((v) => !v)
                }
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
          onClick={() =>
            setFlipped((v) => !v)
          }
        >
          {flipped ? "View front" : "View back"}
        </button>

        <button
          type="button"
          className={`btn btn--sm ${
            isBlocked ? "" : "btn--danger"
          }`}
          onClick={toggleBlocked}
        >
          {isBlocked
            ? "Unblock card"
            : "Block card"}
        </button>
      </div>

      <div
        className={`cards-view__limits ${
          isBlocked ? "is-disabled" : ""
        }`}
      >
        <div className="cards-view__limits-head">
          <h3 className="cards-view__limits-title">
            Limits
          </h3>

          <span className="text-muted">
            Online / Withdrawals
          </span>
        </div>

        <div className="cards-view__limits-grid">
          <label className="cards-view__limit">
            <span className="cards-view__limit-label">
              Online
            </span>

            <input
              className="cards-view__limit-input"
              type="number"
              min="0"
              step="100"
              value={onlineLimit}
              onChange={(e) =>
                setOnlineLimit(e.target.value)
              }
              disabled={isBlocked}
            />
          </label>

          <label className="cards-view__limit">
            <span className="cards-view__limit-label">
              Withdrawals
            </span>

            <input
              className="cards-view__limit-input"
              type="number"
              min="0"
              step="100"
              value={withdrawalLimit}
              onChange={(e) =>
                setWithdrawalLimit(e.target.value)
              }
              disabled={isBlocked}
            />
          </label>
        </div>

        {!canWithdraw && (
          <p className="text-muted cards-view__hint">
            Virtual cards typically cannot
            withdraw cash.
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