import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { insights } from "../data/securityInsights";

export default function SecurityInsights() {
  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            Threat intelligence / 04
          </span>

          <h1>Security insights.</h1>

          <p>
            Simple patterns that help you slow down and verify suspicious
            requests.
          </p>
        </div>
      </div>

      <section
        className="insight-grid"
        aria-label="Security insights"
      >
        {insights.map((item) => (
          <article
            className="insight-card"
            key={item.title}
          >
            <span className="eyebrow">
              {item.tag}
            </span>

            <span
              className="insight-icon"
              aria-hidden="true"
            >
              <ShieldCheck size={20} />
            </span>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

            <ArrowUpRight
              className="insight-arrow"
              size={15}
              aria-hidden="true"
            />
          </article>
        ))}
      </section>
    </main>
  );
}
