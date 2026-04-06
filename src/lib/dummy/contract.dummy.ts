import type { EmploymentContract } from "@/types/contract";

// ════════════════════════════════════════════
// CONTRACT DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_CONTRACTS: EmploymentContract[] = [
  // Ahmad Fauzan - Employee 1
  {
    id: 1,
    employee_id: 1,
    contract_number: "CTR/2020/001",
    contract_type: "pkwtt",
    start_date: "2020-01-01",
    end_date: null,
    salary: 25000000,
    notes: "Kontrak tetap setelah promosi ke Direktur",
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    employee_id: 1,
    contract_number: "CTR/2019/001",
    contract_type: "pkwt",
    start_date: "2019-01-01",
    end_date: "2019-12-31",
    salary: 20000000,
    notes: "Kontrak awal 1 tahun",
    created_at: "2019-01-01T00:00:00Z",
    updated_at: "2019-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Fatimah Azzahra - Employee 2
  {
    id: 3,
    employee_id: 2,
    contract_number: "CTR/2021/015",
    contract_type: "pkwtt",
    start_date: "2021-07-01",
    end_date: null,
    salary: 18000000,
    notes: "Kontrak tetap setelah 1 tahun PKWT",
    created_at: "2021-07-01T00:00:00Z",
    updated_at: "2021-07-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    employee_id: 2,
    contract_number: "CTR/2020/010",
    contract_type: "pkwt",
    start_date: "2020-07-01",
    end_date: "2021-06-30",
    salary: 15000000,
    notes: null,
    created_at: "2020-07-01T00:00:00Z",
    updated_at: "2020-07-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    employee_id: 2,
    contract_number: "CTR/2020/005",
    contract_type: "probation",
    start_date: "2020-04-01",
    end_date: "2020-06-30",
    salary: 12000000,
    notes: "Masa percobaan 3 bulan",
    created_at: "2020-04-01T00:00:00Z",
    updated_at: "2020-04-01T00:00:00Z",
    deleted_at: null,
  },

  // Usman Hakim - Employee 3
  {
    id: 6,
    employee_id: 3,
    contract_number: "CTR/2024/003",
    contract_type: "pkwt",
    start_date: "2024-01-01",
    end_date: "2026-12-31",
    salary: 12000000,
    notes: "Kontrak 3 tahun sebagai pengajar",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Aisyah Rahmawati - Employee 4
  {
    id: 7,
    employee_id: 4,
    contract_number: "CTR/2022/008",
    contract_type: "pkwtt",
    start_date: "2022-03-01",
    end_date: null,
    salary: 10000000,
    notes: null,
    created_at: "2022-03-01T00:00:00Z",
    updated_at: "2022-03-01T00:00:00Z",
    deleted_at: null,
  },

  // Muhammad Rizki - Employee 5
  {
    id: 8,
    employee_id: 5,
    contract_number: "CTR/2025/INT01",
    contract_type: "intern",
    start_date: "2025-01-01",
    end_date: "2025-06-30",
    salary: 3000000,
    notes: "Program magang 6 bulan",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Khadijah Sari - Employee 6
  {
    id: 9,
    employee_id: 6,
    contract_number: "CTR/2023/020",
    contract_type: "pkwt",
    start_date: "2023-08-01",
    end_date: "2025-07-31",
    salary: 8000000,
    notes: null,
    created_at: "2023-08-01T00:00:00Z",
    updated_at: "2023-08-01T00:00:00Z",
    deleted_at: null,
  },

  // Ali Syahputra - Employee 7
  {
    id: 10,
    employee_id: 7,
    contract_number: "CTR/2024/PT01",
    contract_type: "part_time",
    start_date: "2024-06-01",
    end_date: null,
    salary: 4500000,
    notes: "Part time security shift malam",
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    deleted_at: null,
  },

  // Zahra Putri - Employee 8
  {
    id: 11,
    employee_id: 8,
    contract_number: "CTR/2024/FL01",
    contract_type: "freelance",
    start_date: "2024-09-01",
    end_date: "2025-08-31",
    salary: 6000000,
    notes: "Freelance content creator",
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
    deleted_at: null,
  },

  // Ibrahim Maulana - Employee 9
  {
    id: 12,
    employee_id: 9,
    contract_number: "CTR/2019/008",
    contract_type: "pkwtt",
    start_date: "2019-05-01",
    end_date: null,
    salary: 15000000,
    notes: "Kontrak tetap senior manager",
    created_at: "2019-05-01T00:00:00Z",
    updated_at: "2019-05-01T00:00:00Z",
    deleted_at: null,
  },

  // Nurul Hidayah - Employee 10
  {
    id: 13,
    employee_id: 10,
    contract_number: "CTR/2025/PRB01",
    contract_type: "probation",
    start_date: "2025-10-01",
    end_date: "2025-12-31",
    salary: 7000000,
    notes: "Masa percobaan 3 bulan sebagai staff admin",
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyContracts(employeeId?: number): EmploymentContract[] {
  if (employeeId) {
    return DUMMY_CONTRACTS.filter((c) => c.employee_id === employeeId);
  }
  return DUMMY_CONTRACTS;
}

export function getDummyContractById(
  id: number,
): EmploymentContract | undefined {
  return DUMMY_CONTRACTS.find((c) => c.id === id);
}

export function getDummyActiveContract(
  employeeId: number,
): EmploymentContract | undefined {
  const today = new Date().toISOString().split("T")[0];
  return DUMMY_CONTRACTS.find(
    (c) =>
      c.employee_id === employeeId &&
      (c.end_date === null || c.end_date >= today),
  );
}
