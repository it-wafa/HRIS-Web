import type {
  AuditLog,
  AuditLogDisplay,
  AuditFieldChange,
  AuditLogListParams,
} from "@/types/audit-log";

// ══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

const getTimestamp = (daysAgo: number, time: string): string => {
  const date = new Date("2026-04-07"); // Current date sesuai context
  date.setDate(date.getDate() - daysAgo);
  return `${date.toISOString().split("T")[0]}T${time}:00Z`;
};

// ══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG DUMMY DATA (§12 — contextual only)
// ══════════════════════════════════════════════════════════════════════════════

export const DUMMY_AUDIT_LOGS: AuditLog[] = [
  // 1. Update jabatan pegawai
  {
    id: 1,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    table_name: "employees",
    record_id: 3,
    action: "update",
    old_values: {
      job_positions_id: 5,
      job_position_title: "Staff IT",
    },
    new_values: {
      job_positions_id: 4,
      job_position_title: "Senior Developer",
    },
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    created_at: getTimestamp(1, "10:30"),
  },
  // 2. Update departemen pegawai
  {
    id: 2,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    table_name: "employees",
    record_id: 5,
    action: "update",
    old_values: {
      department_id: 3,
      department_name: "Marketing & Sales",
    },
    new_values: {
      department_id: 2,
      department_name: "IT Development",
    },
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    created_at: getTimestamp(2, "14:15"),
  },
  // 3. Approval cuti - level 1
  {
    id: 3,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    table_name: "leave_approvals",
    record_id: 10,
    action: "create",
    old_values: null,
    new_values: {
      leave_request_id: 5,
      approver_id: 1,
      level: 1,
      status: "approved",
      notes: "Silakan, jangan lupa handover ke tim",
    },
    ip_address: "192.168.1.50",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    created_at: getTimestamp(3, "09:00"),
  },
  // 4. Approval cuti - level 2
  {
    id: 4,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    table_name: "leave_approvals",
    record_id: 11,
    action: "create",
    old_values: null,
    new_values: {
      leave_request_id: 5,
      approver_id: 2,
      level: 2,
      status: "approved",
      notes: null,
    },
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    created_at: getTimestamp(3, "11:30"),
  },
  // 5. Koreksi presensi approved
  {
    id: 5,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    table_name: "attendance_overrides",
    record_id: 3,
    action: "update",
    old_values: {
      status: "pending",
    },
    new_values: {
      status: "approved",
      approved_by: 2,
      approved_at: getTimestamp(4, "08:45"),
      notes: "Data sudah diverifikasi dengan log CCTV",
    },
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    created_at: getTimestamp(4, "08:45"),
  },
  // 6. Perubahan kontrak
  {
    id: 6,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    table_name: "contracts",
    record_id: 7,
    action: "create",
    old_values: null,
    new_values: {
      employee_id: 7,
      contract_type: "PKWT",
      start_date: "2026-05-01",
      end_date: "2027-04-30",
      notes: "Perpanjangan kontrak tahun kedua",
    },
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    created_at: getTimestamp(5, "15:00"),
  },
  // 7. Delete jenis cuti (soft delete)
  {
    id: 7,
    employee_id: 1,
    employee_name: "Ahmad Fauzan",
    table_name: "leave_types",
    record_id: 9,
    action: "delete",
    old_values: {
      name: "Cuti Tidak Aktif",
      category: "other",
      deleted_at: null,
    },
    new_values: {
      deleted_at: getTimestamp(6, "10:00"),
    },
    ip_address: "192.168.1.50",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    created_at: getTimestamp(6, "10:00"),
  },
  // 8. Create jenis cuti baru
  {
    id: 8,
    employee_id: 2,
    employee_name: "Fatimah Azzahra",
    table_name: "leave_types",
    record_id: 10,
    action: "create",
    old_values: null,
    new_values: {
      name: "Cuti Paternity",
      category: "special",
      requires_document: true,
      requires_document_type: "Akta Kelahiran Anak",
      max_duration_per_request: 5,
      max_duration_unit: "days",
    },
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    created_at: getTimestamp(7, "09:30"),
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// HELPER: Transform AuditLog to AuditLogDisplay
// ══════════════════════════════════════════════════════════════════════════════

const TABLE_NAME_LABELS: Record<string, string> = {
  employees: "data pegawai",
  leave_approvals: "approval cuti",
  leave_requests: "pengajuan cuti",
  attendance_overrides: "koreksi presensi",
  contracts: "kontrak kerja",
  leave_types: "jenis cuti",
  attendance_logs: "log kehadiran",
  permission_requests: "pengajuan izin",
  overtime_requests: "pengajuan lembur",
  business_trip_requests: "pengajuan dinas luar",
};

const FIELD_LABELS: Record<string, string> = {
  job_positions_id: "ID Jabatan",
  job_position_title: "Jabatan",
  department_id: "ID Departemen",
  department_name: "Departemen",
  status: "Status",
  approved_by: "Disetujui Oleh",
  approved_at: "Waktu Persetujuan",
  notes: "Catatan",
  leave_request_id: "ID Pengajuan Cuti",
  approver_id: "ID Approver",
  level: "Level Approval",
  employee_id: "ID Pegawai",
  contract_type: "Tipe Kontrak",
  start_date: "Tanggal Mulai",
  end_date: "Tanggal Selesai",
  name: "Nama",
  category: "Kategori",
  requires_document: "Wajib Dokumen",
  requires_document_type: "Jenis Dokumen",
  max_duration_per_request: "Maks Durasi/Request",
  max_duration_unit: "Satuan Durasi",
  deleted_at: "Dihapus Pada",
};

function transformToDisplay(log: AuditLog): AuditLogDisplay {
  const changes: AuditFieldChange[] = [];

  // Collect all fields from old and new values
  const allFields = new Set([
    ...Object.keys(log.old_values || {}),
    ...Object.keys(log.new_values || {}),
  ]);

  allFields.forEach((field) => {
    const oldVal = log.old_values?.[field];
    const newVal = log.new_values?.[field];

    // Only add if there's a difference
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({
        field,
        label: FIELD_LABELS[field] || field,
        old_value: oldVal != null ? String(oldVal) : null,
        new_value: newVal != null ? String(newVal) : null,
      });
    }
  });

  const tableLabel = TABLE_NAME_LABELS[log.table_name] || log.table_name;

  return {
    id: log.id,
    actor_name: log.employee_name || "System",
    target_description: `${tableLabel} #${log.record_id}`,
    action: log.action,
    changes,
    created_at: log.created_at,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORTED FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Get dummy audit logs with optional filtering
 */
export function getDummyAuditLogs(params?: AuditLogListParams): AuditLog[] {
  let result = [...DUMMY_AUDIT_LOGS];

  if (params?.table_name) {
    result = result.filter((log) => log.table_name === params.table_name);
  }

  if (params?.record_id !== undefined) {
    result = result.filter((log) => log.record_id === params.record_id);
  }

  if (params?.employee_id !== undefined) {
    result = result.filter((log) => log.employee_id === params.employee_id);
  }

  if (params?.action) {
    result = result.filter((log) => log.action === params.action);
  }

  // Sort by created_at descending
  result.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return result;
}

/**
 * Get dummy audit logs transformed to display format
 */
export function getDummyAuditLogDisplay(
  params?: AuditLogListParams,
): AuditLogDisplay[] {
  const logs = getDummyAuditLogs(params);
  return logs.map(transformToDisplay);
}
