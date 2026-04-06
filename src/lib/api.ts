import { AUTH_BASE_URL } from "./const";

// ============================================
// TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiError {
  statusCode: number;
  message: string;
}

// ============================================
// API CALL WRAPPER
// ============================================

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", // cross-domain cookie support
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === false) {
    const error: ApiError = {
      statusCode: data.statusCode || response.status,
      message: data.message || "Something went wrong",
    };
    throw error;
  }

  return data as ApiResponse<T>;
}

// ============================================
// AUTH API
// ============================================

/** POST /auth/login */
export async function loginApi(email: string, password: string) {
  return apiCall<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** POST /auth/logout */
export async function logoutApi() {
  return apiCall<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}
