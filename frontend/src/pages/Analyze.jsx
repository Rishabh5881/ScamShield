import { useRef, useState } from "react";
import { Link2, MessageSquare, Image, ScanLine, ShieldAlert, CheckCircle2, UploadCloud, X } from "lucide-react";
import { analyzeMessage } from "../services/api";

const tabs = [
  { id: "message", label: "Message", icon: MessageSquare },
  { id: "url", label: "URL", icon: Link2 },
  { id: "screenshot", label: "Screenshot", icon: Image },
];

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Analyze() {
  const [type, setType] = useState("message");
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function switchTab(id) {
    setType(id);
    setResult(null);
    setError("");
    setStatus("idle");
  }

  function handleFile(candidate) {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError("Please upload a PNG, JPG or WEBP image.");
      return;
    }
    if (candidate.size > MAX_FILE_BYTES) {
      setError("That image is larger than 8MB. Try a smaller screenshot.");
      return;
    }
    setError("");
    setFile(candidate);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setStatus("loading");
    setResult(null);
    try {
      const response = await analyzeMessage({ message: value, type, file });
      setResult(response.data);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Unable to complete analysis.");
      setStatus("error");
    }
  }

  return (
    <main className="page-content">
      <div className="page-header">
        <div><span className="eyebrow">Threat analysis / 02</span><h1>Analyze before you act.</h1><p>Give ScamShield a suspicious signal. The Phase 1 interface uses safe mock analysis data.</p></div>
      </div>

      <div className="analyze-grid">
        <section className="panel">
          <div className="panel-head"><div><span className="eyebrow">Input signal</span><h3>What looks suspicious?</h3></div><ScanLine size={15} color="#50d2d8" /></div>
          <div className="input-tabs" role="tablist" aria-label="Analysis type">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} className={type === id ? "active" : ""} onClick={() => switchTab(id)} role="tab" aria-selected={type === id} type="button"><Icon size={13} />{label}</button>
            ))}
          </div>

          <form className="analyze-form" onSubmit={submit}>
            <label htmlFor="analysis-input">{type === "message" ? "Paste the suspicious message" : type === "url" ? "Paste the suspicious URL" : "Screenshot input"}</label>

            {type === "screenshot" ? (
              <div
                className={`dropzone ${dragActive ? "drag-active" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
              >
                <input
                  ref={fileInputRef}
                  id="analysis-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="visually-hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {file ? (
                  <>
                    <CheckCircle2 size={24} color="#43cf8b" />
                    <strong>{file.name}</strong>
                    <span>{formatBytes(file.size)} · click to replace</span>
                    <button type="button" className="dropzone-clear" onClick={(e) => { e.stopPropagation(); setFile(null); }} aria-label="Remove file">
                      <X size={12} /> Remove
                    </button>
                  </>
                ) : (
                  <>
                    <UploadCloud size={24} />
                    <strong>Drop a screenshot here, or click to browse</strong>
                    <span>PNG, JPG or WEBP, up to 8MB · mock analysis in Phase 1</span>
                  </>
                )}
              </div>
            ) : type === "url" ? (
              <input
                id="analysis-input"
                type="url"
                inputMode="url"
                className="url-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://example.com/suspicious-link"
              />
            ) : (
              <textarea id="analysis-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Paste the message, email or chat content here..." />
            )}

            {error && <div className="error-box" role="alert">{error}</div>}
            <button className="primary-btn analyze-btn" disabled={status === "loading"} type="submit">
              {status === "loading" ? <>Scanning signal<span className="loading-dots">...</span></> : <>Analyze signal <ScanLine size={13} /></>}
            </button>
          </form>
        </section>

        <section className="panel result-panel" aria-live="polite">
          <div className="panel-head"><div><span className="eyebrow">Security report</span><h3>Analysis result</h3></div>{status === "success" ? <CheckCircle2 size={15} color="#43cf8b" /> : <ShieldAlert size={15} color="#65727f" />}</div>

          {!result && status !== "loading" && (
            <div className="empty-result"><ShieldAlert size={34} strokeWidth={1.2} /><h3>No signal analyzed yet</h3><p>Submit something suspicious and the result will appear here with severity, red flags and recommended actions.</p></div>
          )}

          {status === "loading" && (
            <div className="empty-result scanning"><ScanLine size={38} /><h3>Scanning signal...</h3><p>Checking message patterns, urgency signals and suspicious behaviour.</p><div className="scan-line" /></div>
          )}

          {result && (
            <div>
              <span className={`risk-badge ${result.severity.toLowerCase()}`}>{result.severity}</span>
              <div className="result-score">{result.riskScore}<small>/100</small></div>
              <div className="eyebrow">{result.scamType} · {Math.round(result.confidence * 100)}% confidence</div>
              <h3>Threat detected</h3>
              <p>{result.explanation}</p>
              <div className="red-flags">
                <strong>Red flags</strong>
                {result.redFlags.map((flag) => <span key={flag}>• {flag}</span>)}
              </div>
              <div className="red-flags">
                <strong>Recommended actions</strong>
                {result.recommendedActions.map((action) => <span key={action}>✓ {action}</span>)}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
