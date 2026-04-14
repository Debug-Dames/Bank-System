import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import "./landing.css";

// ── SVG Icons ───────────────────────────────────────────────
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7h10M8 3l4 4-4 4" />
  </svg>
);

const DepositIcon = () => (
  <svg className="feature-card__icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10" width="32" height="22" rx="3" />
    <line x1="4" y1="17" x2="36" y2="17" />
    <line x1="10" y1="26" x2="16" y2="26" />
    <circle cx="28" cy="26" r="3" />
  </svg>
);

const WithdrawIcon = () => (
  <svg className="feature-card__icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="14" />
    <path d="M20 13v7l4 4" />
    <path d="M8 20h4M28 20h4" />
  </svg>
);

const PortfolioIcon = () => (
  <svg className="feature-card__icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4,28 14,18 22,24 36,10" />
    <polyline points="28,10 36,10 36,18" />
  </svg>
);

const EliteIcon = () => (
  <svg className="feature-card__icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4l3.5 7 7.5 1-5.5 5.5 1.3 7.5L20 22l-6.8 3.5 1.3-7.5L9 13l7.5-1z" />
    <path d="M20 28v8M14 32h12" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="feature-card__icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="14" width="20" height="16" rx="2" />
    <path d="M14 14v-3a6 6 0 0 1 12 0v3" />
    <circle cx="20" cy="22" r="2" />
    <line x1="20" y1="24" x2="20" y2="27" />
  </svg>
);

const ClockIcon = () => (
  <svg className="feature-card__icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="14" />
    <path d="M20 12v8l5 3" />
  </svg>
);

// ── Data ────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "Secure Transactions", "Wealth Management", "Instant Transfers",
  "Private Banking", "Investment Advisory", "24/7 Support", "Zero Hidden Fees",
  "Secure Transactions", "Wealth Management", "Instant Transfers",
  "Private Banking", "Investment Advisory", "24/7 Support", "Zero Hidden Fees",
];

const FEATURES = [
  { num: "01", icon: <DepositIcon />, title: "Instant Deposits", body: "Fund your account in seconds. Real-time processing with full transaction transparency and immediate confirmation." },
  { num: "02", icon: <WithdrawIcon />, title: "Smart Withdrawals", body: "Access your funds with intelligent limits, real-time balance previews, and multi-layer authentication security." },
  { num: "03", icon: <PortfolioIcon />, title: "Portfolio Insights", body: "Track every rand with precision. Beautiful analytics and detailed transaction history at your fingertips." },
  { num: "04", icon: <EliteIcon />, title: "Elite Status", body: "Private Client membership unlocks exclusive rates, priority support, and bespoke financial advisory services." },
  { num: "05", icon: <SecurityIcon />, title: "Bank-Grade Security", body: "256-bit encryption, biometric authentication, and real-time fraud detection protect every transaction." },
  { num: "06", icon: <ClockIcon />, title: "Always Available", body: "Your bank never sleeps. Round-the-clock access, dedicated relationship managers, and zero downtime guaranteed." },
];

const PROMISE_ITEMS = [
  { num: "01", title: "Transparent by design", body: "No hidden fees. No fine print surprises. Every charge is itemised, every rate is published, every decision is yours." },
  { num: "02", title: "Your data stays yours", body: "We never sell, share, or monetise your financial data. Your privacy is a fundamental right, not a feature." },
  { num: "03", title: "Built for the long term", body: "NovaBank grows with you. From your first deposit to generational wealth, we are your lifelong financial partner." },
];

const TESTIMONIALS = [
  { quote: "NovaBank has fundamentally changed how I think about my money. The clarity, the speed, the elegance — there is nothing else like it.", name: "Naledi Dlamini", role: "Entrepreneur, Johannesburg" },
  { quote: "The private client experience is exceptional. My relationship manager knows my goals better than most advisors I have worked with over twenty years.", name: "Sipho Khumalo", role: "Investment Director, Cape Town" },
  { quote: "I switched from a major bank and within a week I wondered why I had waited so long. The dashboard alone is worth it.", name: "Aisha Patel", role: "CFO, Durban" },
];

// ── useReveal hook ───────────────────────────────────────────
function useReveal() {
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


// ── Hero ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__geo" />
      <span className="hero__numeral" aria-hidden="true">N</span>

      <div className="hero__content">
        <p className="hero__eyebrow">Est. 2025 · South Africa</p>
        <h1 className="hero__headline">
          <em>Your Future.</em>
          <strong>Your Bank.</strong>
          Nova<span style={{ color: "var(--gold-light)" }}>Bank.</span>
        </h1>
        <p className="hero__subline">
          Private banking reimagined for those who demand more.
          Intelligent wealth management, seamless transactions,
          and the discretion of a trusted partner.
        </p>
        <div className="hero__actions">
          <a href="/login" className="btn-primary">
            Get Started <ArrowIcon />
          </a>
          <a href="#features" className="btn-ghost" onClick={(e) => {
            const t = document.querySelector("#features");
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
          }}>Discover More</a>
        </div>
      </div>

      <div className="hero__stats">
        {[
          ["R 4.2B", "Assets Under Management"],
          ["98.4%", "Client Satisfaction"],
          ["240K+", "Active Clients"],
          ["24/7", "Dedicated Support"],
        ].map(([value, label]) => (
          <div className="hero__stat" key={label}>
            <div className="hero__stat-value">{value}</div>
            <div className="hero__stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
}

// ── Ticker ───────────────────────────────────────────────────
function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {TICKER_ITEMS.map((item, i) => (
          <span className="ticker__item" key={i}>
            <span className="ticker__dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Features ─────────────────────────────────────────────────
function Features() {
  return (
    <section className="features" id="features">
      <div className="features__header">
        <div>
          <p className="section-label reveal">Our Services</p>
          <h2 className="section-title reveal reveal-delay-1">
            Banking built for<br /><em>the exceptional</em>
          </h2>
        </div>
        <p className="features__intro reveal reveal-delay-2">
          Every feature is crafted with precision, security,
          and the elegance you expect from a private bank.
        </p>
      </div>

      <div className="features__grid">
        {FEATURES.map((f, i) => (
          <div className={`feature-card reveal reveal-delay-${(i % 3) + 1}`} key={f.num}>
            <div className="feature-card__num">{f.num}</div>
            {f.icon}
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__body">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Promise ──────────────────────────────────────────────────
function Promise() {
  return (
    <section className="promise" id="promise">
      <div className="promise__visual reveal">
        <div className="promise__card promise__card--main">
          <div className="promise__card-label">Total Portfolio Value</div>
          <div className="promise__card-balance">R 248,430.00</div>
          <div className="promise__card-sub">+12.4% this quarter</div>
        </div>
        <div className="promise__card promise__card--accent">
          <div className="promise__card-tag">Growth Overview</div>
          <div className="promise__bars">
            {[["Savings", 82], ["Investments", 67], ["Returns", 91]].map(([label, pct]) => (
              <div className="promise__bar-row" key={label}>
                <span>{label}</span>
                <div className="promise__bar-track">
                  <div className="promise__bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="promise__copy">
        <p className="section-label reveal">Our Promise</p>
        <h2 className="section-title reveal reveal-delay-1">
          Wealth managed with<br /><em>absolute precision</em>
        </h2>
        <p className="promise__intro reveal reveal-delay-2">
          NovaBank was built on a single belief — that exceptional banking should be accessible to those who value their financial future above all else.
        </p>
        <div className="promise__list">
          {PROMISE_ITEMS.map((item, i) => (
            <div className={`promise__item reveal reveal-delay-${i + 2}`} key={item.num}>
              <span className="promise__item-num">{item.num}</span>
              <div>
                <div className="promise__item-title">{item.title}</div>
                <div className="promise__item-body">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <p className="section-label reveal">Client Voices</p>
      <h2 className="section-title reveal reveal-delay-1">
        Trusted by those who<br /><em>expect the best</em>
      </h2>
      <div className="testimonials__grid">
        {TESTIMONIALS.map((t, i) => (
          <div className={`testimonial reveal reveal-delay-${i + 1}`} key={t.name}>
            <p className="testimonial__quote">"{t.quote}"</p>
            <div className="testimonial__author">
              <span className="testimonial__name">{t.name}</span>
              <span className="testimonial__role">{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CTA ──────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section className="cta-section">
      <span className="cta-section__glyph" aria-hidden="true">NB</span>
      <div className="cta-section__content">
        <p className="section-label reveal" style={{ justifyContent: "center" }}>Begin Your Journey</p>
        <h2 className="cta-section__slogan reveal reveal-delay-1">
          Your Future.<br /><em>Your Bank.</em><br />NovaBank.
        </h2>
        <p className="cta-section__body reveal reveal-delay-2">
          Join 240,000 clients who trust NovaBank with what matters most.
          Access your account instantly and manage your finances with confidence.
        </p>
        <div className="cta-section__actions reveal reveal-delay-3">
          <a href="/login" className="btn-primary">
            Sign In <ArrowIcon />
          </a>
          
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <div className="footer__brand-name">Nova<span>Bank</span></div>
          <div className="footer__brand-slogan">Your Future. Your Bank. NovaBank.</div>
        </div>
        
      </div>
      <div className="footer__bottom">
        <p className="footer__copy">© 2025 NovaBank (Pty) Ltd. Registered in South Africa. FSCA Authorised.</p>
        
      </div>
    </footer>
  );
}

// ── App ──────────────────────────────────────────────────────
export default function NovaBank() {
  useReveal();

  return (
    <>
      <Navbar />
      <Hero />
      <Ticker />
      <Features />
      <Promise />
      <Testimonials />
      <CtaSection />
      <Footer />
    </>
  );
}