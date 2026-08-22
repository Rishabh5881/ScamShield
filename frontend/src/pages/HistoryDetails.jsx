import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getHistoryDetails } from "../services/api";

export default function HistoryDetails() {
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        setError("");

        const response = await getHistoryDetails(id);
        setAnalysis(response?.data || null);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load analysis details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="page-content">
        <section className="panel">
          <div className="empty-table">
            <strong>Loading analysis details...</strong>
          </div>
        </section>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="page-content">
        <section className="panel">
          <div className="empty-table">
            <strong>{error || "Analysis not found."}</strong>
            <Link to="/history">Back to history</Link>
          </div>
        </section>
      </main>
    );
  }

  const result = analysis.result || {};

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Analysis details</span>
          <h1>Security assessment.</h1>
          <p>Detailed result from your completed analysis.</p>
        </div>
      </div>

      <section className="panel">
        <div className="history-panel-header">
          <div className="history-title">
            <div className="history-title-icon">
              <ShieldCheck size={17} />
            </div>

            <div>
              <strong>{result.classification || "ANALYSIS"}</strong>
              <span>{analysis.inputType}</span>
            </div>
          </div>
        </div>

        <div className="detail-list">
          <div>
            <span>Risk score</span>
            <strong>{result.riskScore ?? 0}/100</strong>
          </div>

          <div>
            <span>Classification</span>
            <strong>{result.classification || "—"}</strong>
          </div>

          <div>
            <span>Scam type</span>
            <strong>{result.scamType || "—"}</strong>
          </div>

          <div>
            <span>Severity</span>
            <strong>{result.severity || "—"}</strong>
          </div>

          <div>
            <span>Date</span>
            <strong>
              {analysis.createdAt
                ? new Date(analysis.createdAt).toLocaleString()
                : "—"}
            </strong>
          </div>

          <div>
            <span>Input</span>
            <strong>{analysis.originalInput || "—"}</strong>
          </div>

          <div>
            <span>Explanation</span>
            <strong>{result.explanation || "—"}</strong>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Link to="/history">
            <ArrowLeft size={14} />
            Back to history
          </Link>
        </div>
      </section>
    </main>
  );
}
