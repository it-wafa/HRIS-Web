import { useState, useMemo } from "react";
import {
  Plus,
  X,
  Plane,
  Timer,
  LogOut,
  ListFilter,
  Eye,
  Check,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, Input } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  usePermissionRequestList,
  usePermissionRequestMutations,
} from "@/hooks/usePermissionRequest";
import {
  useBusinessTripList,
  useBusinessTripMutations,
} from "@/hooks/useBusinessTrip";
import { useOvertimeList, useOvertimeMutations } from "@/hooks/useOvertime";
import { useEmployeeList } from "@/hooks/useEmployee";
import {
  PERMISSION_TYPE_OPTIONS,
  PERMISSION_STATUS_OPTIONS,
  type PermissionType,
  type RequestStatus,
  type PermissionRequest,
  type CreatePermissionPayload,
} from "@/types/permission-request";
import {
  TRIP_STATUS_OPTIONS,
  type TripStatus,
  type BusinessTripRequest,
  type CreateBusinessTripPayload,
} from "@/types/business-trip";
import {
  WORK_LOCATION_OPTIONS,
  OVERTIME_STATUS_OPTIONS,
  type OvertimeStatus,
  type OvertimeRequest,
  type CreateOvertimePayload,
} from "@/types/overtime";

// ════════════════════════════════════════════
// STATUS BADGES
// ════════════════════════════════════════════

const STATUS_COLORS: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Menunggu",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  approved: {
    label: "Disetujui",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-nowrap",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

// ════════════════════════════════════════════
// SHARED APPROVAL ACTION BUTTONS
// ════════════════════════════════════════════

function ApprovalActions({
  status,
  onDetail,
  onApprove,
  onReject,
}: {
  status: string;
  onDetail: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDetail}
        className="h-7 px-2 text-xs"
      >
        <Eye size={13} />
        Detail
      </Button>
      {status === "pending" && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onApprove}
            className="h-7 px-2 text-xs text-green-700 hover:bg-green-500/10 dark:text-green-400"
          >
            <Check size={13} />
            Setuju
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReject}
            className="h-7 px-2 text-xs text-red-600 hover:bg-red-500/10"
          >
            <Ban size={13} />
            Tolak
          </Button>
        </>
      )}
    </div>
  );
}

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
// SKELETON
// ════════════════════════════════════════════

function SkeletonTable({ cols = 6 }: { cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border)">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border) bg-(--muted)/50">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-(--border)">
                {Array.from({ length: cols }).map((_, j) => (
                  <td key={j} className="px-5 py-4">
                    <Skeleton className="h-4 w-full max-w-28" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// PERMISSION DETAIL MODAL
// ════════════════════════════════════════════

function PermissionDetailModal({
  request,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: {
  request: PermissionRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: (notes: string) => void;
  isLoading?: boolean;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
          <h3 className="text-sm font-bold text-(--foreground)">
            Detail Izin Kehadiran
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                {request.employee_name || "—"}
              </p>
              <p className="text-xs text-(--muted-foreground)">
                {formatDate(request.date)}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-(--muted-foreground)">Tipe Izin</p>
                <p className="text-sm font-medium text-(--foreground)">
                  {PERMISSION_TYPE_OPTIONS.find(
                    (o) => o.value === request.permission_type,
                  )?.label || request.permission_type}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--muted-foreground)">Jam</p>
                <p className="text-sm text-(--foreground)">
                  {request.leave_time || request.return_time
                    ? [request.leave_time, request.return_time]
                        .filter(Boolean)
                        .join(" — ")
                    : "—"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground) mb-1">Alasan</p>
              <p className="text-sm text-(--foreground)">{request.reason}</p>
            </div>
            {request.document_url && (
              <div>
                <p className="text-xs text-(--muted-foreground) mb-1">
                  Dokumen
                </p>
                <a
                  href={request.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-(--primary) hover:underline"
                >
                  Lihat Dokumen →
                </a>
              </div>
            )}
            {request.approver_notes && (
              <div>
                <p className="text-xs text-(--muted-foreground) mb-1">
                  Catatan Approver
                </p>
                <p className="text-sm text-(--foreground) italic">
                  "{request.approver_notes}"
                </p>
              </div>
            )}
          </div>

          {rejectMode && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-(--foreground) opacity-80">
                Catatan Penolakan *
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Jelaskan alasan penolakan..."
                rows={3}
                className="w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground) border-(--border) placeholder:text-(--muted-foreground) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-(--border) px-5 py-3">
          {request.status === "pending" && !rejectMode && (
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Tutup
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectMode(true)}
                className="text-red-600 hover:bg-red-500/10"
              >
                <Ban size={14} />
                Tolak
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onApprove}
                isLoading={isLoading}
              >
                <Check size={14} />
                Setujui
              </Button>
            </>
          )}
          {request.status === "pending" && rejectMode && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectMode(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onReject(rejectNotes)}
                isLoading={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                Konfirmasi Tolak
              </Button>
            </>
          )}
          {request.status !== "pending" && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// BUSINESS TRIP DETAIL MODAL
// ════════════════════════════════════════════

function BusinessTripDetailModal({
  trip,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: {
  trip: BusinessTripRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: (notes: string) => void;
  isLoading?: boolean;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
          <h3 className="text-sm font-bold text-(--foreground)">
            Detail Dinas Luar
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                {trip.employee_name || "—"}
              </p>
              <p className="text-xs text-(--muted-foreground)">
                → {trip.destination}
              </p>
            </div>
            <StatusBadge status={trip.status} />
          </div>

          <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-(--muted-foreground)">Tujuan</p>
                <p className="text-sm font-medium text-(--foreground)">
                  {trip.destination}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--muted-foreground)">Durasi</p>
                <p className="text-sm text-(--foreground)">
                  {trip.total_days} hari
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-(--muted-foreground)">Periode</p>
                <p className="text-sm text-(--foreground)">
                  {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground) mb-1">
                Keperluan
              </p>
              <p className="text-sm text-(--foreground)">{trip.purpose}</p>
            </div>
            {trip.document_url && (
              <div>
                <p className="text-xs text-(--muted-foreground) mb-1">
                  Surat Tugas
                </p>
                <a
                  href={trip.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-(--primary) hover:underline"
                >
                  Lihat Dokumen →
                </a>
              </div>
            )}
            {trip.approver_notes && (
              <div>
                <p className="text-xs text-(--muted-foreground) mb-1">
                  Catatan Approver
                </p>
                <p className="text-sm text-(--foreground) italic">
                  "{trip.approver_notes}"
                </p>
              </div>
            )}
          </div>

          {rejectMode && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-(--foreground) opacity-80">
                Catatan Penolakan *
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Jelaskan alasan penolakan..."
                rows={3}
                className="w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground) border-(--border) placeholder:text-(--muted-foreground) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-(--border) px-5 py-3">
          {trip.status === "pending" && !rejectMode && (
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Tutup
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectMode(true)}
                className="text-red-600 hover:bg-red-500/10"
              >
                <Ban size={14} />
                Tolak
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onApprove}
                isLoading={isLoading}
              >
                <Check size={14} />
                Setujui
              </Button>
            </>
          )}
          {trip.status === "pending" && rejectMode && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectMode(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onReject(rejectNotes)}
                isLoading={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                Konfirmasi Tolak
              </Button>
            </>
          )}
          {trip.status !== "pending" && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// OVERTIME DETAIL MODAL
// ════════════════════════════════════════════

function OvertimeDetailModal({
  overtime: ot,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: {
  overtime: OvertimeRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: (notes: string) => void;
  isLoading?: boolean;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatDuration = (minutes: number) => {
    if (minutes <= 0) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h} jam${m > 0 ? ` ${m} menit` : ""}` : `${m} menit`;
  };

  const formatDateTime = (ts: string | null) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          <h3 className="text-sm font-bold text-(--foreground)">
            Detail Pengajuan Lembur
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                {ot.employee_name || "—"}
              </p>
              <p className="text-xs text-(--muted-foreground)">
                {formatDate(ot.overtime_date)}
              </p>
            </div>
            <StatusBadge status={ot.status} />
          </div>

          <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-(--muted-foreground)">
                  Durasi Rencana
                </p>
                <p className="text-sm font-medium text-(--foreground)">
                  {formatDuration(ot.planned_minutes)}
                </p>
              </div>
              {ot.actual_minutes !== null && (
                <div>
                  <p className="text-xs text-(--muted-foreground)">
                    Durasi Aktual
                  </p>
                  <p className="text-sm text-(--foreground)">
                    {formatDuration(ot.actual_minutes)}
                  </p>
                </div>
              )}
              {(ot.planned_start || ot.planned_end) && (
                <div>
                  <p className="text-xs text-(--muted-foreground)">
                    Jam Lembur
                  </p>
                  <p className="text-sm text-(--foreground)">
                    {formatDateTime(ot.planned_start)} —{" "}
                    {formatDateTime(ot.planned_end)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-(--muted-foreground)">
                  Lokasi Kerja
                </p>
                <p className="text-sm text-(--foreground)">
                  {WORK_LOCATION_OPTIONS.find(
                    (o) => o.value === ot.work_location_type,
                  )?.label || ot.work_location_type}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground) mb-1">
                Alasan Lembur
              </p>
              <p className="text-sm text-(--foreground)">{ot.reason}</p>
            </div>
            {ot.approver_notes && (
              <div>
                <p className="text-xs text-(--muted-foreground) mb-1">
                  Catatan Approver
                </p>
                <p className="text-sm text-(--foreground) italic">
                  "{ot.approver_notes}"
                </p>
              </div>
            )}
          </div>

          {rejectMode && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-(--foreground) opacity-80">
                Catatan Penolakan *
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Jelaskan alasan penolakan..."
                rows={3}
                className="w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground) border-(--border) placeholder:text-(--muted-foreground) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-(--border) px-5 py-3">
          {ot.status === "pending" && !rejectMode && (
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Tutup
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectMode(true)}
                className="text-red-600 hover:bg-red-500/10"
              >
                <Ban size={14} />
                Tolak
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onApprove}
                isLoading={isLoading}
              >
                <Check size={14} />
                Setujui
              </Button>
            </>
          )}
          {ot.status === "pending" && rejectMode && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectMode(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onReject(rejectNotes)}
                isLoading={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                Konfirmasi Tolak
              </Button>
            </>
          )}
          {ot.status !== "pending" && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// FORMS
// ════════════════════════════════════════════

function PermissionForm({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreatePermissionPayload) => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    permission_type: "out_of_office" as PermissionType,
    date: "",
    leave_time: "",
    return_time: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = "Tanggal wajib diisi";
    if (!formData.reason.trim()) newErrors.reason = "Alasan wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      permission_type: formData.permission_type,
      date: formData.date,
      leave_time: formData.leave_time || null,
      return_time: formData.return_time || null,
      reason: formData.reason.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SearchableSelect
        label="Tipe Izin"
        value={formData.permission_type}
        onChange={(val) =>
          setFormData((p) => ({ ...p, permission_type: val as PermissionType }))
        }
        options={PERMISSION_TYPE_OPTIONS}
        placeholder="Pilih tipe izin..."
      />
      <Input
        id="date"
        label="Tanggal"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
        error={errors.date}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="leave_time"
          label={
            formData.permission_type === "late_arrival"
              ? "Jam Tiba (perkiraan)"
              : "Jam Keluar"
          }
          type="time"
          value={formData.leave_time}
          onChange={(e) =>
            setFormData((p) => ({ ...p, leave_time: e.target.value }))
          }
        />
        {formData.permission_type === "out_of_office" && (
          <Input
            id="return_time"
            label="Jam Kembali"
            type="time"
            value={formData.return_time}
            onChange={(e) =>
              setFormData((p) => ({ ...p, return_time: e.target.value }))
            }
          />
        )}
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Alasan *
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) =>
            setFormData((p) => ({ ...p, reason: e.target.value }))
          }
          placeholder="Jelaskan alasan pengajuan izin..."
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
            errors.reason && "border-(--destructive)",
          )}
        />
        {errors.reason && (
          <p className="text-xs text-(--destructive)">{errors.reason}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-(--border)">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Ajukan Izin
        </Button>
      </div>
    </form>
  );
}

function BusinessTripForm({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateBusinessTripPayload) => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    purpose: "",
    document_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalDays = useMemo(() => {
    if (!formData.start_date || !formData.end_date) return 0;
    const diff = Math.ceil(
      (new Date(formData.end_date).getTime() -
        new Date(formData.start_date).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diff >= 0 ? diff + 1 : 0;
  }, [formData.start_date, formData.end_date]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.destination.trim())
      newErrors.destination = "Tujuan wajib diisi";
    if (!formData.start_date)
      newErrors.start_date = "Tanggal mulai wajib diisi";
    if (!formData.end_date) newErrors.end_date = "Tanggal selesai wajib diisi";
    if (!formData.purpose.trim())
      newErrors.purpose = "Tujuan perjalanan wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      destination: formData.destination.trim(),
      start_date: formData.start_date,
      end_date: formData.end_date,
      total_days: totalDays,
      purpose: formData.purpose.trim(),
      document_url: formData.document_url.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="destination"
        label="Tujuan Kota/Daerah *"
        value={formData.destination}
        onChange={(e) =>
          setFormData((p) => ({ ...p, destination: e.target.value }))
        }
        placeholder="Contoh: Jakarta, Bandung"
        error={errors.destination}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="start_date"
          label="Tanggal Mulai *"
          type="date"
          value={formData.start_date}
          onChange={(e) =>
            setFormData((p) => ({ ...p, start_date: e.target.value }))
          }
          error={errors.start_date}
        />
        <Input
          id="end_date"
          label="Tanggal Selesai *"
          type="date"
          value={formData.end_date}
          onChange={(e) =>
            setFormData((p) => ({ ...p, end_date: e.target.value }))
          }
          error={errors.end_date}
        />
      </div>
      {totalDays > 0 && (
        <p className="text-sm text-(--muted-foreground)">
          Total:{" "}
          <strong className="text-(--foreground)">{totalDays} hari</strong>
        </p>
      )}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Tujuan Perjalanan *
        </label>
        <textarea
          value={formData.purpose}
          onChange={(e) =>
            setFormData((p) => ({ ...p, purpose: e.target.value }))
          }
          placeholder="Jelaskan tujuan dan agenda perjalanan dinas..."
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
            errors.purpose && "border-(--destructive)",
          )}
        />
        {errors.purpose && (
          <p className="text-xs text-(--destructive)">{errors.purpose}</p>
        )}
      </div>
      <Input
        id="document_url"
        label="URL Surat Tugas (opsional)"
        value={formData.document_url}
        onChange={(e) =>
          setFormData((p) => ({ ...p, document_url: e.target.value }))
        }
        placeholder="https://..."
      />
      <div className="flex justify-end gap-2 pt-4 border-t border-(--border)">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Ajukan Dinas Luar
        </Button>
      </div>
    </form>
  );
}

function OvertimeForm({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateOvertimePayload) => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    attendance_log_id: "1",
    overtime_date: "",
    planned_start: "",
    planned_end: "",
    planned_minutes: "",
    reason: "",
    work_location_type: "office" as CreateOvertimePayload["work_location_type"],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatedMinutes = useMemo(() => {
    if (!formData.planned_start || !formData.planned_end) return 0;
    const today =
      formData.overtime_date || new Date().toISOString().split("T")[0];
    const start = new Date(`${today}T${formData.planned_start}`);
    const end = new Date(`${today}T${formData.planned_end}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    return diff > 0 ? diff : 0;
  }, [formData.planned_start, formData.planned_end, formData.overtime_date]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.overtime_date)
      newErrors.overtime_date = "Tanggal wajib diisi";
    if (!formData.reason.trim()) newErrors.reason = "Alasan wajib diisi";
    if (calculatedMinutes <= 0 && !formData.planned_minutes)
      newErrors.planned_minutes = "Durasi lembur wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const minutes =
      calculatedMinutes > 0
        ? calculatedMinutes
        : parseInt(formData.planned_minutes) || 0;
    onSubmit({
      attendance_log_id: parseInt(formData.attendance_log_id),
      overtime_date: formData.overtime_date,
      planned_start: formData.planned_start
        ? `${formData.overtime_date}T${formData.planned_start}:00Z`
        : undefined,
      planned_end: formData.planned_end
        ? `${formData.overtime_date}T${formData.planned_end}:00Z`
        : undefined,
      planned_minutes: minutes,
      reason: formData.reason.trim(),
      work_location_type: formData.work_location_type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="overtime_date"
        label="Tanggal Lembur *"
        type="date"
        value={formData.overtime_date}
        onChange={(e) =>
          setFormData((p) => ({ ...p, overtime_date: e.target.value }))
        }
        error={errors.overtime_date}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="planned_start"
          label="Jam Mulai (rencana)"
          type="time"
          value={formData.planned_start}
          onChange={(e) =>
            setFormData((p) => ({ ...p, planned_start: e.target.value }))
          }
        />
        <Input
          id="planned_end"
          label="Jam Selesai (rencana)"
          type="time"
          value={formData.planned_end}
          onChange={(e) =>
            setFormData((p) => ({ ...p, planned_end: e.target.value }))
          }
        />
      </div>
      {calculatedMinutes > 0 ? (
        <p className="text-sm text-(--muted-foreground)">
          Durasi:{" "}
          <strong className="text-(--foreground)">
            {Math.floor(calculatedMinutes / 60)} jam{" "}
            {calculatedMinutes % 60 > 0 ? `${calculatedMinutes % 60} mnt` : ""}
          </strong>
        </p>
      ) : (
        <Input
          id="planned_minutes"
          label="Durasi (menit) *"
          type="number"
          min="1"
          value={formData.planned_minutes}
          onChange={(e) =>
            setFormData((p) => ({ ...p, planned_minutes: e.target.value }))
          }
          placeholder="Contoh: 120"
          error={errors.planned_minutes}
        />
      )}
      <SearchableSelect
        label="Lokasi Kerja"
        value={formData.work_location_type}
        onChange={(val) =>
          setFormData((p) => ({
            ...p,
            work_location_type:
              val as CreateOvertimePayload["work_location_type"],
          }))
        }
        options={WORK_LOCATION_OPTIONS}
        placeholder="Pilih lokasi..."
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Alasan Lembur *
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) =>
            setFormData((p) => ({ ...p, reason: e.target.value }))
          }
          placeholder="Jelaskan pekerjaan yang diselesaikan saat lembur..."
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
            errors.reason && "border-(--destructive)",
          )}
        />
        {errors.reason && (
          <p className="text-xs text-(--destructive)">{errors.reason}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-(--border)">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Ajukan Lembur
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// TAB 1: IZIN KEHADIRAN
// ════════════════════════════════════════════

function PermissionTab() {
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [detailRequest, setDetailRequest] = useState<PermissionRequest | null>(
    null,
  );

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      status: filterStatus as RequestStatus | undefined,
      permission_type: filterType as PermissionType | undefined,
    }),
    [filterEmployee, filterStatus, filterType],
  );

  const { data: requests, loading, refetch } = usePermissionRequestList(params);
  const { data: employees } = useEmployeeList({ is_active: true });
  const {
    loading: mutLoading,
    createRequest,
    approveRequest,
    rejectRequest,
  } = usePermissionRequestMutations(refetch);

  const handleCreate = async (payload: CreatePermissionPayload) => {
    const result = await createRequest(payload);
    if (result) setShowForm(false);
  };

  const handleApprove = async (req: PermissionRequest) => {
    await approveRequest(req.id);
    setDetailRequest(null);
  };

  const handleReject = async (req: PermissionRequest, notes: string) => {
    await rejectRequest(req.id, notes);
    setDetailRequest(null);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <SearchableSelect
            value={filterEmployee}
            onChange={setFilterEmployee}
            options={[
              { value: "", label: "Semua Pegawai" },
              ...(employees?.map((e) => ({
                value: String(e.id),
                label: e.full_name,
              })) || []),
            ]}
            placeholder="Filter pegawai..."
            searchPlaceholder="Cari pegawai..."
          />
          <SearchableSelect
            value={filterType}
            onChange={setFilterType}
            options={[
              { value: "", label: "Semua Tipe" },
              ...PERMISSION_TYPE_OPTIONS,
            ]}
            placeholder="Filter tipe..."
          />
          <SearchableSelect
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "", label: "Semua Status" },
              ...PERMISSION_STATUS_OPTIONS.map((s) => ({
                value: s.value,
                label: s.label,
              })),
            ]}
            placeholder="Filter status..."
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(true)}
          className="self-start sm:self-auto"
        >
          <Plus size={16} />
          Ajukan Izin
        </Button>
      </div>

      {loading ? (
        <SkeletonTable cols={7} />
      ) : !requests || requests.length === 0 ? (
        <EmptyState
          title="Belum ada pengajuan izin"
          description="Ajukan izin kehadiran di sini"
          icon={<LogOut className="h-12 w-12" />}
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Ajukan Izin
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    {[
                      "Pegawai",
                      "Tipe Izin",
                      "Tanggal",
                      "Jam",
                      "Alasan",
                      "Status",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-5 py-3 ${h !== "Aksi" ? "text-left" : "text-center"} text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, index) => (
                    <tr
                      key={req.id}
                      className={cn(
                        "border-b border-(--border) last:border-b-0",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
                        {req.employee_name || "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                        {PERMISSION_TYPE_OPTIONS.find(
                          (o) => o.value === req.permission_type,
                        )?.label || req.permission_type}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground) whitespace-nowrap">
                        {formatDate(req.date)}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                        {req.leave_time || req.return_time
                          ? [req.leave_time, req.return_time]
                              .filter(Boolean)
                              .join(" — ")
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground) max-w-xs truncate">
                        {req.reason}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-5 py-3">
                        <ApprovalActions
                          status={req.status}
                          onDetail={() => setDetailRequest(req)}
                          onApprove={() => handleApprove(req)}
                          onReject={() => setDetailRequest(req)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-(--border) bg-(--card) p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-(--foreground)">
                      {req.employee_name || "—"}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {
                        PERMISSION_TYPE_OPTIONS.find(
                          (o) => o.value === req.permission_type,
                        )?.label
                      }
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-(--muted-foreground) mb-3">
                  <span>{formatDate(req.date)}</span>
                  {(req.leave_time || req.return_time) && (
                    <span>
                      {[req.leave_time, req.return_time]
                        .filter(Boolean)
                        .join(" — ")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-(--foreground) line-clamp-2 mb-3">
                  {req.reason}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailRequest(req)}
                    className="flex-1"
                  >
                    <Eye size={13} />
                    Detail
                  </Button>
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(req)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-green-500/10 px-2 py-1.5 text-xs font-medium text-green-700 hover:bg-green-500/20 transition-colors dark:text-green-400"
                      >
                        <Check size={12} />
                        Setuju
                      </button>
                      <button
                        onClick={() => setDetailRequest(req)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-500/10 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/20 transition-colors"
                      >
                        <Ban size={12} />
                        Tolak
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={showForm}
        title="Ajukan Izin"
        onClose={() => setShowForm(false)}
      >
        <PermissionForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutLoading}
        />
      </Modal>

      {detailRequest && (
        <PermissionDetailModal
          request={detailRequest}
          onClose={() => setDetailRequest(null)}
          onApprove={() => handleApprove(detailRequest)}
          onReject={(notes) => handleReject(detailRequest, notes)}
          isLoading={mutLoading}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// TAB 2: DINAS LUAR
// ════════════════════════════════════════════

function BusinessTripTab() {
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [detailTrip, setDetailTrip] = useState<BusinessTripRequest | null>(
    null,
  );

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      status: filterStatus as TripStatus | undefined,
    }),
    [filterEmployee, filterStatus],
  );

  const { data: trips, loading, refetch } = useBusinessTripList(params);
  const { data: employees } = useEmployeeList({ is_active: true });
  const {
    loading: mutLoading,
    createTrip,
    approveTrip,
    rejectTrip,
  } = useBusinessTripMutations(refetch);

  const handleCreate = async (payload: CreateBusinessTripPayload) => {
    const result = await createTrip(payload);
    if (result) setShowForm(false);
  };

  const handleApprove = async (trip: BusinessTripRequest) => {
    await approveTrip(trip.id);
    setDetailTrip(null);
  };

  const handleReject = async (trip: BusinessTripRequest, notes: string) => {
    await rejectTrip(trip.id, notes);
    setDetailTrip(null);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <SearchableSelect
            value={filterEmployee}
            onChange={setFilterEmployee}
            options={[
              { value: "", label: "Semua Pegawai" },
              ...(employees?.map((e) => ({
                value: String(e.id),
                label: e.full_name,
              })) || []),
            ]}
            placeholder="Filter pegawai..."
            searchPlaceholder="Cari pegawai..."
          />
          <SearchableSelect
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "", label: "Semua Status" },
              ...TRIP_STATUS_OPTIONS.map((s) => ({
                value: s.value,
                label: s.label,
              })),
            ]}
            placeholder="Filter status..."
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(true)}
          className="self-start sm:self-auto"
        >
          <Plus size={16} />
          Ajukan Dinas Luar
        </Button>
      </div>

      {loading ? (
        <SkeletonTable cols={7} />
      ) : !trips || trips.length === 0 ? (
        <EmptyState
          title="Belum ada pengajuan dinas luar"
          description="Ajukan perjalanan dinas di sini"
          icon={<Plane className="h-12 w-12" />}
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Ajukan Dinas Luar
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    {[
                      "Pegawai",
                      "Tujuan",
                      "Periode",
                      "Hari",
                      "Keperluan",
                      "Status",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip, index) => (
                    <tr
                      key={trip.id}
                      className={cn(
                        "border-b border-(--border) last:border-b-0",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
                        {trip.employee_name || "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {trip.destination}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground) whitespace-nowrap">
                        {formatDate(trip.start_date)} —{" "}
                        {formatDate(trip.end_date)}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-(--foreground)">
                        {trip.total_days}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground) max-w-xs truncate">
                        {trip.purpose}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={trip.status} />
                      </td>
                      <td className="px-5 py-3">
                        <ApprovalActions
                          status={trip.status}
                          onDetail={() => setDetailTrip(trip)}
                          onApprove={() => handleApprove(trip)}
                          onReject={() => setDetailTrip(trip)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-xl border border-(--border) bg-(--card) p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-(--foreground)">
                      {trip.employee_name || "—"}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      → {trip.destination}
                    </p>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
                <p className="text-xs text-(--muted-foreground) mb-3">
                  {formatDate(trip.start_date)} — {formatDate(trip.end_date)} (
                  {trip.total_days} hari)
                </p>
                <p className="text-xs text-(--foreground) line-clamp-2 mb-3">
                  {trip.purpose}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailTrip(trip)}
                    className="flex-1"
                  >
                    <Eye size={13} />
                    Detail
                  </Button>
                  {trip.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(trip)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-green-500/10 px-2 py-1.5 text-xs font-medium text-green-700 hover:bg-green-500/20 transition-colors dark:text-green-400"
                      >
                        <Check size={12} />
                        Setuju
                      </button>
                      <button
                        onClick={() => setDetailTrip(trip)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-500/10 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/20 transition-colors"
                      >
                        <Ban size={12} />
                        Tolak
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={showForm}
        title="Ajukan Dinas Luar"
        onClose={() => setShowForm(false)}
      >
        <BusinessTripForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutLoading}
        />
      </Modal>

      {detailTrip && (
        <BusinessTripDetailModal
          trip={detailTrip}
          onClose={() => setDetailTrip(null)}
          onApprove={() => handleApprove(detailTrip)}
          onReject={(notes) => handleReject(detailTrip, notes)}
          isLoading={mutLoading}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// TAB 3: LEMBUR
// ════════════════════════════════════════════

function OvertimeTab() {
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [detailOvertime, setDetailOvertime] = useState<OvertimeRequest | null>(
    null,
  );

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      status: filterStatus as OvertimeStatus | undefined,
    }),
    [filterEmployee, filterStatus],
  );

  const { data: overtimes, loading, refetch } = useOvertimeList(params);
  const { data: employees } = useEmployeeList({ is_active: true });
  const {
    loading: mutLoading,
    createOvertime,
    approveOvertime,
    rejectOvertime,
  } = useOvertimeMutations(refetch);

  const handleCreate = async (payload: CreateOvertimePayload) => {
    const result = await createOvertime(payload);
    if (result) setShowForm(false);
  };

  const handleApprove = async (ot: OvertimeRequest) => {
    await approveOvertime(ot.id);
    setDetailOvertime(null);
  };

  const handleReject = async (ot: OvertimeRequest, notes: string) => {
    await rejectOvertime(ot.id, notes);
    setDetailOvertime(null);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const formatDuration = (minutes: number) => {
    if (minutes <= 0) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}j ${m > 0 ? `${m}m` : ""}` : `${m}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <SearchableSelect
            value={filterEmployee}
            onChange={setFilterEmployee}
            options={[
              { value: "", label: "Semua Pegawai" },
              ...(employees?.map((e) => ({
                value: String(e.id),
                label: e.full_name,
              })) || []),
            ]}
            placeholder="Filter pegawai..."
            searchPlaceholder="Cari pegawai..."
          />
          <SearchableSelect
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "", label: "Semua Status" },
              ...OVERTIME_STATUS_OPTIONS.map((s) => ({
                value: s.value,
                label: s.label,
              })),
            ]}
            placeholder="Filter status..."
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(true)}
          className="self-start sm:self-auto"
        >
          <Plus size={16} />
          Ajukan Lembur
        </Button>
      </div>

      {loading ? (
        <SkeletonTable cols={8} />
      ) : !overtimes || overtimes.length === 0 ? (
        <EmptyState
          title="Belum ada pengajuan lembur"
          description="Ajukan lembur jika diperlukan"
          icon={<Timer className="h-12 w-12" />}
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Ajukan Lembur
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    {[
                      "Pegawai",
                      "Tanggal",
                      "Durasi Rencana",
                      "Durasi Aktual",
                      "Lokasi",
                      "Alasan",
                      "Status",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {overtimes.map((ot, index) => (
                    <tr
                      key={ot.id}
                      className={cn(
                        "border-b border-(--border) last:border-b-0",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
                        {ot.employee_name || "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground) whitespace-nowrap">
                        {formatDate(ot.overtime_date)}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {formatDuration(ot.planned_minutes)}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {ot.actual_minutes !== null
                          ? formatDuration(ot.actual_minutes)
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                        {WORK_LOCATION_OPTIONS.find(
                          (o) => o.value === ot.work_location_type,
                        )?.label || ot.work_location_type}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground) max-w-xs truncate">
                        {ot.reason}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={ot.status} />
                      </td>
                      <td className="px-5 py-3">
                        <ApprovalActions
                          status={ot.status}
                          onDetail={() => setDetailOvertime(ot)}
                          onApprove={() => handleApprove(ot)}
                          onReject={() => setDetailOvertime(ot)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {overtimes.map((ot) => (
              <div
                key={ot.id}
                className="rounded-xl border border-(--border) bg-(--card) p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-(--foreground)">
                      {ot.employee_name || "—"}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {formatDate(ot.overtime_date)}
                    </p>
                  </div>
                  <StatusBadge status={ot.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-(--muted-foreground) mb-3">
                  <div>
                    <p className="font-medium">Durasi Rencana</p>
                    <p>{formatDuration(ot.planned_minutes)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Lokasi</p>
                    <p>
                      {
                        WORK_LOCATION_OPTIONS.find(
                          (o) => o.value === ot.work_location_type,
                        )?.label
                      }
                    </p>
                  </div>
                </div>
                <p className="text-xs text-(--foreground) line-clamp-2 mb-3">
                  {ot.reason}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailOvertime(ot)}
                    className="flex-1"
                  >
                    <Eye size={13} />
                    Detail
                  </Button>
                  {ot.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(ot)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-green-500/10 px-2 py-1.5 text-xs font-medium text-green-700 hover:bg-green-500/20 transition-colors dark:text-green-400"
                      >
                        <Check size={12} />
                        Setuju
                      </button>
                      <button
                        onClick={() => setDetailOvertime(ot)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-500/10 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/20 transition-colors"
                      >
                        <Ban size={12} />
                        Tolak
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={showForm}
        title="Ajukan Lembur"
        onClose={() => setShowForm(false)}
      >
        <OvertimeForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutLoading}
        />
      </Modal>

      {detailOvertime && (
        <OvertimeDetailModal
          overtime={detailOvertime}
          onClose={() => setDetailOvertime(null)}
          onApprove={() => handleApprove(detailOvertime)}
          onReject={(notes) => handleReject(detailOvertime, notes)}
          isLoading={mutLoading}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// TAB 4: SEMUA PENGAJUAN
// ════════════════════════════════════════════

type AllRequestItem = {
  id: string;
  originalId: number;
  type: "permission" | "trip" | "overtime";
  typeLabel: string;
  employee: string;
  summary: string;
  date: string;
  status: string;
  originalData: PermissionRequest | BusinessTripRequest | OvertimeRequest;
};

function AllRequestsTab() {
  const { data: permissions, refetch: refetchPermissions } =
    usePermissionRequestList({});
  const { data: trips, refetch: refetchTrips } = useBusinessTripList({});
  const { data: overtimes, refetch: refetchOvertimes } = useOvertimeList({});

  const {
    approveRequest: approvePermission,
    rejectRequest: rejectPermission,
    loading: permLoading,
  } = usePermissionRequestMutations(refetchPermissions);
  const {
    approveTrip,
    rejectTrip,
    loading: tripLoading,
  } = useBusinessTripMutations(refetchTrips);
  const {
    approveOvertime,
    rejectOvertime,
    loading: overtimeLoading,
  } = useOvertimeMutations(refetchOvertimes);

  const [detailItem, setDetailItem] = useState<AllRequestItem | null>(null);

  const allRequests = useMemo(() => {
    const items: AllRequestItem[] = [];
    permissions?.forEach((p) =>
      items.push({
        id: `permission-${p.id}`,
        originalId: p.id,
        type: "permission",
        typeLabel: "Izin",
        employee: p.employee_name || "—",
        summary:
          PERMISSION_TYPE_OPTIONS.find((o) => o.value === p.permission_type)
            ?.label || p.permission_type,
        date: p.date,
        status: p.status,
        originalData: p,
      }),
    );
    trips?.forEach((t) =>
      items.push({
        id: `trip-${t.id}`,
        originalId: t.id,
        type: "trip",
        typeLabel: "Dinas Luar",
        employee: t.employee_name || "—",
        summary: t.destination,
        date: t.start_date,
        status: t.status,
        originalData: t,
      }),
    );
    overtimes?.forEach((o) =>
      items.push({
        id: `overtime-${o.id}`,
        originalId: o.id,
        type: "overtime",
        typeLabel: "Lembur",
        employee: o.employee_name || "—",
        summary: `${Math.floor(o.planned_minutes / 60)}j lembur`,
        date: o.overtime_date,
        status: o.status,
        originalData: o,
      }),
    );
    return items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [permissions, trips, overtimes]);

  const handleApprove = async (item: AllRequestItem) => {
    if (item.type === "permission") {
      await approvePermission(item.originalId);
    } else if (item.type === "trip") {
      await approveTrip(item.originalId);
    } else if (item.type === "overtime") {
      await approveOvertime(item.originalId);
    }
    setDetailItem(null);
  };

  const handleReject = async (item: AllRequestItem, notes: string) => {
    if (item.type === "permission") {
      await rejectPermission(item.originalId, notes);
    } else if (item.type === "trip") {
      await rejectTrip(item.originalId, notes);
    } else if (item.type === "overtime") {
      await rejectOvertime(item.originalId, notes);
    }
    setDetailItem(null);
  };

  const TYPE_COLORS: Record<string, string> = {
    Izin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Dinas Luar":
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    Lembur:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };

  const isLoading = permLoading || tripLoading || overtimeLoading;

  if (!allRequests.length) {
    return (
      <EmptyState
        title="Belum ada pengajuan"
        description="Pengajuan dari semua modul akan ditampilkan di sini"
        icon={<ListFilter className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--border) bg-(--muted)/50">
                {[
                  "Jenis",
                  "Pegawai",
                  "Ringkasan",
                  "Tanggal",
                  "Status",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRequests.map((req, index) => (
                <tr
                  key={req.id}
                  className={cn(
                    "border-b border-(--border) last:border-b-0",
                    index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                  )}
                >
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        TYPE_COLORS[req.typeLabel] || "",
                      )}
                    >
                      {req.typeLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
                    {req.employee}
                  </td>
                  <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                    {req.summary}
                  </td>
                  <td className="px-5 py-3 text-sm text-(--muted-foreground) whitespace-nowrap">
                    {new Date(req.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-5 py-3">
                    <ApprovalActions
                      status={req.status}
                      onDetail={() => setDetailItem(req)}
                      onApprove={() => handleApprove(req)}
                      onReject={() => setDetailItem(req)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {allRequests.map((req) => (
          <div
            key={req.id}
            className="rounded-xl border border-(--border) bg-(--card) p-4"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mb-1",
                    TYPE_COLORS[req.typeLabel] || "",
                  )}
                >
                  {req.typeLabel}
                </span>
                <p className="text-sm font-semibold text-(--foreground)">
                  {req.employee}
                </p>
              </div>
              <StatusBadge status={req.status} />
            </div>
            <p className="text-xs text-(--muted-foreground) mb-1">
              {req.summary}
            </p>
            <p className="text-xs text-(--muted-foreground) mb-3">
              {new Date(req.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetailItem(req)}
                className="flex-1"
              >
                <Eye size={13} />
                Detail
              </Button>
              {req.status === "pending" && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApprove(req)}
                    className="flex-1 text-green-700 hover:bg-green-500/10 dark:text-green-400"
                  >
                    <Check size={13} />
                    Setuju
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailItem(req)}
                    className="flex-1 text-red-600 hover:bg-red-500/10"
                  >
                    <Ban size={13} />
                    Tolak
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <AllRequestDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onApprove={() => handleApprove(detailItem)}
          onReject={(notes) => handleReject(detailItem, notes)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// ALL REQUEST DETAIL MODAL
// ════════════════════════════════════════════

function AllRequestDetailModal({
  item,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: {
  item: AllRequestItem;
  onClose: () => void;
  onApprove: () => void;
  onReject: (notes: string) => void;
  isLoading?: boolean;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const renderDetails = () => {
    if (item.type === "permission") {
      const req = item.originalData as PermissionRequest;
      return (
        <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-(--muted-foreground)">Tipe Izin</p>
              <p className="text-sm font-medium text-(--foreground)">
                {PERMISSION_TYPE_OPTIONS.find(
                  (o) => o.value === req.permission_type,
                )?.label || req.permission_type}
              </p>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground)">Jam</p>
              <p className="text-sm text-(--foreground)">
                {req.leave_time || req.return_time
                  ? [req.leave_time, req.return_time]
                      .filter(Boolean)
                      .join(" — ")
                  : "—"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-(--muted-foreground) mb-1">Alasan</p>
            <p className="text-sm text-(--foreground)">{req.reason}</p>
          </div>
        </div>
      );
    } else if (item.type === "trip") {
      const req = item.originalData as BusinessTripRequest;
      return (
        <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-(--muted-foreground)">Tujuan</p>
              <p className="text-sm font-medium text-(--foreground)">
                {req.destination}
              </p>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground)">Periode</p>
              <p className="text-sm text-(--foreground)">
                {formatDate(req.start_date)} — {formatDate(req.end_date)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-(--muted-foreground) mb-1">
              Tujuan Dinas
            </p>
            <p className="text-sm text-(--foreground)">{req.purpose}</p>
          </div>
        </div>
      );
    } else {
      const req = item.originalData as OvertimeRequest;
      return (
        <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-(--muted-foreground)">Tanggal</p>
              <p className="text-sm font-medium text-(--foreground)">
                {formatDate(req.overtime_date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground)">Durasi</p>
              <p className="text-sm text-(--foreground)">
                {Math.floor(req.planned_minutes / 60)} jam{" "}
                {req.planned_minutes % 60} menit
              </p>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground)">Jam Mulai</p>
              <p className="text-sm text-(--foreground)">
                {req.planned_start || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground)">Jam Selesai</p>
              <p className="text-sm text-(--foreground)">
                {req.planned_end || "—"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-(--muted-foreground) mb-1">Alasan</p>
            <p className="text-sm text-(--foreground)">{req.reason}</p>
          </div>
        </div>
      );
    }
  };

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
          <h3 className="text-sm font-bold text-(--foreground)">
            Detail {item.typeLabel}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                {item.employee}
              </p>
              <p className="text-xs text-(--muted-foreground)">
                {formatDate(item.date)}
              </p>
            </div>
            <StatusBadge status={item.status} />
          </div>

          {renderDetails()}

          {rejectMode && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-(--foreground) opacity-80">
                Catatan Penolakan *
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Jelaskan alasan penolakan..."
                rows={3}
                className="w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground) border-(--border) placeholder:text-(--muted-foreground) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-(--border) px-5 py-3">
          {item.status === "pending" && !rejectMode && (
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Tutup
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectMode(true)}
                className="text-red-600 hover:bg-red-500/10"
              >
                <Ban size={14} />
                Tolak
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onApprove}
                isLoading={isLoading}
              >
                <Check size={14} />
                Setujui
              </Button>
            </>
          )}
          {item.status === "pending" && rejectMode && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectMode(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onReject(rejectNotes)}
                isLoading={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                Konfirmasi Tolak
              </Button>
            </>
          )}
          {item.status !== "pending" && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

type TabType = "permission" | "business_trip" | "overtime" | "all";

const TABS = [
  { id: "permission" as TabType, label: "Izin Kehadiran", icon: LogOut },
  { id: "business_trip" as TabType, label: "Dinas Luar", icon: Plane },
  { id: "overtime" as TabType, label: "Lembur", icon: Timer },
  { id: "all" as TabType, label: "Semua", icon: ListFilter },
];

export function RequestPage() {
  const [activeTab, setActiveTab] = useState<TabType>("permission");

  return (
    <MainLayout>
      <header className="sticky top-0 z-40 flex flex-col gap-3 border-b border-(--border) bg-(--card) px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-wide text-(--foreground) md:text-lg">
              Pengajuan
            </h1>
            <p className="text-[10px] text-(--muted-foreground) md:text-xs">
              Kelola pengajuan izin, dinas luar, dan lembur
            </p>
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-(--muted)/50 w-fit overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-(--card) text-(--foreground) shadow-sm"
                      : "text-(--muted-foreground) hover:text-(--foreground)",
                  )}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-350 p-3 sm:p-5">
        {activeTab === "permission" && <PermissionTab />}
        {activeTab === "business_trip" && <BusinessTripTab />}
        {activeTab === "overtime" && <OvertimeTab />}
        {activeTab === "all" && <AllRequestsTab />}
      </div>
    </MainLayout>
  );
}
