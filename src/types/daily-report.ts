export type ReportStatus = "submitted" | "missing";

export interface DailyReport {
  id: number;
  employee_id: number;
  employee_name?: string;
  report_date: string;
  activities: string;
  status: ReportStatus;
  submitted_at: string | null;
  attendance_log_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateDailyReportPayload {
  report_date: string;
  activities: string;
  attendance_log_id?: number;
}

export interface UpdateDailyReportPayload {
  activities?: string;
}

export interface DailyReportListParams {
  employee_id?: number;
  start_date?: string;
  end_date?: string;
  status?: ReportStatus;
}

export const REPORT_STATUS_OPTIONS: {
  value: ReportStatus;
  label: string;
  color: string;
}[] = [
  { value: "submitted", label: "Terkirim", color: "green" },
  { value: "missing", label: "Belum Diisi", color: "red" },
];
