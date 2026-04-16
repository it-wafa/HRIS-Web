import type { JobPosition } from "@/types/job-position";

// ════════════════════════════════════════════
// JOB POSITION DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_POSITIONS: JobPosition[] = [
  {
    id: 1,
    title: "Direktur",
    department_id: 1, // HRGA
    department_name: "Human Resource & General Affair",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    title: "Manager HRD",
    department_id: 1, // HRGA
    department_name: "Human Resource & General Affair",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    title: "Manager Operasional",
    department_id: 1, // HRGA
    department_name: "Human Resource & General Affair",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    title: "Koordinator",
    department_id: 3, // PDK
    department_name: "Pendidikan & Kurikulum",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    title: "Guru/Pengajar",
    department_id: 2, // AKD
    department_name: "Akademik",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 6,
    title: "Staff Admin",
    department_id: 1, // HRGA
    department_name: "Human Resource & General Affair",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 7,
    title: "Trainer",
    department_id: 3, // PDK
    department_name: "Pendidikan & Kurikulum",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 8,
    title: "IT Support",
    department_id: 5, // ITP
    department_name: "IT & Pengembangan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyPositions(params?: {
  department_id?: number;
}): JobPosition[] {
  if (params?.department_id !== undefined) {
    return DUMMY_POSITIONS.filter(
      (p) => p.department_id === params.department_id,
    );
  }
  return DUMMY_POSITIONS;
}

export function getDummyPositionById(id: number): JobPosition | undefined {
  return DUMMY_POSITIONS.find((position) => position.id === id);
}
export function getDummyPositionsByDepartment(
  departmentId: number,
): JobPosition[] {
  return DUMMY_POSITIONS.filter((p) => p.department_id === departmentId);
}
