import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Shield,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import {
  useRoleList,
  usePermissionList,
  useRoleMutations,
  useRolePermissions,
} from "@/hooks/useRole";
import { useRoleMetadata } from "@/hooks/useMetadata";
import type { Role, Permission, CreateRolePayload, RoleMetadata } from "@/types/role";

// ════════════════════════════════════════════
// MODAL WRAPPER
// ════════════════════════════════════════════

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-(--border) bg-(--card) my-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 0 40px rgba(212,21,140,0.1), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between border-b border-(--border) px-5 py-3">
          <h3 className="text-sm font-bold text-(--foreground)">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) transition hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// CONFIRM DIALOG
// ════════════════════════════════════════════

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-(--border) bg-(--card)"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h3 className="text-base font-bold text-(--foreground)">{title}</h3>
          <p className="mt-2 text-sm text-(--muted-foreground)">{message}</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-(--border) px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// ROLE FORM
// ════════════════════════════════════════════

function RoleForm({
  onClose,
  onSubmit,
  editRole,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateRolePayload) => void;
  editRole?: Role;
  isLoading?: boolean;
}) {
  const [name, setName] = useState(editRole?.name || "");
  const [description, setDescription] = useState(editRole?.description || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Nama role wajib diisi" });
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Nama Role"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors({});
        }}
        placeholder="Contoh: HRD Admin"
        error={errors.name}
        autoFocus
      />

      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-(--foreground) opacity-80"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi singkat tentang role ini"
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground)",
            "transition-colors duration-200 resize-none",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          )}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {editRole ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// PERMISSION MATRIX
// ════════════════════════════════════════════

function PermissionMatrix({
  roleId,
  permissions,
  rolePermissionCodes,
  onUpdatePermissions,
  metadata,
  isLoading,
}: {
  roleId: number;
  permissions: Permission[];
  rolePermissionCodes: string[];
  onUpdatePermissions: (roleId: number, permissionCodes: string[]) => void;
  metadata: RoleMetadata;
  isLoading?: boolean;
}) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>(rolePermissionCodes);

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      if (!grouped[p.module]) grouped[p.module] = [];
      grouped[p.module].push(p);
    });
    return grouped;
  }, [permissions]);

  const togglePermission = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code],
    );
  };

  const hasChanges = useMemo(() => {
    const sorted1 = [...selectedCodes].sort();
    const sorted2 = [...rolePermissionCodes].sort();
    return JSON.stringify(sorted1) !== JSON.stringify(sorted2);
  }, [selectedCodes, rolePermissionCodes]);

  const handleSave = () => {
    onUpdatePermissions(roleId, selectedCodes);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--border)">
              <th className="pb-2 pr-4 text-left font-medium text-(--muted-foreground)">
                Modul
              </th>
              {metadata.action_meta.map((action) => (
                <th
                  key={action.id}
                  className="pb-2 px-2 text-center font-medium text-(--muted-foreground)"
                >
                  {action.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metadata.module_meta.map((module) => {
              const modulePermissions = permissionsByModule[module.id] || [];
              return (
                <tr key={module.id} className="border-b border-(--border)/50">
                  <td className="py-2 pr-4 font-medium text-(--foreground)">
                    {module.name}
                  </td>
                  {metadata.action_meta.map((action) => {
                    const permission = modulePermissions.find(
                      (p) => p.action === action.id,
                    );
                    if (!permission) {
                      return (
                        <td key={action.id} className="py-2 px-2 text-center">
                          <span className="text-(--muted-foreground)">—</span>
                        </td>
                      );
                    }
                    const isChecked = selectedCodes.includes(permission.code);
                    return (
                      <td key={action.id} className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(permission.code)}
                          className={cn(
                            "h-5 w-5 rounded border transition-colors inline-flex items-center justify-center",
                            isChecked
                              ? "bg-(--primary) border-(--primary) text-white"
                              : "border-(--border) hover:border-(--primary)",
                          )}
                        >
                          {isChecked && <Check size={12} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasChanges && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isLoading}
          >
            Simpan Perubahan
          </Button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// ROLE CARD
// ════════════════════════════════════════════

function RoleCard({
  role,
  permissions,
  metadata,
  onEdit,
  onDelete,
  onUpdatePermissions,
  isLoading,
}: {
  role: Role;
  permissions: Permission[];
  metadata: RoleMetadata;
  onEdit: () => void;
  onDelete: () => void;
  onUpdatePermissions: (roleId: number, permissionCodes: string[]) => void;
  isLoading?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const rolePermissionCodes = useRolePermissions(role.id);

  return (
    <div className="overflow-hidden rounded-xl border border-(--border) bg-(--card)">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-(--muted)/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
            <Shield size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-(--foreground)">{role.name}</h3>
            {role.description && (
              <p className="text-sm text-(--muted-foreground) truncate">
                {role.description}
              </p>
            )}
          </div>
          <span className="inline-flex items-center rounded-full bg-(--muted) px-2.5 py-0.5 text-xs font-medium text-(--muted-foreground)">
            {role.permission_count || rolePermissionCodes.length} permissions
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-red-500/10 hover:text-red-500"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
          <div className="text-(--muted-foreground)">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Permission Matrix */}
      {expanded && (
        <div className="border-t border-(--border) px-5 py-4 bg-(--muted)/20">
          <h4 className="text-sm font-semibold text-(--foreground) mb-2">
            Permission Matrix
          </h4>
          <PermissionMatrix
            roleId={role.id}
            permissions={permissions}
            rolePermissionCodes={rolePermissionCodes}
            onUpdatePermissions={onUpdatePermissions}
            metadata={metadata}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// SKELETON CARDS
// ════════════════════════════════════════════

function SkeletonCards() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-(--border) bg-(--card) px-5 py-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function RolePage() {
  const { data: roles, loading: rolesLoading, refetch } = useRoleList();
  const { data: permissions, loading: permissionsLoading } =
    usePermissionList();
  const { data: metadata, loading: metaLoading } = useRoleMetadata();
  const {
    loading: mutationLoading,
    createRole,
    updateRole,
    deleteRole,
    updateRolePermissions,
  } = useRoleMutations(refetch);

  const [showForm, setShowForm] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const loading = rolesLoading || permissionsLoading || metaLoading;

  const handleCreate = async (payload: CreateRolePayload) => {
    const result = await createRole(payload);
    if (result) {
      setShowForm(false);
    }
  };

  const handleUpdate = async (payload: CreateRolePayload) => {
    if (!editRole) return;
    const result = await updateRole(editRole.id, payload);
    if (result) {
      setEditRole(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteRole(deleteTarget.id);
    if (result) {
      setDeleteTarget(null);
    }
  };

  const handleUpdatePermissions = async (
    roleId: number,
    permissionCodes: string[],
  ) => {
    await updateRolePermissions(roleId, permissionCodes);
  };

  return (
    <MainLayout>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 flex flex-col gap-3 border-b border-(--border) bg-(--card) px-4 py-3 sm:px-6 sm:py-3.5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-sm font-bold tracking-wide text-(--foreground) md:text-lg">
            Role & Akses
          </h1>
          <p className="text-[10px] text-(--muted-foreground) md:text-xs">
            Kelola role dan permission per module
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(true)}
          className="self-start sm:self-auto"
        >
          <Plus size={16} />
          Tambah Role
        </Button>
      </header>

      <div className="mx-auto max-w-350 p-3 sm:p-5">
        {/* Content */}
        {loading ? (
          <SkeletonCards />
        ) : !roles || roles.length === 0 ? (
          <EmptyState
            title="Belum ada data role"
            description="Tambahkan role baru untuk memulai"
            icon={<Shield className="h-12 w-12" />}
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Tambah Role
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                permissions={permissions || []}
                metadata={metadata!}
                onEdit={() => setEditRole(role)}
                onDelete={() => setDeleteTarget(role)}
                onUpdatePermissions={handleUpdatePermissions}
                isLoading={mutationLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={showForm}
        title="Tambah Role"
        onClose={() => setShowForm(false)}
      >
        <RoleForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editRole}
        title="Edit Role"
        onClose={() => setEditRole(null)}
      >
        {editRole && (
          <RoleForm
            onClose={() => setEditRole(null)}
            onSubmit={handleUpdate}
            editRole={editRole}
            isLoading={mutationLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Role"
        message={`Apakah Anda yakin ingin menghapus role "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={mutationLoading}
      />
    </MainLayout>
  );
}
