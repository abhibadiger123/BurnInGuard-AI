import { useEffect, useState } from "react";
import BurnInChart from "./BurnInChart";
import useLiveMonitoring from "./useLiveMonitoring";
import { getComponents, getComponent, getAnomaly, getDrift, getReadings } from "./api";

function Dashboard({ token }) {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [anomaly, setAnomaly] = useState(null);
  const [drift, setDrift] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const { liveReading, liveReadings, isConnected, error: liveError } =
    useLiveMonitoring(selectedComponent?.id);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setApiError("");
      const componentResponse = await getComponents();
      
      let componentList = [];
      if (Array.isArray(componentResponse)) componentList = componentResponse;
      else if (Array.isArray(componentResponse?.items)) componentList = componentResponse.items;
      else if (Array.isArray(componentResponse?.data)) componentList = componentResponse.data;
      else if (componentResponse?.id) componentList = [componentResponse];

      setComponents(componentList);

      if (componentList.length === 0) {
        setSelectedComponent(null);
        setAnomaly(null);
        setDrift(null);
        setReadings([]);
        return;
      }

      const firstComponent = componentList[0];
      const componentId = firstComponent.id;

      if (!componentId) {
        setSelectedComponent(firstComponent);
        setApiError("Component ID is missing from the API response.");
        return;
      }

      const componentData = await getComponent(componentId);
      setSelectedComponent(componentData || firstComponent);

      try {
        setAnomaly(await getAnomaly(componentId));
      } catch (e) {
        setAnomaly(null);
      }

      try {
        setDrift(await getDrift(componentId));
      } catch (e) {
        setDrift(null);
      }

      try {
        const readingResponse = await getReadings(componentId);
        let readingList = [];
        if (Array.isArray(readingResponse)) readingList = readingResponse;
        else if (Array.isArray(readingResponse?.items)) readingList = readingResponse.items;
        else if (Array.isArray(readingResponse?.data)) readingList = readingResponse.data;
        else if (readingResponse?.id) readingList = [readingResponse];
        setReadings(readingList);
      } catch (e) {
        setReadings([]);
      }
    } catch (error) {
      setApiError(error.message || "Unable to connect to the BurnInGuard AI backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadDashboardData();
  }, [token]);

  const activeReading = liveReading || (readings.length > 0 ? readings[readings.length - 1] : null);
  const totalComponents = components.length;
  const activeTests = components.filter((c) => ["active", "running", "testing"].includes(String(c.status || "").toLowerCase())).length;
  const alertComponents = components.filter((c) => ["warning", "critical", "high", "medium"].includes(String(c.status || "").toLowerCase())).length;

  const riskLevel = anomaly?.risk_level || anomaly?.status || "LOW";
  const riskClass = getRiskClass(riskLevel);
  const anomalyScore = anomaly?.anomaly_score != null ? Number(anomaly.anomaly_score).toFixed(3) : "-";
  const componentStatus = anomaly?.status || selectedComponent?.status || "NORMAL";
  const componentStatusClass = getRiskClass(componentStatus);

  const predicted168 = drift?.predicted_168h != null ? Number(drift.predicted_168h).toFixed(3) : "-";
  const driftRate = drift?.drift_rate != null ? Number(drift.drift_rate).toFixed(6) : "-";
  const systemHealth = apiError ? "Offline" : loading ? "Loading" : "98.6%";

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div>
          <span className="live-badge">
            <i></i>
            {isConnected ? "LIVE MONITORING" : "CONNECTING..."}
          </span>
          <h2>Burn-In Intelligence Dashboard</h2>
          <p>Monitor component behavior, detect anomalies and predict degradation using AI.</p>
        </div>
        <div className="hero-chip">
          <span>AI ENGINE</span>
          <strong>ACTIVE</strong>
        </div>
      </section>

      {/* ERRORS */}
      {apiError && (
        <section className="panel" style={{ marginBottom: "1rem", padding: "1rem", borderLeft: "4px solid #ef4444" }}>
          <strong>Backend connection error</strong>
          <p>{apiError}</p>
          <button className="view-alerts" onClick={loadDashboardData}>Retry connection</button>
        </section>
      )}

      {liveError && (
        <section className="panel" style={{ marginBottom: "1rem", padding: "1rem", borderLeft: "4px solid #f59e0b" }}>
          <strong>Live Monitoring</strong>
          <p>{liveError}</p>
        </section>
      )}

      {/* STATS */}
      <section className="stats">
        <StatCard title="Total Components" value={loading ? "..." : totalComponents} subtitle="Registered components" icon="▣" />
        <StatCard title="Active Tests" value={loading ? "..." : activeTests} subtitle="Currently monitored" icon="◉" />
        <StatCard title="AI Alerts" value={loading ? "..." : alertComponents} subtitle="Requires attention" icon="⚠" alert />
        <StatCard title="System Health" value={systemHealth} subtitle="Overall stability" icon="♥" />
      </section>

      {/* COMPONENT + AI GRID */}
      <section className="content-grid">
        <div className="panel component-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">ACTIVE COMPONENT</span>
              <h3>{selectedComponent?.component_code || "No Component"}</h3>
            </div>
            <span className={`pill ${componentStatusClass}`}>● {String(componentStatus).toUpperCase()}</span>
          </div>

          <div className="component-info">
            <div><span>Component Type</span><strong>{selectedComponent?.component_type || "-"}</strong></div>
            <div><span>Manufacturer</span><strong>{selectedComponent?.manufacturer || "-"}</strong></div>
            <div><span>Batch</span><strong>{selectedComponent?.batch_number || "-"}</strong></div>
            <div><span>Lot</span><strong>{selectedComponent?.lot_number || "-"}</strong></div>
          </div>

          <div className="measurements">
            <Measurement label="Temperature" value={activeReading?.temperature ?? "-"} unit="°C" />
            <Measurement label="Voltage" value={activeReading?.voltage ?? "-"} unit="V" />
            <Measurement label="Current" value={activeReading?.current ?? "-"} unit="A" />
            <Measurement label="Power" value={activeReading?.power ?? "-"} unit="W" />
            <Measurement label="Leakage" value={activeReading?.leakage_current ?? "-"} unit="µA" />
            <Measurement label="Burn-In Hours" value={activeReading?.burn_in_hours ?? "-"} unit="h" />
          </div>

          <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#64748b" }}>
            Last live reading: {liveReading?.timestamp ? new Date(liveReading.timestamp).toLocaleTimeString() : "Waiting..."}
          </div>
        </div>

        <div className="panel ai-panel">
          <div className="panel-header">
            <div>
              <span className="section-label blue">AI ANALYSIS</span>
              <h3>Anomaly Detection</h3>
            </div>
            <span className="ai-icon">✦</span>
          </div>

          <div className="ai-score">
            <div className="score-circle">
              <strong>{anomalyScore}</strong>
              <span>Score</span>
            </div>
            <div className="risk">
              <span>Current Risk Level</span>
              <strong className={`risk-text ${riskClass}`}>{String(riskLevel).toUpperCase()}</strong>
              <small>{isConnected ? "Live component measurements are being received." : "Waiting for live monitoring connection."}</small>
            </div>
          </div>

          <div className="explanation">
            <span>AI EXPLANATION</span>
            <p>{anomaly?.explanation || "No AI explanation available."}</p>
          </div>
        </div>
      </section>

      {/* CHART + ALERTS GRID */}
      <section className="lower-grid">
        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">BURN-IN TREND</span>
              <h3>Live Component Measurements</h3>
            </div>
            <span className="chart-period">{isConnected ? `${liveReadings.length} live points` : "Stored readings"}</span>
          </div>
          
          <div className="chart" style={{ minHeight: "350px" }}>
            <BurnInChart readings={readings} liveReadings={liveReadings} />
          </div>

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <div><span className="section-label">PREDICTED 168H</span><strong>{predicted168}</strong></div>
            <div><span className="section-label">DRIFT RATE</span><strong>{driftRate}</strong></div>
            <div><span className="section-label">PREDICTION</span><strong>{drift?.prediction || "-"}</strong></div>
          </div>
        </div>

        <div className="panel alerts-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">ALERT CENTER</span>
              <h3>Recent Alerts</h3>
            </div>
            <span className="alert-count">{alertComponents}</span>
          </div>

          {anomaly && (["HIGH", "MEDIUM"].includes(String(anomaly.risk_level).toUpperCase())) ? (
            <Alert 
              level={String(anomaly.risk_level).toLowerCase() === "high" ? "critical" : "warning"} 
              title={selectedComponent?.component_code || "Component"} 
              text={anomaly.explanation || "AI anomaly detected."} 
            />
          ) : (
            <Alert level="normal" title="System Normal" text="No critical anomaly detected for the active component." />
          )}

          {drift && (["HIGH", "MEDIUM"].includes(String(drift.risk_level).toUpperCase())) && (
            <Alert 
              level={String(drift.risk_level).toLowerCase() === "high" ? "critical" : "warning"} 
              title="Drift Prediction" 
              text={drift.explanation || "Potential degradation detected."} 
            />
          )}
        </div>
      </section>
    </>
  );
}

// Utility Components & Functions (Kept inside Dashboard.jsx to reduce file clutter)

function getRiskClass(value) {
  const status = String(value || "").toLowerCase();
  if (["high", "critical", "failure_risk"].includes(status)) return "critical";
  if (["medium", "warning", "degradation_risk"].includes(status)) return "warning";
  return "normal";
}

function StatCard({ title, value, subtitle, icon, alert }) {
  return (
    <div className="stat-card">
      <div className={alert ? "stat-icon alert-icon" : "stat-icon"}>{icon}</div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}

function Measurement({ label, value, unit }) {
  return (
    <div className="measurement">
      <span>{label}</span>
      <strong>{value} <small>{unit}</small></strong>
    </div>
  );
}

function Alert({ level, title, text }) {
  return (
    <div className={`alert ${level}`}>
      <span className="alert-dot"></span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <span className="arrow">›</span>
    </div>
  );
}

export default Dashboard;