import { useState } from "react";
import { Plus, Pencil, Trash2, CalendarOff, X } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLeaveTypeList, useLeaveTypeMutations } from "@/hooks/useLeaveType";
import { useLeaveTypeMetadata } from "@/hooks/useMetadata";
import type {
  LeaveType,
  LeaveCategory,
  CreateLeaveTypePayload,
} from "@/types/leave";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { cn } from "@/lib/utils";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { PermissionGate } from "@/components/ui/PermissionGate";
import { PERMISSIONS } from "@/constants/permission";

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

export function LeaveTypePage() {
  const { data: leaveTypes, loading, refetch } = useLeaveTypeList();
  const { data: metadata } = useLeaveTypeMetadata();
  const { createLeaveType, updateLeaveType, deleteLeaveType } =
    useLeaveTypeMutations(() => {
      setIsModalOpen(false);
      refetch();
    });

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<LeaveType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateLeaveTypePayload>({
    name: "",
    category: "annual",
    requires_document: false,
    requires_document_type: "",
    max_duration_per_request: null,
    max_duration_unit: "days",
    max_occurrences_per_year: null,
    max_total_duration_per_year: null,
    max_total_duration_unit: "days",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenModal = (leaveType?: LeaveType) => {
    if (leaveType) {
      setEditingLeaveType(leaveType);
      setFormData({
        name: leaveType.name,
        category: leaveType.category,
        requires_document: leaveType.requires_document,
        requires_document_type: leaveType.requires_document_type || "",
        max_duration_per_request: leaveType.max_duration_per_request,
        max_duration_unit: leaveType.max_duration_unit || "days",
        max_occurrences_per_year: leaveType.max_occurrences_per_year,
        max_total_duration_per_year: leaveType.max_total_duration_per_year,
        max_total_duration_unit: leaveType.max_total_duration_unit || "days",
      });
    } else {
      setEditingLeaveType(null);
      setFormData({
        name: "",
        category: "annual",
        requires_document: false,
        requires_document_type: "",
        max_duration_per_request: null,
        max_duration_unit: "days",
        max_occurrences_per_year: null,
        max_total_duration_per_year: null,
        max_total_duration_unit: "days",
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLeaveType(null);
    setErrors({});
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteLeaveType(deleteTarget.id);
      refetch();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama jenis cuti wajib diisi";
    if (
      formData.requires_document &&
      !formData.requires_document_type?.trim()
    ) {
      newErrors.requires_document_type = "Jenis dokumen wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      if (editingLeaveType) {
        await updateLeaveType(editingLeaveType.id, formData);
      } else {
        await createLeaveType(formData);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryLabel = (cat: LeaveCategory) => {
    const opt = metadata?.category_meta?.find((o) => o.id === cat);
    return opt ? opt.name : cat;
  };

  const filteredLeaveTypes =
    leaveTypes?.filter(
      (lt) => filterCategory === "all" || lt.category === filterCategory,
    ) || [];

  // Convert metadata options for Select component
  const categoryOptions = (metadata?.category_meta || []).map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const unitOptions = (metadata?.duration_unit_meta || []).map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const filterOptions = [
    { value: "all", label: "Semua Kategori" },
    ...categoryOptions,
  ];

  return (
    <MainLayout>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 flex flex-col gap-3 border-b border-(--border) bg-(--card) px-4 py-3 sm:px-6 sm:py-3.5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-sm font-bold tracking-wide text-(--foreground) md:text-lg">
            Jenis Cuti
          </h1>
          <p className="text-[10px] text-(--muted-foreground) md:text-xs">
            Kelola master data jenis cuti dan peraturannya.
          </p>
        </div>
        <PermissionGate permission={PERMISSIONS.LEAVE_TYPE_CREATE}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto"
        >
          <Plus size={16} /> Tambah Jenis Cuti
        </Button>
        </PermissionGate>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <div className="w-48">
          <SearchableSelect
            value={filterCategory}
            onChange={(value) => setFilterCategory(value)}
            options={filterOptions}
          />
        </div>
        {/* Filter Section */}
        <div className="rounded-xl border border-(--border) bg-(--card) shadow-sm">
          {/* Table / Content */}
          {loading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredLeaveTypes.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Tidak ada data"
                description="Belum ada data jenis cuti."
                icon={<CalendarOff className="h-12 w-12" />}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    <th className="px-4 py-3 font-medium text-(--muted-foreground)">
                      Nama
                    </th>
                    <th className="px-4 py-3 font-medium text-(--muted-foreground)">
                      Kategori
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 font-medium text-(--muted-foreground)">
                      Maks/Request
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 font-medium text-(--muted-foreground)">
                      Maks/Tahun
                    </th>
                    <th className="hidden sm:table-cell px-4 py-3 font-medium text-(--muted-foreground)">
                      Wajib Dokumen
                    </th>
                    <th className="px-4 py-3 font-medium text-(--muted-foreground) text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--border)">
                  {filteredLeaveTypes.map((lt) => (
                    <tr
                      key={lt.id}
                      className="hover:bg-(--muted)/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-(--foreground)">
                        {lt.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-(--primary)/10 px-2 py-0.5 text-xs font-semibold text-(--primary)">
                          {getCategoryLabel(lt.category)}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-(--muted-foreground)">
                        {lt.max_duration_per_request
                          ? `${lt.max_duration_per_request} ${lt.max_duration_unit === "days" ? "Hari" : "Jam"}`
                          : "-"}
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-(--muted-foreground)">
                        {lt.max_total_duration_per_year
                          ? `${lt.max_total_duration_per_year} ${lt.max_total_duration_unit === "days" ? "Hari" : "Jam"}`
                          : "-"}
                        {lt.max_occurrences_per_year &&
                          ` (${lt.max_occurrences_per_year}x)`}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-(--muted-foreground)">
                        {lt.requires_document ? (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            Ya
                            {lt.requires_document_type &&
                              ` (${lt.requires_document_type})`}
                          </span>
                        ) : (
                          "Tidak"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <PermissionGate permission={PERMISSIONS.LEAVE_TYPE_UPDATE}>
                          <button
                            onClick={() => handleOpenModal(lt)}
                            className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          </PermissionGate>
                          <PermissionGate permission={PERMISSIONS.LEAVE_TYPE_DELETE}>
                          <button
                            onClick={() => setDeleteTarget(lt)}
                            className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:bg-red-500/10 hover:text-red-500"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                          </PermissionGate>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        open={isModalOpen}
        title={editingLeaveType ? "Edit Jenis Cuti" : "Tambah Jenis Cuti"}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            id="name"
            label="Nama Jenis Cuti"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="Contoh: Cuti Melahirkan"
            error={errors.name}
            autoFocus
          />

          <SearchableSelect
            label="Kategori"
            value={formData.category}
            onChange={(value) =>
              setFormData({ ...formData, category: value as LeaveCategory })
            }
            options={categoryOptions}
            placeholder="Pilih kategori"
            searchPlaceholder="Cari kategori..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="max_duration_per_request"
              label="Maks Durasi / Request"
              type="number"
              value={formData.max_duration_per_request ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_duration_per_request: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              placeholder="Opsional"
            />
            <SearchableSelect
              label="Satuan"
              value={formData.max_duration_unit || "days"}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  max_duration_unit: value as "days" | "hours",
                })
              }
              options={unitOptions}
              placeholder="Pilih satuan"
              searchPlaceholder="Cari satuan..."
            />
          </div>

          <Input
            id="max_occurrences_per_year"
            label="Maks Frekuensi / Tahun"
            type="number"
            value={formData.max_occurrences_per_year ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_occurrences_per_year: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            placeholder="Opsional"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="max_total_duration_per_year"
              label="Maks Total Durasi / Tahun"
              type="number"
              value={formData.max_total_duration_per_year ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_total_duration_per_year: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              placeholder="Opsional"
            />
            <SearchableSelect
              label="Satuan"
              value={formData.max_total_duration_unit || "days"}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  max_total_duration_unit: value as "days" | "hours",
                })
              }
              options={unitOptions}
              placeholder="Pilih satuan"
              searchPlaceholder="Cari satuan..."
            />
          </div>

          <Toggle
            label="Wajib Lampirkan Dokumen"
            checked={formData.requires_document}
            onChange={(checked) =>
              setFormData({ ...formData, requires_document: checked })
            }
          />

          {formData.requires_document && (
            <Input
              id="requires_document_type"
              label="Jenis Dokumen yang Dibutuhkan"
              value={formData.requires_document_type || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  requires_document_type: e.target.value,
                });
                setErrors((prev) => ({ ...prev, requires_document_type: "" }));
              }}
              placeholder="Contoh: Surat Dokter, FC Kartu Keluarga"
              error={errors.requires_document_type}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingLeaveType ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Jenis Cuti"
        message={`Apakah Anda yakin ingin menghapus jenis cuti "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </MainLayout>
  );
}
