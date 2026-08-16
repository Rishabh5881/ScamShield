import { Activity, AlertTriangle, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react";

const icons = { blue: Activity, red: ShieldAlert, amber: AlertTriangle, green: ShieldCheck };

export default function StatCard({ label, value, change, tone = "blue" }) {
  const Icon = icons[tone] || Activity;
  return (
    <article className="stat-card">
      <div className="stat-head"><span>{label}</span><span className={`stat-icon ${tone === "red" ? "alert" : ""}`}><Icon size={15} /></span></div>
      <div className="stat-value">{value}</div>
      <div className="stat-change"><span><TrendingUp size={9} /> {change}</span> vs. last period</div>
    </article>
  );
}
