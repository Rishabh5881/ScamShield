import { MessageSquare, Package, BriefcaseBusiness, Gift, CreditCard, ArrowUpRight } from "lucide-react";

const icons = { message: MessageSquare, package: Package, briefcase: BriefcaseBusiness, gift: Gift, credit: CreditCard };

export default function RecentAnalyses({ items }) {
  return (
    <div className="recent-analyses">
      {items.map((item) => {
        const Icon = icons[item.icon] || MessageSquare;
        return (
          <div className="analysis-row" key={item.title}>
            <div className="analysis-title">
              <span className="analysis-symbol"><Icon size={14} /></span>
              <div><strong>{item.title}</strong><span>{item.category}</span></div>
            </div>
            <span className={`risk-badge ${item.severity.toLowerCase()}`}>{item.severity}</span>
            <div className="score"><strong>{item.score}</strong><span>/100</span></div>
            <time>{item.time}</time>
          </div>
        );
      })}
    </div>
  );
}
