import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  History as HistoryIcon,
  ShieldCheck,
} from "lucide-react";
import { getHistory } from "../services/api";

function mapRow(item) {
  const result = item?.result || {};

  return {
    id: item?.id || "unknown",
    title: item?.originalInput || "Security analysis",
    category:
      result?.scamType ||
      result?.classification ||
      item?.inputType ||
      "Analysis",
    severity: result?.severity || "LOW",
    score: result?.riskScore ?? 0,
    date: item?.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : "—",
    inputType: item?.inputType || "analysis",
  };
}

export default function History() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const response = await getHistory();

        if (cancelled) return;

        const payload = response?.data;

        const historyData = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        setRows(historyData.map(mapRow));
      } catch (err) {
        if (cancelled) return;

        setRows([]);

        setError(
          err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            err?.message ||
            "Unable to load analysis history."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows.filter((item) => {
      const matchesFilter =
        filter === "ALL" || item.severity === filter;

      const matchesSearch =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.severity.toLowerCase().includes(normalizedQuery) ||
        item.inputType.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [rows, query, filter]);

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            Activity archive / 03
          </span>

          <h1>Analysis history.</h1>

          <p>
            Review previous threat signals and their
            risk classifications.
          </p>
        </div>

        <div className="page-header-status">
          <span className="status-dot" />
          {rows.length} analyses recorded
        </div>
      </div>

      <section className="panel history-panel">
        <div className="history-panel-header">
          <div className="history-title">
            <div className="history-title-icon">
              <HistoryIcon size={17} />
            </div>

            <div>
              <strong>Analysis archive</strong>
              <span>
                Your completed security assessments
              </span>
            </div>
          </div>

          <div className="history-security-state">
            <ShieldCheck size={14} />
            Private history
          </div>
        </div>

        <div className="history-tools">
          <label className="search-box history-search">
            <Search size={14} />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search history..."
              type="search"
              aria-label="Search analysis history"
            />
          </label>

          <div className="filter-row">
            <SlidersHorizontal size={13} />

            {[
              "ALL",
              "CRITICAL",
              "HIGH",
              "SUSPICIOUS",
              "LOW",
            ].map((filterValue) => (
              <button
                key={filterValue}
                className={
                  filter === filterValue ? "active" : ""
                }
                onClick={() => setFilter(filterValue)}
                type="button"
              >
                {filterValue}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        <div className="history-table">
          <div className="history-head">
            <span>Analysis</span>
            <span>Category</span>
            <span>Risk</span>
            <span>Score</span>
            <span>Date</span>
          </div>

          {loading && (
            <div className="empty-table history-loading">
              <div className="history-loading-icon">
                <HistoryIcon size={18} />
              </div>

              <strong>
                Loading analysis history...
              </strong>

              <small>
                Retrieving your completed security assessments.
              </small>
            </div>
          )}

          {!loading &&
            filtered.map((item) => (
              <div
                className="history-row"
                key={item.id}
              >
                <div className="history-analysis-cell">
                  <div className="history-row-icon">
                    <HistoryIcon size={15} />
                  </div>

                  <div>
                    <strong title={item.title}>
                      {item.title}
                    </strong>

                    <small title={item.id}>
                      {item.id}
                    </small>
                  </div>
                </div>

                <span className="history-category">
                  {item.category}
                </span>

                <span
                  className={`risk-badge ${item.severity.toLowerCase()}`}
                >
                  {item.severity}
                </span>

                <strong className="history-score">
                  {item.score}/100
                </strong>

                <time>
                  {item.date}
                </time>
              </div>
            ))}

          {!loading && !filtered.length && (
            <div className="empty-table history-empty">
              <div className="history-empty-icon">
                <Search size={18} />
              </div>

              <strong>
                {error
                  ? "No live history is available."
                  : "No analyses match your filters."}
              </strong>

              <small>
                {error
                  ? "Try again after the analysis service is available."
                  : "Try another search term or risk filter."}
              </small>
            </div>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="history-footer">
            <span>
              Showing {filtered.length} of {rows.length} analyses
            </span>

            <span>
              Risk scores are generated from completed assessments
            </span>
          </div>
        )}
      </section>
    </main>
  );
}