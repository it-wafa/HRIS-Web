import type {
  JobPosition,
  CreatePositionPayload,
  UpdatePositionPayload,
} from "@/types/job-position";
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
// POSITION API
// ════════════════════════════════════════════

/** GET /positions — List all job positions */
export async function fetchPositions(token: string) {
  return bffCall<JobPosition[]>("/positions", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /positions — Create a new job position */
export async function createPosition(
  token: string,
  payload: CreatePositionPayload,
) {
  return bffCall<JobPosition>("/positions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /positions/:id — Update a job position */
export async function updatePosition(
  token: string,
  id: number,
  payload: UpdatePositionPayload,
) {
  return bffCall<JobPosition>(`/positions/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /positions/:id — Delete a job position */
export async function deletePosition(token: string, id: number) {
  return bffCall<{ message: string }>(`/positions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
