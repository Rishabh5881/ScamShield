import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  ScanSearch,
  Fingerprint,
  Link2,
  Image,
  MessageSquareWarning,
  Radar,
  LockKeyhole,
  Activity,
  CheckCircle2,
} from "lucide-react";
import BrandMark from "../components/BrandMark";

export default function Home() {
  return (
    <main className="landing-page">
      {/* =====================================================
          PUBLIC NAVBAR — LOGGED OUT
          ===================================================== */}
      <nav className="landing-nav">
        <Link to="/" className="landing-brand">
          <div className="landing-brand-mark">
            <BrandMark size={21} />
          </div>

          <div className="landing-brand-content">
            <strong>ScamShield AI</strong>
            <span>Signal Intelligence</span>
          </div>
        </Link>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-signin">
            Sign in
          </Link>

          <Link to="/signup" className="landing-nav-cta">
            <span>Create account</span>
            <ArrowRight
              size={15}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </div>
      </nav>

      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-status">
            <span className="landing-status-dot" />
            PERIMETER WATCH · ONLINE
          </div>

          <span className="landing-eyebrow">
            AI-powered threat intelligence
          </span>

          <h1>
            Don't trust the
            <br />
            <em>signal.</em>
            <br />
            <span>Check it.</span>
          </h1>

          <p>
            ScamShield analyzes suspicious messages, URLs and screenshots
            to detect scam signals, explain the threat and help you take
            safer action before it's too late.
          </p>

          <div className="landing-hero-actions">
            <Link to="/signup" className="landing-primary">
              <span>Start protecting yourself</span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <Link to="/login" className="landing-secondary">
              Sign in to ScamShield
            </Link>
          </div>

          <div className="landing-trust">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Private analysis</span>

            <i />

            <Activity size={15} aria-hidden="true" />
            <span>Structured risk intelligence</span>
          </div>
        </div>

        {/* =====================================================
            SECURITY VISUAL
            ===================================================== */}
        <div className="threat-console">
          <div className="console-corner console-tl" />
          <div className="console-corner console-tr" />
          <div className="console-corner console-bl" />
          <div className="console-corner console-br" />

          <div className="console-header">
            <div>
              <span>SCAMSHIELD / PERIMETER</span>
              <strong>THREAT MONITOR</strong>
            </div>

            <div className="console-live">
              <span />
              LIVE
            </div>
          </div>

          <div className="radar">
            <div className="radar-ring radar-ring-one" />
            <div className="radar-ring radar-ring-two" />
            <div className="radar-ring radar-ring-three" />

            <div className="radar-cross horizontal" />
            <div className="radar-cross vertical" />

            <div className="radar-sweep" />

            <div className="radar-core">
              <ShieldCheck size={27} aria-hidden="true" />
            </div>

            <span className="threat-dot dot-one" />
            <span className="threat-dot dot-two" />
            <span className="threat-dot dot-three" />
          </div>

          <div className="console-analysis">
            <div className="analysis-label">
              <span>INCOMING SIGNAL</span>
              <span>SCAN 02491</span>
            </div>

            <div className="signal-box">
              <MessageSquareWarning
                size={18}
                aria-hidden="true"
              />

              <div>
                <strong>Suspicious banking message</strong>
                <span>
                  Urgency · verification request · link
                </span>
              </div>

              <div className="signal-risk">
                <strong>HIGH</strong>
                <span>87 / 100</span>
              </div>
            </div>

            <div className="console-progress">
              <span />
            </div>

            <div className="console-result">
              <CheckCircle2
                size={16}
                aria-hidden="true"
              />

              <span>
                Signal analyzed · threat pattern identified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SIGNAL STRIP
          ===================================================== */}
      <section className="landing-signal-strip">
        <div>
          <span>01</span>
          <ShieldCheck size={18} aria-hidden="true" />
          <strong>Detect</strong>
          <p>Identify suspicious signals.</p>
        </div>

        <div>
          <span>02</span>
          <ScanSearch size={18} aria-hidden="true" />
          <strong>Explain</strong>
          <p>Understand why it looks dangerous.</p>
        </div>

        <div>
          <span>03</span>
          <LockKeyhole size={18} aria-hidden="true" />
          <strong>Protect</strong>
          <p>Take safer action with confidence.</p>
        </div>
      </section>

      {/* =====================================================
          WHAT WE DO
          ===================================================== */}
      <section className="landing-section">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">
            WHAT SCAMSHIELD DOES
          </span>

          <h2>
            A security layer for
            <br />
            <em>every suspicious signal.</em>
          </h2>

          <p>
            Scammers can reach you through a message, a link or even an
            image. ScamShield gives you one place to inspect that signal
            before you trust it.
          </p>
        </div>

        <div className="threat-types">
          <div className="threat-card">
            <div className="threat-icon">
              <MessageSquareWarning aria-hidden="true" />
            </div>

            <span>01 / MESSAGE</span>

            <h3>Suspicious messages</h3>

            <p>
              Detect phishing language, urgency, impersonation,
              manipulation and other social-engineering patterns.
            </p>

            <div className="threat-card-line" />
          </div>

          <div className="threat-card featured">
            <div className="threat-icon">
              <Link2 aria-hidden="true" />
            </div>

            <span>02 / URL</span>

            <h3>Suspicious URLs</h3>

            <p>
              Inspect suspicious domains, verification links,
              credential-harvesting pages and malicious URL patterns.
            </p>

            <div className="threat-card-line" />
          </div>

          <div className="threat-card">
            <div className="threat-icon">
              <Image aria-hidden="true" />
            </div>

            <span>03 / SCREENSHOT</span>

            <h3>Visual evidence</h3>

            <p>
              Analyze screenshots of suspicious banking alerts,
              payment requests and other scam communications.
            </p>

            <div className="threat-card-line" />
          </div>
        </div>
      </section>

      {/* =====================================================
          INTELLIGENCE
          ===================================================== */}
      <section className="intelligence-section">
        <div className="intelligence-visual">
          <div className="intelligence-grid" />

          <div className="intelligence-center">
            <Radar size={34} aria-hidden="true" />
          </div>

          <div className="intel-node node-a">
            <Fingerprint size={17} aria-hidden="true" />
            <span>IDENTITY</span>
          </div>

          <div className="intel-node node-b">
            <Link2 size={17} aria-hidden="true" />
            <span>URL</span>
          </div>

          <div className="intel-node node-c">
            <MessageSquareWarning
              size={17}
              aria-hidden="true"
            />
            <span>MESSAGE</span>
          </div>

          <div className="intel-node node-d">
            <ShieldCheck size={17} aria-hidden="true" />
            <span>RISK</span>
          </div>

          <div className="intel-line line-a" />
          <div className="intel-line line-b" />
          <div className="intel-line line-c" />
          <div className="intel-line line-d" />
        </div>

        <div className="intelligence-copy">
          <span className="landing-eyebrow">
            SIGNAL INTELLIGENCE
          </span>

          <h2>
            From suspicious
            <br />
            <em>signal</em> to clear decision.
          </h2>

          <p>
            ScamShield doesn't simply tell you that something is
            suspicious. It turns the analysis into a structured security
            report you can understand.
          </p>

          <div className="intel-list">
            <div>
              <ShieldCheck aria-hidden="true" />

              <span>
                <strong>Risk score</strong>
                Quantified threat severity from 0–100.
              </span>
            </div>

            <div>
              <Fingerprint aria-hidden="true" />

              <span>
                <strong>Threat classification</strong>
                Understand what type of scam you're facing.
              </span>
            </div>

            <div>
              <ScanSearch aria-hidden="true" />

              <span>
                <strong>Red flags & attack patterns</strong>
                See the signals that triggered the assessment.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}
      <section className="landing-final">
        <div className="landing-final-glow" />

        <span className="landing-eyebrow">
          YOUR FIRST LINE OF DEFENSE
        </span>

        <h2>
          Check first.
          <br />
          <em>Act with confidence.</em>
        </h2>

        <p>
          Create your ScamShield account and start checking suspicious
          messages, URLs and screenshots with structured threat
          intelligence.
        </p>

        <Link to="/signup" className="landing-primary">
          <span>Create your account</span>
          <ArrowRight size={17} aria-hidden="true" />
        </Link>

        <div className="landing-footer-status">
          <span />
          SCAMSHIELD AI · PERIMETER WATCH · PROTECTED
        </div>
      </section>
    </main>
  );
}