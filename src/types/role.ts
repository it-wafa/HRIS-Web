// ════════════════════════════════════════════
// ROLE & PERMISSION TYPES
// ════════════════════════════════════════════

export interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined fields for display
  permissions?: Permission[];
  permission_count?: number;
}

export interface Permission {
  id: number;
  module: string;
  action: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  created_at: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

export interface UpdateRolePermissionsPayload {
  permission_ids: number[];
}

// Module list for permission matrix
export const PERMISSION_MODULES = [
  "dashboard",
  "employee",
  "branch",
  "position",
  "role",
  "attendance",
  "leave",
  "report",
] as const;

// Action list for permission matrix
export const PERMISSION_ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];
