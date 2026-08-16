export default function RiskDonut({ score = 76 }) {
  return (
    <div className="donut-wrap">
      <div className="donut" style={{ "--score": `${score}%` }} aria-label={`${score}% safe rate`}>
        <div className="donut-inner"><strong>{score}%</strong><span>SAFE RATE</span></div>
      </div>
      <div className="donut-copy"><strong>Excellent protection</strong><span>Threat coverage is looking healthy.</span></div>
    </div>
  );
}
