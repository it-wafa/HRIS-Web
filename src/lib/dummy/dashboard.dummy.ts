import type {
  EmployeeDashboardData,
  HRDDashboardData,
  TodayAttendanceStatus,
  AttendanceSummary,
  LeaveBalanceSummary,
  PendingRequest,
  ApprovalQueueItem,
  TeamAttendanceSummary,
  NotClockedInEmployee,
  ExpiringContract,
} from "@/types/dashboard";

// ══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

const getDateString = (daysAgo: number): string => {
  const date = new Date("2026-04-07"); // Current date sesuai context
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getTimestamp = (dateStr: string, time: string): string => {
  return `${dateStr}T${time}:00Z`;
};

// ══════════════════════════════════════════════════════════════════════════════
// EMPLOYEE DASHBOARD DUMMY DATA (§13.1)
// ══════════════════════════════════════════════════════════════════════════════

const DUMMY_TODAY_STATUS: TodayAttendanceStatus = {
  has_clocked_in: true,
  has_clocked_out: false,
  clock_in_at: getTimestamp(getDateString(0), "07:52"),
  clock_out_at: null,
  status: "present",
  late_minutes: 0,
};

const DUMMY_TODAY_STATUS_NOT_CLOCKED_IN: TodayAttendanceStatus = {
  has_clocked_in: false,
  has_clocked_out: false,
  clock_in_at: null,
  clock_out_at: null,
  status: null,
  late_minutes: 0,
};

const DUMMY_MONTHLY_SUMMARY: AttendanceSummary = {
  total_present: 18,
  total_late: 2,
  total_absent: 1,
  total_leave: 1,
  total_business_trip: 1,
  total_half_day: 0,
};

const DUMMY_LEAVE_BALANCES: LeaveBalanceSummary[] = [
  {
    leave_type_id: 1,
    leave_type_name: "Cuti Tahunan",
    total_quota: 12,
    used: 2,
    remaining: 10,
  },
  {
    leave_type_id: 2,
    leave_type_name: "Sakit",
    total_quota: null, // unlimited
    used: 2,
    remaining: null,
  },
  {
    leave_type_id: 3,
    leave_type_name: "Cuti Khusus",
    total_quota: 3,
    used: 0,
    remaining: 3,
  },
];

const DUMMY_PENDING_REQUESTS: PendingRequest[] = [
  {
    id: 1,
    type: "leave",
    label: "Cuti Tahunan — 3 hari",
    created_at: getTimestamp(getDateString(2), "09:00"),
    status: "pending",
  },
  {
    id: 2,
    type: "overtime",
    label: "Lembur — 2 jam (Project Deadline)",
    created_at: getTimestamp(getDateString(1), "16:30"),
    status: "pending",
  },
];

const DUMMY_EMPLOYEE_DASHBOARD: EmployeeDashboardData = {
  today: DUMMY_TODAY_STATUS,
  monthly_summary: DUMMY_MONTHLY_SUMMARY,
  leave_balances: DUMMY_LEAVE_BALANCES,
  pending_requests: DUMMY_PENDING_REQUESTS,
};

// ══════════════════════════════════════════════════════════════════════════════
// HRD DASHBOARD DUMMY DATA (§13.2)
// ══════════════════════════════════════════════════════════════════════════════

const DUMMY_APPROVAL_QUEUE: ApprovalQueueItem[] = [
  {
    id: 1,
    type: "leave",
    employee_name: "Usman Hakim",
    label: "Cuti Tahunan — 3 hari (15–17 Apr)",
    created_at: getTimestamp(getDateString(2), "09:00"),
  },
  {
    id: 2,
    type: "permission",
    employee_name: "Dewi Lestari",
    label: "Izin Keluar — 2 jam (Keperluan Bank)",
    created_at: getTimestamp(getDateString(1), "10:15"),
  },
  {
    id: 3,
    type: "overtime",
    employee_name: "Rudi Hermawan",
    label: "Lembur — 3 jam (Maintenance Server)",
    created_at: getTimestamp(getDateString(1), "16:00"),
  },
  {
    id: 4,
    type: "business_trip",
    employee_name: "Siti Rahayu",
    label: "Dinas Luar — Jakarta (Meeting Client)",
    created_at: getTimestamp(getDateString(3), "14:00"),
  },
  {
    id: 5,
    type: "override",
    employee_name: "Budi Santoso",
    label: "Koreksi Presensi — 5 Apr (Lupa Clock Out)",
    created_at: getTimestamp(getDateString(2), "08:30"),
  },
];

const DUMMY_APPROVAL_COUNTS = {
  leave: 1,
  permission: 1,
  overtime: 1,
  business_trip: 1,
  override: 1,
  total: 5,
};

const DUMMY_TEAM_ATTENDANCE: TeamAttendanceSummary = {
  total_employees: 45,
  present_today: 38,
  late_today: 3,
  not_clocked_in: 4,
  on_leave: 2,
};

const DUMMY_NOT_CLOCKED_IN: NotClockedInEmployee[] = [
  {
    employee_id: 5,
    employee_name: "Dewi Lestari",
    employee_number: "EMP-005",
    department_name: "Finance & Accounting",
    shift_start: "08:00",
  },
  {
    employee_id: 6,
    employee_name: "Rizki Pratama",
    employee_number: "EMP-006",
    department_name: "IT Development",
    shift_start: "08:00",
  },
  {
    employee_id: 8,
    employee_name: "Dinda Permata",
    employee_number: "EMP-008",
    department_name: "Marketing & Sales",
    shift_start: "08:00",
  },
  {
    employee_id: 10,
    employee_name: "Agus Wijaya",
    employee_number: "EMP-010",
    department_name: "Production",
    shift_start: "07:00",
  },
];

const DUMMY_EXPIRING_CONTRACTS: ExpiringContract[] = [
  {
    employee_id: 7,
    employee_name: "Rina Wulandari",
    employee_number: "EMP-007",
    contract_type: "PKWT",
    end_date: "2026-04-25",
    days_remaining: 18,
  },
  {
    employee_id: 9,
    employee_name: "Bambang Suryadi",
    employee_number: "EMP-009",
    contract_type: "PKWT",
    end_date: "2026-05-01",
    days_remaining: 24,
  },
];

const DUMMY_HRD_DASHBOARD: HRDDashboardData = {
  approval_queue: DUMMY_APPROVAL_QUEUE,
  approval_counts: DUMMY_APPROVAL_COUNTS,
  team_attendance: DUMMY_TEAM_ATTENDANCE,
  not_clocked_in: DUMMY_NOT_CLOCKED_IN,
  expiring_contracts: DUMMY_EXPIRING_CONTRACTS,
};

// ══════════════════════════════════════════════════════════════════════════════
// EXPORTED FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Get dummy employee dashboard data
 * @param clockedIn - if true, returns data with clocked in status; if false, not clocked in
 */
export function getDummyEmployeeDashboard(
  clockedIn: boolean = true,
): EmployeeDashboardData {
  return {
    ...DUMMY_EMPLOYEE_DASHBOARD,
    today: clockedIn ? DUMMY_TODAY_STATUS : DUMMY_TODAY_STATUS_NOT_CLOCKED_IN,
  };
}

/**
 * Get dummy HRD dashboard data
 */
export function getDummyHRDDashboard(): HRDDashboardData {
  return DUMMY_HRD_DASHBOARD;
}

/**
 * Get dummy today attendance status
 */
export function getDummyTodayStatus(
  clockedIn: boolean = true,
): TodayAttendanceStatus {
  return clockedIn ? DUMMY_TODAY_STATUS : DUMMY_TODAY_STATUS_NOT_CLOCKED_IN;
}
