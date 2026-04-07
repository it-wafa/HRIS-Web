import type { AuditLog, AuditLogListParams } from "@/types/audit-log";
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
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

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

// ══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG API
// ══════════════════════════════════════════════════════════════════════════════

/** GET /audit-logs — List audit logs with optional filters */
export async function fetchAuditLogs(
  token: string,
  params?: AuditLogListParams,
) {
  const query = buildQueryString(params);
  return bffCall<AuditLog[]>(token, `/audit-logs${query}`);
}

/** GET /audit-logs — Fetch audit logs for a specific record */
export async function fetchAuditLogsByRecord(
  token: string,
  tableName: string,
  recordId: number,
) {
  return fetchAuditLogs(token, { table_name: tableName, record_id: recordId });
}

/** GET /audit-logs/:id — Get audit log by ID */
export async function fetchAuditLogById(token: string, id: number) {
  return bffCall<AuditLog>(token, `/audit-logs/${id}`);
}
