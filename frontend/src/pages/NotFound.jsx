import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="page-content"><div className="placeholder-card"><span className="eyebrow">Signal lost</span><h1>Page not found.</h1><p>The route you requested does not exist in this Phase 1 build.</p><Link className="primary-btn" to="/dashboard">Return to dashboard</Link></div></main>;
}
