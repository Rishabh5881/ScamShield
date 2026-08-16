export default function CategoryChart({ categories }) {
  return (
    <div>
      {categories.map((item) => (
        <div className="bar-row" key={item.label}>
          <div className="bar-meta"><span>{item.label}</span><strong>{item.value}%</strong></div>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${item.value * 2}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
