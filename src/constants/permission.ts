export const PERM_HomeEmployeeRead = "home-employee_read";
export const PERM_HomeAdminRead = "home-admin_read";
export const PERM_HomeClockIn = "home-clock_in";
export const PERM_HomeClockOut = "home-clock_out";
export const PERM_EmployeeRead = "employee-read";
export const PERM_EmployeeCreate = "employee-create";
export const PERM_EmployeeUpdate = "employee-update";
export const PERM_EmployeeDelete = "employee-delete";
export const PERM_EmployeeResetPassword = "employee-reset_password";
export const PERM_BranchRead = "branch-read";
export const PERM_BranchCreate = "branch-create";
export const PERM_BranchUpdate = "branch-update";
export const PERM_BranchDelete = "branch-delete";
export const PERM_DepartmentRead = "department-read";
export const PERM_DepartmentCreate = "department-create";
export const PERM_DepartmentUpdate = "department-update";
export const PERM_DepartmentDelete = "department-delete";
export const PERM_JobPositionRead = "job_position-read";
export const PERM_JobPositionCreate = "job_position-create";
export const PERM_JobPositionUpdate = "job_position-update";
export const PERM_JobPositionDelete = "job_position-delete";
export const PERM_RoleRead = "role-read";
export const PERM_RoleCreate = "role-create";
export const PERM_RoleUpdate = "role-update";
export const PERM_RoleDelete = "role-delete";
export const PERM_LeaveTypeRead = "leave_type-read";
export const PERM_LeaveTypeCreate = "leave_type-create";
export const PERM_LeaveTypeUpdate = "leave_type-update";
export const PERM_LeaveTypeDelete = "leave_type-delete";
export const PERM_TemplateShiftRead = "template_shift-read";
export const PERM_TemplateShiftCreate = "template_shift-create";
export const PERM_TemplateShiftUpdate = "template_shift-update";
export const PERM_TemplateShiftDelete = "template_shift-delete";
export const PERM_ScheduleRead = "schedule-read";
export const PERM_ScheduleCreate = "schedule-create";
export const PERM_ScheduleUpdate = "schedule-update";
export const PERM_ScheduleDelete = "schedule-delete";
export const PERM_HolidayRead = "holiday-read";
export const PERM_HolidayCreate = "holiday-create";
export const PERM_HolidayUpdate = "holiday-update";
export const PERM_HolidayDelete = "holiday-delete";
export const PERM_AttendanceRead = "attendance-read";
export const PERM_AttendanceCreate = "attendance-create";
export const PERM_AttendanceUpdate = "attendance-update";
export const PERM_AttendanceAdjustmentRead = "attendance_adjustment-read";
export const PERM_AttendanceAdjustmentCreate = "attendance_adjustment-create";
export const PERM_AttendanceAdjustmentApprove = "attendance_adjustment-approve";
export const PERM_LeaveRead = "leave-read";
export const PERM_LeaveCreate = "leave-create";
export const PERM_LeaveUpdate = "leave-update";
export const PERM_LeaveLeaderApprove = "leave-leader_approve";
export const PERM_LeaveHRApprove = "leave-hr_approve";
export const PERM_LeaveBalanceRead = "leave_balance-read";
export const PERM_RequestRead = "request-read";
export const PERM_RequestCreate = "request-create";
export const PERM_RequestApprove = "request-approve";
export const PERM_RequestUpdate = "request-update";
export const PERM_RequestDelete = "request-delete";
export const PERM_BusinessTripRead = "business_trip-read";
export const PERM_BusinessTripCreate = "business_trip-create";
export const PERM_BusinessTripApprove = "business_trip-approve";
export const PERM_OvertimeRead = "overtime-read";
export const PERM_OvertimeCreate = "overtime-create";
export const PERM_OvertimeApprove = "overtime-approve";
export const PERM_DailyReportRead = "daily_report-read";
export const PERM_DailyReportCreate = "daily_report-create";
export const PERM_DailyReportDelete = "daily_report-delete";
export const PERM_MutabaahRead = "mutabaah-read";
export const PERM_MutabaahCreate = "mutabaah-create";
export const PERM_MutabaahUpdate = "mutabaah-update";
export const PERM_ProfileRead = "profile-read";
export const PERM_ProfileUpdate = "profile-update";
export const PERM_ProfileResetPassword = "profile-reset_password";

/** Object map for convenient use in components */
export const PERMISSIONS = {
  HOME_EMPLOYEE_READ: PERM_HomeEmployeeRead,
  HOME_ADMIN_READ: PERM_HomeAdminRead,
  HOME_CLOCK_IN: PERM_HomeClockIn,
  HOME_CLOCK_OUT: PERM_HomeClockOut,
  EMPLOYEE_READ: PERM_EmployeeRead,
  EMPLOYEE_CREATE: PERM_EmployeeCreate,
  EMPLOYEE_UPDATE: PERM_EmployeeUpdate,
  EMPLOYEE_DELETE: PERM_EmployeeDelete,
  EMPLOYEE_RESET_PASSWORD: PERM_EmployeeResetPassword,
  BRANCH_READ: PERM_BranchRead,
  BRANCH_CREATE: PERM_BranchCreate,
  BRANCH_UPDATE: PERM_BranchUpdate,
  BRANCH_DELETE: PERM_BranchDelete,
  DEPARTMENT_READ: PERM_DepartmentRead,
  DEPARTMENT_CREATE: PERM_DepartmentCreate,
  DEPARTMENT_UPDATE: PERM_DepartmentUpdate,
  DEPARTMENT_DELETE: PERM_DepartmentDelete,
  JOB_POSITION_READ: PERM_JobPositionRead,
  JOB_POSITION_CREATE: PERM_JobPositionCreate,
  JOB_POSITION_UPDATE: PERM_JobPositionUpdate,
  JOB_POSITION_DELETE: PERM_JobPositionDelete,
  ROLE_READ: PERM_RoleRead,
  ROLE_CREATE: PERM_RoleCreate,
  ROLE_UPDATE: PERM_RoleUpdate,
  ROLE_DELETE: PERM_RoleDelete,
  LEAVE_TYPE_READ: PERM_LeaveTypeRead,
  LEAVE_TYPE_CREATE: PERM_LeaveTypeCreate,
  LEAVE_TYPE_UPDATE: PERM_LeaveTypeUpdate,
  LEAVE_TYPE_DELETE: PERM_LeaveTypeDelete,
  TEMPLATE_SHIFT_READ: PERM_TemplateShiftRead,
  TEMPLATE_SHIFT_CREATE: PERM_TemplateShiftCreate,
  TEMPLATE_SHIFT_UPDATE: PERM_TemplateShiftUpdate,
  TEMPLATE_SHIFT_DELETE: PERM_TemplateShiftDelete,
  SCHEDULE_READ: PERM_ScheduleRead,
  SCHEDULE_CREATE: PERM_ScheduleCreate,
  SCHEDULE_UPDATE: PERM_ScheduleUpdate,
  SCHEDULE_DELETE: PERM_ScheduleDelete,
  HOLIDAY_READ: PERM_HolidayRead,
  HOLIDAY_CREATE: PERM_HolidayCreate,
  HOLIDAY_UPDATE: PERM_HolidayUpdate,
  HOLIDAY_DELETE: PERM_HolidayDelete,
  ATTENDANCE_READ: PERM_AttendanceRead,
  ATTENDANCE_CREATE: PERM_AttendanceCreate,
  ATTENDANCE_UPDATE: PERM_AttendanceUpdate,
  ATTENDANCE_ADJUSTMENT_READ: PERM_AttendanceAdjustmentRead,
  ATTENDANCE_ADJUSTMENT_CREATE: PERM_AttendanceAdjustmentCreate,
  ATTENDANCE_ADJUSTMENT_APPROVE: PERM_AttendanceAdjustmentApprove,
  LEAVE_READ: PERM_LeaveRead,
  LEAVE_CREATE: PERM_LeaveCreate,
  LEAVE_UPDATE: PERM_LeaveUpdate,
  LEAVE_LEADER_APPROVE: PERM_LeaveLeaderApprove,
  LEAVE_HR_APPROVE: PERM_LeaveHRApprove,
  LEAVE_BALANCE_READ: PERM_LeaveBalanceRead,
  REQUEST_READ: PERM_RequestRead,
  REQUEST_CREATE: PERM_RequestCreate,
  REQUEST_APPROVE: PERM_RequestApprove,
  REQUEST_UPDATE: PERM_RequestUpdate,
  REQUEST_DELETE: PERM_RequestDelete,
  BUSINESS_TRIP_READ: PERM_BusinessTripRead,
  BUSINESS_TRIP_CREATE: PERM_BusinessTripCreate,
  BUSINESS_TRIP_APPROVE: PERM_BusinessTripApprove,
  OVERTIME_READ: PERM_OvertimeRead,
  OVERTIME_CREATE: PERM_OvertimeCreate,
  OVERTIME_APPROVE: PERM_OvertimeApprove,
  DAILY_REPORT_READ: PERM_DailyReportRead,
  DAILY_REPORT_CREATE: PERM_DailyReportCreate,
  DAILY_REPORT_DELETE: PERM_DailyReportDelete,
  MUTABAAH_READ: PERM_MutabaahRead,
  MUTABAAH_CREATE: PERM_MutabaahCreate,
  MUTABAAH_UPDATE: PERM_MutabaahUpdate,
  PROFILE_READ: PERM_ProfileRead,
  PROFILE_UPDATE: PERM_ProfileUpdate,
  PROFILE_RESET_PASSWORD: PERM_ProfileResetPassword,
} as const;

