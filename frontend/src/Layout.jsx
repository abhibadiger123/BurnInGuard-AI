import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Moved navigation array outside the component to use it in useEffect without recreating it on every render
const navigation = [
  ["Home", "⌂", "/"],
  ["Dashboard", "📊", "/dashboard"],
  ["Components", "▣", "/components"],
  ["Live Monitoring", "◉", "/live"],
  ["AI Predictions", "✦", "/ai"],
  ["Alerts", "⚠", "/alerts"],
];

function Layout({ children, onLogout, isConnected, apiError }) {
  const location = useLocation();
  const [active, setActive] = useState("Home");

  // Automatically update the header title based on the current URL
  useEffect(() => {
    const currentRoute = navigation.find((nav) => nav[2] === location.pathname);
    if (currentRoute) {
      setActive(currentRoute[0]);
    }
  }, [location.pathname]);

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">B</div>
          <div>
            <h2>BurnInGuard</h2>
            <span>AI Intelligence</span>
          </div>
        </div>

        <nav>
          {navigation.map(([name, icon, path]) => (
            <Link
              key={name}
              to={path}
              className={location.pathname === path ? "nav-item active" : "nav-item"}
              onClick={() => setActive(name)}
              style={{ textDecoration: 'none' }}
            >
              <span>{icon}</span>
              {name}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className={isConnected ? "status-dot" : "status-dot offline"}></span>
            <div>
              <strong>
                {apiError
                  ? "Backend Error"
                  : isConnected
                  ? "Live System Online"
                  : "System Online"}
              </strong>
              <small>
                {apiError
                  ? "Check FastAPI"
                  : isConnected
                  ? "WebSocket connected"
                  : "FastAPI connected"}
              </small>
            </div>
          </div>
          <div className="prototype">
            Synthetic Burn-In Data
            <br />
            <span>For Hackathon Demonstration</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <div>
            <p className="eyebrow">AI-POWERED COMPONENT INTELLIGENCE</p>
            <h1>{active}</h1>
          </div>

          <div className="profile">
            <div className="notification">🔔</div>
            <div className="avatar">A</div>
            <div>
              <strong>Engineer</strong>
              <small>Admin</small>
            </div>
            <button
              className="logout-btn logout-button"
              onClick={onLogout}
              style={{ marginLeft: "1rem", width: "auto" }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* INJECT PAGE CONTENT HERE */}
        {children}
      </main>
    </div>
  );
}

export default Layout;