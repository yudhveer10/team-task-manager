const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const buildHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (path, { method = "GET", body, token } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

export const authApi = {
  signup: (payload) => apiRequest("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),
  me: (token) => apiRequest("/auth/me", { token }),
};

export const projectApi = {
  list: (token) => apiRequest("/projects", { token }),
  create: (payload, token) => apiRequest("/projects", { method: "POST", body: payload, token }),
  detail: (projectId, token) => apiRequest(`/projects/${projectId}`, { token }),
  addMember: (projectId, payload, token) =>
    apiRequest(`/projects/${projectId}/members`, { method: "POST", body: payload, token }),
  updateMemberRole: (projectId, memberId, payload, token) =>
    apiRequest(`/projects/${projectId}/members/${memberId}`, { method: "PATCH", body: payload, token }),
  removeMember: (projectId, memberId, token) =>
    apiRequest(`/projects/${projectId}/members/${memberId}`, { method: "DELETE", token }),
};

export const taskApi = {
  list: (projectId, token) => apiRequest(`/projects/${projectId}/tasks`, { token }),
  create: (projectId, payload, token) =>
    apiRequest(`/projects/${projectId}/tasks`, { method: "POST", body: payload, token }),
  update: (projectId, taskId, payload, token) =>
    apiRequest(`/projects/${projectId}/tasks/${taskId}`, { method: "PATCH", body: payload, token }),
  delete: (projectId, taskId, token) =>
    apiRequest(`/projects/${projectId}/tasks/${taskId}`, { method: "DELETE", token }),
};

export const dashboardApi = {
  get: (token) => apiRequest("/dashboard", { token }),
};
