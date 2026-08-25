import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ArrowRight,
  Play,
  Check,
  MessageSquare,
  Link2,
  Image,
  Brain,
  AlertTriangle,
  Lock,
  BarChart3,
  ScanSearch,
  CreditCard,
  BriefcaseBusiness,
  TrendingUp,
  KeyRound,
  Activity,
  Eye,
  Zap,
  ChevronRight,
  CircleCheck,
  ShieldCheck,
} from "lucide-react";

import "../styles/Home.css";

const tickerItems = [
  ["critical", "Phishing link blocked", "91"],
  ["high", "Fake job offer flagged", "74"],
  ["critical", "UPI scam message detected", "88"],
  ["safe", "URL verified clean", "04"],
  ["critical", "Bank impersonation caught", "96"],
  ["suspicious", "Investment scam identified", "79"],
  ["critical", "Credential theft attempt", "90"],
];

const features = [
  {
    icon: Brain,
    title: "AI Scam Detection",
    text: "Detect phishing and social engineering attempts using intelligent threat analysis.",
  },
  {
    icon: Link2,
    title: "URL Intelligence",
    text: "Analyze suspicious links without visiting dangerous destinations.",
  },
  {
    icon: Image,
    title: "Screenshot Analysis",
    text: "Upload suspicious screenshots and identify visual scam indicators.",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring",
    text: "Understand every threat through a simple 0–100 security score.",
  },
  {
    icon: AlertTriangle,
    title: "Threat Detection",
    text: "Identify phishing, banking fraud, UPI scams, job scams and more.",
  },
  {
    icon: Activity,
    title: "Security Insights",
    text: "Track analysis history and understand recurring threat patterns.",
  },
];

const threats = [
  {
    icon: Shield,
    title: "Phishing",
    text: "Fake messages designed to trick you into revealing sensitive information.",
    level: 3,
  },
  {
    icon: CreditCard,
    title: "Banking Fraud",
    text: "Impersonation attempts designed to steal account credentials or funds.",
    level: 4,
  },
  {
    icon: Link2,
    title: "Payment & UPI Scams",
    text: "Fraudulent payment requests and deceptive transaction links.",
    level: 2,
  },
  {
    icon: BriefcaseBusiness,
    title: "Fake Job Offers",
    text: "Bogus recruitment schemes designed to extract money or personal data.",
    level: 2,
  },
  {
    icon: TrendingUp,
    title: "Investment Scams",
    text: "Fraudulent schemes promising unrealistic investment returns.",
    level: 3,
  },
  {
    icon: KeyRound,
    title: "Credential Theft",
    text: "Attempts to steal passwords and login details through deception.",
    level: 4,
  },
];

const recentActivity = [
  {
    name: "Suspicious Bank Message",
    status: "CRITICAL",
    score: 94,
    type: "critical",
  },
  {
    name: "Safe Website",
    status: "SAFE",
    score: 8,
    type: "safe",
  },
  {
    name: "UPI Payment Scam",
    status: "HIGH",
    score: 82,
    type: "high",
  },
];

function SectionHeading({ eyebrow, title, description, center = true }) {
  return (
    <div className={`section-heading ${center ? "center" : ""}`}>
      {eyebrow && <span className="eyebrow warm">{eyebrow}</span>}
      <h2 dangerouslySetInnerHTML={{ __html: title }} />
      {description && <p>{description}</p>}
    </div>
  );
}

function PerimeterCard({ children, className = "" }) {
  return <div className={`watch-card ${className}`}>{children}</div>;
}

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("message");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="home-page">
      {/* Background */}
      <div className="home-grid" />
      <div className="home-noise" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* ================= NAVBAR ================= */}
      <nav className={`home-navbar ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="home-logo">
          <span className="logo-shield">
            <Shield size={17} />
          </span>

          <span>
            SCAMSHIELD <strong>AI</strong>
          </span>
        </Link>

        <div className="home-nav-links">
          <a href="#top">Home</a>
          <a href="#how">How It Works</a>
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#dashboard">Dashboard</a>
        </div>

        <div className="home-nav-actions">
          <Link to="/login" className="nav-signin">
            Sign In
          </Link>

          <Link to="/signup" className="gold-button nav-get-started">
            Get Started
            <ArrowRight size={15} />
          </Link>
        </div>

        <button
          className="mobile-nav-button"
          onClick={() => scrollTo("features")}
          aria-label="Open navigation"
        >
          <Activity size={19} />
        </button>
      </nav>

      {/* ================= HERO ================= */}
      <header className="hero-section" id="top">
        <div className="page-container hero-layout">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="live-dot" />
              AI-POWERED DIGITAL SECURITY
            </div>

            <h1>
              Detect Scams Before They Become{" "}
              <span className="gold-text">Damage.</span>
            </h1>

            <p className="hero-description">
              ScamShield AI analyzes suspicious messages, URLs and screenshots
              using intelligent threat detection to help you identify digital
              scams before it&apos;s too late.
            </p>

            <div className="hero-actions">
              <Link to="/analyze" className="gold-button large-button">
                <Shield size={17} />
                Analyze Something Now
                <ArrowRight size={16} />
              </Link>

              <button
                className="outline-button large-button"
                onClick={() => scrollTo("how")}
              >
                <Play size={15} />
                How It Works
              </button>
            </div>

            <div className="trust-list">
              <div>
                <span>
                  <Check size={11} />
                </span>
                AI-Powered Analysis
              </div>

              <div>
                <span>
                  <Check size={11} />
                </span>
                Real-Time Threat Detection
              </div>

              <div>
                <span>
                  <Check size={11} />
                </span>
                Privacy-Focused Processing
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-orbit orbit-three" />

            <div className="radar-line" />

            <PerimeterCard className="threat-analysis-card">
              <div className="analysis-card-top">
                <span>THREAT ANALYSIS</span>
                <span className="analysis-live">
                  <i />
                  LIVE
                </span>
              </div>

              <div className="analysis-card-title">
                Suspicious Activity Detected
              </div>

              <div className="risk-display">
                <div className="risk-circle">
                  <svg viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="51"
                      className="risk-track"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="51"
                      className="risk-progress"
                    />
                  </svg>

                  <div className="risk-number">
                    <strong>94</strong>
                    <span>/ 100</span>
                  </div>
                </div>

                <div>
                  <span className="critical-badge">
                    <AlertTriangle size={12} />
                    CRITICAL RISK
                  </span>

                  <p className="risk-caption">
                    Multiple high-confidence threat signals detected.
                  </p>
                </div>
              </div>

              <div className="fake-message">
                <MessageSquare size={14} />
                <span>
                  &quot;Your bank account will be blocked. Verify your OTP
                  immediately…&quot;
                </span>
              </div>

              <div className="analysis-footer">
                <span>
                  <ShieldCheck size={13} />
                  AI confidence
                </span>
                <strong>96%</strong>
              </div>
            </PerimeterCard>

            <div className="floating-signal signal-clean">
              <ShieldCheck size={14} />
              <span>
                <small>URL SCAN</small>
                Clean
              </span>
            </div>

            <div className="floating-signal signal-danger">
              <AlertTriangle size={14} />
              <span>
                <small>THREAT</small>
                Phishing Detected
              </span>
            </div>

            <div className="floating-signal signal-live">
              <Activity size={14} />
              <span>
                <small>ENGINE</small>
                Monitoring…
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= TICKER ================= */}
      <div className="threat-ticker">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div className="ticker-item" key={`${item[1]}-${index}`}>
              <span className={`ticker-dot ${item[0]}`} />
              <span>{item[1]}</span>
              <strong>RISK {item[2]}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* ================= LIVE ANALYSIS ================= */}
      <section className="home-section analysis-section" id="analyze">
        <div className="page-container">
          <SectionHeading
            eyebrow="LIVE DEMO"
            title={`See ScamShield AI in <span class="gold-text">Action.</span>`}
            description="Our intelligence engine analyzes digital threats and turns complex signals into a clear security decision."
          />

          <div className="live-analysis-panel">
            <div className="analysis-input-side">
              <div className="analysis-tabs">
                <button
                  className={activeTab === "message" ? "active" : ""}
                  onClick={() => setActiveTab("message")}
                >
                  <MessageSquare size={14} />
                  Message
                </button>

                <button
                  className={activeTab === "url" ? "active" : ""}
                  onClick={() => setActiveTab("url")}
                >
                  <Link2 size={14} />
                  URL
                </button>

                <button
                  className={activeTab === "screenshot" ? "active" : ""}
                  onClick={() => setActiveTab("screenshot")}
                >
                  <Image size={14} />
                  Screenshot
                </button>
              </div>

              <div className="input-panel-content">
                {activeTab === "message" && (
                  <>
                    <div className="field-label">
                      <span>MESSAGE SIGNAL</span>
                      <small>Sample</small>
                    </div>

                    <div className="sample-input">
                      Congratulations! Your bank account has been suspended.
                      Click here immediately to verify your account details.
                    </div>
                  </>
                )}

                {activeTab === "url" && (
                  <>
                    <div className="field-label">
                      <span>URL SIGNAL</span>
                      <small>Static analysis</small>
                    </div>

                    <div className="sample-input url-input">
                      https://secure-bank-verification.example/login
                    </div>
                  </>
                )}

                {activeTab === "screenshot" && (
                  <>
                    <div className="field-label">
                      <span>SCREENSHOT SIGNAL</span>
                      <small>Vision analysis</small>
                    </div>

                    <div className="screenshot-placeholder">
                      <Image size={28} />
                      <strong>Suspicious screenshot</strong>
                      <span>AI vision analysis ready</span>
                    </div>
                  </>
                )}

                <Link to="/analyze" className="gold-button analysis-button">
                  <ScanSearch size={16} />
                  Analyze Threat
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="threat-report">
              <div className="report-heading">
                <div>
                  <span className="mono-label">AI THREAT REPORT</span>
                  <h3>Security assessment</h3>
                </div>

                <span className="report-status">
                  <i />
                  ANALYZED
                </span>
              </div>

              <div className="scam-status">
                <AlertTriangle size={16} />
                Scam Detected
              </div>

              <div className="report-metrics">
                <div className="report-metric">
                  <span>RISK SCORE</span>
                  <strong className="danger-value">87 / 100</strong>
                </div>

                <div className="report-metric">
                  <span>THREAT TYPE</span>
                  <strong>Phishing</strong>
                </div>

                <div className="report-metric">
                  <span>SEVERITY</span>
                  <strong className="warning-value">HIGH</strong>
                </div>

                <div className="report-metric">
                  <span>CONFIDENCE</span>
                  <strong className="success-value">96%</strong>
                </div>
              </div>

              <div className="red-flags">
                <div>
                  <AlertTriangle size={14} />
                  Urgency manipulation
                </div>

                <div>
                  <AlertTriangle size={14} />
                  Credential theft attempt
                </div>

                <div>
                  <AlertTriangle size={14} />
                  Suspicious link
                </div>

                <div>
                  <AlertTriangle size={14} />
                  Impersonation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="home-section how-section" id="how">
        <div className="page-container">
          <SectionHeading
            eyebrow="THREAT WORKFLOW"
            title={`Security Intelligence in <span class="gold-text">Three Steps.</span>`}
            description="From suspicious signal to actionable security decision."
          />

          <div className="steps-grid">
            <PerimeterCard className="step-card">
              <span className="step-number">STEP 01</span>

              <div className="step-icon">
                <MessageSquare size={23} />
              </div>

              <h3>Submit</h3>
              <p>Send suspicious digital content to ScamShield.</p>

              <ul>
                <li>Message</li>
                <li>URL</li>
                <li>Screenshot</li>
              </ul>
            </PerimeterCard>

            <PerimeterCard className="step-card">
              <span className="step-number">STEP 02</span>

              <div className="step-icon">
                <Brain size={23} />
              </div>

              <h3>AI Analysis</h3>
              <p>Multiple intelligence signals are evaluated together.</p>

              <ul>
                <li>Threat patterns</li>
                <li>Suspicious language</li>
                <li>Scam techniques</li>
                <li>Risk signals</li>
              </ul>
            </PerimeterCard>

            <PerimeterCard className="step-card">
              <span className="step-number">STEP 03</span>

              <div className="step-icon">
                <ShieldCheck size={23} />
              </div>

              <h3>Stay Protected</h3>
              <p>Receive a clear threat report and recommended action.</p>

              <ul>
                <li>Risk score</li>
                <li>Scam classification</li>
                <li>Severity</li>
                <li>Red flags</li>
                <li>Recommendations</li>
              </ul>
            </PerimeterCard>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="home-section features-section" id="features">
        <div className="page-container">
          <SectionHeading
            eyebrow="CAPABILITIES"
            center={false}
            title={`Intelligent Protection Against <span class="gold-text">Modern Scams.</span>`}
            description="A security intelligence layer designed around the threats people actually encounter online."
          />

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <PerimeterCard className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={20} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>

                  <span className="feature-arrow">
                    <ChevronRight size={15} />
                  </span>
                </PerimeterCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= THREATS ================= */}
      <section className="home-section threats-section">
        <div className="page-container">
          <SectionHeading
            eyebrow="THREAT COVERAGE"
            title={`One AI. <span class="gold-text">Multiple Threats.</span>`}
            description="Recognize common social-engineering and digital-fraud patterns before they become costly mistakes."
          />

          <div className="threat-grid">
            {threats.map((threat) => {
              const Icon = threat.icon;

              return (
                <PerimeterCard className="threat-card" key={threat.title}>
                  <div className="threat-top">
                    <div className="threat-icon">
                      <Icon size={21} />
                    </div>

                    <div className="risk-level">
                      {[0, 1, 2, 3].map((dot) => (
                        <i
                          key={dot}
                          className={dot < threat.level ? "on" : ""}
                        />
                      ))}
                    </div>
                  </div>

                  <h3>{threat.title}</h3>
                  <p>{threat.text}</p>
                </PerimeterCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= AI ENGINE ================= */}
      <section className="home-section engine-section" id="security">
        <div className="page-container">
          <SectionHeading
            eyebrow="INTELLIGENCE ENGINE"
            title={`Powered by Intelligent <span class="gold-text">Threat Analysis.</span>`}
            description="Different signals converge into one security assessment."
          />

          <div className="engine-visual">
            <div className="engine-ring ring-a" />
            <div className="engine-ring ring-b" />

            <div className="engine-core">
              <Brain size={28} />
              <strong>AI</strong>
              <span>INTELLIGENCE<br />ENGINE</span>
            </div>

            <div className="engine-node node-message">
              <MessageSquare size={15} />
              Message Analysis
            </div>

            <div className="engine-node node-url">
              <Link2 size={15} />
              URL Analysis
            </div>

            <div className="engine-node node-image">
              <Image size={15} />
              Screenshot Analysis
            </div>

            <div className="engine-node node-risk">
              <Activity size={15} />
              Risk Engine
            </div>

            <div className="engine-node node-report">
              <BarChart3 size={15} />
              Threat Report
            </div>

            <div className="engine-node node-recommendation">
              <ShieldCheck size={15} />
              Recommendation
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRIVACY ================= */}
      <section className="home-section privacy-section">
        <div className="page-container">
          <SectionHeading
            eyebrow="PRIVACY & SECURITY"
            title={`Your Security Shouldn't Cost Your <span class="gold-text">Privacy.</span>`}
            description="Security intelligence should protect your information while helping you make better decisions."
          />

          <div className="privacy-grid">
            <PerimeterCard className="privacy-card">
              <div className="privacy-icon">
                <Lock size={22} />
              </div>
              <h3>Secure Processing</h3>
              <p>Sensitive information is processed through controlled security workflows.</p>
            </PerimeterCard>

            <PerimeterCard className="privacy-card">
              <div className="privacy-icon">
                <Shield size={22} />
              </div>
              <h3>Privacy Focused</h3>
              <p>Designed to minimize unnecessary exposure of user information.</p>
            </PerimeterCard>

            <PerimeterCard className="privacy-card">
              <div className="privacy-icon">
                <Zap size={22} />
              </div>
              <h3>Intelligent Detection</h3>
              <p>Multiple security signals combine to produce useful threat assessments.</p>
            </PerimeterCard>
          </div>
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="home-section dashboard-preview" id="dashboard">
        <div className="page-container">
          <SectionHeading
            eyebrow="SECURITY CENTER"
            title={`Your Personal Threat <span class="gold-text">Intelligence Center.</span>`}
            description="A single place to understand what you've analyzed and what requires attention."
          />

          <PerimeterCard className="dashboard-card">
            <div className="dashboard-metrics">
              <div>
                <span>Total Analyses</span>
                <strong>128</strong>
                <small>Live activity</small>
              </div>

              <div>
                <span>Threats Detected</span>
                <strong className="danger-value">34</strong>
                <small>26.5% of analyses</small>
              </div>

              <div>
                <span>Average Risk</span>
                <strong className="warning-value">62</strong>
                <small>Moderate</small>
              </div>

              <div>
                <span>Critical Threats</span>
                <strong className="danger-value">08</strong>
                <small>Requires attention</small>
              </div>
            </div>

            <div className="dashboard-body">
              <div className="chart-panel">
                <div className="panel-title">
                  <div>
                    <span>DETECTION TRENDS</span>
                    <strong>Recent threat activity</strong>
                  </div>

                  <BarChart3 size={18} />
                </div>

                <div className="bar-chart">
                  {[40, 65, 35, 80, 55, 95, 70, 82, 58].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="chart-bar"
                        style={{ height: `${height}%` }}
                      >
                        <span />
                      </div>
                    )
                  )}
                </div>

                <div className="chart-days">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="activity-panel">
                <div className="panel-title">
                  <div>
                    <span>RECENT ACTIVITY</span>
                    <strong>Latest analyses</strong>
                  </div>

                  <Link to="/history">View all</Link>
                </div>

                <div className="activity-list">
                  {recentActivity.map((item) => (
                    <div className="activity-row" key={item.name}>
                      <div className="activity-name">
                        <span
                          className={`activity-icon ${item.type}`}
                        >
                          {item.type === "safe" ? (
                            <Check size={13} />
                          ) : (
                            <AlertTriangle size={13} />
                          )}
                        </span>

                        <span>{item.name}</span>
                      </div>

                      <span className={`activity-status ${item.type}`}>
                        {item.status} · {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-action">
              <Link to="/dashboard" className="gold-button">
                Open Dashboard
                <ArrowRight size={15} />
              </Link>
            </div>
          </PerimeterCard>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="home-section capability-section">
        <div className="page-container">
          <SectionHeading
            eyebrow="SCAMSHIELD CAPABILITIES"
            title={`Built for Safer <span class="gold-text">Digital Interactions.</span>`}
          />

          <div className="capability-grid">
            <PerimeterCard className="capability-card">
              <strong>AI-Powered</strong>
              <span>Threat Analysis</span>
            </PerimeterCard>

            <PerimeterCard className="capability-card">
              <strong>3+</strong>
              <span>Message · URL · Screenshot</span>
            </PerimeterCard>

            <PerimeterCard className="capability-card">
              <strong>Real-Time</strong>
              <span>Risk Detection</span>
            </PerimeterCard>

            <PerimeterCard className="capability-card">
              <strong>0–100</strong>
              <span>Risk Scoring</span>
            </PerimeterCard>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="final-section">
        <div className="final-glow" />

        <div className="page-container">
          <div className="final-card">
            <div className="final-icon">
              <ShieldCheck size={27} />
            </div>

            <span className="eyebrow warm">PERIMETER WATCH · ACTIVE</span>

            <h2>
              Don&apos;t Wait Until It&apos;s{" "}
              <span className="gold-text">Too Late.</span>
            </h2>

            <p>
              Analyze suspicious digital activity and make safer decisions
              with AI-powered threat intelligence.
            </p>

            <div className="final-actions">
              <Link to="/analyze" className="gold-button large-button">
                <ScanSearch size={17} />
                Analyze a Threat Now
                <ArrowRight size={16} />
              </Link>

              <Link to="/signup" className="outline-button large-button">
                Create Free Account
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <div className="page-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="home-logo">
                <span className="logo-shield">
                  <Shield size={17} />
                </span>

                <span>
                  SCAMSHIELD <strong>AI</strong>
                </span>
              </Link>

              <p>
                Intelligent scam detection & threat analysis for safer digital
                interactions.
              </p>

              <span className="footer-status">
                <i />
                SYSTEM OPERATIONAL
              </span>
            </div>

            <div className="footer-column">
              <h4>PRODUCT</h4>
              <Link to="/analyze">Analyze</Link>
              <a href="#features">Features</a>
              <a href="#how">How It Works</a>
              <Link to="/dashboard">Dashboard</Link>
            </div>

            <div className="footer-column">
              <h4>SECURITY</h4>
              <a href="#security">AI Detection</a>
              <a href="#security">URL Intelligence</a>
              <a href="#security">Screenshot Analysis</a>
              <a href="#security">Privacy</a>
            </div>

            <div className="footer-column">
              <h4>ACCOUNT</h4>
              <Link to="/login">Sign In</Link>
              <Link to="/signup">Create Account</Link>
              <Link to="/history">History</Link>
              <Link to="/profile">Profile</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <span>AI SECURITY INTELLIGENCE</span>
            <span>© 2026 ScamShield AI</span>
            <span>BUILT FOR SAFER DIGITAL INTERACTIONS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;