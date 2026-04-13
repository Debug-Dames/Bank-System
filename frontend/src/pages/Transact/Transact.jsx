import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { prependTransaction, setBalance } from "../../features/authSlice";
import {
  buyAirtime,
  buyData,
  buyElectricity,
  payBeneficiary,
  sendCash,
} from "../../service/mockApi";

import "../../components/ui/styles/alert.css";
import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "./transact.css";

const TABS = [
  { id: "airtime", label: "Airtime" },
  { id: "data", label: "Data" },
  { id: "electricity", label: "Electricity" },
  { id: "beneficiary", label: "Transfer" },
  { id: "sendcash", label: "Send Cash" },
];

const NETWORKS = ["Vodacom", "MTN", "Cell C", "Telkom", "Rain"];
const DATA_BUNDLES = ["500MB", "1GB", "2GB", "5GB", "10GB"];

export default function Transact() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const accountId = useSelector((state) => state.auth?.account?.id) || "acc_001";
  const balance = useSelector((state) => state.auth?.balance ?? 0);

  const tab = useMemo(() => {
    const requested = String(searchParams.get("tab") || "").toLowerCase();
    return TABS.some((t) => t.id === requested) ? requested : "airtime";
  }, [searchParams]);
  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [airtime, setAirtime] = useState({
    provider: "Vodacom",
    phone: "",
    amount: "",
  });

  const [data, setData] = useState({
    provider: "Vodacom",
    phone: "",
    bundle: "1GB",
    amount: "",
  });

  const [electricity, setElectricity] = useState({
    meterNumber: "",
    amount: "",
  });

  const [beneficiary, setBeneficiary] = useState({
    beneficiaryName: "",
    bank: "",
    beneficiaryAccount: "",
    reference: "",
    amount: "",
  });

  const [cashSend, setCashSend] = useState({
    recipientName: "",
    phone: "",
    note: "",
    amount: "",
    pin: "",
  });

  const formattedBalance = useMemo(
    () => Number(balance ?? 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 }),
    [balance]
  );

  const resetFeedback = useCallback(() => {
    setStatus("idle");
    setError("");
    setResult(null);
  }, []);

  const commitTx = useCallback((tx) => {
    dispatch(setBalance(tx.balanceAfter));
    dispatch(prependTransaction(tx));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();
    setStatus("loading");

    try {
      let tx;
      if (tab === "airtime") {
        tx = await buyAirtime({
          accountId,
          provider: airtime.provider,
          phone: airtime.phone,
          amount: airtime.amount,
        });
      } else if (tab === "data") {
        tx = await buyData({
          accountId,
          provider: data.provider,
          phone: data.phone,
          bundle: data.bundle,
          amount: data.amount,
        });
      } else if (tab === "electricity") {
        tx = await buyElectricity({
          accountId,
          meterNumber: electricity.meterNumber,
          amount: electricity.amount,
        });
      } else if (tab === "beneficiary") {
        tx = await payBeneficiary({
          accountId,
          beneficiaryName: beneficiary.beneficiaryName,
          bank: beneficiary.bank,
          beneficiaryAccount: beneficiary.beneficiaryAccount,
          reference: beneficiary.reference,
          amount: beneficiary.amount,
        });
      } else {
        tx = await sendCash({
          accountId,
          recipientName: cashSend.recipientName,
          phone: cashSend.phone,
          reference: cashSend.note,
          amount: cashSend.amount,
          pin: cashSend.pin,
        });
      }

      commitTx(tx);
      setResult(tx);
      setStatus("succeeded");
    } catch (err) {
      setError(err?.message || "Transaction failed");
      setStatus("failed");
    }
  };

  return (
    <div className="transact-page">
      <header className="transact-header">
        <div>
          <h1 className="transact-title">Transact</h1>
          <p className="transact-subtitle text-muted">
            Buy airtime, data, electricity, transfer money, or send cash.
          </p>
        </div>

        <div className="transact-balance">
          <span className="transact-balance__label">Available</span>
          <span className="transact-balance__value">R {formattedBalance}</span>
        </div>
      </header>

      <div className="transact-tabs" role="tablist" aria-label="Transact options">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className={`transact-tab${tab === t.id ? " is-active" : ""}`}
            aria-selected={tab === t.id}
            onClick={() => {
              resetFeedback();
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("tab", t.id);
                return next;
              });
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="card transact-card">
        <div className="card__head">
          <h2 className="card__title">
            {TABS.find((t) => t.id === tab)?.label}
          </h2>
          <span className="pill pill--muted">Mock</span>
        </div>

        {status === "failed" && (
          <div className="alert alert--error">
            <span className="alert__indicator" />
            <span className="alert__message">{error}</span>
          </div>
        )}

        {status === "succeeded" && result && (
          <div className="alert alert--success">
            <span className="alert__indicator" />
            <span className="alert__message">
              Successful: {result.type} • R{" "}
              {Number(result.amount).toLocaleString("en-ZA", {
                minimumFractionDigits: 2,
              })}{" "}
              • New balance R{" "}
              {Number(result.balanceAfter).toLocaleString("en-ZA", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        <form className="transact-form" onSubmit={handleSubmit}>
          {tab === "airtime" && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="airtimeProvider">
                  Network
                </label>
                <select
                  id="airtimeProvider"
                  className="form-input"
                  value={airtime.provider}
                  onChange={(e) =>
                    setAirtime((p) => ({ ...p, provider: e.target.value }))
                  }
                >
                  {NETWORKS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="airtimePhone">
                  Phone number
                </label>
                <input
                  id="airtimePhone"
                  className="form-input"
                  value={airtime.phone}
                  onChange={(e) =>
                    setAirtime((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="e.g. 0712345678"
                  inputMode="tel"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="airtimeAmount">
                  Amount (ZAR)
                </label>
                <input
                  id="airtimeAmount"
                  className="form-input"
                  value={airtime.amount}
                  onChange={(e) =>
                    setAirtime((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="e.g. 50"
                  inputMode="decimal"
                />
              </div>
            </>
          )}

          {tab === "data" && (
            <>
              <div className="transact-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="dataProvider">
                    Network
                  </label>
                  <select
                    id="dataProvider"
                    className="form-input"
                    value={data.provider}
                    onChange={(e) =>
                      setData((p) => ({ ...p, provider: e.target.value }))
                    }
                  >
                    {NETWORKS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dataBundle">
                    Bundle
                  </label>
                  <select
                    id="dataBundle"
                    className="form-input"
                    value={data.bundle}
                    onChange={(e) =>
                      setData((p) => ({ ...p, bundle: e.target.value }))
                    }
                  >
                    {DATA_BUNDLES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dataPhone">
                  Phone number
                </label>
                <input
                  id="dataPhone"
                  className="form-input"
                  value={data.phone}
                  onChange={(e) =>
                    setData((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="e.g. 0712345678"
                  inputMode="tel"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dataAmount">
                  Amount (ZAR)
                </label>
                <input
                  id="dataAmount"
                  className="form-input"
                  value={data.amount}
                  onChange={(e) =>
                    setData((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="e.g. 99"
                  inputMode="decimal"
                />
              </div>
            </>
          )}

          {tab === "electricity" && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="meterNumber">
                  Meter number
                </label>
                <input
                  id="meterNumber"
                  className="form-input"
                  value={electricity.meterNumber}
                  onChange={(e) =>
                    setElectricity((p) => ({ ...p, meterNumber: e.target.value }))
                  }
                  placeholder="e.g. 01234567890"
                  inputMode="numeric"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="electricityAmount">
                  Amount (ZAR)
                </label>
                <input
                  id="electricityAmount"
                  className="form-input"
                  value={electricity.amount}
                  onChange={(e) =>
                    setElectricity((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="e.g. 200"
                  inputMode="decimal"
                />
              </div>

              {status === "succeeded" && result?.type === "electricity" && result?.token && (
                <div className="transact-token">
                  <span className="transact-token__label">Token</span>
                  <span className="transact-token__value">{result.token}</span>
                </div>
              )}
            </>
          )}

          {tab === "beneficiary" && (
            <>
              <div className="transact-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="beneficiaryName">
                    Beneficiary name
                  </label>
                  <input
                    id="beneficiaryName"
                    className="form-input"
                    value={beneficiary.beneficiaryName}
                    onChange={(e) =>
                      setBeneficiary((p) => ({ ...p, beneficiaryName: e.target.value }))
                    }
                    placeholder="e.g. John Smith"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="beneficiaryBank">
                    Bank
                  </label>
                  <input
                    id="beneficiaryBank"
                    className="form-input"
                    value={beneficiary.bank}
                    onChange={(e) =>
                      setBeneficiary((p) => ({ ...p, bank: e.target.value }))
                    }
                    placeholder="e.g. FNB"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="beneficiaryAccount">
                  Account number
                </label>
                <input
                  id="beneficiaryAccount"
                  className="form-input"
                  value={beneficiary.beneficiaryAccount}
                  onChange={(e) =>
                    setBeneficiary((p) => ({
                      ...p,
                      beneficiaryAccount: e.target.value,
                    }))
                  }
                  placeholder="e.g. 1234567890"
                  inputMode="numeric"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="beneficiaryRef">
                  Reference
                </label>
                <input
                  id="beneficiaryRef"
                  className="form-input"
                  value={beneficiary.reference}
                  onChange={(e) =>
                    setBeneficiary((p) => ({ ...p, reference: e.target.value }))
                  }
                  placeholder="e.g. Rent"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="beneficiaryAmount">
                  Amount (ZAR)
                </label>
                <input
                  id="beneficiaryAmount"
                  className="form-input"
                  value={beneficiary.amount}
                  onChange={(e) =>
                    setBeneficiary((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="e.g. 1200"
                  inputMode="decimal"
                />
              </div>
            </>
          )}

          {tab === "sendcash" && (
            <>
              <div className="transact-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="cashRecipient">
                    Recipient name
                  </label>
                  <input
                    id="cashRecipient"
                    className="form-input"
                    value={cashSend.recipientName}
                    onChange={(e) =>
                      setCashSend((p) => ({ ...p, recipientName: e.target.value }))
                    }
                    placeholder="e.g. Thando"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cashPhone">
                    Phone number
                  </label>
                  <input
                    id="cashPhone"
                    className="form-input"
                    value={cashSend.phone}
                    onChange={(e) =>
                      setCashSend((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="e.g. 071 234 5678"
                    inputMode="tel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cashNote">
                  Note (optional)
                </label>
                <input
                  id="cashNote"
                  className="form-input"
                  value={cashSend.note}
                  onChange={(e) =>
                    setCashSend((p) => ({ ...p, note: e.target.value }))
                  }
                  placeholder="e.g. Taxi"
                />
              </div>

              <div className="transact-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="cashAmount">
                    Amount (ZAR)
                  </label>
                  <input
                    id="cashAmount"
                    className="form-input"
                    value={cashSend.amount}
                    onChange={(e) =>
                      setCashSend((p) => ({ ...p, amount: e.target.value }))
                    }
                    placeholder="e.g. 250"
                    inputMode="decimal"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cashPin">
                    Secret PIN
                  </label>
                  <input
                    id="cashPin"
                    className="form-input"
                    type="password"
                    value={cashSend.pin}
                    onChange={(e) =>
                      setCashSend((p) => ({
                        ...p,
                        pin: e.target.value.replace(/[^\d]/g, "").slice(0, 6),
                      }))
                    }
                    placeholder="4–6 digits"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              {status === "succeeded" &&
                result?.type === "sendcash" &&
                result?.cashCode && (
                  <div className="transact-token" aria-live="polite">
                    <span className="transact-token__label">Cash send complete</span>
                    <span className="transact-token__value">{result.cashCode}</span>
                    <div className="text-muted">
                      Ref: <strong>{result.referenceNumber}</strong> · Expires:{" "}
                      <strong>
                        {new Date(result.expiresAt).toLocaleString("en-ZA")}
                      </strong>
                    </div>
                    <div className="transact-actions" style={{ justifyContent: "flex-start" }}>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        onClick={() => {
                          const amountText = Number(result.amount ?? 0).toLocaleString("en-ZA", {
                            minimumFractionDigits: 2,
                          });
                          const expiryText = new Date(result.expiresAt).toLocaleString("en-ZA");
                          const message =
                            `NovaBank Cash Send\n` +
                            `Amount: R ${amountText}\n` +
                            `Cash code: ${result.cashCode}\n` +
                            `Reference: ${result.referenceNumber}\n` +
                            `Expiry: ${expiryText}`;

                          const sharePayload = { title: "NovaBank Cash Send", text: message };

                          if (navigator.share) {
                            navigator.share(sharePayload).catch(() => {});
                            return;
                          }

                          if (navigator.clipboard?.writeText) {
                            navigator.clipboard
                              .writeText(message)
                              .then(() => window.alert("Cash send details copied. Send it to the recipient."))
                              .catch(() => window.prompt("Copy and send to recipient:", message));
                            return;
                          }

                          window.prompt("Copy and send to recipient:", message);
                        }}
                      >
                        Send to recipient
                      </button>
                    </div>
                  </div>
                )}
            </>
          )}

          <div className="transact-actions">
            <button
              className="btn btn--primary"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Processing..." : "Confirm"}
            </button>
            <button
              className="btn btn--outline"
              type="button"
              onClick={resetFeedback}
              disabled={status === "loading"}
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
