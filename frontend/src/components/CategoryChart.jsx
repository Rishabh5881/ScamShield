export default function CategoryChart({
  categories = [],
}) {
  if (!categories.length) {
    return (
      <div className="empty-table">
        No threat categories available yet.
      </div>
    );
  }

  const maxValue = Math.max(
    ...categories.map((item) => item.value || 0),
    1
  );

  return (
    <div>
      {categories.map((item) => {
        const value = item.value || 0;

        const percentage = Math.round(
          (value / maxValue) * 100
        );

        return (
          <div
            className="bar-row"
            key={item.label}
          >
            <div className="bar-meta">
              <span>
                {item.label}
              </span>

              <strong>
                {value}
              </strong>
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