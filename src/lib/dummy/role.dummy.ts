import type {
  Role,
  Permission,
  RolePermission,
  RoleMetadata,
} from "@/types/role";

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
// PERMISSION DUMMY DATA (code-based)
// ════════════════════════════════════════════

export const DUMMY_PERMISSIONS: Permission[] = [
  // Dashboard
  {
    code: "dashboard.view",
    module: "dashboard",
    action: "view",
    description: "Melihat dashboard",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Employee
  {
    code: "employee.view",
    module: "employee",
    action: "view",
    description: "Melihat data pegawai",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "employee.create",
    module: "employee",
    action: "create",
    description: "Menambah pegawai baru",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "employee.edit",
    module: "employee",
    action: "edit",
    description: "Mengubah data pegawai",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "employee.delete",
    module: "employee",
    action: "delete",
    description: "Menghapus pegawai",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Branch
  {
    code: "branch.view",
    module: "branch",
    action: "view",
    description: "Melihat data cabang",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "branch.create",
    module: "branch",
    action: "create",
    description: "Menambah cabang baru",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "branch.edit",
    module: "branch",
    action: "edit",
    description: "Mengubah data cabang",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "branch.delete",
    module: "branch",
    action: "delete",
    description: "Menghapus cabang",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Position
  {
    code: "position.view",
    module: "position",
    action: "view",
    description: "Melihat data jabatan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "position.create",
    module: "position",
    action: "create",
    description: "Menambah jabatan baru",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "position.edit",
    module: "position",
    action: "edit",
    description: "Mengubah data jabatan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "position.delete",
    module: "position",
    action: "delete",
    description: "Menghapus jabatan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Role
  {
    code: "role.view",
    module: "role",
    action: "view",
    description: "Melihat data role",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "role.create",
    module: "role",
    action: "create",
    description: "Menambah role baru",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "role.edit",
    module: "role",
    action: "edit",
    description: "Mengubah data role",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "role.delete",
    module: "role",
    action: "delete",
    description: "Menghapus role",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Attendance
  {
    code: "attendance.view",
    module: "attendance",
    action: "view",
    description: "Melihat data kehadiran",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "attendance.create",
    module: "attendance",
    action: "create",
    description: "Input kehadiran manual",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "attendance.edit",
    module: "attendance",
    action: "edit",
    description: "Mengubah data kehadiran",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "attendance.delete",
    module: "attendance",
    action: "delete",
    description: "Menghapus data kehadiran",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "attendance.approve",
    module: "attendance",
    action: "approve",
    description: "Menyetujui kehadiran",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Leave
  {
    code: "leave.view",
    module: "leave",
    action: "view",
    description: "Melihat data cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "leave.create",
    module: "leave",
    action: "create",
    description: "Mengajukan cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "leave.edit",
    module: "leave",
    action: "edit",
    description: "Mengubah pengajuan cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "leave.delete",
    module: "leave",
    action: "delete",
    description: "Membatalkan cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "leave.approve",
    module: "leave",
    action: "approve",
    description: "Menyetujui cuti",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Report
  {
    code: "report.view",
    module: "report",
    action: "view",
    description: "Melihat laporan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "report.create",
    module: "report",
    action: "create",
    description: "Membuat laporan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },

  // Mutaba'ah
  {
    code: "mutabaah.view",
    module: "mutabaah",
    action: "view",
    description: "Melihat laporan Mutaba'ah tilawah",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// ROLE PERMISSIONS (MAPPING) — code-based
// ════════════════════════════════════════════

export const DUMMY_ROLE_PERMISSIONS: RolePermission[] = [
  // Super Admin - all permissions
  ...DUMMY_PERMISSIONS.map((p, idx) => ({
    id: idx + 1,
    role_id: 1,
    permission_code: p.code,
    created_at: "2024-01-01T00:00:00Z",
  })),

  // HRD Admin - employee, attendance, leave, report, dashboard
  { id: 100, role_id: 2, permission_code: "dashboard.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 101, role_id: 2, permission_code: "employee.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 102, role_id: 2, permission_code: "employee.create", created_at: "2024-01-01T00:00:00Z" },
  { id: 103, role_id: 2, permission_code: "employee.edit", created_at: "2024-01-01T00:00:00Z" },
  { id: 104, role_id: 2, permission_code: "employee.delete", created_at: "2024-01-01T00:00:00Z" },
  { id: 105, role_id: 2, permission_code: "attendance.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 106, role_id: 2, permission_code: "attendance.create", created_at: "2024-01-01T00:00:00Z" },
  { id: 107, role_id: 2, permission_code: "attendance.edit", created_at: "2024-01-01T00:00:00Z" },
  { id: 108, role_id: 2, permission_code: "attendance.approve", created_at: "2024-01-01T00:00:00Z" },
  { id: 109, role_id: 2, permission_code: "leave.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 110, role_id: 2, permission_code: "leave.approve", created_at: "2024-01-01T00:00:00Z" },
  { id: 111, role_id: 2, permission_code: "report.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 112, role_id: 2, permission_code: "report.create", created_at: "2024-01-01T00:00:00Z" },
  { id: 113, role_id: 2, permission_code: "mutabaah.view", created_at: "2024-01-01T00:00:00Z" },

  // Branch Admin
  { id: 200, role_id: 3, permission_code: "dashboard.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 201, role_id: 3, permission_code: "employee.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 202, role_id: 3, permission_code: "branch.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 203, role_id: 3, permission_code: "branch.edit", created_at: "2024-01-01T00:00:00Z" },
  { id: 204, role_id: 3, permission_code: "attendance.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 205, role_id: 3, permission_code: "attendance.approve", created_at: "2024-01-01T00:00:00Z" },

  // Supervisor
  { id: 300, role_id: 4, permission_code: "dashboard.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 301, role_id: 4, permission_code: "employee.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 302, role_id: 4, permission_code: "attendance.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 303, role_id: 4, permission_code: "attendance.approve", created_at: "2024-01-01T00:00:00Z" },
  { id: 304, role_id: 4, permission_code: "leave.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 305, role_id: 4, permission_code: "leave.approve", created_at: "2024-01-01T00:00:00Z" },
  { id: 306, role_id: 4, permission_code: "mutabaah.view", created_at: "2024-01-01T00:00:00Z" },

  // Staff
  { id: 400, role_id: 5, permission_code: "dashboard.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 401, role_id: 5, permission_code: "attendance.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 402, role_id: 5, permission_code: "leave.view", created_at: "2024-01-01T00:00:00Z" },
  { id: 403, role_id: 5, permission_code: "leave.create", created_at: "2024-01-01T00:00:00Z" },
];

export function getDummyRoles(): Role[] {
  return DUMMY_ROLES;
}

export function getDummyRoleById(id: number): Role | undefined {
  const role = DUMMY_ROLES.find((r) => r.id === id);
  if (role) {
    const rolePermissionCodes = DUMMY_ROLE_PERMISSIONS.filter(
      (rp) => rp.role_id === id,
    ).map((rp) => rp.permission_code);
    const permissions = DUMMY_PERMISSIONS.filter((p) =>
      rolePermissionCodes.includes(p.code),
    );
    return { ...role, permissions };
  }
  return undefined;
}

export function getDummyPermissions(): Permission[] {
  return DUMMY_PERMISSIONS;
}

export function getDummyRolePermissions(roleId: number): string[] {
  return DUMMY_ROLE_PERMISSIONS.filter((rp) => rp.role_id === roleId).map(
    (rp) => rp.permission_code,
  );
}

export function getDummyRoleMetadata(): RoleMetadata {
  return {
    module_meta: [
      { id: "dashboard", name: "Dashboard" },
      { id: "employee", name: "Pegawai" },
      { id: "branch", name: "Cabang" },
      { id: "position", name: "Jabatan" },
      { id: "role", name: "Role" },
      { id: "attendance", name: "Kehadiran" },
      { id: "leave", name: "Cuti" },
      { id: "report", name: "Laporan" },
      { id: "mutabaah", name: "Mutaba'ah" },
    ],
    action_meta: [
      { id: "view", name: "Lihat" },
      { id: "create", name: "Tambah" },
      { id: "edit", name: "Edit" },
      { id: "delete", name: "Hapus" },
      { id: "approve", name: "Approve" },
    ],
  };
}
