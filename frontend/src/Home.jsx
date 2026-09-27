import { Link } from "react-router-dom";

function Home() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="landing-page">

      <header className="landing-navbar">
        <Link
          to="/"
          className="landing-brand"
        >
          <div className="landing-logo">
            B
          </div>

          <div>
            <strong>
              BurnInGuard <span>AI</span>
            </strong>

            <small>
              Team Brain Box
            </small>
          </div>
        </Link>

        <nav className="landing-nav">
          <Link
            to="/"
            className="landing-nav-active"
          >
            Home
          </Link>

          <a href="#capabilities">
            Capabilities
          </a>

          <a href="#workflow">
            How It Works
          </a>

          <a href="#about">
            About
          </a>
        </nav>

        <div className="landing-actions">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="landing-login-link"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="landing-login-link"
            >
              Login
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              to="/register"
              className="landing-register-button"
            >
              Get Started
            </Link>
          )}
        </div>
      </header>

      <main>

        <section className="landing-hero">

          <div className="landing-grid-background"></div>

          <div className="landing-glow landing-glow-one"></div>
          <div className="landing-glow landing-glow-two"></div>

          <div className="landing-hero-content">

            <div className="landing-status">
              <span></span>
              AI BURN-IN INTELLIGENCE SYSTEM
            </div>

            <h1>
              Detect Component
              <br />
              <span>Failure Before It Happens.</span>
            </h1>

            <p>
              BurnInGuard AI analyzes electronic component
              burn-in measurements, detects abnormal behavior,
              predicts degradation and provides explainable
              AI-driven risk intelligence.
            </p>

            <div className="landing-hero-actions">

              <Link
                to={isLoggedIn ? "/dashboard" : "/login"}
                className="landing-primary-button"
              >
                {isLoggedIn
                  ? "Open Dashboard"
                  : "Explore BurnInGuard AI"}
                <span>→</span>
              </Link>

              <a
                href="#workflow"
                className="landing-secondary-button"
              >
                See How It Works
              </a>

            </div>

            <div className="landing-trust-row">

              <div>
                <span className="trust-dot"></span>
                <strong>AI ENGINE</strong>
                <small>ACTIVE</small>
              </div>

              <div>
                <span className="trust-dot"></span>
                <strong>ANOMALY</strong>
                <small>DETECTION</small>
              </div>

              <div>
                <span className="trust-dot"></span>
                <strong>DRIFT</strong>
                <small>PREDICTION</small>
              </div>

            </div>

          </div>

          <div className="landing-hero-visual">

            <div className="system-card">

              <div className="system-card-header">
                <div>
                  <span>
                    BURN-IN ANALYSIS
                  </span>

                  <strong>
                    Component Intelligence
                  </strong>
                </div>

                <div className="system-live">
                  <span></span>
                  LIVE
                </div>
              </div>

              <div className="component-visual">

                <div className="chip-orbit orbit-one"></div>
                <div className="chip-orbit orbit-two"></div>

                <div className="chip-core">
                  <span>BG</span>
                  <small>AI</small>
                </div>

              </div>

              <div className="system-measurements">

                <div>
                  <span>Temperature</span>
                  <strong>72.4°C</strong>
                  <small>STABLE</small>
                </div>

                <div>
                  <span>Voltage</span>
                  <strong>5.00 V</strong>
                  <small>NORMAL</small>
                </div>

                <div>
                  <span>Current</span>
                  <strong>2.10 A</strong>
                  <small>NORMAL</small>
                </div>

                <div>
                  <span>Leakage</span>
                  <strong>10.0 µA</strong>
                  <small>MONITORED</small>
                </div>

              </div>

              <div className="system-ai-result">

                <div className="ai-result-icon">
                  ✦
                </div>

                <div>
                  <span>AI RISK ANALYSIS</span>
                  <strong>LOW RISK</strong>
                </div>

                <div className="ai-score-value">
                  0.138
                </div>

              </div>

            </div>

          </div>

        </section>

        <section
          className="landing-stats"
          id="about"
        >

          <div>
            <strong>01</strong>
            <span>Component Monitoring</span>
          </div>

          <div>
            <strong>02</strong>
            <span>AI Anomaly Detection</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Time-Series Drift Prediction</span>
          </div>

          <div>
            <strong>04</strong>
            <span>Explainable Risk Intelligence</span>
          </div>

        </section>

        <section
          className="landing-section"
          id="capabilities"
        >

          <div className="landing-section-heading">

            <span>
              CORE CAPABILITIES
            </span>

            <h2>
              Intelligence for Every
              <br />
              Stage of Burn-In Testing.
            </h2>

            <p>
              BurnInGuard AI combines component telemetry,
              anomaly detection and predictive analysis
              into a single monitoring workflow.
            </p>

          </div>

          <div className="landing-capabilities">

            <CapabilityCard
              number="01"
              icon="◈"
              title="Dynamic Anomaly Detection"
              text="Identify abnormal component behavior relative to observed burn-in baselines instead of relying only on fixed threshold limits."
            />

            <CapabilityCard
              number="02"
              icon="↗"
              title="Drift Prediction"
              text="Analyze early measurement changes and estimate future component behavior to identify potential degradation trends."
            />

            <CapabilityCard
              number="03"
              icon="◉"
              title="Live Monitoring"
              text="Receive continuously updating sensor-like burn-in measurements through the real-time monitoring interface."
            />

            <CapabilityCard
              number="04"
              icon="✦"
              title="Explainable AI"
              text="Convert AI analysis into understandable risk levels and explanations so engineers can investigate flagged components."
            />

          </div>

        </section>

        <section
          className="landing-workflow"
          id="workflow"
        >

          <div className="landing-section-heading centered">

            <span>
              SYSTEM WORKFLOW
            </span>

            <h2>
              From Component Data
              <br />
              to AI Risk Intelligence.
            </h2>

          </div>

          <div className="workflow-line">

            <WorkflowStep
              number="01"
              title="Component"
              text="Register component, manufacturer, batch and lot information."
            />

            <WorkflowStep
              number="02"
              title="Burn-In Data"
              text="Collect temperature, voltage, current, power and leakage measurements."
            />

            <WorkflowStep
              number="03"
              title="AI Analysis"
              text="Detect anomalies and analyze measurement drift."
            />

            <WorkflowStep
              number="04"
              title="Risk Result"
              text="Generate risk level, prediction and explanation."
            />

          </div>

        </section>

        <section className="landing-demo-banner">

          <div>

            <span className="landing-demo-label">
              HACKATHON PROTOTYPE
            </span>

            <h2>
              Built to demonstrate
              predictive burn-in intelligence.
            </h2>

            <p>
              This prototype uses synthetic burn-in measurements
              for demonstration and evaluation purposes.
            </p>

          </div>

          <div className="landing-demo-badge">
            <span>
              Synthetic Burn-In Data
            </span>

            <strong>
              For Hackathon Demonstration
            </strong>
          </div>

        </section>

      </main>

      <footer className="landing-footer">

        <div>
          <strong>
            BurnInGuard <span>AI</span>
          </strong>

          <p>
            Explainable Predictive Intelligence
            for Electronic Component Burn-In
          </p>
        </div>

        <div>
          <span>
            SIH26170
          </span>

          <small>
            Team Brain Box
          </small>
        </div>

      </footer>

    </div>
  );
}

function CapabilityCard({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="landing-capability-card">

      <div className="capability-top">
        <span>
          {number}
        </span>

        <div className="capability-icon">
          {icon}
        </div>
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

      <div className="capability-arrow">
        →
      </div>

    </div>
  );
}

function WorkflowStep({
  number,
  title,
  text,
}) {
  return (
    <div className="workflow-step">

      <div className="workflow-number">
        {number}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}

export default Home;