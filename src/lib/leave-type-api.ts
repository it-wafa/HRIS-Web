import type {
  LeaveType,
  CreateLeaveTypePayload,
  UpdateLeaveTypePayload,
} from "@/types/leave";
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
// LEAVE TYPE CRUD API (§1.5)
// ══════════════════════════════════════════════════════════════════════════════

/** GET /leave-types — List all leave types */
export async function fetchLeaveTypes(token: string) {
  return bffCall<LeaveType[]>(token, "/leave-types");
}

/** GET /leave-types/:id — Get leave type by ID */
export async function fetchLeaveTypeById(token: string, id: number) {
  return bffCall<LeaveType>(token, `/leave-types/${id}`);
}

/** POST /leave-types — Create new leave type */
export async function createLeaveType(
  token: string,
  payload: CreateLeaveTypePayload,
) {
  return bffCall<LeaveType>(token, "/leave-types", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /leave-types/:id — Update leave type */
export async function updateLeaveType(
  token: string,
  id: number,
  payload: UpdateLeaveTypePayload,
) {
  return bffCall<LeaveType>(token, `/leave-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /leave-types/:id — Delete leave type (soft delete) */
export async function deleteLeaveType(token: string, id: number) {
  return bffCall<{ message: string }>(token, `/leave-types/${id}`, {
    method: "DELETE",
  });
}
