import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Network,
  Building2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useDepartmentList,
  useDepartmentMutations,
} from "@/hooks/useDepartment";
import { useBranchList } from "@/hooks/useBranch";
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/types/department";

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
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-(--border) bg-(--card) my-8"
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
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
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
// TOGGLE SWITCH
// ════════════════════════════════════════════

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-(--primary)" : "bg-(--muted)",
        )}
        onClick={() => onChange(!checked)}
      >
        <div
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </div>
      {label && <span className="text-sm text-(--foreground)">{label}</span>}
    </label>
  );
}

// ════════════════════════════════════════════
// DEPARTMENT FORM
// ════════════════════════════════════════════

function DepartmentForm({
  onClose,
  onSubmit,
  editDepartment,
  branches,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateDepartmentPayload | UpdateDepartmentPayload) => void;
  editDepartment?: Department;
  branches: { id: number; name: string }[];
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    code: editDepartment?.code || "",
    name: editDepartment?.name || "",
    branch_id: editDepartment?.branch_id ? String(editDepartment.branch_id) : "",
    description: editDepartment?.description || "",
    is_active: editDepartment?.is_active ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = "Kode departemen wajib diisi";
    if (!formData.name.trim()) newErrors.name = "Nama departemen wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      branch_id: formData.branch_id ? Number(formData.branch_id) : null,
      description: formData.description.trim() || undefined,
      ...(editDepartment && { is_active: formData.is_active }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="code"
          label="Kode Departemen"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
          placeholder="Contoh: HRGA"
          error={errors.code}
          maxLength={20}
        />
        <Input
          id="name"
          label="Nama Departemen"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Contoh: Human Resource & General Affair"
          error={errors.name}
        />
      </div>

      <SearchableSelect
        label="Cabang (Opsional)"
        value={formData.branch_id}
        onChange={(val) => handleChange("branch_id", val)}
        options={[
          { value: "", label: "Semua Cabang" },
          ...branches.map((b) => ({ value: String(b.id), label: b.name })),
        ]}
        placeholder="Pilih cabang atau kosongkan untuk semua cabang"
        searchPlaceholder="Cari cabang..."
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Deskripsi
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Deskripsi singkat departemen (opsional)"
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
          )}
        />
      </div>

      {editDepartment && (
        <div className="pt-2">
          <Toggle
            checked={formData.is_active}
            onChange={(checked) => handleChange("is_active", checked)}
            label="Departemen Aktif"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-(--border)">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {editDepartment ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// SKELETON TABLE
// ════════════════════════════════════════════

function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border)">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border) bg-(--muted)/50">
              {["Kode", "Nama", "Cabang", "Deskripsi", "Status", "Aksi"].map((h) => (
                <th key={h} className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-(--border)">
                <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                <td className="px-5 py-4"><Skeleton className="h-4 w-48" /></td>
                <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                <td className="px-5 py-4"><Skeleton className="h-4 w-64" /></td>
                <td className="px-5 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function DepartmentPage() {
  const { data: branches } = useBranchList();

  // Filter state
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "active" | "inactive">("");
  const [searchQuery, setSearchQuery] = useState("");

  const params = {
    branch_id: filterBranch ? parseInt(filterBranch) : undefined,
    is_active:
      filterStatus === "active"
        ? true
        : filterStatus === "inactive"
          ? false
          : undefined,
  };

  const { data: departments, loading, refetch } = useDepartmentList(params);
  const {
    loading: mutationLoading,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartmentMutations(refetch);

  const [showForm, setShowForm] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  // Client-side search filter
  const filtered = departments?.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.code.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      (d.description?.toLowerCase().includes(q) ?? false)
    );
  }) ?? [];

  const handleCreate = async (payload: CreateDepartmentPayload | UpdateDepartmentPayload) => {
    const result = await createDepartment(payload as CreateDepartmentPayload);
    if (result) setShowForm(false);
  };

  const handleUpdate = async (payload: CreateDepartmentPayload | UpdateDepartmentPayload) => {
    if (!editDepartment) return;
    const result = await updateDepartment(editDepartment.id, payload as UpdateDepartmentPayload);
    if (result) setEditDepartment(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteDepartment(deleteTarget.id);
    if (result) setDeleteTarget(null);
  };

  const branchOptions = branches?.map((b) => ({ id: b.id, name: b.name })) || [];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-(--foreground) md:text-2xl">
              Departemen
            </h1>
            <p className="text-sm text-(--muted-foreground)">
              Kelola unit organisasi di dalam cabang
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            className="self-start sm:self-auto"
          >
            <Plus size={16} />
            Tambah Departemen
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode atau nama departemen..."
              className={cn(
                "w-full rounded-lg border bg-(--input) pl-9 pr-4 py-2 text-sm text-(--foreground)",
                "border-(--border) placeholder:text-(--muted-foreground)",
                "transition-colors duration-200",
                "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
              )}
            />
          </div>

          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className={cn(
              "rounded-lg border bg-(--input) px-4 py-2 text-sm text-(--foreground)",
              "border-(--border) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
            )}
          >
            <option value="">Semua Cabang</option>
            {branches?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "" | "active" | "inactive")
            }
            className={cn(
              "rounded-lg border bg-(--input) px-4 py-2 text-sm text-(--foreground)",
              "border-(--border) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
            )}
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonTable />
        ) : !filtered || filtered.length === 0 ? (
          <EmptyState
            title={
              searchQuery
                ? "Departemen tidak ditemukan"
                : "Belum ada data departemen"
            }
            description={
              searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Tambahkan departemen baru untuk memulai"
            }
            icon={<Network className="h-12 w-12" />}
            action={
              !searchQuery && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} />
                  Tambah Departemen
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-(--border) bg-(--muted)/50">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                        Kode
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                        Nama
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                        Cabang
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                        Deskripsi
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                        Status
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((dept, index) => (
                      <tr
                        key={dept.id}
                        className={cn(
                          "border-b border-(--border) last:border-b-0",
                          index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                        )}
                      >
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-md bg-(--primary)/10 px-2 py-0.5 text-xs font-bold text-(--primary)">
                            {dept.code}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-medium text-(--foreground)">
                            {dept.name}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-(--muted-foreground)">
                          {dept.branch_name || (
                            <span className="italic text-(--muted-foreground)">
                              Semua Cabang
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-(--muted-foreground) max-w-xs truncate">
                          {dept.description || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              dept.is_active
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                            )}
                          >
                            {dept.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setEditDepartment(dept)}
                              className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(dept)}
                              className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-red-500/10 hover:text-red-500"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {filtered.map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-xl border border-(--border) bg-(--card) p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center rounded-md bg-(--primary)/10 px-2 py-0.5 text-xs font-bold text-(--primary)">
                          {dept.code}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            dept.is_active
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                          )}
                        >
                          {dept.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="font-semibold text-(--foreground)">{dept.name}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-(--muted-foreground)">
                        <Building2 size={12} />
                        {dept.branch_name || "Semua Cabang"}
                      </div>
                      {dept.description && (
                        <p className="mt-1 text-xs text-(--muted-foreground) line-clamp-2">
                          {dept.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditDepartment(dept)}
                        className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(dept)}
                        className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={showForm}
        title="Tambah Departemen"
        onClose={() => setShowForm(false)}
      >
        <DepartmentForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          branches={branchOptions}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editDepartment}
        title="Edit Departemen"
        onClose={() => setEditDepartment(null)}
      >
        {editDepartment && (
          <DepartmentForm
            onClose={() => setEditDepartment(null)}
            onSubmit={handleUpdate}
            editDepartment={editDepartment}
            branches={branchOptions}
            isLoading={mutationLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Departemen"
        message={`Apakah Anda yakin ingin menghapus departemen "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={mutationLoading}
      />
    </MainLayout>
  );
}