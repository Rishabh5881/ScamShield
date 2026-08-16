// Original ScamShield mark: a signal ping radiating from a fixed point,
// standing in for "a threat, caught early" — deliberately not a shield.
export default function BrandMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="3" cy="21" r="14" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.4" />
      <circle cx="3" cy="21" r="9" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
      <circle cx="3" cy="21" r="4.5" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.4" />
      <circle cx="3" cy="21" r="1.6" fill="currentColor" />
    </svg>
  );
}
