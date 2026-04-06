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

  return bffCall<Employee[]>(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /employees/:id — Get employee by ID */
export async function fetchEmployeeById(token: string, id: number) {
  return bffCall<Employee>(`/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /employees — Create a new employee */
export async function createEmployee(
  token: string,
  payload: CreateEmployeePayload,
) {
  return bffCall<Employee>("/employees", {
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
  return bffCall<Employee>(`/employees/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /employees/:id — Delete an employee */
export async function deleteEmployee(token: string, id: number) {
  return bffCall<{ message: string }>(`/employees/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// EMPLOYEE CONTACT API
// ════════════════════════════════════════════

/** GET /employees/:employeeId/contacts — List contacts for an employee */
export async function fetchEmployeeContacts(token: string, employeeId: number) {
  return bffCall<EmployeeContact[]>(`/employees/${employeeId}/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /employees/:employeeId/contacts — Create a new contact */
export async function createEmployeeContact(
  token: string,
  employeeId: number,
  payload: CreateContactPayload,
) {
  return bffCall<EmployeeContact>(`/employees/${employeeId}/contacts`, {
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
  return bffCall<EmployeeContact>(`/employee-contacts/${contactId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /employee-contacts/:id — Delete a contact */
export async function deleteEmployeeContact(token: string, contactId: number) {
  return bffCall<{ message: string }>(`/employee-contacts/${contactId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
