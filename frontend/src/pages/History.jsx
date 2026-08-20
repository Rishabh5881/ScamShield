import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { getHistory } from "../services/api";

function mapRow(item) {
  const result = item.result || {};

  return {
    id: item.id,
    title:
      item.originalInput ||
      "Security analysis",
    category:
      result.scamType ||
      result.classification ||
      item.inputType ||
      "Analysis",
    severity:
      result.severity || "LOW",
    score:
      result.riskScore ?? 0,
    date: item.createdAt
      ? new Date(
          item.createdAt
        ).toLocaleDateString()
      : "—",
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

        const response =
          await getHistory();

        if (cancelled) {
          return;
        }

        const historyData =
          response?.data || [];

        setRows(
          Array.isArray(historyData)
            ? historyData.map(mapRow)
            : []
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        // IMPORTANT:
        // Never show mock/fake history.
        setRows([]);

        setError(
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
    const normalizedQuery =
      query.trim().toLowerCase();

    return rows.filter((item) => {
      const matchesFilter =
        filter === "ALL" ||
        item.severity === filter;

      const matchesSearch =
        !normalizedQuery ||
        item.title
          .toLowerCase()
          .includes(normalizedQuery) ||
        item.category
          .toLowerCase()
          .includes(normalizedQuery) ||
        item.severity
          .toLowerCase()
          .includes(normalizedQuery);

      return (
        matchesFilter &&
        matchesSearch
      );
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
            Review previous threat signals
            and their risk classifications.
          </p>
        </div>
      </div>

      <section className="panel history-panel">
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
                  filter === filterValue
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(filterValue)
                }
                type="button"
              >
                {filterValue}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="error-box"
            role="alert"
          >
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
            <div className="empty-table">
              Loading analysis history...
            </div>
          )}

          {!loading &&
            filtered.map((item) => (
              <div
                className="history-row"
                key={item.id}
              >
                <div>
                  <strong>
                    {item.title}
                  </strong>

                  <small>
                    {item.id}
                  </small>
                </div>

                <span>
                  {item.category}
                </span>

                <span
                  className={`risk-badge ${item.severity.toLowerCase()}`}
                >
                  {item.severity}
                </span>

                <strong>
                  {item.score}/100
                </strong>

                <time>
                  {item.date}
                </time>
              </div>
            ))}

          {!loading &&
            !filtered.length && (
              <div className="empty-table">
                {error
                  ? "No live history is available."
                  : "No analyses match your filters."}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}