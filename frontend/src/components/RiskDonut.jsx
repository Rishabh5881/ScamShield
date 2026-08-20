export default function RiskDonut({
  score = 0,
  loading = false,
}) {
  const safeScore = Math.max(
    0,
    Math.min(100, Number(score) || 0)
  );

  const label =
    safeScore >= 80
      ? "Excellent protection"
      : safeScore >= 60
        ? "Good protection"
        : safeScore >= 40
          ? "Moderate protection"
          : "Needs attention";

  const description =
    safeScore >= 80
      ? "Threat coverage is looking healthy."
      : safeScore >= 60
        ? "Your current protection coverage is good."
        : safeScore >= 40
          ? "Some suspicious activity needs attention."
          : "Several risks require your attention.";

  return (
    <div className="donut-wrap">
      <div
        className="donut"
        style={{
          "--score": `${safeScore}%`,
        }}
        aria-label={`${safeScore}% safe rate`}
      >
        <div className="donut-inner">
          <strong>
            {loading ? "—" : `${safeScore}%`}
          </strong>

          <span>SAFE RATE</span>
        </div>
      </div>

      <div className="donut-copy">
        <strong>
          {loading ? "Loading protection..." : label}
        </strong>

        <span>
          {loading
            ? "Calculating from your analysis activity."
            : description}
        </span>
      </div>
    </div>
  );
}