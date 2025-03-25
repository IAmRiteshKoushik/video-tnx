const EDUCATOR_EMAIL = "riteshkoushik39@gmail.com";
const EDUCATOR_PASSWORD = "password123";

// Check if running in browser environment
const isBrowser = typeof window !== "undefined";

export async function login(email: string, password: string): Promise<boolean> {
  // Simple validation
  if (email === EDUCATOR_EMAIL && password === EDUCATOR_PASSWORD) {
    // Set auth token in localStorage
    if (isBrowser) {
      localStorage.setItem("auth_token", "educator_session_token");
      localStorage.setItem("user_role", "educator");
    }
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  if (isBrowser) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
  }
}

export async function checkAuth(): Promise<boolean> {
  if (!isBrowser) return false;

  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("user_role");

  return token === "educator_session_token" && role === "educator";
}
