import { useState } from "react";
import { Plus, Pencil, Trash2, X, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { usePositionList, usePositionMutations } from "@/hooks/usePosition";
import type { JobPosition, CreatePositionPayload } from "@/types/job-position";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-(--border) bg-(--card)"
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
        <div className="p-5">{children}</div>
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
// POSITION FORM
// ════════════════════════════════════════════

function PositionForm({
  onClose,
  onSubmit,
  editPosition,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreatePositionPayload) => void;
  editPosition?: JobPosition;
  isLoading?: boolean;
}) {
  const [title, setTitle] = useState(editPosition?.title || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Nama jabatan wajib diisi");
      return;
    }
    onSubmit({ title: title.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Nama Jabatan"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError("");
        }}
        placeholder="Contoh: Manager HRD"
        error={error}
        autoFocus
      />

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
          {editPosition ? "Simpan" : "Tambah"}
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
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-(--border) bg-(--card) px-5 py-4"
        >
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function PositionPage() {
  const { data: positions, loading, refetch } = usePositionList();
  const {
    loading: mutationLoading,
    createPosition,
    updatePosition,
    deletePosition,
  } = usePositionMutations(refetch);

  const [showForm, setShowForm] = useState(false);
  const [editPosition, setEditPosition] = useState<JobPosition | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobPosition | null>(null);

  const handleCreate = async (payload: CreatePositionPayload) => {
    const result = await createPosition(payload);
    if (result) {
      setShowForm(false);
    }
  };

  const handleUpdate = async (payload: CreatePositionPayload) => {
    if (!editPosition) return;
    const result = await updatePosition(editPosition.id, payload);
    if (result) {
      setEditPosition(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deletePosition(deleteTarget.id);
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
              Jabatan
            </h1>
            <p className="text-sm text-(--muted-foreground)">
              Kelola data jabatan/posisi organisasi
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            className="self-start sm:self-auto"
          >
            <Plus size={16} />
            Tambah Jabatan
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonTable />
        ) : !positions || positions.length === 0 ? (
          <EmptyState
            title="Belum ada data jabatan"
            description="Tambahkan jabatan baru untuk memulai"
            icon={<Briefcase className="h-12 w-12" />}
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Tambah Jabatan
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-(--border)">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--muted)/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                    Nama Jabatan
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => (
                  <tr
                    key={position.id}
                    className={cn(
                      "border-b border-(--border) last:border-b-0",
                      index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                    )}
                  >
                    <td className="px-5 py-4">
                      <span className="font-medium text-(--foreground)">
                        {position.title}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditPosition(position)}
                          className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(position)}
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
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={showForm}
        title="Tambah Jabatan"
        onClose={() => setShowForm(false)}
      >
        <PositionForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editPosition}
        title="Edit Jabatan"
        onClose={() => setEditPosition(null)}
      >
        {editPosition && (
          <PositionForm
            onClose={() => setEditPosition(null)}
            onSubmit={handleUpdate}
            editPosition={editPosition}
            isLoading={mutationLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Jabatan"
        message={`Apakah Anda yakin ingin menghapus jabatan "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={mutationLoading}
      />
    </MainLayout>
  );
}
