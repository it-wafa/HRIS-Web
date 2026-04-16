import type {
  EmployeeDashboardData,
  HRDDashboardData,
  ClockInPayload,
  ClockOutPayload,
} from "@/types/dashboard";
import type { AttendanceLog } from "@/types/attendance";
import { apiCall } from "@/lib/api";
// DASHBOARD API
// ══════════════════════════════════════════════════════════════════════════════

/** GET /dashboard/employee — Employee dashboard data */
export async function fetchEmployeeDashboard() {
  return apiCall<EmployeeDashboardData>("/dashboard/employee");
}

/** GET /dashboard/hrd — HRD/Supervisor dashboard data */
export async function fetchHRDDashboard() {
  return apiCall<HRDDashboardData>("/dashboard/hrd");
}

// ══════════════════════════════════════════════════════════════════════════════
// CLOCK IN / CLOCK OUT API
// ══════════════════════════════════════════════════════════════════════════════

/** POST /attendance/clock-in — Clock in for today */
export async function clockIn(payload?: ClockInPayload) {
  return apiCall<AttendanceLog>("/attendance/clock-in", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

/** POST /attendance/clock-out — Clock out for today */
export async function clockOut(payload?: ClockOutPayload) {
  return apiCall<AttendanceLog>("/attendance/clock-out", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}
