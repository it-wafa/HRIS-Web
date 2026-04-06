import type { Branch } from "@/types/branch";

// ════════════════════════════════════════════
// BRANCH DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_BRANCHES: Branch[] = [
  {
    id: 1,
    code: "HQ-SBY",
    name: "Kantor Pusat Surabaya",
    address: "Jl. Raya Darmo No. 123, Surabaya, Jawa Timur 60241",
    latitude: -7.2575,
    longitude: 112.7521,
    radius_meters: 150,
    allow_wfh: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    code: "BR-JKT",
    name: "Cabang Jakarta",
    address: "Jl. Sudirman Kav. 52-53, Jakarta Selatan, DKI Jakarta 12190",
    latitude: -6.2088,
    longitude: 106.8456,
    radius_meters: 100,
    allow_wfh: false,
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    code: "BR-BDG",
    name: "Cabang Bandung",
    address: "Jl. Asia Afrika No. 65, Bandung, Jawa Barat 40111",
    latitude: -6.9175,
    longitude: 107.6191,
    radius_meters: 100,
    allow_wfh: true,
    created_at: "2024-03-20T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyBranches(): Branch[] {
  return DUMMY_BRANCHES;
}

export function getDummyBranchById(id: number): Branch | undefined {
  return DUMMY_BRANCHES.find((branch) => branch.id === id);
}
