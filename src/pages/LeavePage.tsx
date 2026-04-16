import { useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  BarChart3,
  X,
  AlertCircle,
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
import { ApprovalTimeline } from "@/components/ui/ApprovalTimeline";
import type { TimelineStep } from "@/components/ui/ApprovalTimeline";
import {
  useLeaveTypeList,
  useLeaveBalanceList,
  useLeaveRequestList,
  useLeaveRequestMutations,
} from "@/hooks/useLeave";
import { useEmployeeList } from "@/hooks/useEmployee";
import {
  LEAVE_STATUS_OPTIONS,
  LEAVE_CATEGORY_OPTIONS,
  type LeaveRequestStatus,
  type LeaveRequest,
  type CreateLeavePayload,
} from "@/types/leave";

// ════════════════════════════════════════════
// STATUS BADGE
// ════════════════════════════════════════════

const LEAVE_STATUS_CONFIG: Record<
  LeaveRequestStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  approved_leader: {
    label: "Disetujui Leader",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  approved_hr: {
    label: "Disetujui HR",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

function LeaveStatusBadge({ status }: { status: LeaveRequestStatus }) {
  const config = LEAVE_STATUS_CONFIG[status];
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
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// LEAVE REQUEST FORM
// ════════════════════════════════════════════

function LeaveRequestForm({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateLeavePayload) => void;
  isLoading?: boolean;
}) {
  const { data: leaveTypes } = useLeaveTypeList();
  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
    document_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const selectedLeaveType = useMemo(
    () => leaveTypes?.find((lt) => String(lt.id) === formData.leave_type_id),
    [leaveTypes, formData.leave_type_id],
  );

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
    if (!formData.leave_type_id)
      newErrors.leave_type_id = "Jenis cuti wajib dipilih";
    if (!formData.start_date)
      newErrors.start_date = "Tanggal mulai wajib diisi";
    if (!formData.end_date) newErrors.end_date = "Tanggal selesai wajib diisi";
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      newErrors.end_date = "Tanggal selesai tidak boleh sebelum tanggal mulai";
    }
    if (selectedLeaveType?.requires_document && !formData.document_url.trim()) {
      newErrors.document_url =
        "Dokumen pendukung wajib diisi untuk jenis cuti ini";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      leave_type_id: parseInt(formData.leave_type_id),
      start_date: formData.start_date,
      end_date: formData.end_date,
      total_days: totalDays,
      reason: formData.reason.trim() || undefined,
      document_url: formData.document_url.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <SearchableSelect
          label="Jenis Cuti"
          value={formData.leave_type_id}
          onChange={(val) => handleChange("leave_type_id", val)}
          options={
            leaveTypes?.map((lt) => ({
              value: String(lt.id),
              label: `${lt.name} ${lt.category === "annual" ? `(Maks. ${lt.max_total_duration_per_year} hari/tahun)` : ""}`,
              group: LEAVE_CATEGORY_OPTIONS.find((c) => c.value === lt.category)
                ?.label,
            })) || []
          }
          grouped
          placeholder="Pilih jenis cuti..."
          searchPlaceholder="Cari jenis cuti..."
        />
        {errors.leave_type_id && (
          <p className="text-xs text-(--destructive)">{errors.leave_type_id}</p>
        )}
      </div>

      {selectedLeaveType && (
        <div className="rounded-lg bg-(--muted)/50 border border-(--border) p-3 text-xs space-y-1">
          {selectedLeaveType.max_duration_per_request && (
            <p className="text-(--muted-foreground)">
              Maksimal per pengajuan:{" "}
              <strong>
                {selectedLeaveType.max_duration_per_request}{" "}
                {selectedLeaveType.max_duration_unit}
              </strong>
            </p>
          )}
          {selectedLeaveType.requires_document && (
            <p className="flex items-center gap-1 text-amber-600">
              <AlertCircle size={12} />
              Wajib melampirkan: {selectedLeaveType.requires_document_type}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="start_date"
          label="Tanggal Mulai"
          type="date"
          value={formData.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          error={errors.start_date}
        />
        <Input
          id="end_date"
          label="Tanggal Selesai"
          type="date"
          value={formData.end_date}
          onChange={(e) => handleChange("end_date", e.target.value)}
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
          Alasan
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Alasan pengajuan cuti (opsional)"
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
          )}
        />
      </div>

      <Input
        id="document_url"
        label={`URL Dokumen Pendukung${selectedLeaveType?.requires_document ? " *" : ""}`}
        value={formData.document_url}
        onChange={(e) => handleChange("document_url", e.target.value)}
        placeholder="https://..."
        error={errors.document_url}
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
          Ajukan Cuti
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// LEAVE DETAIL MODAL (with approve/reject)
// ════════════════════════════════════════════

function LeaveDetailModal({
  request,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: {
  request: LeaveRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: (notes: string) => void;
  isLoading?: boolean;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const CATEGORY_LABELS: Record<string, string> = {
    annual: "Cuti Tahunan",
    sick: "Sakit",
    special: "Cuti Khusus",
    other: "Lainnya",
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getTimelineSteps = (req: LeaveRequest): TimelineStep[] => {
    if (!req.approvals || req.approvals.length === 0) return [];
    return req.approvals.map((approval) => ({
      level: approval.level,
      label: approval.level === 1 ? "Leader Departemen" : "Leader HRGA",
      approver_name: approval.approver_name || null,
      status: approval.status,
      notes: approval.notes,
      decided_at: approval.decided_at,
    }));
  };

  const isPending =
    request.status === "pending" || request.status === "approved_leader";

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
          <div>
            <h3 className="text-sm font-bold text-(--foreground)">
              Detail Pengajuan Cuti
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                {request.employee_name || "—"}
              </p>
              <p className="text-xs text-(--muted-foreground)">
                {request.leave_type_name}
                {request.leave_category &&
                  ` • ${CATEGORY_LABELS[request.leave_category]}`}
              </p>
            </div>
            <LeaveStatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg bg-(--muted)/30 p-3">
            <div>
              <p className="text-xs text-(--muted-foreground)">Periode</p>
              <p className="text-sm font-medium text-(--foreground)">
                {formatDate(request.start_date)} —{" "}
                {formatDate(request.end_date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground)">Durasi</p>
              <p className="text-sm font-medium text-(--foreground)">
                {request.total_days} hari
              </p>
            </div>
          </div>

          {request.reason && (
            <div>
              <p className="text-xs text-(--muted-foreground) mb-1">Alasan</p>
              <p className="text-sm text-(--foreground)">{request.reason}</p>
            </div>
          )}

          {request.document_url && (
            <div>
              <p className="text-xs text-(--muted-foreground) mb-1">
                Dokumen Pendukung
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

          <div>
            <h4 className="text-sm font-semibold text-(--foreground) mb-3">
              Timeline Persetujuan
            </h4>
            <ApprovalTimeline
              steps={getTimelineSteps(request)}
              current_status={request.status}
            />
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
          {isPending && !rejectMode && (
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
          {isPending && rejectMode && (
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
          {!isPending && (
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
// TAB 1: PENGAJUAN CUTI
// ════════════════════════════════════════════

function LeaveRequestTab() {
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState(
    String(new Date().getFullYear()),
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      status: filterStatus as LeaveRequestStatus | undefined,
      year: filterYear ? parseInt(filterYear) : undefined,
    }),
    [filterEmployee, filterStatus, filterYear],
  );

  const { data: requests, loading, refetch } = useLeaveRequestList(params);
  const { data: employees } = useEmployeeList({ is_active: true });
  const {
    loading: mutLoading,
    createRequest,
    approveRequest,
    rejectRequest,
  } = useLeaveRequestMutations(refetch);

  const handleCreate = async (payload: CreateLeavePayload) => {
    const result = await createRequest(payload);
    if (result) setShowForm(false);
  };

  const handleApprove = async (req: LeaveRequest) => {
    await approveRequest(req.id);
    setSelectedRequest(null);
  };

  const handleReject = async (req: LeaveRequest, notes: string) => {
    await rejectRequest(req.id, { notes });
    setSelectedRequest(null);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const CATEGORY_LABELS: Record<string, string> = {
    annual: "Cuti Tahunan",
    sick: "Sakit",
    special: "Cuti Khusus",
    other: "Lainnya",
  };

  const isPending = (status: LeaveRequestStatus) =>
    status === "pending" || status === "approved_leader";

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
              ...LEAVE_STATUS_OPTIONS.map((s) => ({
                value: s.value,
                label: s.label,
              })),
            ]}
            placeholder="Filter status..."
          />
          <SearchableSelect
            value={filterYear}
            onChange={setFilterYear}
            options={[2024, 2025, 2026, 2027].map((y) => ({
              value: String(y),
              label: String(y),
            }))}
            placeholder="Tahun..."
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(true)}
          className="self-start sm:self-auto"
        >
          <Plus size={16} />
          Ajukan Cuti
        </Button>
      </div>

      {loading ? (
        <SkeletonTable cols={8} />
      ) : !requests || requests.length === 0 ? (
        <EmptyState
          title="Belum ada pengajuan cuti"
          description="Ajukan cuti atau izin tidak masuk di sini"
          icon={<CalendarDays className="h-12 w-12" />}
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Ajukan Cuti
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
                      "Jenis Cuti",
                      "Periode",
                      "Hari",
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
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-sm text-(--foreground)">
                            {req.leave_type_name}
                          </p>
                          {req.leave_category && (
                            <p className="text-xs text-(--muted-foreground)">
                              {CATEGORY_LABELS[req.leave_category]}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground) whitespace-nowrap">
                        {formatDate(req.start_date)} —{" "}
                        {formatDate(req.end_date)}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-(--foreground)">
                        {req.total_days}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground) max-w-xs truncate">
                        {req.reason || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <LeaveStatusBadge status={req.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(req)}
                            className="h-7 px-2 text-xs"
                          >
                            <Eye size={13} />
                            Detail
                          </Button>
                          {isPending(req.status) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(req)}
                                className="h-7 px-2 text-xs text-green-700 hover:bg-green-500/10 dark:text-green-400"
                              >
                                <Check size={13} />
                                Setuju
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRequest(req)}
                                className="h-7 px-2 text-xs text-red-600 hover:bg-red-500/10"
                              >
                                <Ban size={13} />
                                Tolak
                              </Button>
                            </>
                          )}
                        </div>
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
                      {req.leave_type_name}
                    </p>
                  </div>
                  <LeaveStatusBadge status={req.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-(--muted-foreground) mb-3">
                  <div>
                    <p className="font-medium">Periode</p>
                    <p>
                      {formatDate(req.start_date)} — {formatDate(req.end_date)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Durasi</p>
                    <p>{req.total_days} hari</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRequest(req)}
                    className="flex-1"
                  >
                    <Eye size={13} />
                    Detail
                  </Button>
                  {isPending(req.status) && (
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
                        onClick={() => setSelectedRequest(req)}
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
        </>
      )}

      <Modal
        open={showForm}
        title="Ajukan Cuti"
        onClose={() => setShowForm(false)}
      >
        <LeaveRequestForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutLoading}
        />
      </Modal>

      {selectedRequest && (
        <LeaveDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => handleApprove(selectedRequest)}
          onReject={(notes) => handleReject(selectedRequest, notes)}
          isLoading={mutLoading}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// TAB 2: SALDO CUTI
// ════════════════════════════════════════════

function LeaveBalanceTab() {
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterYear, setFilterYear] = useState(
    String(new Date().getFullYear()),
  );

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      year: filterYear ? parseInt(filterYear) : undefined,
    }),
    [filterEmployee, filterYear],
  );

  const { data: balances, loading } = useLeaveBalanceList(params);
  const { data: employees } = useEmployeeList({ is_active: true });

  return (
    <div className="space-y-4">
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
          value={filterYear}
          onChange={setFilterYear}
          options={[2024, 2025, 2026, 2027].map((y) => ({
            value: String(y),
            label: String(y),
          }))}
          placeholder="Tahun..."
        />
      </div>

      {loading ? (
        <SkeletonTable cols={5} />
      ) : !balances || balances.length === 0 ? (
        <EmptyState
          title="Belum ada data saldo cuti"
          description="Saldo cuti akan muncul setelah pegawai memiliki jenis cuti yang berlaku"
          icon={<BarChart3 className="h-12 w-12" />}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-(--border)">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--muted)/50">
                  {["Pegawai", "Jenis Cuti", "Kuota", "Terpakai", "Sisa"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {balances.map((bal, index) => {
                  const remaining = bal.remaining_duration;
                  const percentage = bal.max_duration
                    ? (bal.used_duration / bal.max_duration) * 100
                    : 0;
                  return (
                    <tr
                      key={bal.id}
                      className={cn(
                        "border-b border-(--border) last:border-b-0",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
                        {bal.employee_name || "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {bal.leave_type_name || "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {bal.max_duration !== undefined &&
                        bal.max_duration !== null
                          ? `${bal.max_duration} hari`
                          : "Tidak terbatas"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="space-y-1">
                          <p className="text-sm text-(--foreground)">
                            {bal.used_duration} hari
                          </p>
                          {bal.max_duration && (
                            <div className="h-1.5 w-24 rounded-full bg-(--muted) overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  percentage >= 100
                                    ? "bg-red-500"
                                    : percentage >= 80
                                      ? "bg-yellow-500"
                                      : "bg-green-500",
                                )}
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold">
                        {remaining !== undefined && remaining !== null ? (
                          <span
                            className={
                              remaining <= 0
                                ? "text-red-600"
                                : remaining <= 3
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }
                          >
                            {remaining} hari
                          </span>
                        ) : (
                          <span className="text-(--muted-foreground)">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

type TabType = "requests" | "balances";

export function LeavePage() {
  const [activeTab, setActiveTab] = useState<TabType>("requests");

  const TABS = [
    { id: "requests" as TabType, label: "Pengajuan Cuti", icon: CalendarDays },
    { id: "balances" as TabType, label: "Saldo Cuti", icon: BarChart3 },
  ];

  return (
    <MainLayout>
      <header className="sticky top-0 z-40 flex flex-col gap-3 border-b border-(--border) bg-(--card) px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-wide text-(--foreground) md:text-lg">
              Cuti
            </h1>
            <p className="text-[10px] text-(--muted-foreground) md:text-xs">
              Kelola pengajuan cuti, saldo, dan konfigurasi jenis cuti
            </p>
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-(--muted)/50 w-fit">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
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
        {activeTab === "requests" && <LeaveRequestTab />}
        {activeTab === "balances" && <LeaveBalanceTab />}
      </div>
    </MainLayout>
  );
}
