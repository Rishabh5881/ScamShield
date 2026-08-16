import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { insights } from "../data/mockData";

export default function SecurityInsights() {
  return (
    <main className="page-content">
      <div className="page-header"><div><span className="eyebrow">Threat intelligence / 04</span><h1>Security insights.</h1><p>Simple patterns that help you slow down and verify suspicious requests.</p></div></div>
      <section className="insight-grid">
        {insights.map(item => <article className="insight-card" key={item.title}><span className="eyebrow">{item.tag}</span><ShieldCheck size={20} color="#5b8cff" /><h3>{item.title}</h3><p>{item.text}</p><ArrowUpRight size={13} color="#5d6975" /></article>)}
      </section>
    </main>
  );
}
