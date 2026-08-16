import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { history } from "../data/mockData";

export default function History() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const rows = useMemo(() => history.filter(item => (filter === "ALL" || item.severity === filter) && item.title.toLowerCase().includes(query.toLowerCase())), [query, filter]);

  return (
    <main className="page-content">
      <div className="page-header"><div><span className="eyebrow">Activity archive / 03</span><h1>Analysis history.</h1><p>Review previous threat signals and their risk classifications.</p></div></div>
      <section className="panel history-panel">
        <div className="history-tools">
          <label className="search-box history-search"><Search size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search history..." /></label>
          <div className="filter-row"><SlidersHorizontal size={13} />{["ALL","CRITICAL","HIGH","LOW"].map(x => <button key={x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)}>{x}</button>)}</div>
        </div>
        <div className="history-table">
          <div className="history-head"><span>Analysis</span><span>Category</span><span>Risk</span><span>Score</span><span>Date</span></div>
          {rows.map(item => <div className="history-row" key={item.id}><div><strong>{item.title}</strong><small>{item.id}</small></div><span>{item.category}</span><span className={`risk-badge ${item.severity.toLowerCase()}`}>{item.severity}</span><strong>{item.score}/100</strong><time>{item.date}</time></div>)}
          {!rows.length && <div className="empty-table">No analyses match your filters.</div>}
        </div>
      </section>
    </main>
  );
}
