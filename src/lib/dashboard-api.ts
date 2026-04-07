import type {
  EmployeeDashboardData,
  HRDDashboardData,
  ClockInPayload,
  ClockOutPayload,
} from "@/types/dashboard";
import type { AttendanceLog } from "@/types/attendance";
import type { ApiResponse, ApiError } from "./api";
import { BFF_BASE_URL } from "./const";

// ══════════════════════════════════════════════════════════════════════════════
// BFF CALL WRAPPER
// ══════════════════════════════════════════════════════════════════════════════

async function bffCall<T>(
  token: string,
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BFF_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD API
// ══════════════════════════════════════════════════════════════════════════════

/** GET /dashboard/employee — Employee dashboard data */
export async function fetchEmployeeDashboard(token: string) {
  return bffCall<EmployeeDashboardData>(token, "/dashboard/employee");
}

/** GET /dashboard/hrd — HRD/Supervisor dashboard data */
export async function fetchHRDDashboard(token: string) {
  return bffCall<HRDDashboardData>(token, "/dashboard/hrd");
}

// ══════════════════════════════════════════════════════════════════════════════
// CLOCK IN / CLOCK OUT API
// ══════════════════════════════════════════════════════════════════════════════

/** POST /attendance/clock-in — Clock in for today */
export async function clockIn(token: string, payload?: ClockInPayload) {
  return bffCall<AttendanceLog>(token, "/attendance/clock-in", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

/** POST /attendance/clock-out — Clock out for today */
export async function clockOut(token: string, payload?: ClockOutPayload) {
  return bffCall<AttendanceLog>(token, "/attendance/clock-out", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}
