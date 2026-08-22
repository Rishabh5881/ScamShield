export default function DetectionTrends({
  trends = [],
}) {
  if (!trends.length) {
    return (
      <div className="empty-table">
        No detection trend data available yet.
      </div>
    );
  }

  const maxTotal = Math.max(
    ...trends.map((item) => item.total || 0),
    1
  );

  return (
    <div className="trend-list">
      {trends.map((item) => {
        const total = item.total || 0;
        const scams = item.scams || 0;

        const totalWidth = Math.round(
          (total / maxTotal) * 100
        );

        const scamWidth =
          total > 0
            ? Math.round((scams / total) * 100)
            : 0;

        return (
          <div
            className="trend-row"
            key={item.date}
          >
            <div className="trend-meta">
              <span>{item.date}</span>

              <strong>
                {scams} scams / {total} total
              </strong>
            </div>

            <div className="trend-track">
              <div
                className="trend-total"
                style={{
                  width: `${totalWidth}%`,
                }}
              />

              <div
                className="trend-scams"
                style={{
                  width: `${scamWidth}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
