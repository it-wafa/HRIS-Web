import type { Role, Permission, RolePermission } from "@/types/role";

// ════════════════════════════════════════════
// ROLE DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_ROLES: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    description: "Akses penuh ke semua modul dan fitur sistem",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    permission_count: 40,
  },
  {
    id: 2,
    name: "HRD Admin",
    description: "Mengelola data pegawai, kehadiran, cuti, dan laporan HR",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    permission_count: 25,
  },
  {
    id: 3,
    name: "Branch Admin",
    description: "Mengelola data cabang dan pegawai di cabang tersebut",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    permission_count: 15,
  },
  {
    id: 4,
    name: "Supervisor",
    description: "Melihat dan menyetujui pengajuan tim",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    permission_count: 10,
  },
  {
    id: 5,
    name: "Staff",
    description: "Akses dasar untuk pegawai biasa",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    permission_count: 5,
  },
];

// ════════════════════════════════════════════
// PERMISSION DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_PERMISSIONS: Permission[] = [
  // Dashboard
  {
    id: 1,
    module: "dashboard",
    action: "view",
    description: "Melihat dashboard",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Employee
  {
    id: 2,
    module: "employee",
    action: "view",
    description: "Melihat data pegawai",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    module: "employee",
    action: "create",
    description: "Menambah pegawai baru",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    module: "employee",
    action: "edit",
    description: "Mengubah data pegawai",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    module: "employee",
    action: "delete",
    description: "Menghapus pegawai",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Branch
  {
    id: 6,
    module: "branch",
    action: "view",
    description: "Melihat data cabang",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 7,
    module: "branch",
    action: "create",
    description: "Menambah cabang baru",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 8,
    module: "branch",
    action: "edit",
    description: "Mengubah data cabang",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 9,
    module: "branch",
    action: "delete",
    description: "Menghapus cabang",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Position
  {
    id: 10,
    module: "position",
    action: "view",
    description: "Melihat data jabatan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 11,
    module: "position",
    action: "create",
    description: "Menambah jabatan baru",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 12,
    module: "position",
    action: "edit",
    description: "Mengubah data jabatan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 13,
    module: "position",
    action: "delete",
    description: "Menghapus jabatan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Role
  {
    id: 14,
    module: "role",
    action: "view",
    description: "Melihat data role",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 15,
    module: "role",
    action: "create",
    description: "Menambah role baru",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 16,
    module: "role",
    action: "edit",
    description: "Mengubah data role",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 17,
    module: "role",
    action: "delete",
    description: "Menghapus role",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Attendance
  {
    id: 18,
    module: "attendance",
    action: "view",
    description: "Melihat data kehadiran",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 19,
    module: "attendance",
    action: "create",
    description: "Input kehadiran manual",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 20,
    module: "attendance",
    action: "edit",
    description: "Mengubah data kehadiran",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 21,
    module: "attendance",
    action: "delete",
    description: "Menghapus data kehadiran",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 22,
    module: "attendance",
    action: "approve",
    description: "Menyetujui kehadiran",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Leave
  {
    id: 23,
    module: "leave",
    action: "view",
    description: "Melihat data cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 24,
    module: "leave",
    action: "create",
    description: "Mengajukan cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 25,
    module: "leave",
    action: "edit",
    description: "Mengubah pengajuan cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 26,
    module: "leave",
    action: "delete",
    description: "Membatalkan cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 27,
    module: "leave",
    action: "approve",
    description: "Menyetujui cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Report
  {
    id: 28,
    module: "report",
    action: "view",
    description: "Melihat laporan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: 29,
    module: "report",
    action: "create",
    description: "Membuat laporan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// ROLE PERMISSIONS (MAPPING)
// ════════════════════════════════════════════

export const DUMMY_ROLE_PERMISSIONS: RolePermission[] = [
  // Super Admin - all permissions
  ...DUMMY_PERMISSIONS.map((p, idx) => ({
    id: idx + 1,
    role_id: 1,
    permission_id: p.id,
    created_at: "2024-01-01T00:00:00Z",
  })),

  // HRD Admin - employee, attendance, leave, report, dashboard
  { id: 100, role_id: 2, permission_id: 1, created_at: "2024-01-01T00:00:00Z" }, // dashboard view
  { id: 101, role_id: 2, permission_id: 2, created_at: "2024-01-01T00:00:00Z" }, // employee view
  { id: 102, role_id: 2, permission_id: 3, created_at: "2024-01-01T00:00:00Z" }, // employee create
  { id: 103, role_id: 2, permission_id: 4, created_at: "2024-01-01T00:00:00Z" }, // employee edit
  { id: 104, role_id: 2, permission_id: 5, created_at: "2024-01-01T00:00:00Z" }, // employee delete
  {
    id: 105,
    role_id: 2,
    permission_id: 18,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance view
  {
    id: 106,
    role_id: 2,
    permission_id: 19,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance create
  {
    id: 107,
    role_id: 2,
    permission_id: 20,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance edit
  {
    id: 108,
    role_id: 2,
    permission_id: 22,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance approve
  {
    id: 109,
    role_id: 2,
    permission_id: 23,
    created_at: "2024-01-01T00:00:00Z",
  }, // leave view
  {
    id: 110,
    role_id: 2,
    permission_id: 27,
    created_at: "2024-01-01T00:00:00Z",
  }, // leave approve
  {
    id: 111,
    role_id: 2,
    permission_id: 28,
    created_at: "2024-01-01T00:00:00Z",
  }, // report view
  {
    id: 112,
    role_id: 2,
    permission_id: 29,
    created_at: "2024-01-01T00:00:00Z",
  }, // report create

  // Branch Admin
  { id: 200, role_id: 3, permission_id: 1, created_at: "2024-01-01T00:00:00Z" }, // dashboard view
  { id: 201, role_id: 3, permission_id: 2, created_at: "2024-01-01T00:00:00Z" }, // employee view
  { id: 202, role_id: 3, permission_id: 6, created_at: "2024-01-01T00:00:00Z" }, // branch view
  { id: 203, role_id: 3, permission_id: 8, created_at: "2024-01-01T00:00:00Z" }, // branch edit
  {
    id: 204,
    role_id: 3,
    permission_id: 18,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance view
  {
    id: 205,
    role_id: 3,
    permission_id: 22,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance approve

  // Supervisor
  { id: 300, role_id: 4, permission_id: 1, created_at: "2024-01-01T00:00:00Z" }, // dashboard view
  { id: 301, role_id: 4, permission_id: 2, created_at: "2024-01-01T00:00:00Z" }, // employee view
  {
    id: 302,
    role_id: 4,
    permission_id: 18,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance view
  {
    id: 303,
    role_id: 4,
    permission_id: 22,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance approve
  {
    id: 304,
    role_id: 4,
    permission_id: 23,
    created_at: "2024-01-01T00:00:00Z",
  }, // leave view
  {
    id: 305,
    role_id: 4,
    permission_id: 27,
    created_at: "2024-01-01T00:00:00Z",
  }, // leave approve

  // Staff
  { id: 400, role_id: 5, permission_id: 1, created_at: "2024-01-01T00:00:00Z" }, // dashboard view
  {
    id: 401,
    role_id: 5,
    permission_id: 18,
    created_at: "2024-01-01T00:00:00Z",
  }, // attendance view
  {
    id: 402,
    role_id: 5,
    permission_id: 23,
    created_at: "2024-01-01T00:00:00Z",
  }, // leave view
  {
    id: 403,
    role_id: 5,
    permission_id: 24,
    created_at: "2024-01-01T00:00:00Z",
  }, // leave create
];

export function getDummyRoles(): Role[] {
  return DUMMY_ROLES;
}

export function getDummyRoleById(id: number): Role | undefined {
  const role = DUMMY_ROLES.find((r) => r.id === id);
  if (role) {
    const rolePermissionIds = DUMMY_ROLE_PERMISSIONS.filter(
      (rp) => rp.role_id === id,
    ).map((rp) => rp.permission_id);
    const permissions = DUMMY_PERMISSIONS.filter((p) =>
      rolePermissionIds.includes(p.id),
    );
    return { ...role, permissions };
  }
  return undefined;
}

export function getDummyPermissions(): Permission[] {
  return DUMMY_PERMISSIONS;
}

export function getDummyRolePermissions(roleId: number): number[] {
  return DUMMY_ROLE_PERMISSIONS.filter((rp) => rp.role_id === roleId).map(
    (rp) => rp.permission_id,
  );
}
