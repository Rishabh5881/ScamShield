import { useRef, useState } from "react";
import {
  Link2,
  MessageSquare,
  Image,
  ScanLine,
  ShieldAlert,
  CheckCircle2,
  UploadCloud,
  X,
  RotateCcw,
} from "lucide-react";
import { analyzeMessage } from "../services/api";
import { useSettings } from "../context/SettingsContext";

const tabs = [
  {
    id: "message",
    label: "Message",
    icon: MessageSquare,
  },
  {
    id: "url",
    label: "URL",
    icon: Link2,
  },
  {
    id: "screenshot",
    label: "Screenshot",
    icon: Image,
  },
];

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Analyze() {
  const { settings } = useSettings();

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
    setValue("");
    setFile(null);
    setResult(null);
    setError("");
    setStatus("idle");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFile(candidate) {
    if (!candidate) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError("Please upload a PNG, JPG or WEBP image.");
      setFile(null);
      return;
    }

    if (candidate.size > MAX_FILE_BYTES) {
      setError(
        "That image is larger than 10MB. Try a smaller screenshot."
      );
      setFile(null);
      return;
    }

    setError("");
    setFile(candidate);
    setResult(null);
    setStatus("idle");
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0];

    handleFile(droppedFile);
  }

  async function submit(event) {
    event?.preventDefault();

    setError("");

    if (!settings.threatMonitoring) {
      setStatus("error");
      setError(
        "Threat monitoring is paused. Re-enable it in Profile & Protection before starting an analysis."
      );
      return;
    }

    if (type === "message" && !value.trim()) {
      setStatus("error");
      setError("Please enter a message to analyze.");
      return;
    }

    if (type === "url" && !value.trim()) {
      setStatus("error");
      setError("Please enter a URL to analyze.");
      return;
    }

    if (type === "screenshot" && !file) {
      setStatus("error");
      setError("Please upload a screenshot to analyze.");
      return;
    }

    setStatus("loading");
    setResult(null);

    try {
      const response = await analyzeMessage({
        message: value,
        type,
        file,
      });

      console.log("ANALYSIS UI RESPONSE:", response);

      const analysisResult =
        response?.data?.result ||
        response?.data?.data?.result ||
        response?.result ||
        null;

      if (!analysisResult) {
        throw new Error(
          "Analysis completed but no result was returned."
        );
      }

      setResult(analysisResult);
      setStatus("success");
    } catch (err) {
      console.error("ANALYSIS UI ERROR:", err);

      setError(
        err?.message ||
          "Unable to complete the analysis."
      );
      setStatus("error");
    }
  }

  async function retryAnalysis() {
    if (status === "loading") {
      return;
    }

    setError("");
    setResult(null);
    setStatus("loading");

    await submit();
  }

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            Threat analysis / 02
          </span>

          <h1>Analyze before you act.</h1>

          <p>
            Give ScamShield a suspicious signal and
            receive a security report.
          </p>
        </div>
      </div>

      <div className="analyze-grid">
        {/* INPUT PANEL */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                Input signal
              </span>

              <h3>What looks suspicious?</h3>
            </div>

            <ScanLine
              size={15}
              color="#50d2d8"
            />
          </div>

          <div
            className="input-tabs"
            role="tablist"
            aria-label="Analysis type"
          >
            {tabs.map(
              ({
                id,
                label,
                icon: Icon,
              }) => (
                <button
                  key={id}
                  className={
                    type === id ? "active" : ""
                  }
                  onClick={() =>
                    switchTab(id)
                  }
                  role="tab"
                  aria-selected={
                    type === id
                  }
                  type="button"
                  disabled={status === "loading"}
                >
                  <Icon size={13} />
                  {label}
                </button>
              )
            )}
          </div>

          <form
            className="analyze-form"
            onSubmit={submit}
          >
            <label htmlFor="analysis-input">
              {type === "message"
                ? "Paste the suspicious message"
                : type === "url"
                ? "Paste the suspicious URL"
                : "Screenshot input"}
            </label>

            {/* SCREENSHOT */}
            {type === "screenshot" && (
              <div
                className={`dropzone ${
                  dragActive
                    ? "drag-active"
                    : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() =>
                  setDragActive(false)
                }
                onDrop={onDrop}
              >
                <input
                  ref={fileInputRef}
                  id="analysis-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="visually-hidden"
                  onChange={(event) =>
                    handleFile(
                      event.target.files?.[0]
                    )
                  }
                />

                {file ? (
                  <>
                    <CheckCircle2
                      size={24}
                      color="#43cf8b"
                    />

                    <strong>
                      {file.name}
                    </strong>

                    <span>
                      {formatBytes(file.size)}
                      {" · "}
                      click to replace
                    </span>

                    <button
                      type="button"
                      className="dropzone-clear"
                      onClick={(event) => {
                        event.stopPropagation();

                        setFile(null);
                        setError("");
                        setResult(null);
                        setStatus("idle");

                        if (
                          fileInputRef.current
                        ) {
                          fileInputRef.current.value =
                            "";
                        }
                      }}
                      aria-label="Remove file"
                    >
                      <X size={12} />
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <UploadCloud size={24} />

                    <strong>
                      Drop a screenshot here,
                      or click to browse
                    </strong>

                    <span>
                      PNG, JPG or WEBP,
                      up to 10MB
                    </span>
                  </>
                )}
              </div>
            )}

            {/* URL */}
            {type === "url" && (
              <input
                id="analysis-input"
                type="url"
                inputMode="url"
                className="url-input"
                value={value}
                onChange={(event) =>
                  setValue(event.target.value)
                }
                placeholder="https://example.com/suspicious-link"
                disabled={status === "loading"}
              />
            )}

            {/* MESSAGE */}
            {type === "message" && (
              <textarea
                id="analysis-input"
                value={value}
                onChange={(event) =>
                  setValue(event.target.value)
                }
                placeholder="Paste the message, email or chat content here..."
                disabled={status === "loading"}
              />
            )}

            {error && (
              <div
                className="error-box"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              className="primary-btn analyze-btn"
              disabled={status === "loading"}
              type="submit"
            >
              {status === "loading" ? (
                <>
                  Scanning signal
                  <span className="loading-dots">
                    ...
                  </span>
                </>
              ) : (
                <>
                  Analyze signal
                  <ScanLine size={13} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* RESULT PANEL */}
        <section
          className="panel result-panel"
          aria-live="polite"
        >
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                Security report
              </span>

              <h3>Analysis result</h3>
            </div>

            {status === "success" ? (
              <CheckCircle2
                size={15}
                color="#43cf8b"
              />
            ) : (
              <ShieldAlert
                size={15}
                color="#65727f"
              />
            )}
          </div>

          {/* EMPTY */}
          {!result &&
            status !== "loading" &&
            status !== "error" && (
              <div className="empty-result">
                <ShieldAlert
                  size={34}
                  strokeWidth={1.2}
                />

                <h3>
                  No signal analyzed yet
                </h3>

                <p>
                  Submit something suspicious
                  and the result will appear
                  here with severity, red flags
                  and recommended actions.
                </p>
              </div>
            )}

          {/* LOADING */}
          {status === "loading" && (
            <div className="empty-result scanning">
              <ScanLine size={38} />

              <h3>
                Scanning signal...
              </h3>

              <p>
                Checking message patterns,
                suspicious behaviour and
                threat indicators.
              </p>

              <div className="scan-line" />
            </div>
          )}

          {/* ERROR + RETRY */}
          {status === "error" && (
            <div className="empty-result">
              <ShieldAlert
                size={38}
                strokeWidth={1.2}
              />

              <h3>
                Analysis failed
              </h3>

              <p>
                {error ||
                  "Unable to complete the analysis."}
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={retryAnalysis}
                disabled={status === "loading"}
              >
                Retry
                <RotateCcw size={13} />
              </button>
            </div>
          )}

          {/* RESULT */}
          {result && status === "success" && (
            <div>
              <span
                className={`risk-badge ${(
                  result.severity ||
                  "LOW"
                ).toLowerCase()}`}
              >
                {result.severity ||
                  "LOW"}
              </span>

              <div className="result-score">
                {result.riskScore ?? 0}
                <small>/100</small>
              </div>

              <div className="eyebrow">
                {result.scamType ||
                  result.classification ||
                  "Security signal"}

                {" · "}

                {Math.round(
                  (Number(
                    result.confidence
                  ) || 0) * 100
                )}
                % confidence
              </div>

              <h3>
                Threat assessment
              </h3>

              <p>
                {result.explanation ||
                  "The signal was analyzed successfully."}
              </p>

              {/* CLASSIFICATION */}
              {result.classification && (
                <div className="red-flags">
                  <strong>
                    Classification
                  </strong>

                  <span>
                    {result.classification}
                  </span>
                </div>
              )}

              {/* RED FLAGS */}
              <div className="red-flags">
                <strong>
                  Red flags
                </strong>

                {Array.isArray(
                  result.redFlags
                ) &&
                result.redFlags.length > 0 ? (
                  result.redFlags.map(
                    (flag, index) => (
                      <span
                        key={`${flag}-${index}`}
                      >
                        • {flag}
                      </span>
                    )
                  )
                ) : (
                  <span>
                    No specific red flags
                    reported.
                  </span>
                )}
              </div>

              {/* RECOMMENDED ACTIONS */}
              <div className="red-flags">
                <strong>
                  Recommended actions
                </strong>

                {Array.isArray(
                  result.recommendedActions
                ) &&
                result.recommendedActions
                  .length > 0 ? (
                  result.recommendedActions.map(
                    (action, index) => (
                      <span
                        key={`${action}-${index}`}
                      >
                        ✓ {action}
                      </span>
                    )
                  )
                ) : (
                  <span>
                    No specific actions
                    provided.
                  </span>
                )}
              </div>

              {/* ATTACK PATTERN */}
              {Array.isArray(
                result.attackPattern
              ) &&
                result.attackPattern.length >
                  0 && (
                  <div className="red-flags">
                    <strong>
                      Attack pattern
                    </strong>

                    {result.attackPattern.map(
                      (
                        pattern,
                        index
                      ) => (
                        <span
                          key={`${pattern}-${index}`}
                        >
                          • {pattern}
                        </span>
                      )
                    )}
                  </div>
                )}

              {/* RETRY */}
              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  className="primary-btn"
                  onClick={retryAnalysis}
                  disabled={
                    status === "loading"
                  }
                >
                  Analyze again
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}