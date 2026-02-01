// ================= API CONFIG =================
const API_BASE = "https://task-manager-backend-production-6f8f.up.railway.app/api";

// === ENDPOINT ===
const API_TASK = `${API_BASE}/task`;
const API_LOGIN = `${API_BASE}/login`;
const API_REGISTER = `${API_BASE}/register`; 

// ================= JWT HELPERS =================
const TOKEN_KEY = "token";

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ================= AUTH GUARD =================
function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// ================= AUTH FETCH =================
async function authFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    alert("Sesi habis. Silakan login ulang.");
    window.location.href = "login.html";
    throw new Error("Unauthorized");
  }

  return res;
}
