import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateLong } from "@/utils/date";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useHolidayList, useHolidayMutations, useHolidayMetadata } from "@/hooks/useHoliday";

import { PermissionGate } from "@/components/ui/PermissionGate";
import { PERMISSIONS } from "@/constants/permission";
import {
  HOLIDAY_TYPE_LABELS,
  HOLIDAY_TYPE_COLORS,
  type Holiday,
  type HolidayType,
  type CreateHolidayPayload,
} from "@/types/holiday";

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
// HOLIDAY TYPE BADGE
// ════════════════════════════════════════════

function HolidayTypeBadge({ type }: { type: HolidayType }) {
  const colors = HOLIDAY_TYPE_COLORS[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text,
      )}
    >
      {HOLIDAY_TYPE_LABELS[type]}
    </span>
  );
}

// ════════════════════════════════════════════
// HOLIDAY FORM
// ════════════════════════════════════════════

function HolidayForm({
  onClose,
  onSubmit,
  editHoliday,
  branches,
  typeMeta,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateHolidayPayload) => void;
  editHoliday?: Holiday;
  branches: { id: string | number; name: string }[];
  typeMeta: { id: string; name: string }[];
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: editHoliday?.name || "",
    date: editHoliday?.date || "",
    type: editHoliday?.type || ("national" as HolidayType),
    branch_id: editHoliday?.branch_id ? String(editHoliday.branch_id) : "",
    description: editHoliday?.description || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama hari libur wajib diisi";
    if (!formData.date) newErrors.date = "Tanggal wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    // Auto-fill year from date
    const year = formData.date
      ? new Date(formData.date).getFullYear()
      : new Date().getFullYear();

    const payload: CreateHolidayPayload = {
      name: formData.name.trim(),
      date: formData.date,
      year,
      type: formData.type,
      branch_id: formData.branch_id ? parseInt(formData.branch_id) : null,
      description: formData.description.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Nama Hari Libur"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Contoh: Hari Raya Idul Fitri"
        error={errors.name}
        autoFocus
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="date"
          label="Tanggal"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          error={errors.date}
        />

        <div className="space-y-1.5">
          <SearchableSelect
            label="Tipe"
            value={formData.type}
            onChange={(val) => handleChange("type", val)}
            options={typeMeta.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
            placeholder="Pilih tipe"
            searchPlaceholder="Cari tipe..."
          />
        </div>
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
          Deskripsi (Opsional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Keterangan tambahan"
          rows={2}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
          )}
        />
      </div>

      {formData.date && (
        <p className="text-xs text-(--muted-foreground)">
          Tahun otomatis terisi:{" "}
          <strong>{new Date(formData.date).getFullYear()}</strong>
        </p>
      )}

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
          {editHoliday ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// MINI CALENDAR
// ════════════════════════════════════════════

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function MonthCalendar({
  year,
  month, // 1-indexed
  holidays,
  onDayClick,
}: {
  year: number;
  month: number;
  holidays: Holiday[];
  onDayClick?: (date: string) => void;
}) {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();

  // Build holiday map for quick lookup
  const holidayMap = useMemo(() => {
    const map: Record<string, Holiday[]> = {};
    holidays.forEach((h) => {
      const d = h.date; // "YYYY-MM-DD"
      if (!map[d]) map[d] = [];
      map[d].push(h);
    });
    return map;
  }, [holidays]);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-xl border border-(--border) bg-(--card) p-3">
      <h4 className="mb-2 text-center text-xs font-semibold text-(--muted-foreground) uppercase tracking-wider">
        {MONTH_NAMES[month - 1]}
      </h4>
      <div className="grid grid-cols-7 gap-px text-center">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className={cn(
              "py-1 text-[10px] font-medium",
              d === "Min" || d === "Sab"
                ? "text-rose-400"
                : "text-(--muted-foreground)",
            )}
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayHolidays = holidayMap[dateStr] || [];
          const isHoliday = dayHolidays.length > 0;
          const dayOfWeek = (firstDay + day - 1) % 7;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          // Pick color from first holiday type
          const dotColor = isHoliday
            ? HOLIDAY_TYPE_COLORS[dayHolidays[0].type].text
            : "";

          return (
            <div
              key={i}
              title={dayHolidays.map((h) => h.name).join(", ")}
              onClick={() => isHoliday && onDayClick?.(dateStr)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-md py-0.5 text-[11px] transition-colors",
                isHoliday
                  ? cn(
                      HOLIDAY_TYPE_COLORS[dayHolidays[0].type].bg,
                      HOLIDAY_TYPE_COLORS[dayHolidays[0].type].text,
                      "font-semibold cursor-pointer hover:opacity-80",
                    )
                  : isWeekend
                    ? "text-rose-400/60"
                    : "text-(--foreground)",
              )}
            >
              {day}
              {isHoliday && (
                <span
                  className={cn(
                    "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0.5 rounded-full",
                    dotColor,
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// CALENDAR VIEW — 12-month grid
// ════════════════════════════════════════════

function CalendarView({
  year,
  holidays,
  onYearChange,
}: {
  year: number;
  holidays: Holiday[];
  onYearChange: (y: number) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Year nav */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onYearChange(year - 1)}
          className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-lg font-bold text-(--foreground)">{year}</span>
        <button
          onClick={() => onYearChange(year + 1)}
          className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 12-month grid */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <MonthCalendar
            key={month}
            year={year}
            month={month}
            holidays={holidays}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {(Object.entries(HOLIDAY_TYPE_LABELS) as [HolidayType, string][]).map(
          ([type, label]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-3 w-3 rounded-sm",
                  HOLIDAY_TYPE_COLORS[type].bg,
                )}
              />
              <span className="text-xs text-(--muted-foreground)">{label}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// LIST VIEW
// ════════════════════════════════════════════

function ListView({
  holidays,
  onEdit,
  onDelete,
}: {
  holidays: Holiday[];
  onEdit: (h: Holiday) => void;
  onDelete: (h: Holiday) => void;
}) {
  if (holidays.length === 0) {
    return (
      <EmptyState
        title="Tidak ada hari libur"
        description="Tidak ada hari libur untuk filter yang dipilih"
        icon={<Calendar className="h-12 w-12" />}
      />
    );
  }



  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--border) bg-(--muted)/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                  Tanggal
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                  Nama Hari Libur
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                  Tipe
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                  Cabang
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday, index) => (
                <tr
                  key={holiday.id}
                  className={cn(
                    "border-b border-(--border) last:border-b-0",
                    index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                  )}
                >
                  <td className="px-5 py-4 text-sm text-(--foreground) whitespace-nowrap">
                    {formatDateLong(holiday.date)}
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-(--foreground)">
                        {holiday.name}
                      </p>
                      {holiday.description && (
                        <p className="text-xs text-(--muted-foreground) truncate max-w-xs">
                          {holiday.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <HolidayTypeBadge type={holiday.type} />
                  </td>
                  <td className="px-5 py-4 text-sm text-(--muted-foreground)">
                    {holiday.branch_name || (
                      <span className="italic">Semua Cabang</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <PermissionGate permission={PERMISSIONS.HOLIDAY_UPDATE}>
                        <button
                          onClick={() => onEdit(holiday)}
                          className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--primary)/10 hover:text-(--primary)"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                      </PermissionGate>
                      <PermissionGate permission={PERMISSIONS.HOLIDAY_DELETE}>
                        <button
                          onClick={() => onDelete(holiday)}
                          className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-red-500/10 hover:text-red-500"
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
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {holidays.map((holiday) => (
          <div
            key={holiday.id}
            className="rounded-xl border border-(--border) bg-(--card) p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <HolidayTypeBadge type={holiday.type} />
                  {holiday.branch_name && (
                    <span className="text-xs text-(--muted-foreground)">
                      {holiday.branch_name}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-(--foreground)">
                  {holiday.name}
                </p>
                <p className="text-xs text-(--muted-foreground) mt-0.5">
                  {formatDateLong(holiday.date)}
                </p>
                {holiday.description && (
                  <p className="text-xs text-(--muted-foreground) mt-1 line-clamp-1">
                    {holiday.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <PermissionGate permission={PERMISSIONS.HOLIDAY_UPDATE}>
                  <button
                    onClick={() => onEdit(holiday)}
                    className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--primary)/10 hover:text-(--primary)"
                  >
                    <Pencil size={16} />
                  </button>
                </PermissionGate>
                <PermissionGate permission={PERMISSIONS.HOLIDAY_DELETE}>
                  <button
                    onClick={() => onDelete(holiday)}
                    className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </PermissionGate>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ════════════════════════════════════════════
// SKELETON
// ════════════════════════════════════════════

function SkeletonCalendar() {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-(--border) bg-(--card) p-3 space-y-2"
        >
          <Skeleton className="h-3 w-16 mx-auto" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, j) => (
              <Skeleton key={j} className="h-5 w-full rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border)">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border) bg-(--muted)/50">
              {["Tanggal", "Nama", "Tipe", "Cabang", "Aksi"].map((h) => (
                <th key={h} className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-(--border)">
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-40" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-48" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>
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
// VIEW MODE TOGGLE
// ════════════════════════════════════════════

type ViewMode = "calendar" | "list";

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function HolidayPage() {
  const currentYear = new Date().getFullYear();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [year, setYear] = useState(currentYear);
  const [filterType, setFilterType] = useState<HolidayType | "">("");
  const [filterBranch, setFilterBranch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null);

  // Data
  const params = { year, type: filterType || undefined };
  const { data: holidays, loading, refetch } = useHolidayList(params);
  const { data: metadata } = useHolidayMetadata();
  const {
    loading: mutationLoading,
    createHoliday,
    updateHoliday,
    deleteHoliday,
  } = useHolidayMutations(refetch);

  const typeMeta = metadata?.holiday_type_meta ?? [];
  const branchMeta = metadata?.branch_meta ?? [];

  // Client-side filter by branch
  const filtered = useMemo(() => {
    if (!holidays) return [];
    if (!filterBranch) return holidays;
    return holidays.filter(
      (h) => h.branch_id === null || String(h.branch_id) === filterBranch,
    );
  }, [holidays, filterBranch]);

  // Summary counts
  const totalByType = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((h) => {
      counts[h.type] = (counts[h.type] || 0) + 1;
    });
    return counts;
  }, [filtered]);

  // Handlers
  const handleCreate = async (payload: CreateHolidayPayload) => {
    const result = await createHoliday(payload);
    if (result) setShowForm(false);
  };

  const handleUpdate = async (payload: CreateHolidayPayload) => {
    if (!editHoliday) return;
    const result = await updateHoliday(editHoliday.id, payload);
    if (result) setEditHoliday(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteHoliday(deleteTarget.id);
    if (result) setDeleteTarget(null);
  };

  return (
    <MainLayout>
      {/* Sticky Header */}
      <PageHeader
        title="Hari Libur"
        description="Kelola kalender hari libur nasional dan perusahaan"
        actions={
          <PermissionGate permission={PERMISSIONS.HOLIDAY_CREATE}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            className="self-start sm:self-auto"
          >
            <Plus size={16} />
            <span className="hidden sm:block">Tambah Hari Libur</span>
          </Button>
        </PermissionGate>
        }
      />

      <div className="mx-auto max-w-350 p-3 sm:p-5 flex flex-col gap-5">
        {/* Summary Cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <SummaryCard
              title="Total"
              value={filtered.length}
              subtitle="hari libur"
            />
            {(Object.keys(HOLIDAY_TYPE_LABELS) as HolidayType[]).map((type) => {
              const count = totalByType[type] || 0;
              if (count === 0) return null;
              const colors = HOLIDAY_TYPE_COLORS[type];
              return (
                <SummaryCard
                  key={type}
                  title={HOLIDAY_TYPE_LABELS[type]}
                  value={count}
                  subtitle="hari"
                  colorBg={colors.bg}
                  colorText={colors.text}
                />
              );
            })}
          </div>
        )}

        {/* Filter & View Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <SearchableSelect
              value={filterType}
              onChange={(val) => setFilterType(val as HolidayType | "")}
              options={[
                { value: "", label: "Semua Tipe" },
                ...typeMeta.map((m) => ({
                  value: m.id,
                  label: m.name,
                })),
              ]}
              placeholder="Filter tipe..."
            />

            <SearchableSelect
              value={filterBranch}
              onChange={(val) => setFilterBranch(val)}
              options={[
                { value: "", label: "Semua Cabang" },
                ...branchMeta.map((b) => ({
                  value: String(b.id),
                  label: b.name,
                })),
              ]}
              placeholder="Filter cabang..."
              searchPlaceholder="Cari cabang..."
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 p-1 rounded-lg bg-(--muted)/50 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "calendar"
                  ? "bg-(--card) text-(--foreground) shadow-sm"
                  : "text-(--muted-foreground) hover:text-(--foreground)",
              )}
            >
              <Calendar size={16} />
              Kalender
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-(--card) text-(--foreground) shadow-sm"
                  : "text-(--muted-foreground) hover:text-(--foreground)",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Daftar
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          viewMode === "calendar" ? (
            <SkeletonCalendar />
          ) : (
            <SkeletonTable />
          )
        ) : viewMode === "calendar" ? (
          <CalendarView
            year={year}
            holidays={filtered}
            onYearChange={setYear}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Belum ada data hari libur"
            description={
              filterType || filterBranch
                ? "Coba ubah filter yang dipilih"
                : "Tambahkan hari libur untuk memulai"
            }
            icon={<Calendar className="h-12 w-12" />}
            action={
              !filterType &&
              !filterBranch && (
                <PermissionGate permission={PERMISSIONS.HOLIDAY_CREATE}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus size={16} />
                    Tambah Hari Libur
                  </Button>
                </PermissionGate>
              )
            }
          />
        ) : (
          <ListView
            holidays={filtered}
            onEdit={setEditHoliday}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={showForm}
        title="Tambah Hari Libur"
        onClose={() => setShowForm(false)}
      >
        <HolidayForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          branches={branchMeta}
          typeMeta={typeMeta}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editHoliday}
        title="Edit Hari Libur"
        onClose={() => setEditHoliday(null)}
      >
        {editHoliday && (
          <HolidayForm
            onClose={() => setEditHoliday(null)}
            onSubmit={handleUpdate}
            editHoliday={editHoliday}
            branches={branchMeta}
            typeMeta={typeMeta}
            isLoading={mutationLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Hari Libur"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={mutationLoading}
      />
    </MainLayout>
  );
}
