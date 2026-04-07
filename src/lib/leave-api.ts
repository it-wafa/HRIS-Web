import type {
  LeaveType,
  LeaveBalance,
  LeaveRequest,
  CreateLeavePayload,
  ApproveLeavePayload,
  RejectLeavePayload,
  LeaveListParams,
  LeaveBalanceListParams,
} from "@/types/leave";
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

// ════════════════════════════════════════════
// LEAVE TYPE API
// ════════════════════════════════════════════

/** GET /leave-types — List all leave types */
export async function fetchLeaveTypes(token: string) {
  return bffCall<LeaveType[]>("/leave-types", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /leave-types/:id — Get leave type by ID */
export async function fetchLeaveTypeById(token: string, id: number) {
  return bffCall<LeaveType>(`/leave-types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// LEAVE BALANCE API
// ════════════════════════════════════════════

/** GET /leave-balances — List leave balances */
export async function fetchLeaveBalances(
  token: string,
  params?: LeaveBalanceListParams,
) {
  const query = buildQueryString(params);
  return bffCall<LeaveBalance[]>(`/leave-balances${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// LEAVE REQUEST API
// ════════════════════════════════════════════

/** GET /leave-requests — List leave requests */
export async function fetchLeaveRequests(
  token: string,
  params?: LeaveListParams,
) {
  const query = buildQueryString(params);
  return bffCall<LeaveRequest[]>(`/leave-requests${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /leave-requests/:id — Get leave request by ID */
export async function fetchLeaveRequestById(token: string, id: number) {
  return bffCall<LeaveRequest>(`/leave-requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /leave-requests — Create a new leave request */
export async function createLeaveRequest(
  token: string,
  payload: CreateLeavePayload,
) {
  return bffCall<LeaveRequest>("/leave-requests", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /leave-requests/:id/approve — Approve leave request */
export async function approveLeaveRequest(
  token: string,
  id: number,
  payload?: ApproveLeavePayload,
) {
  return bffCall<LeaveRequest>(`/leave-requests/${id}/approve`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload || {}),
  });
}

/** PUT /leave-requests/:id/reject — Reject leave request */
export async function rejectLeaveRequest(
  token: string,
  id: number,
  payload: RejectLeavePayload,
) {
  return bffCall<LeaveRequest>(`/leave-requests/${id}/reject`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
