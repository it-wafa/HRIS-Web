import { usePermission } from "@/hooks/usePermission";

interface PermissionGateProps {
  permission: string | string[];
  mode?: "any" | "all";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Render children hanya jika user memiliki permission yang dibutuhkan.
 * @param permission — string tunggal atau array permission
 * @param mode — "any" (default, salah satu cukup) atau "all" (semua harus ada)
 * @param fallback — komponen alternatif jika tidak punya permission
 */
export function PermissionGate({
  permission,
  mode = "any",
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  const allowed = Array.isArray(permission)
    ? mode === "all"
      ? hasAllPermissions(...permission)
      : hasAnyPermission(...permission)
    : hasPermission(permission);

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
