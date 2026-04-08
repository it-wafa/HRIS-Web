import type {
  Employee,
  EmployeeContact,
  EmployeeListParams,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  CreateContactPayload,
  UpdateContactPayload,
} from "@/types/employee";
import type { ApiResponse, ApiError } from "./api";
import { API_URL } from "./const";

/** Fetch wrapper targeting the API */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
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
// EMPLOYEE API
// ════════════════════════════════════════════

/** GET /employees — List all employees with optional filters */
export async function fetchEmployees(
  token: string,
  params?: EmployeeListParams,
) {
  const query = new URLSearchParams();
  if (params?.branch_id) query.set("branch_id", params.branch_id.toString());
  if (params?.is_active !== undefined)
    query.set("is_active", params.is_active.toString());
  if (params?.search) query.set("search", params.search);

  const queryString = query.toString();
  const endpoint = queryString ? `/employees?${queryString}` : "/employees";

  return apiCall<Employee[]>(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /employees/:id — Get employee by ID */
export async function fetchEmployeeById(token: string, id: number) {
  return apiCall<Employee>(`/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /employees — Create a new employee */
export async function createEmployee(
  token: string,
  payload: CreateEmployeePayload,
) {
  return apiCall<Employee>("/employees", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /employees/:id — Update an employee */
export async function updateEmployee(
  token: string,
  id: number,
  payload: UpdateEmployeePayload,
) {
  return apiCall<Employee>(`/employees/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /employees/:id — Delete an employee */
export async function deleteEmployee(token: string, id: number) {
  return apiCall<{ message: string }>(`/employees/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// EMPLOYEE CONTACT API
// ════════════════════════════════════════════

/** GET /employees/:employeeId/contacts — List contacts for an employee */
export async function fetchEmployeeContacts(token: string, employeeId: number) {
  return apiCall<EmployeeContact[]>(`/employees/${employeeId}/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /employees/:employeeId/contacts — Create a new contact */
export async function createEmployeeContact(
  token: string,
  employeeId: number,
  payload: CreateContactPayload,
) {
  return apiCall<EmployeeContact>(`/employees/${employeeId}/contacts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /employee-contacts/:id — Update a contact */
export async function updateEmployeeContact(
  token: string,
  contactId: number,
  payload: UpdateContactPayload,
) {
  return apiCall<EmployeeContact>(`/employee-contacts/${contactId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /employee-contacts/:id — Delete a contact */
export async function deleteEmployeeContact(token: string, contactId: number) {
  return apiCall<{ message: string }>(`/employee-contacts/${contactId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// EMPLOYEE PASSWORD RESET API
// ════════════════════════════════════════════

export interface ResetPasswordPayload {
  new_password: string;
  confirm_password: string;
}

/** PATCH /employees/:id/reset-password — Reset password for an employee (admin only) */
export async function resetEmployeePassword(
  token: string,
  employeeId: number,
  payload: ResetPasswordPayload,
) {
  return apiCall<{ message: string }>(
    `/employees/${employeeId}/reset-password`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    },
  );
}
