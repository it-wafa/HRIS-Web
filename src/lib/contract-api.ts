import type {
  EmploymentContract,
  CreateContractPayload,
  UpdateContractPayload,
} from "@/types/contract";
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
// CONTRACT API
// ════════════════════════════════════════════

/** GET /employees/:employeeId/contracts — List contracts for an employee */
export async function fetchContracts(token: string, employeeId: number) {
  return bffCall<EmploymentContract[]>(`/employees/${employeeId}/contracts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /employees/:employeeId/contracts — Create a new contract */
export async function createContract(
  token: string,
  employeeId: number,
  payload: CreateContractPayload,
) {
  return bffCall<EmploymentContract>(`/employees/${employeeId}/contracts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /contracts/:id — Update a contract */
export async function updateContract(
  token: string,
  id: number,
  payload: UpdateContractPayload,
) {
  return bffCall<EmploymentContract>(`/contracts/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /contracts/:id — Delete a contract */
export async function deleteContract(token: string, id: number) {
  return bffCall<{ message: string }>(`/contracts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
