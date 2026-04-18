import { usePermission } from "@/hooks/usePermission";
import { ForbiddenPage } from "@/pages/ForbiddenPage";

interface ProtectedRouteProps {
  permission: string | string[];
  mode?: "any" | "all";
  children: React.ReactNode;
}

/**
 * Route guard — render children hanya jika user memiliki permission.
 * Jika tidak, render ForbiddenPage.
 */
export function ProtectedRoute({
  permission,
  mode = "any",
  children,
}: ProtectedRouteProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  const allowed = Array.isArray(permission)
    ? mode === "all"
      ? hasAllPermissions(...permission)
      : hasAnyPermission(...permission)
    : hasPermission(permission);

  if (!allowed) return <ForbiddenPage />;
  return <>{children}</>;
}
