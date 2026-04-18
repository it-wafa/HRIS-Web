import { useAuth } from "@/contexts/AuthContext";

/** Hook untuk cek permission user */
export function usePermission() {
  const { permissions } = useAuth();

  const hasPermission = (perm: string): boolean => {
    return permissions.includes(perm);
  };

  const hasAnyPermission = (...perms: string[]): boolean => {
    return perms.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (...perms: string[]): boolean => {
    return perms.every((p) => permissions.includes(p));
  };

  return { hasPermission, hasAnyPermission, hasAllPermissions, permissions };
}
