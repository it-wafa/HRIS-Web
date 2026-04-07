// ══════════════════════════════════════════════════════════════════════════════
// Dashboard Types (§13)
// ══════════════════════════════════════════════════════════════════════════════

export interface AttendanceSummary {
  total_present: number;
  total_late: number;
  total_absent: number;
  total_leave: number;
  total_business_trip: number;
  total_half_day: number;
}

export interface TodayAttendanceStatus {
  has_clocked_in: boolean;
  has_clocked_out: boolean;
  clock_in_at: string | null; // ISO timestamp
  clock_out_at: string | null;
  status: "present" | "late" | "absent" | null;
  late_minutes: number;
}

export interface PendingRequest {
  id: number;
  type: "leave" | "permission" | "overtime" | "business_trip" | "override";
  label: string; // e.g. "Cuti Tahunan — 3 hari"
  created_at: string;
  status: string;
}

export interface LeaveBalanceSummary {
  leave_type_id: number;
  leave_type_name: string;
  total_quota: number | null; // null = unlimited
  used: number;
  remaining: number | null;
}

// ══════════════════════════════════════════════════════════════════════════════
// Dashboard Pegawai (§13.1)
// ══════════════════════════════════════════════════════════════════════════════

export interface EmployeeDashboardData {
  today: TodayAttendanceStatus;
  monthly_summary: AttendanceSummary;
  leave_balances: LeaveBalanceSummary[];
  pending_requests: PendingRequest[];
}

// ══════════════════════════════════════════════════════════════════════════════
// Dashboard HRD/Supervisor (§13.2)
// ══════════════════════════════════════════════════════════════════════════════

export interface ApprovalQueueItem {
  id: number;
  type: "leave" | "permission" | "overtime" | "business_trip" | "override";
  employee_name: string;
  label: string;
  created_at: string;
}

export interface TeamAttendanceSummary {
  total_employees: number;
  present_today: number;
  late_today: number;
  not_clocked_in: number;
  on_leave: number;
}

export interface ExpiringContract {
  employee_id: number;
  employee_name: string;
  employee_number: string;
  contract_type: string;
  end_date: string;
  days_remaining: number;
}

export interface NotClockedInEmployee {
  employee_id: number;
  employee_name: string;
  employee_number: string;
  department_name: string | null;
  shift_start: string | null; // expected clock in time
}

export interface HRDDashboardData {
  approval_queue: ApprovalQueueItem[];
  approval_counts: {
    leave: number;
    permission: number;
    overtime: number;
    business_trip: number;
    override: number;
    total: number;
  };
  team_attendance: TeamAttendanceSummary;
  not_clocked_in: NotClockedInEmployee[];
  expiring_contracts: ExpiringContract[];
}

// ══════════════════════════════════════════════════════════════════════════════
// Clock Widget (§13.3)
// ══════════════════════════════════════════════════════════════════════════════

export interface ClockWidgetState {
  is_mobile: boolean;
  can_clock_in: boolean; // belum clock in hari ini
  can_clock_out: boolean; // sudah clock in, belum clock out
  current_status: TodayAttendanceStatus;
}

export interface ClockInPayload {
  lat?: number;
  lng?: number;
  photo_url?: string;
  method?: "gps" | "qr_code" | "face_recognition";
}

export interface ClockOutPayload {
  lat?: number;
  lng?: number;
  photo_url?: string;
  method?: "gps" | "qr_code" | "face_recognition";
}
