export default function RiskDistribution({
  distribution = [],
}) {
  if (!distribution.length) {
    return (
      <div className="empty-table">
        No risk distribution data available yet.
      </div>
    );
  }

  const maxValue = Math.max(
    ...distribution.map((item) => item.count || 0),
    1
  );

  return (
    <div className="risk-distribution">
      {distribution.map((item) => {
        const value = item.count || 0;
        const percentage = Math.round(
          (value / maxValue) * 100
        );

        return (
          <div
            className="bar-row"
            key={item.severity}
          >
            <div className="bar-meta">
              <span>{item.severity}</span>
              <strong>{value}</strong>
            </div>

            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
