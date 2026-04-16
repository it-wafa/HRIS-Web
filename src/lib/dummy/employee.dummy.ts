import type {
  Employee,
  EmployeeContact,
  EmployeeListParams,
  EmployeeMetadata,
} from "@/types/employee";

// ════════════════════════════════════════════
// EMPLOYEE DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_EMPLOYEES: Employee[] = [
  {
    id: 1,
    employee_number: "EMP-001",
    full_name: "Ahmad Fauzan",
    nik: "3578012345678901",
    npwp: "12.345.678.9-012.000",
    kk_number: "3578011234567890",
    birth_date: "1985-03-15",
    birth_place: "Surabaya",
    gender: "male",
    religion: "Islam",
    marital_status: "married",
    blood_type: "O",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: false,
    branch_id: 1,
    department_id: 1, // HRGA
    role_id: 1,
    job_positions_id: 1,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Kantor Pusat Surabaya",
    department_name: "Human Resource & General Affair",
    role_name: "Super Admin",
    job_position_title: "Direktur",
  },
  {
    id: 2,
    employee_number: "EMP-002",
    full_name: "Fatimah Azzahra",
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
    photo_url: null,
    is_active: true,
    is_trainer: false,
    branch_id: 1,
    department_id: 1, // HRGA
    role_id: 2,
    job_positions_id: 2,
    created_at: "2020-04-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Kantor Pusat Surabaya",
    department_name: "Human Resource & General Affair",
    role_name: "HRD Admin",
    job_position_title: "Manager HRD",
  },
  {
    id: 3,
    employee_number: "EMP-003",
    full_name: "Usman Hakim",
    nik: "3578012345678903",
    npwp: null,
    kk_number: "3578011234567892",
    birth_date: "1992-11-08",
    birth_place: "Bandung",
    gender: "male",
    religion: "Islam",
    marital_status: "single",
    blood_type: "B",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: true,
    branch_id: 2,
    department_id: 2, // Akademik
    role_id: 5,
    job_positions_id: 5,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Cabang Jakarta",
    department_name: "Akademik",
    role_name: "Staff",
    job_position_title: "Guru/Pengajar",
  },
  {
    id: 4,
    employee_number: "EMP-004",
    full_name: "Aisyah Rahmawati",
    nik: "3578012345678904",
    npwp: "12.345.678.9-014.000",
    kk_number: "3578011234567893",
    birth_date: "1995-02-14",
    birth_place: "Surabaya",
    gender: "female",
    religion: "Islam",
    marital_status: "single",
    blood_type: "AB",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: false,
    branch_id: 1,
    department_id: 1, // HRGA
    role_id: 5,
    job_positions_id: 6,
    created_at: "2022-03-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Kantor Pusat Surabaya",
    department_name: "Human Resource & General Affair",
    role_name: "Staff",
    job_position_title: "Staff Admin",
  },
  {
    id: 5,
    employee_number: "EMP-005",
    full_name: "Muhammad Rizki",
    nik: "3578012345678905",
    npwp: null,
    kk_number: "3578011234567894",
    birth_date: "2000-05-20",
    birth_place: "Malang",
    gender: "male",
    religion: "Islam",
    marital_status: "single",
    blood_type: "O",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: true,
    branch_id: 3,
    department_id: 2, // Akademik
    role_id: 5,
    job_positions_id: 5,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Cabang Bandung",
    department_name: "Akademik",
    role_name: "Staff",
    job_position_title: "Guru/Pengajar",
  },
  {
    id: 6,
    employee_number: "EMP-006",
    full_name: "Khadijah Sari",
    nik: "3578012345678906",
    npwp: null,
    kk_number: "3578011234567895",
    birth_date: "1993-09-12",
    birth_place: "Semarang",
    gender: "female",
    religion: "Islam",
    marital_status: "married",
    blood_type: "A",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: false,
    branch_id: 2,
    department_id: 3, // PDK
    role_id: 4,
    job_positions_id: 4,
    created_at: "2023-08-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Cabang Jakarta",
    department_name: "Pendidikan & Kurikulum",
    role_name: "Supervisor",
    job_position_title: "Koordinator",
  },
  {
    id: 7,
    employee_number: "EMP-007",
    full_name: "Ali Syahputra",
    nik: "3578012345678907",
    npwp: null,
    kk_number: "3578011234567896",
    birth_date: "1998-12-25",
    birth_place: "Medan",
    gender: "male",
    religion: "Islam",
    marital_status: "single",
    blood_type: "B",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: true,
    branch_id: 1,
    department_id: 3, // PDK
    role_id: 5,
    job_positions_id: 7,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Kantor Pusat Surabaya",
    department_name: "Pendidikan & Kurikulum",
    role_name: "Staff",
    job_position_title: "Trainer",
  },
  {
    id: 8,
    employee_number: "EMP-008",
    full_name: "Zahra Putri",
    nik: "3578012345678908",
    npwp: null,
    kk_number: "3578011234567897",
    birth_date: "1997-04-18",
    birth_place: "Yogyakarta",
    gender: "female",
    religion: "Islam",
    marital_status: "single",
    blood_type: "O",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: false,
    branch_id: 3,
    department_id: 1, // HRGA
    role_id: 5,
    job_positions_id: 6,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Cabang Bandung",
    department_name: "Human Resource & General Affair",
    role_name: "Staff",
    job_position_title: "Staff Admin",
  },
  {
    id: 9,
    employee_number: "EMP-009",
    full_name: "Ibrahim Maulana",
    nik: "3578012345678909",
    npwp: "12.345.678.9-015.000",
    kk_number: "3578011234567898",
    birth_date: "1987-06-30",
    birth_place: "Surabaya",
    gender: "male",
    religion: "Islam",
    marital_status: "married",
    blood_type: "AB",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: false,
    branch_id: 1,
    department_id: 1, // HRGA
    role_id: 3,
    job_positions_id: 3,
    created_at: "2019-05-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Kantor Pusat Surabaya",
    department_name: "Human Resource & General Affair",
    role_name: "Branch Admin",
    job_position_title: "Manager Operasional",
  },
  {
    id: 10,
    employee_number: "EMP-010",
    full_name: "Nurul Hidayah",
    nik: "3578012345678910",
    npwp: null,
    kk_number: "3578011234567899",
    birth_date: "1999-08-05",
    birth_place: "Surabaya",
    gender: "female",
    religion: "Islam",
    marital_status: "single",
    blood_type: "A",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: false,
    branch_id: 1,
    department_id: 2, // Akademik
    role_id: 5,
    job_positions_id: 5,
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Kantor Pusat Surabaya",
    department_name: "Akademik",
    role_name: "Staff",
    job_position_title: "Guru/Pengajar",
  },
  {
    id: 11,
    employee_number: "EMP-011",
    full_name: "Hasan Abdullah",
    nik: "3578012345678911",
    npwp: null,
    kk_number: "3578011234567800",
    birth_date: "1994-01-10",
    birth_place: "Makassar",
    gender: "male",
    religion: "Islam",
    marital_status: "married",
    blood_type: "B",
    nationality: "Indonesia",
    photo_url: null,
    is_active: false,
    is_trainer: false,
    branch_id: 2,
    department_id: 2, // Akademik
    role_id: 5,
    job_positions_id: 5,
    created_at: "2022-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Cabang Jakarta",
    department_name: "Akademik",
    role_name: "Staff",
    job_position_title: "Guru/Pengajar",
  },
  {
    id: 12,
    employee_number: "EMP-012",
    full_name: "Siti Aminah",
    nik: "3578012345678912",
    npwp: null,
    kk_number: "3578011234567801",
    birth_date: "1996-11-28",
    birth_place: "Palembang",
    gender: "female",
    religion: "Islam",
    marital_status: "single",
    blood_type: "O",
    nationality: "Indonesia",
    photo_url: null,
    is_active: true,
    is_trainer: false,
    branch_id: 2,
    department_id: 5, // ITP
    role_id: 5,
    job_positions_id: 8,
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    branch_name: "Cabang Jakarta",
    department_name: "IT & Pengembangan",
    role_name: "Staff",
    job_position_title: "IT Support",
  },
];

// ════════════════════════════════════════════
// EMPLOYEE CONTACT DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_EMPLOYEE_CONTACTS: EmployeeContact[] = [
  // Ahmad Fauzan
  {
    id: 1,
    employee_id: 1,
    contact_type: "phone",
    contact_value: "081234567890",
    contact_label: "Kantor",
    is_primary: true,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    employee_id: 1,
    contact_type: "email",
    contact_value: "ahmad.fauzan@wafa.id",
    contact_label: "Kantor",
    is_primary: false,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    employee_id: 1,
    contact_type: "address",
    contact_value: "Jl. Raya Darmo No. 45, Surabaya, Jawa Timur 60241",
    contact_label: "Rumah",
    is_primary: false,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Fatimah Azzahra
  {
    id: 4,
    employee_id: 2,
    contact_type: "phone",
    contact_value: "081345678901",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2020-04-01T00:00:00Z",
    updated_at: "2020-04-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    employee_id: 2,
    contact_type: "email",
    contact_value: "fatimah.azzahra@wafa.id",
    contact_label: "Kantor",
    is_primary: false,
    created_at: "2020-04-01T00:00:00Z",
    updated_at: "2020-04-01T00:00:00Z",
    deleted_at: null,
  },

  // Usman Hakim
  {
    id: 6,
    employee_id: 3,
    contact_type: "phone",
    contact_value: "081456789012",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 7,
    employee_id: 3,
    contact_type: "email",
    contact_value: "usman.hakim@wafa.id",
    contact_label: "Kantor",
    is_primary: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Aisyah Rahmawati
  {
    id: 8,
    employee_id: 4,
    contact_type: "phone",
    contact_value: "081567890123",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2022-03-01T00:00:00Z",
    updated_at: "2022-03-01T00:00:00Z",
    deleted_at: null,
  },

  // Muhammad Rizki
  {
    id: 9,
    employee_id: 5,
    contact_type: "phone",
    contact_value: "081678901234",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Khadijah Sari
  {
    id: 10,
    employee_id: 6,
    contact_type: "phone",
    contact_value: "081789012345",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2023-08-01T00:00:00Z",
    updated_at: "2023-08-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 11,
    employee_id: 6,
    contact_type: "address",
    contact_value:
      "Jl. Gatot Subroto No. 77, Jakarta Selatan, DKI Jakarta 12930",
    contact_label: "Rumah",
    is_primary: false,
    created_at: "2023-08-01T00:00:00Z",
    updated_at: "2023-08-01T00:00:00Z",
    deleted_at: null,
  },

  // Ali Syahputra
  {
    id: 12,
    employee_id: 7,
    contact_type: "phone",
    contact_value: "081890123456",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    deleted_at: null,
  },

  // Zahra Putri
  {
    id: 13,
    employee_id: 8,
    contact_type: "phone",
    contact_value: "081901234567",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
    deleted_at: null,
  },

  // Ibrahim Maulana
  {
    id: 14,
    employee_id: 9,
    contact_type: "phone",
    contact_value: "082012345678",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2019-05-01T00:00:00Z",
    updated_at: "2019-05-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 15,
    employee_id: 9,
    contact_type: "email",
    contact_value: "ibrahim.maulana@wafa.id",
    contact_label: "Kantor",
    is_primary: false,
    created_at: "2019-05-01T00:00:00Z",
    updated_at: "2019-05-01T00:00:00Z",
    deleted_at: null,
  },

  // Nurul Hidayah
  {
    id: 16,
    employee_id: 10,
    contact_type: "phone",
    contact_value: "082123456789",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-01T00:00:00Z",
    deleted_at: null,
  },

  // Hasan Abdullah
  {
    id: 17,
    employee_id: 11,
    contact_type: "phone",
    contact_value: "082234567890",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2022-01-01T00:00:00Z",
    updated_at: "2022-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Siti Aminah
  {
    id: 18,
    employee_id: 12,
    contact_type: "phone",
    contact_value: "082345678901",
    contact_label: "Pribadi",
    is_primary: true,
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2023-03-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 19,
    employee_id: 12,
    contact_type: "email",
    contact_value: "siti.aminah@wafa.id",
    contact_label: "Kantor",
    is_primary: false,
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2023-03-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyEmployees(params?: EmployeeListParams): Employee[] {
  let result = DUMMY_EMPLOYEES;

  if (params?.branch_id) {
    result = result.filter((e) => e.branch_id === params.branch_id);
  }

  if (params?.department_id) {
    result = result.filter((e) => e.department_id === params.department_id);
  }

  if (params?.is_active !== undefined) {
    result = result.filter((e) => e.is_active === params.is_active);
  }

  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.full_name.toLowerCase().includes(searchLower) ||
        e.employee_number.toLowerCase().includes(searchLower),
    );
  }

  return result;
}

export function getDummyEmployeeById(id: number): Employee | undefined {
  return DUMMY_EMPLOYEES.find((e) => e.id === id);
}

export function getDummyEmployeeContacts(
  employeeId?: number,
): EmployeeContact[] {
  if (employeeId) {
    return DUMMY_EMPLOYEE_CONTACTS.filter((c) => c.employee_id === employeeId);
  }
  return DUMMY_EMPLOYEE_CONTACTS;
}

export function getDummyEmployeeContactById(
  id: number,
): EmployeeContact | undefined {
  return DUMMY_EMPLOYEE_CONTACTS.find((c) => c.id === id);
}

export function getDummyEmployeesByDepartment(
  departmentId: number,
): Employee[] {
  return DUMMY_EMPLOYEES.filter((e) => e.department_id === departmentId);
}

export function getDummyEmployeeMetadata(): EmployeeMetadata {
  return {
    branch_meta: [{ id: "1", name: "Kantor Pusat Surabaya" }],
    department_meta: [{ id: "1", name: "HRGA" }],
    role_meta: [{ id: "1", name: "Super Admin" }],
    job_position_meta: [{ id: "1", name: "Direktur" }],
    gender_meta: [
      { id: "male", name: "Laki-laki" },
      { id: "female", name: "Perempuan" },
    ],
    religion_meta: [{ id: "Islam", name: "Islam" }],
    marital_status_meta: [
      { id: "married", name: "Menikah" },
      { id: "single", name: "Belum Menikah" },
    ],
    blood_type_meta: [
      { id: "A", name: "A" },
      { id: "O", name: "O" },
    ],
    status_meta: [{ id: "active", name: "Aktif" }],
  };
}