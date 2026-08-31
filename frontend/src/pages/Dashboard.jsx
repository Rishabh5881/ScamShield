import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Image,
  Link2,
  MessageSquare,
  Activity,
} from "lucide-react";

import { getAnalytics } from "../services/api";
import StatCard from "../components/StatCard";
import RecentAnalyses from "../components/RecentAnalyses";
import RiskDonut from "../components/RiskDonut";
import CategoryChart from "../components/CategoryChart";
import RiskDistribution from "../components/RiskDistribution";
import DetectionTrends from "../components/DetectionTrends";
import { useAuth } from "../context/AuthContext";

function formatRecentAnalyses(items = []) {
  return items.map((item) => ({
    id: item.id,
    title: item.originalInput || "Security analysis",
    category:
      item.result?.scamType ||
      item.result?.classification ||
      "Analysis",
    score: item.result?.riskScore ?? 0,
    severity: item.result?.severity || "LOW",
    time: item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : "Unknown",
    icon:
      item.inputType === "screenshot"
        ? "package"
        : item.inputType === "url"
          ? "credit"
          : "message",
  }));
}

function formatCategories(items = []) {
  return items.map((item) => ({
    label: item.scamType,
    value: item.count,
  }));
}

export default function Dashboard() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const firstName = (user?.name || "User").split(" ")[0];

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await getAnalytics();

        if (!cancelled) {
          setAnalytics(response?.data || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Unable to load dashboard analytics."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = analytics?.summary || {};

  const stats = [
    {
      label: "Total Analyses",
      value: summary.totalAnalyses ?? 0,
      change: "Live",
      tone: "blue",
    },
    {
      label: "Scams Detected",
      value: summary.totalScams ?? 0,
      change: "Live",
      tone: "red",
    },
    {
      label: "High-Risk Detections",
      value: summary.highRisk ?? 0,
      change: "Live",
      tone: "amber",
    },
    {
      label: "Suspicious Cases",
      value: summary.suspicious ?? 0,
      change: "Live",
      tone: "amber",
    },
    {
      label: "Safe Cases",
      value: summary.safe ?? 0,
      change: "Live",
      tone: "green",
    },
  ];

  const recentAnalyses = formatRecentAnalyses(
    analytics?.recentActivity
  );

  const categories = formatCategories(
    analytics?.scamCategories
  );

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            Digital security / 01
          </span>

          <h1>Good morning, {firstName}.</h1>

          <p>
            Detect threats, understand the risk, and protect before you click.
          </p>
        </div>

        <Link className="primary-btn" to="/analyze">
          + New Analysis
          <ArrowRight size={13} />
        </Link>
      </div>

      {error && (
        <div className="dashboard-state error" role="alert"><strong>Dashboard unavailable</strong><span>{error}</span></div>
      )}

      <section className="security-hero">
        <div className="hero-copy">
          <span className="eyebrow warm">
            Perimeter watch Â· live
          </span>

          <h2>
            Most scams don't feel
            <br />
            like scams. <em>That's the point.</em>
          </h2>

          <p>
            ScamShield reads the pattern behind a message, a link or a
            screenshot, and tells you exactly what gave it away, in plain
            language, before you act on it.
          </p>

          <div className="hero-actions">
            <Link className="hero-btn" to="/analyze">
              Analyze a signal
              <ArrowRight size={13} />
            </Link>

            <Link className="ghost-btn" to="/insights">
              See how it works
            </Link>
          </div>
        </div>

        <div className="signal-panel" aria-hidden="true">
          <div className="signal-panel-head">
            <div>
              <strong>Live readout</strong>
              <span>ScamShield Â· incoming</span>
            </div>

            <span className="signal-live">Scanning</span>
          </div>

          <div className="waveform">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>

          <div className="signal-readout">
            <strong>
              {loading ? "â€”" : summary.highRisk ?? 0}
              <small> high risk</small>
            </strong>

            <span className="risk-badge critical">
              Live
            </span>
          </div>

          <p className="signal-meta">
            <b>Backend analytics</b> Â· real database activity
          </p>
        </div>
      </section>

      <section
        className="stats-grid"
        aria-label="Security statistics"
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
          />
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                Live activity
              </span>

              <h3>Recent analyses</h3>
            </div>

            <Link to="/history">
              View all
              <ArrowRight size={10} />
            </Link>
          </div>

          {loading ? (
            <div className="dashboard-state loading"><strong>Loading recent analyses</strong><span>Fetching your latest security activity.</span></div>
          ) : (
            <RecentAnalyses
              items={recentAnalyses}
            />
          )}
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                Protection score
              </span>

              <h3>Current coverage</h3>
            </div>

            <Activity
              size={15}
              color="var(--brass-soft)"
            />
          </div>

          <RiskDonut
            score={
              summary.totalAnalyses
                ? Math.round(
                    ((summary.safe || 0) /
                      summary.totalAnalyses) *
                      100
                  )
                : 0
            }
            loading={loading}
          />
        </article>
      </section>

      <section className="content-grid bottom-grid">
  <article className="panel">
    <div className="panel-head">
      <div>
        <span className="eyebrow">
          Threat distribution
        </span>

        <h3>Scam categories</h3>
      </div>
    </div>

    {loading ? (
      <div className="dashboard-state loading"><strong>Loading threat categories</strong><span>Preparing your threat distribution.</span></div>
    ) : (
      <CategoryChart
        categories={categories}
      />
    )}
  </article>

  <article className="panel">
    <div className="panel-head">
      <div>
        <span className="eyebrow">
          Risk distribution
        </span>

        <h3>Severity levels</h3>
      </div>
    </div>

    {loading ? (
      <div className="dashboard-state loading"><strong>Loading risk distribution</strong><span>Calculating your current security exposure.</span></div>
    ) : (
      <RiskDistribution
        distribution={
          analytics?.riskDistribution || []
        }
      />
    )}
  </article>

  <article className="panel">
    <div className="panel-head">
      <div>
        <span className="eyebrow">
          Detection trends
        </span>

        <h3>Recent activity trend</h3>
      </div>
    </div>

    {loading ? (
      <div className="dashboard-state loading"><strong>Loading detection trends</strong><span>Building your recent detection activity.</span></div>
    ) : (
      <DetectionTrends
        trends={
          analytics?.detectionTrends || []
        }
      />
    )}
  </article>

  <article className="panel">
    <div className="panel-head">
      <div>
        <span className="eyebrow">
          Quick actions
        </span>

        <h3>Analyze something suspicious</h3>
      </div>
    </div>

    <div className="quick-actions">
      <Link
        className="quick-card"
        to="/analyze"
      >
        <span className="quick-icon">
          <MessageSquare size={15} />
        </span>

        <div>
          <strong>Message</strong>
          <span>SMS, email, WhatsApp</span>
        </div>

        <ArrowRight size={12} />
      </Link>

      <Link
        className="quick-card"
        to="/analyze"
      >
        <span className="quick-icon">
          <Link2 size={15} />
        </span>

        <div>
          <strong>URL</strong>
          <span>Check a suspicious link</span>
        </div>

        <ArrowRight size={12} />
      </Link>

      <Link
        className="quick-card"
        to="/analyze"
      >
        <span className="quick-icon">
          <Image size={15} />
        </span>

        <div>
          <strong>Screenshot</strong>
          <span>Analyze an image</span>
        </div>

        <ArrowRight size={12} />
      </Link>
    </div>
  </article>
</section>
    </main>
  );
}

