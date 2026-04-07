import type {
  BusinessTripRequest,
  CreateBusinessTripPayload,
  UpdateBusinessTripStatusPayload,
  BusinessTripListParams,
} from "@/types/business-trip";
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
// BUSINESS TRIP API
// ════════════════════════════════════════════

/** GET /business-trips — List business trip requests */
export async function fetchBusinessTrips(
  token: string,
  params?: BusinessTripListParams,
) {
  const query = buildQueryString(params);
  return bffCall<BusinessTripRequest[]>(`/business-trips${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /business-trips/:id — Get business trip by ID */
export async function fetchBusinessTripById(token: string, id: number) {
  return bffCall<BusinessTripRequest>(`/business-trips/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /business-trips — Create a new business trip request */
export async function createBusinessTrip(
  token: string,
  payload: CreateBusinessTripPayload,
) {
  return bffCall<BusinessTripRequest>("/business-trips", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /business-trips/:id — Update business trip status (approve/reject) */
export async function updateBusinessTripStatus(
  token: string,
  id: number,
  payload: UpdateBusinessTripStatusPayload,
) {
  return bffCall<BusinessTripRequest>(`/business-trips/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /business-trips/:id — Delete a business trip request */
export async function deleteBusinessTrip(token: string, id: number) {
  return bffCall<null>(`/business-trips/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
