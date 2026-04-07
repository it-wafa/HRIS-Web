import type { AttendanceLog, AttendanceListParams } from "@/types/attendance";
import type {
  AttendanceOverride,
  CreateOverridePayload,
  UpdateOverrideStatusPayload,
  OverrideListParams,
} from "@/types/attendance-override";
import type { ApiResponse, ApiError } from "./api";
import { BFF_BASE_URL } from "./const";

/** Fetch wrapper targeting the BFF */
async function bffCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BFF_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
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

// ════════════════════════════════════════════
// ATTENDANCE LOG API
// ════════════════════════════════════════════

/** Build query string from params */
function buildQueryString<T extends object>(params?: T): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/** GET /attendance — List attendance logs */
export async function fetchAttendanceLogs(
  token: string,
  params?: AttendanceListParams,
) {
  const query = buildQueryString(params);
  return bffCall<AttendanceLog[]>(`/attendance${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /attendance/:id — Get attendance log by ID */
export async function fetchAttendanceLogById(token: string, id: number) {
  return bffCall<AttendanceLog>(`/attendance/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// ATTENDANCE OVERRIDE API
// ════════════════════════════════════════════

/** GET /attendance-overrides — List attendance overrides */
export async function fetchAttendanceOverrides(
  token: string,
  params?: OverrideListParams,
) {
  const query = buildQueryString(params);
  return bffCall<AttendanceOverride[]>(`/attendance-overrides${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /attendance-overrides/:id — Get override by ID */
export async function fetchAttendanceOverrideById(token: string, id: number) {
  return bffCall<AttendanceOverride>(`/attendance-overrides/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /attendance-overrides — Create attendance override request */
export async function createAttendanceOverride(
  token: string,
  payload: CreateOverridePayload,
) {
  return bffCall<AttendanceOverride>("/attendance-overrides", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /attendance-overrides/:id — Update override status (approve/reject) */
export async function updateOverrideStatus(
  token: string,
  id: number,
  payload: UpdateOverrideStatusPayload,
) {
  return bffCall<AttendanceOverride>(`/attendance-overrides/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
