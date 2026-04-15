import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./landing.css";

// ── Inline SVG icons ─────────────────────────────────────────
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7h10M8 3l4 4-4 4"/>
  </svg>
);

const FEATURES = [
  {
    num: "01",
    title: "Instant Deposits",
    body: "Fund your account in seconds. Real-time processing with full transaction transparency and immediate confirmation.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="32" height="22" rx="3"/>
        <line x1="4" y1="17" x2="36" y2="17"/>
        <line x1="10" y1="26" x2="16" y2="26"/>
        <circle cx="28" cy="26" r="3"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Smart Withdrawals",
    body: "Access your funds with intelligent limits, real-time balance previews, and multi-layer authentication security.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="14"/>
        <line x1="20" y1="13" x2="20" y2="27"/>
        <line x1="8" y1="20" x2="32" y2="20"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Portfolio Insights",
    body: "Track every rand with precision. Beautiful analytics and detailed transaction history at your fingertips.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4,28 14,18 22,24 36,10"/>
        <polyline points="28,10 36,10 36,18"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Elite Status",
    body: "Private Client membership unlocks exclusive rates, priority support, and bespoke financial advisory services.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4l3.5 7 7.5 1-5.5 5.5 1.3 7.5L20 22l-6.8 3.5 1.3-7.5L9 13l7.5-1z"/>
        <path d="M20 28v8M14 32h12"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "Bank-Grade Security",
    body: "256-bit encryption, biometric authentication, and real-time fraud detection protect every transaction.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="14" width="20" height="16" rx="2"/>
        <path d="M14 14v-3a6 6 0 0 1 12 0v3"/>
        <circle cx="20" cy="22" r="2"/>
        <line x1="20" y1="24" x2="20" y2="27"/>
      </svg>
    ),
  },
  {
    num: "06",
    title: "Always Available",
    body: "Your bank never sleeps. Round-the-clock access, dedicated relationship managers, and zero downtime guaranteed.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="14"/>
        <path d="M20 12v8l5 3"/>
      </svg>
    ),
  },
];

const STATS = [
  { value: "R 4.2B",  label: "Assets Under Management" },
  { value: "98.4%",   label: "Client Satisfaction"     },
  { value: "240K+",   label: "Active Clients"          },
  { value: "24/7",    label: "Dedicated Support"       },
];

const PROMISES = [
  {
    num: "01",
    title: "Transparent by design",
    body: "No hidden fees. No fine print surprises. Every charge is itemised, every rate is published, every decision is yours.",
  },
  {
    num: "02",
    title: "Your data stays yours",
    body: "We never sell, share, or monetise your financial data. Your privacy is a fundamental right, not a feature.",
  },
  {
    num: "03",
    title: "Built for the long term",
    body: "NovaBank grows with you. From your first deposit to generational wealth, we are your lifelong financial partner.",
  },
];

const TESTIMONIALS = [
  {
    quote: "NovaBank has fundamentally changed how I think about my money. The clarity, the speed, the elegance — there is nothing else like it.",
    name:  "Naledi Dlamini",
    role:  "Entrepreneur, Johannesburg",
  },
  {
    quote: "The private client experience is exceptional. My relationship manager knows my goals better than most advisors I have worked with over twenty years.",
    name:  "Sipho Khumalo",
    role:  "Investment Director, Cape Town",
  },
  {
    quote: "I switched from a major bank and within a week I wondered why I had waited so long. The dashboard alone is worth it.",
    name:  "Aisha Patel",
    role:  "CFO, Durban",
  },
];

const TICKER_ITEMS = [
  "Secure Transactions", "Wealth Management", "Instant Transfers",
  "Private Banking", "Investment Advisory", "24/7 Support", "Zero Hidden Fees",
];

// ── Scroll reveal hook ───────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Navbar scroll effect hook ────────────────────────────────
function useNavScroll(ref) {
  useEffect(() => {
    const handler = () => {
      if (ref.current) {
        ref.current.classList.toggle("land-nav--scrolled", window.scrollY > 40);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ref]);
}

// ── Smooth scroll helper ─────────────────────────────────────
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ════════════════════════════════════════════════════════════
export default function Landing() {
  const navRef = useRef(null);
  useScrollReveal();
  useNavScroll(navRef);

  return (
    <div className="landing">

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="land-nav" ref={navRef}>
        <div className="land-nav__brand">
          <span className="land-nav__brand-name">
            Nova<span>Bank</span>
          </span>
          <span className="land-nav__brand-tag">Private Banking</span>
        </div>

        <ul className="land-nav__links">
          <li><button className="land-nav__link" onClick={() => scrollTo("features")}>Services</button></li>
          <li><button className="land-nav__link" onClick={() => scrollTo("promise")}>About</button></li>
          <li><button className="land-nav__link" onClick={() => scrollTo("testimonials")}>Clients</button></li>
        </ul>

        <Link to="/login" className="land-nav__cta">
              Sign In <ArrowRight />
            </Link>
        
        <Link to="/register" className="land-nav__cta">
          Open Account <ArrowRight />
        </Link>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="land-hero">
        <div className="land-hero__bg" aria-hidden="true" />
        <div className="land-hero__geo" aria-hidden="true" />
        <span className="land-hero__numeral" aria-hidden="true">N</span>

        <div className="land-hero__content">
          <p className="land-hero__eyebrow">Est. 2025 · South Africa</p>

          <h1 className="land-hero__headline">
            <em>Your Future.</em>
            <strong>Your Bank.</strong>
            <span>Nova<span className="land-gold">Bank.</span></span>
          </h1>

          <p className="land-hero__subline">
            Private banking reimagined for those who demand more.
            Intelligent wealth management, seamless transactions,
            and the discretion of a trusted partner.
          </p>

          <div className="land-hero__actions">
            <Link to="/login" className="land-btn-primary">
              Get Started <ArrowRight />
            </Link>
            <button className="land-btn-ghost" onClick={() => scrollTo("features")}>
              Discover More
            </button>
          </div>
        </div>

        <div className="land-hero__stats">
          {STATS.map((s) => (
            <div key={s.label} className="land-hero__stat">
              <div className="land-hero__stat-value">{s.value}</div>
              <div className="land-hero__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="land-hero__scroll" aria-hidden="true">
          <div className="land-hero__scroll-line" />
          <span className="land-hero__scroll-text">Scroll</span>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <div className="land-ticker" aria-hidden="true">
        <div className="land-ticker__track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="land-ticker__item">
              <span className="land-ticker__dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="land-features" id="features">
        <div className="land-features__header">
          <div>
            <p className="land-section-label reveal">Our Services</p>
            <h2 className="land-section-title reveal reveal-delay-1">
              Banking built for<br /><em>the exceptional</em>
            </h2>
          </div>
          <p className="land-features__intro reveal reveal-delay-2">
            Every feature is crafted with precision, security,
            and the elegance you expect from a private bank.
          </p>
        </div>

        <div className="land-features__grid">
          {FEATURES.map((f, i) => (
            <div key={f.num} className={`land-feature-card reveal reveal-delay-${(i % 3) + 1}`}>
              <div className="land-feature-card__num">{f.num}</div>
              <div className="land-feature-card__icon">{f.icon}</div>
              <h3 className="land-feature-card__title">{f.title}</h3>
              <p className="land-feature-card__body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMISE ──────────────────────────────────────── */}
      <section className="land-promise" id="promise">
        {/* Mock dashboard visual */}
        <div className="land-promise__visual reveal">
          <div className="land-promise__card land-promise__card--main">
            <div className="land-promise__card-label">Total Portfolio Value</div>
            <div className="land-promise__card-balance">R 248,430.00</div>
            <div className="land-promise__card-sub">+12.4% this quarter</div>
          </div>
          <div className="land-promise__card land-promise__card--accent">
            <div className="land-promise__card-tag">Growth Overview</div>
            <div className="land-promise__bars">
              {[["Savings", 82], ["Investments", 67], ["Returns", 91]].map(([label, pct]) => (
                <div key={label} className="land-promise__bar-row">
                  <span>{label}</span>
                  <div className="land-promise__bar-track">
                    <div className="land-promise__bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="land-promise__copy">
          <p className="land-section-label reveal">Our Promise</p>
          <h2 className="land-section-title reveal reveal-delay-1">
            Wealth managed with<br /><em>absolute precision</em>
          </h2>
          <p className="land-promise__intro reveal reveal-delay-2">
            NovaBank was built on a single belief — that exceptional banking
            should be accessible to those who value their financial future above all else.
          </p>

          <div className="land-promise__list">
            {PROMISES.map((p, i) => (
              <div key={p.num} className={`land-promise__item reveal reveal-delay-${i + 2}`}>
                <span className="land-promise__item-num">{p.num}</span>
                <div>
                  <div className="land-promise__item-title">{p.title}</div>
                  <div className="land-promise__item-body">{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="land-testimonials" id="testimonials">
        <p className="land-section-label reveal">Client Voices</p>
        <h2 className="land-section-title reveal reveal-delay-1">
          Trusted by those who<br /><em>expect the best</em>
        </h2>

        <div className="land-testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`land-testimonial reveal reveal-delay-${i + 1}`}>
              <p className="land-testimonial__quote">"{t.quote}"</p>
              <div className="land-testimonial__author">
                <span className="land-testimonial__name">{t.name}</span>
                <span className="land-testimonial__role">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="land-cta">
        <span className="land-cta__glyph" aria-hidden="true">NB</span>
        <div className="land-cta__content">
          <p className="land-section-label reveal" style={{ justifyContent: "center" }}>
            Begin Your Journey
          </p>
          <h2 className="land-cta__slogan reveal reveal-delay-1">
            Your Future.<br /><em>Your Bank.</em><br />NovaBank.
          </h2>
          <p className="land-cta__body reveal reveal-delay-2">
            Join 240,000 clients who trust NovaBank with what matters most.
            Open your account in under five minutes.
          </p>
          <div className="land-cta__actions reveal reveal-delay-3">
            <Link to="/register" className="land-btn-primary">
              Open Account <ArrowRight />
            </Link>
            <Link to="/login" className="land-btn-ghost">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="land-footer">
        <div className="land-footer__top">
          <div>
            <div className="land-footer__brand-name">
              Nova<span>Bank</span>
            </div>
            <div className="land-footer__brand-slogan">
              Your Future. Your Bank. NovaBank.
            </div>
          </div>
          <div className="land-footer__links">
            {[
              { title: "Banking",  links: ["Personal Accounts", "Private Banking", "Deposits", "Withdrawals"] },
              { title: "Company",  links: ["About Us", "Careers", "Press", "Contact"] },
              { title: "Legal",    links: ["Privacy Policy", "Terms of Service", "POPIA Compliance", "FSCA Regulation"] },
            ].map((col) => (
              <div key={col.title} className="land-footer__col">
                <div className="land-footer__col-title">{col.title}</div>
                {col.links.map((l) => <a key={l} href="#">{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="land-footer__bottom">
          <p className="land-footer__copy">
            © 2025 NovaBank (Pty) Ltd. Registered in South Africa. FSCA Authorised.
          </p>
          <div className="land-footer__legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>

    </div>
  );
}