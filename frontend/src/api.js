const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
    }

    let message = `Request failed with status ${response.status}`;

    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        message = data.detail
          .map((item) => item.msg)
          .join(", ");
      } else {
        message = data.detail;
      }
    }

    throw new Error(message);
  }

  return data;
}


export async function login(email, password) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    }
  );

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    let message = "Login failed";

    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        message = data.detail
          .map((item) => item.msg)
          .join(", ");
      } else {
        message = data.detail;
      }
    }

    throw new Error(message);
  }

  return data;
}


export async function register(name, email, password) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    }
  );

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    let message = "Registration failed";

    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        message = data.detail
          .map((item) => item.msg)
          .join(", ");
      } else {
        message = data.detail;
      }
    }

    throw new Error(message);
  }

  return data;
}


export function getMe() {
  return request("/api/auth/me");
}


export function getComponents() {
  return request("/api/components");
}


export function getComponent(componentId) {
  return request(`/api/components/${componentId}`);
}


export function getAnomaly(componentId) {
  return request(`/api/ai/anomaly/${componentId}`);
}


export function getDrift(componentId) {
  return request(`/api/ai/drift/${componentId}`);
}


export function getReadings(componentId) {
  return request(`/api/readings/${componentId}`);
}


export function getHealth() {
  return request("/health/database");
}