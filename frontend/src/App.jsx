import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Layout from "./Layout";
import Dashboard from "./Dashboard";

function getAuthenticatedUser() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    return null;
  }
}

function UserRoute({ children }) {
  const user = getAuthenticatedUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  const user = getAuthenticatedUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    window.location.href = "/login";
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <Layout onLogout={handleLogout}>
              <Dashboard />
            </Layout>
          </UserRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;