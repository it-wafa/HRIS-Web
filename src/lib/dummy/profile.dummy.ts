import type { EmployeeProfile, EmployeeProfileContact } from "@/types/profile";

// ════════════════════════════════════════════
// DUMMY PROFILE DATA (for demo mode)
// This represents the "logged in" user's profile
// ════════════════════════════════════════════

export const DUMMY_EMPLOYEE_PROFILE: EmployeeProfile = {
  id: 2,
  employee_number: "EMP-002",
  full_name: "Fatimah Azzahra",
  photo_url: null,

  // Personal data
  nik: "3578012345678902",
  npwp: "12.345.678.9-013.000",
  kk_number: "3578011234567891",
  birth_date: "1988-07-22",
  birth_place: "Jakarta",
  gender: "female",
  religion: "Islam",
  marital_status: "married",
  blood_type: "A",
  nationality: "Indonesia",

  // Work info
  branch_id: 1,
  department_id: 1,
  role_id: 2,
  job_positions_id: 2,
  branch_name: "Kantor Pusat Surabaya",
  department_name: "Human Resource & General Affair",
  role_name: "HRD Admin",
  job_position_title: "Manager HRD",

  // Timestamps
  created_at: "2020-04-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const DUMMY_PROFILE_CONTACTS: EmployeeProfileContact[] = [
  {
    id: 4,
    contact_type: "phone",
    contact_value: "081234567891",
    contact_label: "Pribadi",
    is_primary: true,
  },
  {
    id: 5,
    contact_type: "email",
    contact_value: "fatimah.azzahra@wafa.id",
    contact_label: "Kantor",
    is_primary: false,
  },
  {
    id: 6,
    contact_type: "address",
    contact_value: "Jl. Raya Darmo No. 50, Surabaya, Jawa Timur 60264",
    contact_label: "Rumah",
    is_primary: false,
  },
];

// ════════════════════════════════════════════
// GETTER FUNCTIONS
// ════════════════════════════════════════════

export function getDummyEmployeeProfile(): EmployeeProfile {
  return DUMMY_EMPLOYEE_PROFILE;
}

export function getDummyProfileContacts(): EmployeeProfileContact[] {
  return DUMMY_PROFILE_CONTACTS;
}
