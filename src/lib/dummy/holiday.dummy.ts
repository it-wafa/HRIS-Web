import type { Holiday, HolidayListParams } from "@/types/holiday";

// ════════════════════════════════════════════
// HOLIDAY DUMMY DATA - INDONESIA 2026
// ════════════════════════════════════════════

export const DUMMY_HOLIDAYS: Holiday[] = [
  // Januari
  {
    id: 1,
    name: "Tahun Baru Masehi",
    year: 2026,
    date: "2026-01-01",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Perayaan tahun baru masehi 2026",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    name: "Isra Mi'raj Nabi Muhammad SAW",
    year: 2026,
    date: "2026-01-29",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Memperingati perjalanan Isra Mi'raj Nabi Muhammad SAW",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // Februari
  {
    id: 3,
    name: "Tahun Baru Imlek",
    year: 2026,
    date: "2026-02-17",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Perayaan tahun baru Imlek",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // Maret
  {
    id: 4,
    name: "Hari Raya Nyepi",
    year: 2026,
    date: "2026-03-31",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Hari Raya Nyepi Tahun Baru Saka",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // April - Idul Fitri
  {
    id: 5,
    name: "Idul Fitri 1447 H (Hari Pertama)",
    year: 2026,
    date: "2026-04-01",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Hari Raya Idul Fitri 1447 Hijriah",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 6,
    name: "Idul Fitri 1447 H (Hari Kedua)",
    year: 2026,
    date: "2026-04-02",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Hari Raya Idul Fitri 1447 Hijriah hari kedua",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 7,
    name: "Cuti Bersama Idul Fitri",
    year: 2026,
    date: "2026-04-03",
    type: "joint",
    branch_id: null,
    branch_name: undefined,
    description: "Cuti bersama dalam rangka Hari Raya Idul Fitri",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 8,
    name: "Wafat Isa Al Masih",
    year: 2026,
    date: "2026-04-03",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Memperingati wafatnya Isa Al Masih",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // Mei
  {
    id: 9,
    name: "Hari Buruh Internasional",
    year: 2026,
    date: "2026-05-01",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Peringatan Hari Buruh Internasional",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 10,
    name: "Kenaikan Isa Al Masih",
    year: 2026,
    date: "2026-05-14",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Memperingati kenaikan Isa Al Masih",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 11,
    name: "Hari Raya Waisak",
    year: 2026,
    date: "2026-05-29",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Hari Raya Waisak 2570 BE",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // Juni
  {
    id: 12,
    name: "Hari Lahir Pancasila",
    year: 2026,
    date: "2026-06-01",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Memperingati Hari Lahir Pancasila",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 13,
    name: "Idul Adha 1447 H",
    year: 2026,
    date: "2026-06-07",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Hari Raya Idul Adha 1447 Hijriah",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 14,
    name: "Tahun Baru Islam 1448 H",
    year: 2026,
    date: "2026-06-28",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Tahun Baru Islam 1448 Hijriah",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // Agustus
  {
    id: 15,
    name: "Hari Kemerdekaan RI",
    year: 2026,
    date: "2026-08-17",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Memperingati Hari Kemerdekaan Republik Indonesia ke-81",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // September
  {
    id: 16,
    name: "Maulid Nabi Muhammad SAW",
    year: 2026,
    date: "2026-09-06",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Memperingati kelahiran Nabi Muhammad SAW",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // Desember
  {
    id: 17,
    name: "Hari Natal",
    year: 2026,
    date: "2026-12-25",
    type: "national",
    branch_id: null,
    branch_name: undefined,
    description: "Perayaan Hari Natal",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 18,
    name: "Cuti Bersama Natal",
    year: 2026,
    date: "2026-12-26",
    type: "joint",
    branch_id: null,
    branch_name: undefined,
    description: "Cuti bersama dalam rangka Hari Natal",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  // Hari Libur Perusahaan
  {
    id: 19,
    name: "HUT Yayasan Wafa Indonesia",
    year: 2026,
    date: "2026-07-15",
    type: "company",
    branch_id: null,
    branch_name: undefined,
    description:
      "Perayaan Hari Ulang Tahun Yayasan Wafa Indonesia, libur untuk semua cabang",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 20,
    name: "Liburan Akhir Tahun Perusahaan",
    year: 2026,
    date: "2026-12-31",
    type: "company",
    branch_id: null,
    branch_name: undefined,
    description: "Liburan internal akhir tahun",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

export function getDummyHolidays(params?: HolidayListParams): Holiday[] {
  let result = [...DUMMY_HOLIDAYS];

  if (params?.year !== undefined) {
    result = result.filter((h) => h.year === params.year);
  }

  if (params?.type !== undefined) {
    result = result.filter((h) => h.type === params.type);
  }

  if (params?.branch_id !== undefined) {
    result = result.filter(
      (h) => h.branch_id === null || h.branch_id === params.branch_id,
    );
  }

  // Sort by date
  result.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return result;
}

export function getDummyHolidayById(id: number): Holiday | undefined {
  return DUMMY_HOLIDAYS.find((holiday) => holiday.id === id);
}

export function getDummyHolidayMetadata() {
  return {
    holiday_type_meta: [
      { id: "national", name: "Nasional" },
      { id: "joint", name: "Cuti Bersama" },
      { id: "observance", name: "Peringatan" },
      { id: "company", name: "Perusahaan" },
    ],
    branch_meta: [
      { id: "1", name: "Pusat" },
      { id: "2", name: "Cabang Jakarta" },
      { id: "3", name: "Cabang Bandung" },
    ],
  };
}
