import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleCheck,
  Eye,
  Github,
  Globe2,
  LockKeyhole,
  Radar,
  ScanSearch,
  Search,
  ServerCog,
  Shield,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";
import "../styles/home.css";

const features = [
  {
    number: "01",
    icon: MessageIcon,
    title: "Message Intelligence",
    description:
      "Detect phishing, impersonation, urgency manipulation, credential theft and social-engineering patterns hidden inside suspicious messages.",
    tag: "TEXT ANALYSIS",
  },
  {
    number: "02",
    icon: Globe2,
    title: "URL Intelligence",
    description:
      "Inspect domains, paths, parameters and suspicious URL structures without directly visiting the destination.",
    tag: "STATIC ANALYSIS",
  },
  {
    number: "03",
    icon: Eye,
    title: "Visual Threat Analysis",
    description:
      "Analyze suspicious screenshots and extract actionable security signals from visual content.",
    tag: "VISION AI",
  },
  {
    number: "04",
    icon: Radar,
    title: "Security Analytics",
    description:
      "Understand detection history, risk trends, categories, severity and overall security exposure.",
    tag: "THREAT ANALYTICS",
  },
];

const workflow = [
  {
    number: "01",
    title: "Submit",
    description:
      "Paste a suspicious message or URL, or upload a screenshot you don't trust.",
    icon: Search,
  },
  {
    number: "02",
    title: "Detect",
    description:
      "Validation, AI intelligence and deterministic risk signals evaluate the submitted content.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Understand",
    description:
      "Receive a risk score, classification, red flags, attack patterns and an explainable decision.",
    icon: BrainCircuit,
  },
  {
    number: "04",
    title: "Act safely",
    description:
      "Follow clear recommendations before clicking, paying, replying or sharing sensitive information.",
    icon: ShieldCheck,
  },
];

const securityItems = [
  {
    icon: LockKeyhole,
    title: "Protected processing",
    text: "Security-first request handling",
  },
  {
    icon: BrainCircuit,
    title: "Explainable AI",
    text: "Understand why a threat was detected",
  },
  {
    icon: Globe2,
    title: "Static URL analysis",
    text: "Analyze without visiting destinations",
  },
  {
    icon: Eye,
    title: "Screenshot intelligence",
    text: "Visual threat signal extraction",
  },
  {
    icon: Shield,
    title: "Authenticated access",
    text: "Protected user-specific analysis",
  },
  {
    icon: ServerCog,
    title: "Controlled architecture",
    text: "Separated application services",
  },
];

const team = [
  {
    number: "01",
    role: "FULL-STACK / SECURITY",
    title: "Team Member 01",
    description:
      "Focused on the core ScamShield platform, secure application architecture and the end-to-end product experience.",
  },
  {
    number: "02",
    role: "AI / INTELLIGENCE",
    title: "Team Member 02",
    description:
      "Focused on threat intelligence, AI-powered detection, risk signals and explainable security insights.",
  },
  {
    number: "03",
    role: "BACKEND / DATA",
    title: "Team Member 03",
    description:
      "Focused on backend services, APIs, authentication, database architecture and reliable analysis pipelines.",
  },
  {
    number: "04",
    role: "FRONTEND / EXPERIENCE",
    title: "Team Member 04",
    description:
      "Focused on creating a responsive, intuitive and high-quality security experience across ScamShield.",
  },
];

function MessageIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.3 8.5 8.5 0 0 1-4.1-1l-4.9 1.4 1.4-4.8A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function BrandMark() {
  return (
    <div className="ss-brand-mark" aria-hidden="true">
      <ShieldCheck size={21} strokeWidth={1.8} />
    </div>
  );
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="ss-section-label">
      <span className="ss-label-icon">
        <Icon size={13} strokeWidth={1.8} />
      </span>
      <span>{children}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="ss-home">
      {/* =====================================================
          BACKGROUND SYSTEM
      ====================================================== */}

      <div className="ss-background" aria-hidden="true">
        <div className="ss-grid" />
        <div className="ss-noise" />
        <div className="ss-orb ss-orb-a" />
        <div className="ss-orb ss-orb-b" />
        <div className="ss-orb ss-orb-c" />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="ss-navbar">
        <div className="ss-container ss-nav-inner">
          <Link to="/" className="ss-brand">
            <BrandMark />

            <span className="ss-brand-name">
              Scam<span>Shield</span>
            </span>

            <span className="ss-brand-ai">AI</span>
          </Link>

          <nav className="ss-nav-links" aria-label="Primary navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#security">Security</a>
            <a href="#team">Team</a>
          </nav>

          <div className="ss-nav-actions">
            <Link to="/login" className="ss-login">
              Sign in
            </Link>

            <Link to="/signup" className="ss-nav-button">
              Get started
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="ss-hero">
        <div className="ss-container ss-hero-grid">
          <div className="ss-hero-copy">
            <div className="ss-status-pill">
              <span className="ss-live-dot" />
              AI SECURITY INTELLIGENCE
              <span className="ss-pill-line" />
              SYSTEM ONLINE
            </div>

            <h1>
              Detect scams
              <br />
              <span>before they hurt.</span>
            </h1>

            <p className="ss-hero-description">
              ScamShield transforms suspicious messages, URLs and screenshots
              into clear security intelligence — helping you understand the
              threat before you click, pay or respond.
            </p>

            <div className="ss-hero-actions">
              <Link to="/signup" className="ss-primary-button">
                Start protecting
                <ArrowRight size={16} />
              </Link>

              <Link to="/login" className="ss-secondary-button">
                Explore dashboard
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="ss-trust-row">
              <span>
                <CircleCheck size={14} />
                Explainable AI
              </span>

              <span>
                <CircleCheck size={14} />
                Static URL analysis
              </span>

              <span>
                <CircleCheck size={14} />
                Secure processing
              </span>
            </div>
          </div>

          {/* THREAT CONSOLE */}

          <div className="ss-threat-wrapper">
            <div className="ss-threat-halo" />

            <div className="ss-floating ss-floating-top">
              <div className="ss-floating-icon">
                <Radar size={15} />
              </div>
              <div>
                <span>THREAT ENGINE</span>
                <strong>ACTIVE</strong>
              </div>
            </div>

            <div className="ss-floating ss-floating-bottom">
              <div className="ss-floating-icon teal">
                <Sparkles size={15} />
              </div>
              <div>
                <span>AI SIGNAL</span>
                <strong>12 indicators</strong>
              </div>
            </div>

            <div className="ss-threat-console">
              <div className="ss-console-scan" />

              <div className="ss-console-header">
                <div>
                  <span className="ss-console-kicker">
                    THREAT INTELLIGENCE
                  </span>
                  <strong>Live security analysis</strong>
                </div>

                <div className="ss-console-status">
                  <span />
                  LIVE
                </div>
              </div>

              <div className="ss-risk-area">
                <div className="ss-risk-ring">
                  <div className="ss-risk-inner">
                    <span>RISK</span>
                    <strong>94</strong>
                    <small>/ 100</small>
                  </div>
                </div>

                <div className="ss-risk-meta">
                  <span className="ss-risk-label">
                    <TriangleAlert size={13} />
                    THREAT DETECTED
                  </span>

                  <strong>Phishing attempt</strong>

                  <div className="ss-critical">
                    CRITICAL
                  </div>
                </div>
              </div>

              <div className="ss-analysis-stack">
                <div className="ss-analysis-row">
                  <div className="ss-analysis-icon">
                    <Globe2 size={15} />
                  </div>

                  <div className="ss-analysis-copy">
                    <span>URL INTELLIGENCE</span>
                    <strong>Destination not visited</strong>
                  </div>

                  <Check size={15} className="ss-check" />
                </div>

                <div className="ss-analysis-row">
                  <div className="ss-analysis-icon brass">
                    <Radar size={15} />
                  </div>

                  <div className="ss-analysis-copy">
                    <span>RISK ENGINE</span>
                    <strong>Suspicious patterns</strong>
                  </div>

                  <span className="ss-analysis-value">HIGH</span>
                </div>

                <div className="ss-analysis-row">
                  <div className="ss-analysis-icon green">
                    <LockKeyhole size={15} />
                  </div>

                  <div className="ss-analysis-copy">
                    <span>PROCESSING</span>
                    <strong>Analysis secured</strong>
                  </div>

                  <Check size={15} className="ss-check" />
                </div>
              </div>

              <div className="ss-console-footer">
                <span>SCAMSHIELD RISK ENGINE</span>
                <span>ANALYSIS ID #94A7</span>
              </div>
            </div>

            <div className="ss-orbit ss-orbit-1" />
            <div className="ss-orbit ss-orbit-2" />
          </div>
        </div>
      </section>

      {/* =====================================================
          METRICS
      ====================================================== */}

      <section className="ss-metrics">
        <div className="ss-container ss-metrics-grid">
          <div>
            <strong>01</strong>
            <span>Unified threat engine</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Analysis surfaces</span>
          </div>

          <div>
            <strong>100</strong>
            <span>Risk score range</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Protection mindset</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section id="features" className="ss-section">
        <div className="ss-container">
          <div className="ss-section-heading">
            <SectionLabel icon={Radar}>
              THREAT INTELLIGENCE
            </SectionLabel>

            <h2>
              One shield.
              <br />
              <span>Multiple attack surfaces.</span>
            </h2>

            <p>
              ScamShield combines message analysis, URL intelligence, visual
              detection and security analytics into one focused threat
              intelligence platform.
            </p>
          </div>

          <div className="ss-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="ss-feature-card" key={feature.number}>
                  <div className="ss-card-glow" />

                  <div className="ss-feature-top">
                    <span>{feature.number}</span>

                    <div className="ss-feature-icon">
                      <Icon size={19} strokeWidth={1.7} />
                    </div>
                  </div>

                  <div className="ss-feature-content">
                    <span className="ss-feature-tag">{feature.tag}</span>

                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>
                  </div>

                  <div className="ss-feature-arrow">
                    <ArrowUpRight size={15} />
                  </div>

                  <div className="ss-card-line" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW
      ====================================================== */}

      <section id="how-it-works" className="ss-section ss-workflow-section">
        <div className="ss-container">
          <div className="ss-section-heading centered">
            <SectionLabel icon={Zap}>HOW IT WORKS</SectionLabel>

            <h2>
              From suspicious
              <br />
              <span>to understood.</span>
            </h2>

            <p>
              A structured security pipeline turns uncertain digital content
              into an explainable threat decision.
            </p>
          </div>

          <div className="ss-workflow">
            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <div className="ss-workflow-item" key={item.number}>
                  <div className="ss-workflow-node">
                    <span>{item.number}</span>
                    <div>
                      <Icon size={19} strokeWidth={1.7} />
                    </div>
                  </div>

                  {index !== workflow.length - 1 && (
                    <div className="ss-workflow-connector">
                      <span />
                    </div>
                  )}

                  <div className="ss-workflow-copy">
                    <span>STAGE {item.number}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          SECURITY
      ====================================================== */}

      <section id="security" className="ss-section">
        <div className="ss-container ss-security-grid">
          <div className="ss-security-copy">
            <SectionLabel icon={ShieldCheck}>
              SECURITY FIRST
            </SectionLabel>

            <h2>
              Built to make you
              <br />
              <span>harder to scam.</span>
            </h2>

            <p>
              ScamShield is designed around safe analysis, explainable
              decisions and controlled threat intelligence — so you can
              investigate suspicious content without blindly interacting with
              it.
            </p>

            <Link to="/signup" className="ss-primary-button">
              Secure your first analysis
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="ss-security-panel">
            <div className="ss-security-panel-top">
              <div>
                <span>SYSTEM STATUS</span>
                <strong>
                  <i />
                  PROTECTED
                </strong>
              </div>

              <LockKeyhole size={18} />
            </div>

            <div className="ss-security-items">
              {securityItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="ss-security-item" key={item.title}>
                    <div className="ss-security-icon">
                      <Icon size={17} strokeWidth={1.7} />
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </div>

                    <Check size={14} className="ss-security-check" />
                  </div>
                );
              })}
            </div>

            <div className="ss-security-terminal">
              <span>$ scamshield --security-status</span>
              <strong>all systems operational</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TEAM
      ====================================================== */}

      <section id="team" className="ss-section ss-team-section">
        <div className="ss-container">
          <div className="ss-section-heading">
            <SectionLabel icon={Users}>
              THE PEOPLE BEHIND IT
            </SectionLabel>

            <h2>
              Built by people
              <br />
              <span>who care about security.</span>
            </h2>

            <p>
              ScamShield is a collaborative project combining engineering, AI,
              security and product thinking into one mission — making
              suspicious digital interactions easier to understand.
            </p>
          </div>

          <div className="ss-team-grid">
            {team.map((member) => (
              <article className="ss-team-card" key={member.number}>
                <div className="ss-team-top">
                  <span>{member.number}</span>

                  <div className="ss-team-avatar">
                    <UserRound size={20} strokeWidth={1.5} />
                  </div>
                </div>

                <span className="ss-team-role">{member.role}</span>

                <h3>{member.title}</h3>

                <p>{member.description}</p>

                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="ss-team-link"
                >
                  <Github size={15} />
                  GitHub
                  <ArrowUpRight size={13} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="ss-cta">
        <div className="ss-container">
          <div className="ss-cta-card">
            <div className="ss-cta-grid" />

            <div className="ss-cta-orb" />

            <div className="ss-cta-content">
              <div className="ss-cta-label">
                <Sparkles size={14} />
                SCAMSHIELD AI
              </div>

              <h2>
                Don't trust the message.
                <br />
                <span>Analyze it.</span>
              </h2>

              <p>
                Turn uncertainty into actionable security intelligence before
                the next suspicious message becomes a costly mistake.
              </p>

              <Link to="/signup" className="ss-primary-button">
                Get started
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="ss-footer">
        <div className="ss-container">
          <div className="ss-footer-main">
            <div className="ss-footer-brand">
              <Link to="/" className="ss-brand">
                <BrandMark />

                <span className="ss-brand-name">
                  Scam<span>Shield</span>
                </span>

                <span className="ss-brand-ai">AI</span>
              </Link>

              <p>
                Intelligent scam detection
                <br />
                & threat analysis.
              </p>

              <div className="ss-footer-status">
                <span />
                Security systems operational
              </div>
            </div>

            <div className="ss-footer-column">
              <span className="ss-footer-heading">PRODUCT</span>

              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#security">Security</a>
              <Link to="/dashboard">Dashboard</Link>
            </div>

            <div className="ss-footer-column">
              <span className="ss-footer-heading">SECURITY</span>

              <a href="#security">Secure Processing</a>
              <a href="#security">AI Detection</a>
              <a href="#security">URL Intelligence</a>
              <a href="#security">Screenshot Analysis</a>
            </div>

            <div className="ss-footer-column">
              <span className="ss-footer-heading">COMPANY</span>

              <a href="#team">About</a>
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="#team">Team</a>
              <a href="#security">Contact</a>
            </div>
          </div>

          <div className="ss-footer-divider" />

          <div className="ss-footer-bottom">
            <div>
              <span className="ss-footer-micro">
                AI SECURITY INTELLIGENCE
              </span>

              <span className="ss-footer-copy">
                © 2026 ScamShield AI
              </span>

              <span className="ss-footer-copy">
                Built for safer digital interactions.
              </span>
            </div>

            <a
              href="https://github.com/Rishabh5881/ScamShield"
              target="_blank"
              rel="noreferrer"
              className="ss-footer-github"
            >
              <Github size={15} />
              GitHub
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}