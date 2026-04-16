import type { Department } from "@/types/department";

// ════════════════════════════════════════════
// DEPARTMENT DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_DEPARTMENTS: Department[] = [
  {
    id: 1,
    code: "HRGA",
    name: "Human Resource & General Affair",
    branch_id: null, // Berlaku untuk semua cabang
    branch_name: undefined,
    description:
      "Departemen yang mengelola sumber daya manusia dan urusan umum perusahaan",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    code: "AKD",
    name: "Akademik",
    branch_id: null,
    branch_name: undefined,
    description:
      "Departemen yang mengelola kegiatan akademik dan proses pembelajaran",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    code: "PDK",
    name: "Pendidikan & Kurikulum",
    branch_id: null,
    branch_name: undefined,
    description:
      "Departemen yang mengelola kurikulum dan program pendidikan yayasan",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    code: "KEU",
    name: "Keuangan",
    branch_id: null,
    branch_name: undefined,
    description: "Departemen yang mengelola keuangan dan administrasi keuangan",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    code: "ITP",
    name: "IT & Pengembangan",
    branch_id: null,
    branch_name: undefined,
    description:
      "Departemen yang mengelola teknologi informasi dan pengembangan sistem",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 6,
    code: "DKM",
    name: "Dakwah & Kemitraan",
    branch_id: null,
    branch_name: undefined,
    description: "Departemen yang mengelola kegiatan dakwah dan kemitraan",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyDepartments(params?: {
  branch_id?: number;
  is_active?: boolean;
}): Department[] {
  let result = [...DUMMY_DEPARTMENTS];

  if (params?.branch_id !== undefined) {
    result = result.filter(
      (d) => d.branch_id === null || d.branch_id === params.branch_id,
    );
  }

  if (params?.is_active !== undefined) {
    result = result.filter((d) => d.is_active === params.is_active);
  }

  return result;
}

export function getDummyDepartmentById(id: number): Department | undefined {
  return DUMMY_DEPARTMENTS.find((department) => department.id === id);
}

export function getDummyDepartmentMetadata() {
  return {
    branch_meta: [
      { id: "1", name: "Pusat" },
      { id: "2", name: "Cabang Jakarta" },
      { id: "3", name: "Cabang Bandung" },
    ],
  };
}
