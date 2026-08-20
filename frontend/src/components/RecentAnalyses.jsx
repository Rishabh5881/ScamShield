import {
  MessageSquare,
  Package,
  BriefcaseBusiness,
  Gift,
  CreditCard,
} from "lucide-react";

const icons = {
  message: MessageSquare,
  package: Package,
  briefcase: BriefcaseBusiness,
  gift: Gift,
  credit: CreditCard,
};

export default function RecentAnalyses({
  items = [],
}) {
  if (!items.length) {
    return (
      <div className="empty-table">
        No recent analyses yet.
      </div>
    );
  }

  return (
    <div className="recent-analyses">
      {items.map((item) => {
        const Icon =
          icons[item.icon] ||
          MessageSquare;

        return (
          <div
            className="analysis-row"
            key={item.id}
          >
            <div className="analysis-title">
              <span className="analysis-symbol">
                <Icon size={14} />
              </span>

              <div>
                <strong>
                  {item.title}
                </strong>

                <span>
                  {item.category}
                </span>
              </div>
            </div>

            <span
              className={`risk-badge ${(
                item.severity || "LOW"
              ).toLowerCase()}`}
            >
              {item.severity || "LOW"}
            </span>

            <div className="score">
              <strong>
                {item.score ?? 0}
              </strong>

              <span>/100</span>
            </div>

            <time>
              {item.time || "Unknown"}
            </time>
          </div>
        );
      })}
    </div>
  );
}