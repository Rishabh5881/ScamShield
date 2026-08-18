import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { getHistory } from "../services/api";
import { history as fallbackHistory } from "../data/mockData";

function mapRow(item) {
  const result = item.result || {};
  return {
    id: item.id,
    title: item.originalInput || "Security analysis",
    category: result.scamType || result.classification || item.inputType || "Analysis",
    severity: result.severity || "LOW",
    score: result.riskScore ?? 0,
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—",
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
    getHistory().then(response => {
      if (!cancelled) setRows((response?.data || []).map(mapRow));
    }).catch(err => {
      if (!cancelled) { setRows(fallbackHistory); setError(err.message || "Unable to load live history."); }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => rows.filter(item => (filter === "ALL" || item.severity === filter) && item.title.toLowerCase().includes(query.toLowerCase())), [rows, query, filter]);

  return (
    <main className="page-content">
      <div className="page-header"><div><span className="eyebrow">Activity archive / 03</span><h1>Analysis history.</h1><p>Review previous threat signals and their risk classifications.</p></div></div>
      <section className="panel history-panel">
        <div className="history-tools"><label className="search-box history-search"><Search size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search history..." /></label><div className="filter-row"><SlidersHorizontal size={13} />{["ALL","CRITICAL","HIGH","LOW"].map(x => <button key={x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)} type="button">{x}</button>)}</div></div>
        {error && <div className="error-box" role="status">{error} Showing available local history.</div>}
        <div className="history-table"><div className="history-head"><span>Analysis</span><span>Category</span><span>Risk</span><span>Score</span><span>Date</span></div>
          {loading ? <div className="empty-table">Loading analysis history...</div> : filtered.map(item => <div className="history-row" key={item.id}><div><strong>{item.title}</strong><small>{item.id}</small></div><span>{item.category}</span><span className={`risk-badge ${item.severity.toLowerCase()}`}>{item.severity}</span><strong>{item.score}/100</strong><time>{item.date}</time></div>)}
          {!loading && !filtered.length && <div className="empty-table">No analyses match your filters.</div>}
        </div>
      </section>
    </main>
  );
}
