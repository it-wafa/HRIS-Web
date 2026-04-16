import type {
  LeaveType,
  LeaveBalance,
  LeaveRequest,
  LeaveApproval,
  LeaveListParams,
  LeaveBalanceListParams,
} from "@/types/leave";

// ════════════════════════════════════════════
// LEAVE TYPE DUMMY DATA (sesuai §7.1)
// ════════════════════════════════════════════

const getDateString = (daysAgo: number): string => {
  const date = new Date("2026-04-07");
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getTimestamp = (dateStr: string, time: string): string => {
  return `${dateStr}T${time}:00Z`;
};

export const DUMMY_LEAVE_TYPES: LeaveType[] = [
  {
    id: 1,
    name: "Cuti Tahunan",
    category: "annual",
    requires_document: false,
    requires_document_type: null,
    max_duration_per_request: 12,
    max_duration_unit: "days",
    max_occurrences_per_year: null,
    max_total_duration_per_year: 12,
    max_total_duration_unit: "days",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    name: "Sakit",
    category: "sick",
    requires_document: true,
    requires_document_type: "Surat Keterangan Dokter",
    max_duration_per_request: null,
    max_duration_unit: null,
    max_occurrences_per_year: null,
    max_total_duration_per_year: null,
    max_total_duration_unit: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    name: "Cuti Pernikahan",
    category: "special",
    requires_document: true,
    requires_document_type: "Surat Nikah/Undangan",
    max_duration_per_request: 3,
    max_duration_unit: "days",
    max_occurrences_per_year: 1,
    max_total_duration_per_year: 3,
    max_total_duration_unit: "days",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    name: "Cuti Khitanan/Baptis Anak",
    category: "special",
    requires_document: true,
    requires_document_type: "Surat Keterangan",
    max_duration_per_request: 2,
    max_duration_unit: "days",
    max_occurrences_per_year: null,
    max_total_duration_per_year: 2,
    max_total_duration_unit: "days",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    name: "Cuti Melahirkan",
    category: "special",
    requires_document: true,
    requires_document_type: "Surat Keterangan Dokter/Bidan",
    max_duration_per_request: 90,
    max_duration_unit: "days",
    max_occurrences_per_year: 1,
    max_total_duration_per_year: 90,
    max_total_duration_unit: "days",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 6,
    name: "Cuti Keguguran",
    category: "special",
    requires_document: true,
    requires_document_type: "Surat Keterangan Dokter",
    max_duration_per_request: 45,
    max_duration_unit: "days",
    max_occurrences_per_year: null,
    max_total_duration_per_year: 45,
    max_total_duration_unit: "days",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 7,
    name: "Cuti Keluarga Meninggal",
    category: "special",
    requires_document: true,
    requires_document_type: "Surat Kematian",
    max_duration_per_request: 3,
    max_duration_unit: "days",
    max_occurrences_per_year: null,
    max_total_duration_per_year: null,
    max_total_duration_unit: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 8,
    name: "Cuti Haji/Umrah",
    category: "other",
    requires_document: true,
    requires_document_type: "Surat Bukti Keberangkatan",
    max_duration_per_request: 40,
    max_duration_unit: "days",
    max_occurrences_per_year: 1,
    max_total_duration_per_year: 40,
    max_total_duration_unit: "days",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// LEAVE BALANCE DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_LEAVE_BALANCES: LeaveBalance[] = [
  // Employee 1 - Ahmad Fauzan
  {
    id: 1,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    year: 2026,
    used_occurrences: 2,
    used_duration: 3,
    max_occurrences: null,
    max_duration: 12,
    remaining_occurrences: null,
    remaining_duration: 9,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
  // Employee 2 - Fatimah Azzahra
  {
    id: 2,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    year: 2026,
    used_occurrences: 1,
    used_duration: 2,
    max_occurrences: null,
    max_duration: 12,
    remaining_occurrences: null,
    remaining_duration: 10,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-20T00:00:00Z",
  },
  // Employee 3 - Usman Hakim
  {
    id: 3,
    employee_id: 3,
    employee_name: "Usman Hakim",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    year: 2026,
    used_occurrences: 0,
    used_duration: 0,
    max_occurrences: null,
    max_duration: 12,
    remaining_occurrences: null,
    remaining_duration: 12,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  // Employee 4 - Aisyah Rahmawati
  {
    id: 4,
    employee_id: 4,
    employee_name: "Aisyah Rahmawati",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    year: 2026,
    used_occurrences: 1,
    used_duration: 2, // leave_request id 1
    max_occurrences: null,
    max_duration: 12,
    remaining_occurrences: null,
    remaining_duration: 10,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-03-30T00:00:00Z",
  },
  // Employee 5 - Muhammad Rizki
  {
    id: 5,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    year: 2026,
    used_occurrences: 0,
    used_duration: 0,
    max_occurrences: null,
    max_duration: 12,
    remaining_occurrences: null,
    remaining_duration: 12,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// ════════════════════════════════════════════
// LEAVE REQUEST DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_LEAVE_APPROVALS: LeaveApproval[] = [
  // Approvals for leave request 1
  {
    id: 1,
    leave_request_id: 1,
    approver_id: 2,
    approver_name: "Fatimah Azzahra",
    level: 1,
    status: "approved",
    notes: "Disetujui",
    decided_at: getTimestamp(getDateString(10), "10:00"),
    created_at: getTimestamp(getDateString(12), "09:00"),
  },
  {
    id: 2,
    leave_request_id: 1,
    approver_id: 1,
    approver_name: "Ahmad Fauzan",
    level: 2,
    status: "approved",
    notes: "Disetujui, selamat menikmati cuti",
    decided_at: getTimestamp(getDateString(9), "14:00"),
    created_at: getTimestamp(getDateString(10), "10:00"),
  },
  // Approvals for leave request 2 (pending at leader level)
  {
    id: 3,
    leave_request_id: 2,
    approver_id: 2,
    approver_name: "Fatimah Azzahra",
    level: 1,
    status: "pending",
    notes: null,
    decided_at: null,
    created_at: getTimestamp(getDateString(2), "09:00"),
  },
  // Approvals for leave request 3 (approved by leader, pending HR)
  {
    id: 4,
    leave_request_id: 3,
    approver_id: 2,
    approver_name: "Fatimah Azzahra",
    level: 1,
    status: "approved",
    notes: "Disetujui",
    decided_at: getTimestamp(getDateString(4), "11:00"),
    created_at: getTimestamp(getDateString(5), "09:00"),
  },
  {
    id: 5,
    leave_request_id: 3,
    approver_id: 1,
    approver_name: "Ahmad Fauzan",
    level: 2,
    status: "pending",
    notes: null,
    decided_at: null,
    created_at: getTimestamp(getDateString(4), "11:00"),
  },
  // Approvals for leave request 4 (rejected)
  {
    id: 6,
    leave_request_id: 4,
    approver_id: 2,
    approver_name: "Fatimah Azzahra",
    level: 1,
    status: "rejected",
    notes: "Maaf, jadwal sudah bentrok dengan deadline project",
    decided_at: getTimestamp(getDateString(15), "14:00"),
    created_at: getTimestamp(getDateString(16), "10:00"),
  },
  // Approvals for leave request 5 (sick, approved HR)
  {
    id: 7,
    leave_request_id: 5,
    approver_id: 2,
    approver_name: "Fatimah Azzahra",
    level: 1,
    status: "approved",
    notes: "Disetujui, semoga lekas sembuh",
    decided_at: getTimestamp(getDateString(18), "09:00"),
    created_at: getTimestamp(getDateString(19), "10:00"),
  },
  {
    id: 8,
    leave_request_id: 5,
    approver_id: 1,
    approver_name: "Ahmad Fauzan",
    level: 2,
    status: "approved",
    notes: "Semoga lekas sembuh",
    decided_at: getTimestamp(getDateString(17), "10:00"),
    created_at: getTimestamp(getDateString(18), "09:00"),
  },
];

export const DUMMY_LEAVE_REQUESTS: LeaveRequest[] = [
  // Approved HR - Cuti Tahunan (linked to attendance_logs id 9 & 10)
  {
    id: 1,
    employee_id: 4,
    employee_name: "Aisyah Rahmawati",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    leave_category: "annual",
    start_date: getDateString(9),
    end_date: getDateString(8),
    total_days: 2,
    total_hours: null,
    reason: "Acara keluarga",
    document_url: null,
    status: "approved_hr",
    approvals: DUMMY_LEAVE_APPROVALS.filter((a) => a.leave_request_id === 1),
    created_at: getTimestamp(getDateString(12), "09:00"),
    updated_at: getTimestamp(getDateString(9), "14:00"),
    deleted_at: null,
  },
  // Pending - Cuti Tahunan
  {
    id: 2,
    employee_id: 3,
    employee_name: "Usman Hakim",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    leave_category: "annual",
    start_date: getDateString(-5), // 5 hari ke depan
    end_date: getDateString(-7),
    total_days: 3,
    total_hours: null,
    reason: "Liburan keluarga",
    document_url: null,
    status: "pending",
    approvals: DUMMY_LEAVE_APPROVALS.filter((a) => a.leave_request_id === 2),
    created_at: getTimestamp(getDateString(2), "09:00"),
    updated_at: getTimestamp(getDateString(2), "09:00"),
    deleted_at: null,
  },
  // Approved Leader - Cuti Tahunan
  {
    id: 3,
    employee_id: 5,
    employee_name: "Muhammad Rizki",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    leave_category: "annual",
    start_date: getDateString(-10),
    end_date: getDateString(-12),
    total_days: 3,
    total_hours: null,
    reason: "Menghadiri pernikahan saudara di kampung",
    document_url: null,
    status: "approved_leader",
    approvals: DUMMY_LEAVE_APPROVALS.filter((a) => a.leave_request_id === 3),
    created_at: getTimestamp(getDateString(5), "09:00"),
    updated_at: getTimestamp(getDateString(4), "11:00"),
    deleted_at: null,
  },
  // Rejected - Cuti Tahunan
  {
    id: 4,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    leave_category: "annual",
    start_date: getDateString(13),
    end_date: getDateString(11),
    total_days: 3,
    total_hours: null,
    reason: "Staycation",
    document_url: null,
    status: "rejected",
    approvals: DUMMY_LEAVE_APPROVALS.filter((a) => a.leave_request_id === 4),
    created_at: getTimestamp(getDateString(16), "10:00"),
    updated_at: getTimestamp(getDateString(15), "14:00"),
    deleted_at: null,
  },
  // Approved HR - Sakit
  {
    id: 5,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    leave_type_id: 2,
    leave_type_name: "Sakit",
    leave_category: "sick",
    start_date: getDateString(20),
    end_date: getDateString(18),
    total_days: 3,
    total_hours: null,
    reason: "Demam tinggi",
    document_url: "https://example.com/surat-dokter-ahmad.pdf",
    status: "approved_hr",
    approvals: DUMMY_LEAVE_APPROVALS.filter((a) => a.leave_request_id === 5),
    created_at: getTimestamp(getDateString(20), "10:00"),
    updated_at: getTimestamp(getDateString(17), "10:00"),
    deleted_at: null,
  },
  // Pending - Cuti Pernikahan
  {
    id: 6,
    employee_id: 4,
    employee_name: "Aisyah Rahmawati",
    leave_type_id: 3,
    leave_type_name: "Cuti Pernikahan",
    leave_category: "special",
    start_date: getDateString(-30),
    end_date: getDateString(-32),
    total_days: 3,
    total_hours: null,
    reason: "Pernikahan sendiri",
    document_url: "https://example.com/undangan-aisyah.pdf",
    status: "pending",
    approvals: [],
    created_at: getTimestamp(getDateString(1), "14:00"),
    updated_at: getTimestamp(getDateString(1), "14:00"),
    deleted_at: null,
  },
  // Approved HR - Sakit (short)
  {
    id: 7,
    employee_id: 3,
    employee_name: "Usman Hakim",
    leave_type_id: 2,
    leave_type_name: "Sakit",
    leave_category: "sick",
    start_date: getDateString(25),
    end_date: getDateString(25),
    total_days: 1,
    total_hours: null,
    reason: "Sakit perut",
    document_url: "https://example.com/surat-dokter-usman.pdf",
    status: "approved_hr",
    approvals: [],
    created_at: getTimestamp(getDateString(25), "08:00"),
    updated_at: getTimestamp(getDateString(24), "10:00"),
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// GETTER FUNCTIONS
// ════════════════════════════════════════════

export function getDummyLeaveTypes(): LeaveType[] {
  return [...DUMMY_LEAVE_TYPES];
}

export function getDummyLeaveTypeById(id: number): LeaveType | null {
  return DUMMY_LEAVE_TYPES.find((type) => type.id === id) ?? null;
}

export function getDummyLeaveBalances(
  params?: LeaveBalanceListParams,
): LeaveBalance[] {
  let result = [...DUMMY_LEAVE_BALANCES];

  if (params?.employee_id) {
    result = result.filter(
      (balance) => balance.employee_id === params.employee_id,
    );
  }

  if (params?.year) {
    result = result.filter((balance) => balance.year === params.year);
  }

  return result;
}

export function getDummyLeaveRequests(
  params?: LeaveListParams,
): LeaveRequest[] {
  let result = [...DUMMY_LEAVE_REQUESTS];

  if (params?.employee_id) {
    result = result.filter((req) => req.employee_id === params.employee_id);
  }

  if (params?.status) {
    result = result.filter((req) => req.status === params.status);
  }

  if (params?.leave_type_id) {
    result = result.filter((req) => req.leave_type_id === params.leave_type_id);
  }

  if (params?.year) {
    result = result.filter((req) => {
      const reqYear = new Date(req.start_date).getFullYear();
      return reqYear === params.year;
    });
  }

  // Sort by start_date descending
  result.sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  );

  return result;
}

export function getDummyLeaveRequestById(id: number): LeaveRequest | null {
  return DUMMY_LEAVE_REQUESTS.find((req) => req.id === id) ?? null;
}

export function getDummyLeaveTypeMetadata() {
  return {
    category_meta: [
      { id: "annual", name: "Cuti Tahunan" },
      { id: "sick", name: "Sakit" },
      { id: "maternity", name: "Cuti Melahirkan" },
      { id: "paternity", name: "Cuti Ayah" },
      { id: "unpaid", name: "Tanpa Gaji" },
      { id: "special", name: "Cuti Khusus" },
      { id: "other", name: "Lainnya" },
    ],
    duration_unit_meta: [
      { id: "days", name: "Hari" },
      { id: "hours", name: "Jam" },
    ],
  };
}
