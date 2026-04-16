import type {
  ShiftTemplate,
  ShiftTemplateDetail,
  EmployeeSchedule,
  ScheduleListParams,
  DayOfWeek,
} from "@/types/shift";
import { DUMMY_EMPLOYEES } from "./employee.dummy";

// ════════════════════════════════════════════
// SHIFT TEMPLATE DUMMY DATA
// ════════════════════════════════════════════

interface DetailConfig {
  id: number;
  shiftTemplateId: number;
  dayOfWeek: DayOfWeek;
  isWorkingDay: boolean;
  clockInStart: string | null;
  clockInEnd: string | null;
  clockOutStart: string | null;
  clockOutEnd: string | null;
  breakDhuhrStart?: string | null;
  breakDhuhrEnd?: string | null;
  breakAsrStart?: string | null;
  breakAsrEnd?: string | null;
}

// Helper function to create shift template detail
function createDetail(config: DetailConfig): ShiftTemplateDetail {
  return {
    id: config.id,
    shift_template_id: config.shiftTemplateId,
    day_of_week: config.dayOfWeek,
    is_working_day: config.isWorkingDay,
    clock_in_start: config.clockInStart,
    clock_in_end: config.clockInEnd,
    break_dhuhr_start: config.breakDhuhrStart ?? null,
    break_dhuhr_end: config.breakDhuhrEnd ?? null,
    break_asr_start: config.breakAsrStart ?? null,
    break_asr_end: config.breakAsrEnd ?? null,
    clock_out_start: config.clockOutStart,
    clock_out_end: config.clockOutEnd,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  };
}

// Shift Reguler (id: 1) details
const SHIFT_REGULER_DETAILS: ShiftTemplateDetail[] = [
  // Senin - Kamis: working day, break Dzuhur 12:00-12:30, Ashar kosong
  createDetail({
    id: 1,
    shiftTemplateId: 1,
    dayOfWeek: "monday",
    isWorkingDay: true,
    clockInStart: "07:30",
    clockInEnd: "08:10",
    clockOutStart: "15:30",
    clockOutEnd: "16:30",
    breakDhuhrStart: "12:00",
    breakDhuhrEnd: "12:30",
  }),
  createDetail({
    id: 2,
    shiftTemplateId: 1,
    dayOfWeek: "tuesday",
    isWorkingDay: true,
    clockInStart: "07:30",
    clockInEnd: "08:10",
    clockOutStart: "15:30",
    clockOutEnd: "16:30",
    breakDhuhrStart: "12:00",
    breakDhuhrEnd: "12:30",
  }),
  createDetail({
    id: 3,
    shiftTemplateId: 1,
    dayOfWeek: "wednesday",
    isWorkingDay: true,
    clockInStart: "07:30",
    clockInEnd: "08:10",
    clockOutStart: "15:30",
    clockOutEnd: "16:30",
    breakDhuhrStart: "12:00",
    breakDhuhrEnd: "12:30",
  }),
  createDetail({
    id: 4,
    shiftTemplateId: 1,
    dayOfWeek: "thursday",
    isWorkingDay: true,
    clockInStart: "07:30",
    clockInEnd: "08:10",
    clockOutStart: "15:30",
    clockOutEnd: "16:30",
    breakDhuhrStart: "12:00",
    breakDhuhrEnd: "12:30",
  }),
  // Jum'at: working day, break Dzuhur lebih lama (shalat Jumat)
  createDetail({
    id: 5,
    shiftTemplateId: 1,
    dayOfWeek: "friday",
    isWorkingDay: true,
    clockInStart: "07:30",
    clockInEnd: "08:10",
    clockOutStart: "15:30",
    clockOutEnd: "16:30",
    breakDhuhrStart: "11:30",
    breakDhuhrEnd: "13:00",
  }),
  // Sabtu & Minggu: libur
  createDetail({
    id: 6,
    shiftTemplateId: 1,
    dayOfWeek: "saturday",
    isWorkingDay: false,
    clockInStart: null,
    clockInEnd: null,
    clockOutStart: null,
    clockOutEnd: null,
  }),
  createDetail({
    id: 7,
    shiftTemplateId: 1,
    dayOfWeek: "sunday",
    isWorkingDay: false,
    clockInStart: null,
    clockInEnd: null,
    clockOutStart: null,
    clockOutEnd: null,
  }),
];

// Shift Fleksibel (id: 2) details
const SHIFT_FLEKSIBEL_DETAILS: ShiftTemplateDetail[] = [
  // Senin - Jum'at: working day, break Dzuhur 12:00-13:00, Ashar kosong
  createDetail({
    id: 8,
    shiftTemplateId: 2,
    dayOfWeek: "monday",
    isWorkingDay: true,
    clockInStart: "07:00",
    clockInEnd: "09:00",
    clockOutStart: "15:00",
    clockOutEnd: "18:00",
    breakDhuhrStart: "12:00",
    breakDhuhrEnd: "13:00",
  }),
  createDetail({
    id: 9,
    shiftTemplateId: 2,
    dayOfWeek: "tuesday",
    isWorkingDay: true,
    clockInStart: "07:00",
    clockInEnd: "09:00",
    clockOutStart: "15:00",
    clockOutEnd: "18:00",
    breakDhuhrStart: "12:00",
    breakDhuhrEnd: "13:00",
  }),
  createDetail({
    id: 10,
    shiftTemplateId: 2,
    dayOfWeek: "wednesday",
    isWorkingDay: true,
    clockInStart: "07:00",
    clockInEnd: "09:00",
    clockOutStart: "15:00",
    clockOutEnd: "18:00",
    breakDhuhrStart: "12:00",
    breakDhuhrEnd: "13:00",
  }),
  createDetail({
    id: 11,
    shiftTemplateId: 2,
    dayOfWeek: "thursday",
    isWorkingDay: true,
    clockInStart: "07:00",
    clockInEnd: "09:00",
    clockOutStart: "15:00",
    clockOutEnd: "18:00",
    breakDhuhrStart: "12:00",
    breakDhuhrEnd: "13:00",
  }),
  createDetail({
    id: 12,
    shiftTemplateId: 2,
    dayOfWeek: "friday",
    isWorkingDay: true,
    clockInStart: "07:00",
    clockInEnd: "09:00",
    clockOutStart: "15:00",
    clockOutEnd: "18:00",
    breakDhuhrStart: "11:30",
    breakDhuhrEnd: "13:00",
  }),
  // Sabtu & Minggu: libur
  createDetail({
    id: 13,
    shiftTemplateId: 2,
    dayOfWeek: "saturday",
    isWorkingDay: false,
    clockInStart: null,
    clockInEnd: null,
    clockOutStart: null,
    clockOutEnd: null,
  }),
  createDetail({
    id: 14,
    shiftTemplateId: 2,
    dayOfWeek: "sunday",
    isWorkingDay: false,
    clockInStart: null,
    clockInEnd: null,
    clockOutStart: null,
    clockOutEnd: null,
  }),
];

export const DUMMY_SHIFT_TEMPLATES: ShiftTemplate[] = [
  {
    id: 1,
    name: "Shift Reguler",
    is_flexible: false,
    details: SHIFT_REGULER_DETAILS,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    name: "Shift Fleksibel",
    is_flexible: true,
    details: SHIFT_FLEKSIBEL_DETAILS,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyShiftTemplates(): ShiftTemplate[] {
  return DUMMY_SHIFT_TEMPLATES;
}

export function getDummyShiftTemplateById(
  id: number,
): ShiftTemplate | undefined {
  return DUMMY_SHIFT_TEMPLATES.find((shift) => shift.id === id);
}

export function getDummyShiftDetailsByTemplateId(
  templateId: number,
): ShiftTemplateDetail[] {
  const template = DUMMY_SHIFT_TEMPLATES.find((s) => s.id === templateId);
  return template?.details || [];
}

// ════════════════════════════════════════════
// EMPLOYEE SCHEDULE DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_EMPLOYEE_SCHEDULES: EmployeeSchedule[] = [
  {
    id: 1,
    employee_id: 1,
    employee_name: DUMMY_EMPLOYEES[0]?.full_name,
    employee_number: DUMMY_EMPLOYEES[0]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: DUMMY_EMPLOYEES[1]?.full_name,
    employee_number: DUMMY_EMPLOYEES[1]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    employee_id: 3,
    employee_name: DUMMY_EMPLOYEES[2]?.full_name,
    employee_number: DUMMY_EMPLOYEES[2]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    employee_id: 4,
    employee_name: DUMMY_EMPLOYEES[3]?.full_name,
    employee_number: DUMMY_EMPLOYEES[3]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    employee_id: 5,
    employee_name: DUMMY_EMPLOYEES[4]?.full_name,
    employee_number: DUMMY_EMPLOYEES[4]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2025-01-01",
    end_date: null,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 6,
    employee_id: 6,
    employee_name: DUMMY_EMPLOYEES[5]?.full_name,
    employee_number: DUMMY_EMPLOYEES[5]?.employee_number,
    shift_template_id: 2,
    shift_name: DUMMY_SHIFT_TEMPLATES[1]?.name,
    effective_date: "2023-08-01",
    end_date: null,
    is_active: true,
    created_at: "2023-08-01T00:00:00Z",
    updated_at: "2023-08-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 7,
    employee_id: 7,
    employee_name: DUMMY_EMPLOYEES[6]?.full_name,
    employee_number: DUMMY_EMPLOYEES[6]?.employee_number,
    shift_template_id: 2,
    shift_name: DUMMY_SHIFT_TEMPLATES[1]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 8,
    employee_id: 8,
    employee_name: DUMMY_EMPLOYEES[7]?.full_name,
    employee_number: DUMMY_EMPLOYEES[7]?.employee_number,
    shift_template_id: 1,
    shift_name: DUMMY_SHIFT_TEMPLATES[0]?.name,
    effective_date: "2024-01-01",
    end_date: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyEmployeeSchedules(
  params?: ScheduleListParams,
): EmployeeSchedule[] {
  let result = [...DUMMY_EMPLOYEE_SCHEDULES];

  if (params?.employee_id !== undefined) {
    result = result.filter((s) => s.employee_id === params.employee_id);
  }

  if (params?.shift_template_id !== undefined) {
    result = result.filter(
      (s) => s.shift_template_id === params.shift_template_id,
    );
  }

  if (params?.is_active !== undefined) {
    result = result.filter((s) => s.is_active === params.is_active);
  }

  return result;
}

export function getDummyEmployeeScheduleById(
  id: number,
): EmployeeSchedule | undefined {
  return DUMMY_EMPLOYEE_SCHEDULES.find((schedule) => schedule.id === id);
}

export function getDummyShiftMetadata() {
  return {
    day_of_week_meta: [
      { id: "monday", name: "Senin" },
      { id: "tuesday", name: "Selasa" },
      { id: "wednesday", name: "Rabu" },
      { id: "thursday", name: "Kamis" },
      { id: "friday", name: "Jum'at" },
      { id: "saturday", name: "Sabtu" },
      { id: "sunday", name: "Minggu" },
    ],
  };
}
