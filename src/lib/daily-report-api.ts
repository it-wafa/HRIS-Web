import type {
  DailyReport,
  CreateDailyReportPayload,
  UpdateDailyReportPayload,
  DailyReportListParams,
} from "@/types/daily-report";
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
// DAILY REPORT API
// ════════════════════════════════════════════

/** GET /daily-reports — List daily reports */
export async function fetchDailyReports(
  token: string,
  params?: DailyReportListParams,
) {
  const query = buildQueryString(params);
  return bffCall<DailyReport[]>(`/daily-reports${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /daily-reports/:id — Get daily report by ID */
export async function fetchDailyReportById(token: string, id: number) {
  return bffCall<DailyReport>(`/daily-reports/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /daily-reports — Create a new daily report */
export async function createDailyReport(
  token: string,
  payload: CreateDailyReportPayload,
) {
  return bffCall<DailyReport>("/daily-reports", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /daily-reports/:id — Update a daily report */
export async function updateDailyReport(
  token: string,
  id: number,
  payload: UpdateDailyReportPayload,
) {
  return bffCall<DailyReport>(`/daily-reports/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
