import { useState, useMemo } from "react";
import {
  ClipboardCheck,
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MinusCircle,
  Plane,
  CalendarDays,
  Edit2,
  UserPlus,
  Eye,
  Check,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime, formatDateWeekdayShort, formatDateTime } from "@/utils/date";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, Input } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useAttendanceList,
  useOverrideList,
  useOverrideMutations,
  useManualAttendanceMutations,
} from "@/hooks/useAttendance";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useEmployeeList } from "@/hooks/useEmployee";
import { useBranchList } from "@/hooks/useBranch";
import { useAttendanceMetadata } from "@/hooks/useMetadata";
import {
  type AttendanceStatus,
  type AttendanceLog,
  type CreateManualAttendancePayload,
} from "@/types/attendance";
import { PermissionGate } from "@/components/ui/PermissionGate";
import { PERMISSIONS } from "@/constants/permission";
import {
  OVERRIDE_TYPE_OPTIONS,
  type OverrideType,
  type AttendanceOverride,
} from "@/types/attendance-override";
import { MobileActionButton } from "@/components/ui/Button";

// ════════════════════════════════════════════
// STATUS BADGE
// ════════════════════════════════════════════

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  present: {
    label: "Hadir",
    icon: CheckCircle2,
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  late: {
    label: "Terlambat",
    icon: AlertCircle,
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  absent: {
    label: "Absen",
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  half_day: {
    label: "Setengah Hari",
    icon: MinusCircle,
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  leave: {
    label: "Cuti",
    icon: CalendarDays,
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  business_trip: {
    label: "Tugas",
    icon: Plane,
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  holiday: {
    label: "Libur",
    icon: CalendarDays,
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
};

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      <Icon size={12} />
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
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// OVERRIDE FORM
// ════════════════════════════════════════════

function OverrideForm({
  onClose,
  onSubmit,
  logs,
  isLoading,
  metadata,
}: {
  onClose: () => void;
  onSubmit: (payload: {
    attendance_log_id: number;
    override_type: OverrideType;
    corrected_clock_in?: string | null;
    corrected_clock_out?: string | null;
    reason: string;
  }) => void;
  logs: AttendanceLog[];
  isLoading?: boolean;
  metadata?: any;
}) {
  const [formData, setFormData] = useState({
    attendance_log_id: "",
    override_type: "clock_in" as OverrideType,
    corrected_clock_in: "",
    corrected_clock_out: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.attendance_log_id)
      newErrors.attendance_log_id = "Log kehadiran wajib dipilih";
    if (!formData.reason.trim()) newErrors.reason = "Alasan wajib diisi";
    if (
      formData.override_type !== "clock_out" &&
      !formData.corrected_clock_in
    ) {
      newErrors.corrected_clock_in = "Jam masuk koreksi wajib diisi";
    }
    if (
      formData.override_type !== "clock_in" &&
      !formData.corrected_clock_out
    ) {
      newErrors.corrected_clock_out = "Jam keluar koreksi wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      attendance_log_id: parseInt(formData.attendance_log_id),
      override_type: formData.override_type,
      corrected_clock_in: formData.corrected_clock_in || null,
      corrected_clock_out: formData.corrected_clock_out || null,
      reason: formData.reason.trim(),
    });
  };

  const logOptions = logs.map((log) => ({
    value: String(log.id),
    label: `${log.attendance_date} — ${log.employee_name || "Pegawai"} (${STATUS_CONFIG[log.status]?.label})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <SearchableSelect
          label="Log Kehadiran"
          value={formData.attendance_log_id}
          onChange={(val) => handleChange("attendance_log_id", val)}
          options={logOptions}
          placeholder="Pilih log kehadiran..."
          searchPlaceholder="Cari log..."
        />
        {errors.attendance_log_id && (
          <p className="text-xs text-(--destructive)">
            {errors.attendance_log_id}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <SearchableSelect
          label="Tipe Koreksi"
          value={formData.override_type}
          onChange={(val) => handleChange("override_type", val)}
          options={
            metadata?.override_type_meta?.map((t: any) => ({
              value: t.id,
              label: t.name,
            })) || OVERRIDE_TYPE_OPTIONS
          }
          placeholder="Pilih tipe koreksi..."
        />
      </div>

      {formData.override_type !== "clock_out" && (
        <Input
          id="corrected_clock_in"
          label="Jam Masuk Koreksi"
          type="datetime-local"
          value={formData.corrected_clock_in}
          onChange={(e) => handleChange("corrected_clock_in", e.target.value)}
          error={errors.corrected_clock_in}
        />
      )}

      {formData.override_type !== "clock_in" && (
        <Input
          id="corrected_clock_out"
          label="Jam Keluar Koreksi"
          type="datetime-local"
          value={formData.corrected_clock_out}
          onChange={(e) => handleChange("corrected_clock_out", e.target.value)}
          error={errors.corrected_clock_out}
        />
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Alasan Koreksi *
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Jelaskan alasan pengajuan koreksi..."
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
          Ajukan Koreksi
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// OVERRIDE DETAIL MODAL
// ════════════════════════════════════════════

function OverrideDetailModal({
  override: ov,
  onClose,
  onApprove,
  onReject,
  isLoading,
  metadata,
}: {
  override: AttendanceOverride;
  onClose: () => void;
  onApprove: () => void;
  onReject: (notes: string) => void;
  isLoading?: boolean;
  metadata?: any;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");



  const OVERRIDE_STATUS_COLORS: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const OVERRIDE_STATUS_LABELS: Record<string, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
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
            Detail Koreksi Presensi
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) transition hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                {ov.requester_name || "—"}
              </p>
              <p className="text-xs text-(--muted-foreground)">
                {ov.attendance_date || "—"}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                OVERRIDE_STATUS_COLORS[ov.status] ||
                  OVERRIDE_STATUS_COLORS.pending,
              )}
            >
              {OVERRIDE_STATUS_LABELS[ov.status] || ov.status}
            </span>
          </div>

          <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-(--muted-foreground)">
                  Tipe Koreksi
                </p>
                <p className="text-sm font-medium text-(--foreground)">
                  {metadata?.override_type_meta?.find(
                    (o: any) => o.id === ov.override_type,
                  )?.name ||
                    OVERRIDE_TYPE_OPTIONS.find(
                      (o) => o.value === ov.override_type,
                    )?.label ||
                    ov.override_type}
                </p>
              </div>
              {ov.override_type !== "clock_out" && (
                <div className="row-start-2">
                  <p className="text-xs text-(--muted-foreground)">
                    Masuk Asli → Koreksi
                  </p>
                  <p className="text-sm text-(--foreground)">
                    {formatDateTime(ov.original_clock_in)} →{" "}
                    <span className="text-(--primary) font-medium">
                      {formatDateTime(ov.corrected_clock_in)}
                    </span>
                  </p>
                </div>
              )}
              {ov.override_type !== "clock_in" && (
                <div className="row-start-2">
                  <p className="text-xs text-(--muted-foreground)">
                    Keluar Asli → Koreksi
                  </p>
                  <p className="text-sm text-(--foreground)">
                    {formatDateTime(ov.original_clock_out)} →{" "}
                    <span className="text-(--primary) font-medium">
                      {formatDateTime(ov.corrected_clock_out)}
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-(--muted-foreground) mb-1">Alasan</p>
              <p className="text-sm text-(--foreground)">{ov.reason}</p>
            </div>
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
          {ov.status === "pending" && !rejectMode && (
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
          {ov.status === "pending" && rejectMode && (
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
          {ov.status !== "pending" && (
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
// MANUAL ATTENDANCE FORM
// ════════════════════════════════════════════

interface ManualAttendanceFormProps {
  onClose: () => void;
  onSubmit: (payload: CreateManualAttendancePayload) => void;
  employees: Array<{ id: number; full_name: string }>;
  isLoading?: boolean;
}

function ManualAttendanceForm({
  onClose,
  onSubmit,
  employees,
  isLoading,
}: ManualAttendanceFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: today,
    clock_in_at: "",
    clock_out_at: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.employee_id) newErrors.employee_id = "Pegawai wajib dipilih";
    if (!formData.attendance_date)
      newErrors.attendance_date = "Tanggal wajib diisi";
    if (formData.attendance_date > today)
      newErrors.attendance_date = "Tanggal tidak boleh di masa depan";
    if (!formData.clock_in_at) newErrors.clock_in_at = "Jam masuk wajib diisi";
    if (!formData.notes.trim()) newErrors.notes = "Catatan wajib diisi";
    if (formData.notes.trim().length < 10)
      newErrors.notes = "Catatan minimal 10 karakter";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const clockInAt = `${formData.attendance_date}T${formData.clock_in_at}:00`;
    const clockOutAt = formData.clock_out_at
      ? `${formData.attendance_date}T${formData.clock_out_at}:00`
      : null;
    onSubmit({
      employee_id: parseInt(formData.employee_id),
      attendance_date: formData.attendance_date,
      clock_in_at: clockInAt,
      clock_out_at: clockOutAt,
      notes: formData.notes.trim(),
    });
  };

  const employeeOptions = employees.map((e) => ({
    value: String(e.id),
    label: e.full_name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <SearchableSelect
          label="Pegawai *"
          value={formData.employee_id}
          onChange={(val) => handleChange("employee_id", val)}
          options={employeeOptions}
          placeholder="Pilih pegawai..."
          searchPlaceholder="Cari pegawai..."
        />
        {errors.employee_id && (
          <p className="text-xs text-(--destructive)">{errors.employee_id}</p>
        )}
      </div>

      <Input
        id="attendance_date"
        label="Tanggal *"
        type="date"
        max={today}
        value={formData.attendance_date}
        onChange={(e) => handleChange("attendance_date", e.target.value)}
        error={errors.attendance_date}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="clock_in_at"
          label="Jam Masuk *"
          type="time"
          value={formData.clock_in_at}
          onChange={(e) => handleChange("clock_in_at", e.target.value)}
          error={errors.clock_in_at}
        />
        <Input
          id="clock_out_at"
          label="Jam Keluar (Opsional)"
          type="time"
          value={formData.clock_out_at}
          onChange={(e) => handleChange("clock_out_at", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Catatan *
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Jelaskan alasan input presensi manual (min 10 karakter)..."
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
            errors.notes && "border-(--destructive)",
          )}
        />
        {errors.notes && (
          <p className="text-xs text-(--destructive)">{errors.notes}</p>
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
          Simpan
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// SKELETON
// ════════════════════════════════════════════

function SkeletonTable({ cols = 7 }: { cols?: number }) {
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
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-(--border)">
                {Array.from({ length: cols }).map((_, j) => (
                  <td key={j} className="px-5 py-4">
                    <Skeleton className="h-4 w-full max-w-32" />
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
// TAB 1: LOG KEHADIRAN
// ════════════════════════════════════════════

function AttendanceLogTab() {
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      status: filterStatus as AttendanceStatus | undefined,
      branch_id: filterBranch ? parseInt(filterBranch) : undefined,
      start_date: filterStartDate || undefined,
      end_date: filterEndDate || undefined,
    }),
    [
      filterEmployee,
      filterStatus,
      filterBranch,
      filterStartDate,
      filterEndDate,
    ],
  );

  const { data: logs, loading, refetch } = useAttendanceList(params);
  const { data: employees } = useEmployeeList({ is_active: true });
  const { data: branches } = useBranchList();
  const { data: metadata } = useAttendanceMetadata();
  const { createManualAttendance, loading: manualLoading } =
    useManualAttendanceMutations(() => {
      setShowManualForm(false);
      refetch();
    });

  const summary = useMemo(() => {
    if (!logs) return { present: 0, late: 0, absent: 0, leave: 0 };
    return {
      present: logs.filter((l) => l.status === "present").length,
      late: logs.filter((l) => l.status === "late").length,
      absent: logs.filter((l) => l.status === "absent").length,
      leave: logs.filter((l) => l.status === "leave" || l.status === "half_day")
        .length,
    };
  }, [logs]);

  const filtered = useMemo(() => {
    if (!logs) return [];
    if (!searchQuery) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (l) =>
        l.employee_name?.toLowerCase().includes(q) ||
        l.employee_number?.toLowerCase().includes(q) ||
        l.attendance_date.includes(q),
    );
  }, [logs, searchQuery]);



  return (
    <div className="space-y-4">
      {!loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Hadir",
              value: summary.present,
              color: "text-green-600",
              bg: "bg-green-50 dark:bg-green-900/20",
            },
            {
              label: "Terlambat",
              value: summary.late,
              color: "text-yellow-600",
              bg: "bg-yellow-50 dark:bg-yellow-900/20",
            },
            {
              label: "Absen",
              value: summary.absent,
              color: "text-red-600",
              bg: "bg-red-50 dark:bg-red-900/20",
            },
            {
              label: "Cuti/Izin",
              value: summary.leave,
              color: "text-blue-600",
              bg: "bg-blue-50 dark:bg-blue-900/20",
            },
          ].map((item) => (
            <SummaryCard
              key={item.label}
              title={item.label}
              value={item.value}
              subtitle="hari"
              colorBg={item.bg}
              colorText={item.color}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center flex-1">
          <div className="relative flex-1 min-w-45 max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pegawai..."
              className={cn(
                "w-full rounded-lg border bg-(--input) pl-9 pr-4 py-2 text-sm text-(--foreground)",
                "border-(--border) placeholder:text-(--muted-foreground)",
                "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
              )}
            />
          </div>
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
              ...(metadata?.status_meta?.map((s) => ({
                value: s.id,
                label: s.name,
              })) || []),
            ]}
            placeholder="Filter status..."
          />
          <SearchableSelect
            value={filterBranch}
            onChange={setFilterBranch}
            options={[
              { value: "", label: "Semua Cabang" },
              ...(branches?.map((b) => ({
                value: String(b.id),
                label: b.name,
              })) || []),
            ]}
            placeholder="Filter cabang..."
            searchPlaceholder="Cari cabang..."
          />
        </div>
        <PermissionGate permission={PERMISSIONS.ATTENDANCE_CREATE}>
          <Button
            variant="primary"
            onClick={() => setShowManualForm(true)}
            className="shrink-0"
          >
            <UserPlus size={16} />
            Input Manual
          </Button>
        </PermissionGate>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className={cn(
            "rounded-lg border bg-(--input) px-3 py-2 text-sm text-(--foreground)",
            "border-(--border) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          )}
        />
        <span className="text-(--muted-foreground) text-sm">—</span>
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className={cn(
            "rounded-lg border bg-(--input) px-3 py-2 text-sm text-(--foreground)",
            "border-(--border) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          )}
        />
      </div>

      {loading ? (
        <SkeletonTable cols={8} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada data kehadiran"
          description="Coba ubah filter yang dipilih"
          icon={<ClipboardCheck className="h-12 w-12" />}
        />
      ) : (
        <>
          <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    {[
                      "Tanggal",
                      "Pegawai",
                      "Status",
                      "Jam Masuk",
                      "Jam Keluar",
                      "Keterlambatan",
                      "Metode",
                      "Lembur",
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
                  {filtered.map((log, index) => (
                    <tr
                      key={log.id}
                      className={cn(
                        "border-b border-(--border) last:border-b-0",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-3 text-sm text-(--foreground) whitespace-nowrap">
                        {formatDateWeekdayShort(log.attendance_date)}
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-sm font-medium text-(--foreground)">
                            {log.employee_name || "—"}
                          </p>
                          <p className="text-xs text-(--muted-foreground)">
                            {log.employee_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={log.status} />
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {formatTime(log.clock_in_at)}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {formatTime(log.clock_out_at)}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {log.late_minutes > 0 ? (
                          <span className="text-yellow-600 font-medium">
                            {log.late_minutes} mnt
                          </span>
                        ) : (
                          <span className="text-(--muted-foreground)">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                        {log.clock_in_method
                          ? log.clock_in_method.replace("_", " ")
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {log.overtime_minutes > 0 ? (
                          <span className="text-purple-600 font-medium">
                            {log.overtime_minutes} mnt
                          </span>
                        ) : (
                          <span className="text-(--muted-foreground)">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-(--border) bg-(--card) p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-(--foreground)">
                      {log.employee_name || "—"}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {formatDateWeekdayShort(log.attendance_date)}
                    </p>
                  </div>
                  <StatusBadge status={log.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-(--muted-foreground)">
                  <div>
                    <p className="font-medium">Masuk</p>
                    <p>{formatTime(log.clock_in_at)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Keluar</p>
                    <p>{formatTime(log.clock_out_at)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Terlambat</p>
                    <p>
                      {log.late_minutes > 0 ? `${log.late_minutes} mnt` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={showManualForm}
        title="Input Presensi Manual"
        onClose={() => setShowManualForm(false)}
      >
        <ManualAttendanceForm
          onClose={() => setShowManualForm(false)}
          onSubmit={(payload) => createManualAttendance(payload)}
          employees={employees || []}
          isLoading={manualLoading}
        />
      </Modal>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB 2: KOREKSI PRESENSI
// ════════════════════════════════════════════

function AttendanceOverrideTab() {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [detailOverride, setDetailOverride] =
    useState<AttendanceOverride | null>(null);

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      status: filterStatus as AttendanceOverride["status"] | undefined,
    }),
    [filterEmployee, filterStatus],
  );

  const { data: overrides, loading, refetch } = useOverrideList(params);
  const { data: employees } = useEmployeeList({ is_active: true });
  const { data: logs } = useAttendanceList({});
  const { data: metadata } = useAttendanceMetadata();
  const {
    loading: mutLoading,
    createOverride,
    approveOverride,
    rejectOverride,
  } = useOverrideMutations(refetch);

  const handleCreate = async (
    payload: Parameters<typeof createOverride>[0],
  ) => {
    const result = await createOverride(payload);
    if (result) setShowForm(false);
  };

  const handleApprove = async (ov: AttendanceOverride) => {
    await approveOverride(ov.id);
    setDetailOverride(null);
  };

  const handleReject = async (ov: AttendanceOverride, notes: string) => {
    await rejectOverride(ov.id, notes);
    setDetailOverride(null);
  };

  const OVERRIDE_STATUS_COLORS: Record<
    string,
    { label: string; className: string }
  > = {
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
              { value: "pending", label: "Menunggu" },
              { value: "approved", label: "Disetujui" },
              { value: "rejected", label: "Ditolak" },
            ]}
            placeholder="Filter status..."
          />
        </div>
        <PermissionGate permission={PERMISSIONS.ATTENDANCE_ADJUSTMENT_CREATE}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            className="self-end sm:self-auto"
          >
            <Plus size={16} />
            Ajukan Koreksi
          </Button>
        </PermissionGate>
      </div>

      {loading ? (
        <SkeletonTable cols={7} />
      ) : !overrides || overrides.length === 0 ? (
        <EmptyState
          title="Belum ada pengajuan koreksi"
          description="Ajukan koreksi presensi jika ada kesalahan data kehadiran"
          icon={<Edit2 className="h-12 w-12" />}
          action={
            <PermissionGate
              permission={PERMISSIONS.ATTENDANCE_ADJUSTMENT_CREATE}
            >
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Ajukan Koreksi
              </Button>
            </PermissionGate>
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
                      "Tanggal",
                      "Pegawai",
                      "Tipe Koreksi",
                      "Jam Original → Koreksi",
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
                  {overrides.map((ov, index) => {
                    const statusConfig =
                      OVERRIDE_STATUS_COLORS[ov.status] ||
                      OVERRIDE_STATUS_COLORS.pending;
                    return (
                      <tr
                        key={ov.id}
                        className={cn(
                          "border-b border-(--border) last:border-b-0",
                          index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                        )}
                      >
                        <td className="px-5 py-3 text-sm text-(--foreground) whitespace-nowrap">
                          {ov.attendance_date || "—"}
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
                          {ov.requester_name || "—"}
                        </td>
                        <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                          {OVERRIDE_TYPE_OPTIONS.find(
                            (o) => o.value === ov.override_type,
                          )?.label || ov.override_type}
                        </td>
                        <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                          <div className="flex flex-col gap-1">
                            {ov.override_type !== "clock_out" && (
                              <span className="text-xs">
                                <span className="text-(--muted-foreground)">
                                  Masuk:{" "}
                                </span>
                                {formatDateTime(ov.original_clock_in)} →{" "}
                                <span className="text-(--primary) font-medium">
                                  {formatDateTime(ov.corrected_clock_in)}
                                </span>
                              </span>
                            )}
                            {ov.override_type !== "clock_in" && (
                              <span className="text-xs">
                                <span className="text-(--muted-foreground)">
                                  Keluar:{" "}
                                </span>
                                {formatDateTime(ov.original_clock_out)} →{" "}
                                <span className="text-(--primary) font-medium">
                                  {formatDateTime(ov.corrected_clock_out)}
                                </span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-(--muted-foreground) max-w-xs truncate">
                          {ov.reason}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-nowrap",
                              statusConfig.className,
                            )}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDetailOverride(ov)}
                              className="h-7 px-2 text-xs"
                            >
                              <Eye size={13} />
                              Detail
                            </Button>
                            {ov.status === "pending" && (
                              <>
                                <PermissionGate
                                  permission={
                                    PERMISSIONS.ATTENDANCE_ADJUSTMENT_APPROVE
                                  }
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApprove(ov)}
                                    className="h-7 px-2 text-xs text-green-700 hover:bg-green-500/10 dark:text-green-400"
                                  >
                                    <Check size={13} />
                                    Setuju
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDetailOverride(ov)}
                                    className="h-7 px-2 text-xs text-red-600 hover:bg-red-500/10"
                                  >
                                    <Ban size={13} />
                                    Tolak
                                  </Button>
                                </PermissionGate>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {overrides.map((ov) => {
              const statusConfig =
                OVERRIDE_STATUS_COLORS[ov.status] ||
                OVERRIDE_STATUS_COLORS.pending;
              return (
                <div
                  key={ov.id}
                  className="rounded-xl border border-(--border) bg-(--card) p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-(--foreground)">
                        {ov.requester_name || "—"}
                      </p>
                      <p className="text-xs text-(--muted-foreground)">
                        {ov.attendance_date || "—"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        statusConfig.className,
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-(--muted-foreground) mb-1">
                    {
                      OVERRIDE_TYPE_OPTIONS.find(
                        (o) => o.value === ov.override_type,
                      )?.label
                    }
                  </p>
                  <p className="text-xs text-(--foreground) line-clamp-2 mb-3">
                    {ov.reason}
                  </p>
                  <div className="flex gap-2">
                    <MobileActionButton
                      icon={Eye}
                      label="Detail"
                      variant="neutral"
                      onClick={() => setDetailOverride(ov)}
                    />
                    {ov.status === "pending" && (
                      <>
                        <PermissionGate
                          permission={PERMISSIONS.ATTENDANCE_ADJUSTMENT_APPROVE}
                        >
                          <MobileActionButton
                            icon={Check}
                            label="Setuju"
                            variant="approve"
                            onClick={() => handleApprove(ov)}
                          />
                          <MobileActionButton
                            icon={Ban}
                            label="Tolak"
                            variant="reject"
                            onClick={() => setDetailOverride(ov)}
                          />
                        </PermissionGate>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Modal
        open={showForm}
        title="Ajukan Koreksi Presensi"
        onClose={() => setShowForm(false)}
      >
        <OverrideForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          logs={logs || []}
          isLoading={mutLoading}
          metadata={metadata}
        />
      </Modal>

      {detailOverride && (
        <OverrideDetailModal
          override={detailOverride}
          onClose={() => setDetailOverride(null)}
          onApprove={() => handleApprove(detailOverride)}
          onReject={(notes) => handleReject(detailOverride, notes)}
          isLoading={mutLoading}
          metadata={metadata}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

type TabType = "log" | "override";

export function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabType>("log");

  return (
    <MainLayout>
      <PageHeader
        title="Presensi & Kehadiran"
        description="Monitor log kehadiran dan kelola koreksi presensi"
        actions={
          <div className="flex gap-1 p-1 rounded-lg bg-(--muted)/50 w-fit">
            <button
              onClick={() => setActiveTab("log")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeTab === "log"
                  ? "bg-(--card) text-(--foreground) shadow-sm"
                  : "text-(--muted-foreground) hover:text-(--foreground)",
              )}
            >
              <ClipboardCheck size={15} />
              <span className="hidden md:block">Log Kehadiran</span>
            </button>
            <button
              onClick={() => setActiveTab("override")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeTab === "override"
                  ? "bg-(--card) text-(--foreground) shadow-sm"
                  : "text-(--muted-foreground) hover:text-(--foreground)",
              )}
            >
              <Edit2 size={15} />
              <span className="hidden md:block">Koreksi Presensi</span>
            </button>
          </div>
        }
      />

      <div className="mx-auto max-w-350 p-3 sm:p-5">
        {activeTab === "log" ? <AttendanceLogTab /> : <AttendanceOverrideTab />}
      </div>
    </MainLayout>
  );
}
