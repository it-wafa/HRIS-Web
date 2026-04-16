// ════════════════════════════════════════════
// MASTER DATA DUMMY EXPORTS
// ════════════════════════════════════════════

// Branch
export {
  DUMMY_BRANCHES,
  getDummyBranches,
  getDummyBranchById,
} from "./branch.dummy";

// Department
export {
  DUMMY_DEPARTMENTS,
  getDummyDepartments,
  getDummyDepartmentById,
} from "./department.dummy";

// Position
export {
  DUMMY_POSITIONS,
  getDummyPositions,
  getDummyPositionById,
  getDummyPositionsByDepartment,
} from "./position.dummy";

// Role & Permission
export {
  DUMMY_ROLES,
  DUMMY_PERMISSIONS,
  DUMMY_ROLE_PERMISSIONS,
  getDummyRoles,
  getDummyRoleById,
  getDummyPermissions,
  getDummyRolePermissions,
  getDummyRoleMetadata,
} from "./role.dummy";

// Contract
export {
  DUMMY_CONTRACTS,
  getDummyContracts,
  getDummyContractById,
  getDummyActiveContract,
} from "./contract.dummy";

// Employee
export {
  DUMMY_EMPLOYEES,
  DUMMY_EMPLOYEE_CONTACTS,
  getDummyEmployees,
  getDummyEmployeeById,
  getDummyEmployeeContacts,
  getDummyEmployeeContactById,
  getDummyEmployeesByDepartment,
  getDummyEmployeeMetadata,
} from "./employee.dummy";

// Shift & Schedule
export {
  DUMMY_SHIFT_TEMPLATES,
  DUMMY_EMPLOYEE_SCHEDULES,
  getDummyShiftTemplates,
  getDummyShiftTemplateById,
  getDummyShiftDetailsByTemplateId,
  getDummyEmployeeSchedules,
  getDummyEmployeeScheduleById,
} from "./shift.dummy";

// Holiday
export {
  DUMMY_HOLIDAYS,
  getDummyHolidays,
  getDummyHolidayById,
} from "./holiday.dummy";

// Profile (Employee Profile for demo mode)
export {
  DUMMY_EMPLOYEE_PROFILE,
  DUMMY_PROFILE_CONTACTS,
  getDummyEmployeeProfile,
  getDummyProfileContacts,
} from "./profile.dummy";

// ════════════════════════════════════════════
// ATTENDANCE & PENGAJUAN DUMMY EXPORTS
// ════════════════════════════════════════════

// Attendance
export {
  DUMMY_ATTENDANCE_LOGS,
  getDummyAttendanceLogs,
  getDummyAttendanceLogById,
  getDummyAttendanceSummary,
} from "./attendance.dummy";

export {
  DUMMY_ATTENDANCE_OVERRIDES,
  getDummyAttendanceOverrides,
  getDummyAttendanceOverrideById,
} from "./attendance-override.dummy";

// Pengajuan
export {
  DUMMY_PERMISSION_REQUESTS,
  getDummyPermissionRequests,
  getDummyPermissionRequestById,
} from "./permission-request.dummy";

export {
  DUMMY_LEAVE_TYPES,
  DUMMY_LEAVE_BALANCES,
  DUMMY_LEAVE_REQUESTS,
  DUMMY_LEAVE_APPROVALS,
  getDummyLeaveTypes,
  getDummyLeaveTypeById,
  getDummyLeaveBalances,
  getDummyLeaveRequests,
  getDummyLeaveRequestById,
} from "./leave.dummy";

export {
  DUMMY_BUSINESS_TRIPS,
  getDummyBusinessTrips,
  getDummyBusinessTripById,
} from "./business-trip.dummy";

export {
  DUMMY_OVERTIME_REQUESTS,
  getDummyOvertimeRequests,
  getDummyOvertimeRequestById,
} from "./overtime.dummy";

export {
  DUMMY_DAILY_REPORTS,
  getDummyDailyReports,
  getDummyDailyReportById,
} from "./daily-report.dummy";

// ════════════════════════════════════════════
// DASHBOARD & AUDIT LOG DUMMY EXPORTS
// ════════════════════════════════════════════

// Dashboard
export {
  getDummyEmployeeDashboard,
  getDummyHRDDashboard,
  getDummyTodayStatus,
} from "./dashboard.dummy";

// Audit Log
export {
  DUMMY_AUDIT_LOGS,
  getDummyAuditLogs,
  getDummyAuditLogDisplay,
} from "./audit-log.dummy";

// Mutaba'ah
export {
  DUMMY_MUTABAAH_LOGS,
  getDummyMutabaahLogs,
  getDummyMutabaahTodayStatus,
  getDummyMutabaahDailyReport,
  getDummyMutabaahMonthlySummary,
  getDummyMutabaahCategorySummary,
} from "./mutabaah.dummy";
