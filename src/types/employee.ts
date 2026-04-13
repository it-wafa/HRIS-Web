// ════════════════════════════════════════════
// EMPLOYEE TYPES
// ════════════════════════════════════════════

export type Gender = "male" | "female" | "other";
export type MaritalStatus = "single" | "married" | "widowed" | "divorced";
export type ContactType = "phone" | "email" | "address";

export interface Employee {
  id: number;
  employee_number: string;
  full_name: string;
  nik: string | null;
  npwp: string | null;
  kk_number: string | null;
  birth_date: string;
  birth_place: string | null;
  gender: Gender;
  religion: string | null;
  marital_status: MaritalStatus | null;
  blood_type: string | null;
  nationality: string | null;

  photo_url: string | null;
  is_active: boolean;
  is_trainer: boolean;
  branch_id: number | null;
  department_id: number | null;
  role_id: number | null;
  job_positions_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined fields for display
  branch_name?: string;
  department_name?: string;
  role_name?: string;
  job_position_title?: string;
}

export interface EmployeeContact {
  id: number;
  employee_id: number;
  contact_type: ContactType;
  contact_value: string;
  contact_label: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateEmployeePayload {
  employee_number: string;
  full_name: string;
  nik?: string;
  npwp?: string;
  kk_number?: string;
  birth_date: string;
  birth_place?: string;
  gender: Gender;
  religion?: string;
  marital_status?: MaritalStatus;
  blood_type?: string;
  nationality?: string;

  photo_url?: string;
  is_active?: boolean;
  is_trainer?: boolean;
  branch_id?: number;
  department_id?: number;
  role_id?: number;
  job_positions_id?: number;
}

export interface UpdateEmployeePayload {
  employee_number?: string;
  full_name?: string;
  nik?: string;
  npwp?: string;
  kk_number?: string;
  birth_date?: string;
  birth_place?: string;
  gender?: Gender;
  religion?: string;
  marital_status?: MaritalStatus;
  blood_type?: string;
  nationality?: string;

  photo_url?: string;
  is_active?: boolean;
  is_trainer?: boolean;
  branch_id?: number;
  department_id?: number;
  role_id?: number;
  job_positions_id?: number;
}

export interface CreateContactPayload {
  contact_type: ContactType;
  contact_value: string;
  contact_label?: string;
  is_primary?: boolean;
}

export interface UpdateContactPayload {
  contact_type?: ContactType;
  contact_value?: string;
  contact_label?: string;
  is_primary?: boolean;
}

export interface EmployeeListParams {
  branch_id?: number;
  department_id?: number;
  is_active?: boolean;
  search?: string;
}

// Gender labels for display
export const GENDER_LABELS: Record<Gender, string> = {
  male: "Laki-laki",
  female: "Perempuan",
  other: "Lainnya",
};

// Marital status labels for display
export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  single: "Belum Menikah",
  married: "Menikah",
  widowed: "Duda/Janda",
  divorced: "Cerai",
};

// Religion options
export const RELIGION_OPTIONS = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
  "Lainnya",
];

// Blood type options
export const BLOOD_TYPE_OPTIONS = [
  "A",
  "B",
  "AB",
  "O",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

// Contact type labels for display
export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  phone: "Telepon",
  email: "Email",
  address: "Alamat",
};
