import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Building2,
  MapPin,
  Navigation,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { useBranchList, useBranchMutations } from "@/hooks/useBranch";
import type { Branch, CreateBranchPayload } from "@/types/branch";

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

// ════════════════════════════════════════════
// BRANCH FORM
// ════════════════════════════════════════════

function BranchForm({
  onClose,
  onSubmit,
  editBranch,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateBranchPayload) => void;
  editBranch?: Branch;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    code: editBranch?.code || "",
    name: editBranch?.name || "",
    address: editBranch?.address || "",
    latitude: editBranch?.latitude?.toString() || "",
    longitude: editBranch?.longitude?.toString() || "",
    radius_meters: editBranch?.radius_meters?.toString() || "100",
    allow_wfh: editBranch?.allow_wfh || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = "Kode cabang wajib diisi";
    if (!formData.name.trim()) newErrors.name = "Nama cabang wajib diisi";
    if (formData.latitude && isNaN(Number.parseFloat(formData.latitude))) {
      newErrors.latitude = "Latitude tidak valid";
    }
    if (formData.longitude && isNaN(Number.parseFloat(formData.longitude))) {
      newErrors.longitude = "Longitude tidak valid";
    }
    if (
      formData.radius_meters &&
      isNaN(Number.parseInt(formData.radius_meters))
    ) {
      newErrors.radius_meters = "Radius tidak valid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateBranchPayload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      address: formData.address.trim() || undefined,
      latitude: formData.latitude
        ? Number.parseFloat(formData.latitude)
        : undefined,
      longitude: formData.longitude
        ? Number.parseFloat(formData.longitude)
        : undefined,
      radius_meters: formData.radius_meters
        ? Number.parseInt(formData.radius_meters)
        : undefined,
      allow_wfh: formData.allow_wfh,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="code"
          label="Kode Cabang"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value)}
          placeholder="Contoh: HQ-SBY"
          error={errors.code}
        />
        <Input
          id="name"
          label="Nama Cabang"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Contoh: Kantor Pusat Surabaya"
          error={errors.name}
        />
      </div>

      <Input
        id="address"
        label="Alamat"
        value={formData.address}
        onChange={(e) => handleChange("address", e.target.value)}
        placeholder="Alamat lengkap cabang"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="latitude"
          label="Latitude"
          type="number"
          step="any"
          value={formData.latitude}
          onChange={(e) => handleChange("latitude", e.target.value)}
          placeholder="-7.2575"
          error={errors.latitude}
        />
        <Input
          id="longitude"
          label="Longitude"
          type="number"
          step="any"
          value={formData.longitude}
          onChange={(e) => handleChange("longitude", e.target.value)}
          placeholder="112.7521"
          error={errors.longitude}
        />
      </div>

      <Input
        id="radius_meters"
        label="Radius Presensi (meter)"
        type="number"
        value={formData.radius_meters}
        onChange={(e) => handleChange("radius_meters", e.target.value)}
        placeholder="100"
        error={errors.radius_meters}
      />

      <div className="pt-2">
        <Toggle
          checked={formData.allow_wfh}
          onChange={(checked) => handleChange("allow_wfh", checked)}
          label="Izinkan Work From Home (WFH)"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {editBranch ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// BRANCH CARD
// ════════════════════════════════════════════

function BranchCard({
  branch,
  onEdit,
  onDelete,
}: {
  branch: Branch;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border) bg-(--card) transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="border-b border-(--border) bg-(--muted)/30 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-(--primary)/10 px-2 py-0.5 text-xs font-medium text-(--primary)">
                {branch.code}
              </span>
              {branch.allow_wfh && (
                <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                  <Home size={12} />
                  WFH
                </span>
              )}
            </div>
            <h3 className="mt-2 font-semibold text-(--foreground)">
              {branch.name}
            </h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-red-500/10 hover:text-red-500"
              title="Hapus"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 px-5 py-4">
        {branch.address && (
          <div className="flex items-start gap-2">
            <MapPin
              size={16}
              className="mt-0.5 shrink-0 text-(--muted-foreground)"
            />
            <span className="text-sm text-(--muted-foreground)">
              {branch.address}
            </span>
          </div>
        )}

        {(branch.latitude || branch.longitude) && (
          <div className="flex items-center gap-2">
            <Navigation
              size={16}
              className="shrink-0 text-(--muted-foreground)"
            />
            <span className="text-sm font-mono text-(--muted-foreground)">
              {branch.latitude?.toFixed(6)}, {branch.longitude?.toFixed(6)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-(--border)">
          <span className="text-xs text-(--muted-foreground)">
            Radius presensi
          </span>
          <span className="text-sm font-semibold text-(--foreground)">
            {branch.radius_meters} meter
          </span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// SKELETON CARDS
// ════════════════════════════════════════════

function SkeletonCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-(--border) bg-(--card)"
        >
          <div className="border-b border-(--border) bg-(--muted)/30 px-5 py-4">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="space-y-3 px-5 py-4">
            <div className="flex items-start gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-(--border)">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function BranchPage() {
  const { data: branches, loading, refetch } = useBranchList();
  const {
    loading: mutationLoading,
    createBranch,
    updateBranch,
    deleteBranch,
  } = useBranchMutations(refetch);

  const [showForm, setShowForm] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);

  const handleCreate = async (payload: CreateBranchPayload) => {
    const result = await createBranch(payload);
    if (result) {
      setShowForm(false);
    }
  };

  const handleUpdate = async (payload: CreateBranchPayload) => {
    if (!editBranch) return;
    const result = await updateBranch(editBranch.id, payload);
    if (result) {
      setEditBranch(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteBranch(deleteTarget.id);
    if (result) {
      setDeleteTarget(null);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-(--foreground) md:text-2xl">
              Cabang
            </h1>
            <p className="text-sm text-(--muted-foreground)">
              Kelola data lokasi kantor/cabang + konfigurasi GPS radius
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            className="self-start sm:self-auto"
          >
            <Plus size={16} />
            Tambah Cabang
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonCards />
        ) : !branches || branches.length === 0 ? (
          <EmptyState
            title="Belum ada data cabang"
            description="Tambahkan cabang baru untuk memulai"
            icon={<Building2 className="h-12 w-12" />}
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Tambah Cabang
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onEdit={() => setEditBranch(branch)}
                onDelete={() => setDeleteTarget(branch)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={showForm}
        title="Tambah Cabang"
        onClose={() => setShowForm(false)}
      >
        <BranchForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editBranch}
        title="Edit Cabang"
        onClose={() => setEditBranch(null)}
      >
        {editBranch && (
          <BranchForm
            onClose={() => setEditBranch(null)}
            onSubmit={handleUpdate}
            editBranch={editBranch}
            isLoading={mutationLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Cabang"
        message={`Apakah Anda yakin ingin menghapus cabang "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={mutationLoading}
      />
    </MainLayout>
  );
}
