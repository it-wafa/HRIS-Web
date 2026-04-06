import type { JobPosition } from "@/types/job-position";

// ════════════════════════════════════════════
// JOB POSITION DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_POSITIONS: JobPosition[] = [
  {
    id: 1,
    title: "Direktur",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    title: "Manager HRD",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    title: "Manager Operasional",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    title: "Koordinator",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    title: "Guru/Pengajar",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 6,
    title: "Staff Admin",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 7,
    title: "Trainer",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 8,
    title: "IT Support",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyPositions(): JobPosition[] {
  return DUMMY_POSITIONS;
}

export function getDummyPositionById(id: number): JobPosition | undefined {
  return DUMMY_POSITIONS.find((position) => position.id === id);
}
