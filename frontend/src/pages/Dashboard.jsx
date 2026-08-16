import { Link } from "react-router-dom";
import { ArrowRight, Image, Link2, MessageSquare, Activity } from "lucide-react";
import { stats, recentAnalyses, categories } from "../data/mockData";
import StatCard from "../components/StatCard";
import RecentAnalyses from "../components/RecentAnalyses";
import RiskDonut from "../components/RiskDonut";
import CategoryChart from "../components/CategoryChart";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = (user?.name || "Akshh").split(" ")[0];
  return (
    <main className="page-content">
      <div className="page-header">
        <div><span className="eyebrow">Digital security / 01</span><h1>Good morning, {firstName}.</h1><p>Detect threats, understand the risk, and protect before you click.</p></div>
        <Link className="primary-btn" to="/analyze">+ New Analysis <ArrowRight size={13} /></Link>
      </div>

      <section className="security-hero">
        <div className="hero-copy">
          <span className="eyebrow warm">Perimeter watch · live</span>
          <h2>Most scams don't feel<br />like scams. <em>That's the point.</em></h2>
          <p>ScamShield reads the pattern behind a message, a link or a screenshot, and tells you exactly what gave it away, in plain language, before you act on it.</p>
          <div className="hero-actions">
            <Link className="hero-btn" to="/analyze">Analyze a signal <ArrowRight size={13} /></Link>
            <Link className="ghost-btn" to="/insights">See how it works</Link>
          </div>
        </div>

        <div className="signal-panel" aria-hidden="true">
          <div className="signal-panel-head">
            <div><strong>Live readout</strong><span>SS-0128 · incoming</span></div>
            <span className="signal-live">Scanning</span>
          </div>
          <div className="waveform">
            {Array.from({ length: 10 }).map((_, i) => <span key={i} />)}
          </div>
          <div className="signal-readout">
            <strong>94<small>/100</small></strong>
            <span className="risk-badge critical">Critical</span>
          </div>
          <p className="signal-meta"><b>Phishing</b> pattern matched · verification-request language, unfamiliar channel</p>
        </div>
      </section>

      <section className="stats-grid" aria-label="Security statistics">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-head"><div><span className="eyebrow">Live activity</span><h3>Recent analyses</h3></div><Link to="/history">View all <ArrowRight size={10} /></Link></div>
          <RecentAnalyses items={recentAnalyses} />
        </article>
        <article className="panel">
          <div className="panel-head"><div><span className="eyebrow">Protection score</span><h3>Current coverage</h3></div><Activity size={15} color="var(--brass-soft)" /></div>
          <RiskDonut />
        </article>
      </section>

      <section className="content-grid bottom-grid">
        <article className="panel">
          <div className="panel-head"><div><span className="eyebrow">Threat distribution</span><h3>Scam categories</h3></div></div>
          <CategoryChart categories={categories} />
        </article>
        <article className="panel">
          <div className="panel-head"><div><span className="eyebrow">Quick actions</span><h3>Analyze something suspicious</h3></div></div>
          <div className="quick-actions">
            <Link className="quick-card" to="/analyze"><span className="quick-icon"><MessageSquare size={15} /></span><div><strong>Message</strong><span>SMS, email, WhatsApp</span></div><ArrowRight size={12} /></Link>
            <Link className="quick-card" to="/analyze"><span className="quick-icon"><Link2 size={15} /></span><div><strong>URL</strong><span>Check a suspicious link</span></div><ArrowRight size={12} /></Link>
            <Link className="quick-card" to="/analyze"><span className="quick-icon"><Image size={15} /></span><div><strong>Screenshot</strong><span>Analyze an image</span></div><ArrowRight size={12} /></Link>
          </div>
        </article>
      </section>
    </main>
  );
}
