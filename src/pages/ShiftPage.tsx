import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
  Calendar,
  Users,
  Coffee,
  Zap,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useShiftList,
  useShiftMutations,
  useScheduleList,
  useScheduleMutations,
} from "@/hooks/useShift";
import { useEmployeeList } from "@/hooks/useEmployee";
import type {
  ShiftTemplate,
  CreateShiftPayload,
  UpdateShiftPayload,
  EmployeeSchedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from "@/types/shift";

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
// SHIFT TEMPLATE FORM
// ════════════════════════════════════════════

function ShiftForm({
  onClose,
  onSubmit,
  editShift,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateShiftPayload | UpdateShiftPayload) => void;
  editShift?: ShiftTemplate;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: editShift?.name || "",
    clock_in_start: editShift?.clock_in_start || "07:30",
    clock_in_end: editShift?.clock_in_end || "08:10",
    clock_out_start: editShift?.clock_out_start || "15:30",
    clock_out_end: editShift?.clock_out_end || "16:30",
    break_duration_minutes: editShift?.break_duration_minutes ?? 60,
    is_flexible: editShift?.is_flexible ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama shift wajib diisi";
    if (!formData.clock_in_start)
      newErrors.clock_in_start = "Jam masuk awal wajib diisi";
    if (!formData.clock_in_end)
      newErrors.clock_in_end = "Jam masuk akhir wajib diisi";
    if (!formData.clock_out_start)
      newErrors.clock_out_start = "Jam pulang awal wajib diisi";
    if (!formData.clock_out_end)
      newErrors.clock_out_end = "Jam pulang akhir wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateShiftPayload = {
      name: formData.name.trim(),
      clock_in_start: formData.clock_in_start,
      clock_in_end: formData.clock_in_end,
      clock_out_start: formData.clock_out_start,
      clock_out_end: formData.clock_out_end,
      break_duration_minutes: formData.break_duration_minutes,
      is_flexible: formData.is_flexible,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Nama Shift"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Contoh: Shift Reguler"
        error={errors.name}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Window Jam Masuk
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-(--muted-foreground) mb-1">
              Paling Awal
            </label>
            <input
              type="time"
              value={formData.clock_in_start}
              onChange={(e) => handleChange("clock_in_start", e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
                "border-(--border) transition-colors duration-200",
                "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
                errors.clock_in_start && "border-red-500",
              )}
            />
          </div>
          <div>
            <label className="block text-xs text-(--muted-foreground) mb-1">
              Paling Akhir
            </label>
            <input
              type="time"
              value={formData.clock_in_end}
              onChange={(e) => handleChange("clock_in_end", e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
                "border-(--border) transition-colors duration-200",
                "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
                errors.clock_in_end && "border-red-500",
              )}
            />
          </div>
        </div>
        {(errors.clock_in_start || errors.clock_in_end) && (
          <p className="text-xs text-red-500">
            {errors.clock_in_start || errors.clock_in_end}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Window Jam Pulang
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-(--muted-foreground) mb-1">
              Paling Awal
            </label>
            <input
              type="time"
              value={formData.clock_out_start}
              onChange={(e) => handleChange("clock_out_start", e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
                "border-(--border) transition-colors duration-200",
                "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
                errors.clock_out_start && "border-red-500",
              )}
            />
          </div>
          <div>
            <label className="block text-xs text-(--muted-foreground) mb-1">
              Paling Akhir
            </label>
            <input
              type="time"
              value={formData.clock_out_end}
              onChange={(e) => handleChange("clock_out_end", e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
                "border-(--border) transition-colors duration-200",
                "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
                errors.clock_out_end && "border-red-500",
              )}
            />
          </div>
        </div>
        {(errors.clock_out_start || errors.clock_out_end) && (
          <p className="text-xs text-red-500">
            {errors.clock_out_start || errors.clock_out_end}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="break_duration"
          label="Durasi Istirahat (menit)"
          type="number"
          value={String(formData.break_duration_minutes)}
          onChange={(e) =>
            handleChange(
              "break_duration_minutes",
              parseInt(e.target.value) || 0,
            )
          }
          min={0}
        />
        <div className="flex items-end pb-1">
          <Toggle
            checked={formData.is_flexible}
            onChange={(checked) => handleChange("is_flexible", checked)}
            label="Fleksibel"
          />
        </div>
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
          {editShift ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// SCHEDULE FORM
// ════════════════════════════════════════════

function ScheduleForm({
  onClose,
  onSubmit,
  editSchedule,
  employees,
  shifts,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateSchedulePayload | UpdateSchedulePayload) => void;
  editSchedule?: EmployeeSchedule;
  employees: { id: number; name: string; number: string }[];
  shifts: { id: number; name: string }[];
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    employee_id: editSchedule?.employee_id
      ? String(editSchedule.employee_id)
      : "",
    shift_template_id: editSchedule?.shift_template_id
      ? String(editSchedule.shift_template_id)
      : "",
    effective_date: editSchedule?.effective_date || "",
    end_date: editSchedule?.end_date || "",
    is_active: editSchedule?.is_active ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.employee_id) newErrors.employee_id = "Pegawai wajib dipilih";
    if (!formData.shift_template_id)
      newErrors.shift_template_id = "Shift wajib dipilih";
    if (!formData.effective_date)
      newErrors.effective_date = "Tanggal berlaku wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      employee_id: parseInt(formData.employee_id),
      shift_template_id: parseInt(formData.shift_template_id),
      effective_date: formData.effective_date,
      end_date: formData.end_date || null,
      ...(editSchedule && { is_active: formData.is_active }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <SearchableSelect
          label="Pegawai"
          value={formData.employee_id}
          onChange={(val) => handleChange("employee_id", val)}
          options={employees.map((e) => ({
            value: String(e.id),
            label: `${e.name} (${e.number})`,
          }))}
          placeholder="Pilih pegawai"
          searchPlaceholder="Cari pegawai..."
        />
        {errors.employee_id && (
          <p className="text-xs text-red-500">{errors.employee_id}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <SearchableSelect
          label="Template Shift"
          value={formData.shift_template_id}
          onChange={(val) => handleChange("shift_template_id", val)}
          options={shifts.map((s) => ({
            value: String(s.id),
            label: s.name,
          }))}
          placeholder="Pilih shift"
          searchPlaceholder="Cari shift..."
        />
        {errors.shift_template_id && (
          <p className="text-xs text-red-500">{errors.shift_template_id}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-(--foreground) opacity-80">
            Tanggal Berlaku
          </label>
          <input
            type="date"
            value={formData.effective_date}
            onChange={(e) => handleChange("effective_date", e.target.value)}
            className={cn(
              "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
              "border-(--border) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
              errors.effective_date && "border-red-500",
            )}
          />
          {errors.effective_date && (
            <p className="text-xs text-red-500">{errors.effective_date}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-(--foreground) opacity-80">
            Tanggal Berakhir{" "}
            <span className="text-(--muted-foreground) font-normal">
              (opsional)
            </span>
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
            className={cn(
              "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
              "border-(--border) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
            )}
          />
          <p className="text-xs text-(--muted-foreground)">
            Kosongkan jika berlaku seterusnya
          </p>
        </div>
      </div>

      {editSchedule && (
        <div className="pt-2">
          <Toggle
            checked={formData.is_active}
            onChange={(checked) => handleChange("is_active", checked)}
            label="Jadwal Aktif"
          />
        </div>
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
          {editSchedule ? "Simpan" : "Assign"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// SKELETON COMPONENTS
// ════════════════════════════════════════════

function SkeletonShiftTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border)">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border) bg-(--muted)/50">
              {[
                "Nama Shift",
                "Jam Masuk",
                "Jam Pulang",
                "Istirahat",
                "Fleksibel",
                "Aksi",
              ].map((h) => (
                <th key={h} className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b border-(--border)">
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-5 w-12 rounded-full" />
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

function SkeletonScheduleTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border)">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border) bg-(--muted)/50">
              {[
                "Pegawai",
                "Shift",
                "Tanggal Berlaku",
                "Tanggal Berakhir",
                "Status",
                "Aksi",
              ].map((h) => (
                <th key={h} className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-(--border)">
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-40" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-5 w-16 rounded-full" />
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
// TAB SELECTOR
// ════════════════════════════════════════════

type TabType = "templates" | "schedules";

function TabSelector({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-(--muted)/50">
      <button
        onClick={() => onTabChange("templates")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
          activeTab === "templates"
            ? "bg-(--card) text-(--foreground) shadow-sm"
            : "text-(--muted-foreground) hover:text-(--foreground)",
        )}
      >
        <Clock size={16} />
        Template Shift
      </button>
      <button
        onClick={() => onTabChange("schedules")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
          activeTab === "schedules"
            ? "bg-(--card) text-(--foreground) shadow-sm"
            : "text-(--muted-foreground) hover:text-(--foreground)",
        )}
      >
        <Calendar size={16} />
        Jadwal Pegawai
      </button>
    </div>
  );
}

// ════════════════════════════════════════════
// TEMPLATE SHIFT TAB
// ════════════════════════════════════════════

function TemplateShiftTab() {
  const { data: shifts, loading, refetch } = useShiftList();
  const {
    loading: mutationLoading,
    createShift,
    updateShift,
    deleteShift,
  } = useShiftMutations(refetch);

  const [showForm, setShowForm] = useState(false);
  const [editShift, setEditShift] = useState<ShiftTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ShiftTemplate | null>(null);

  const handleCreate = async (
    payload: CreateShiftPayload | UpdateShiftPayload,
  ) => {
    const result = await createShift(payload as CreateShiftPayload);
    if (result) setShowForm(false);
  };

  const handleUpdate = async (
    payload: CreateShiftPayload | UpdateShiftPayload,
  ) => {
    if (!editShift) return;
    const result = await updateShift(
      editShift.id,
      payload as UpdateShiftPayload,
    );
    if (result) setEditShift(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteShift(deleteTarget.id);
    if (result) setDeleteTarget(null);
  };

  // Format time window display
  const formatTimeWindow = (start: string, end: string) => `${start} – ${end}`;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-(--muted-foreground)">
          Template shift menentukan window jam masuk dan pulang pegawai
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(true)}
          className="self-start sm:self-auto"
        >
          <Plus size={16} />
          Tambah Template
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonShiftTable />
      ) : !shifts || shifts.length === 0 ? (
        <EmptyState
          title="Belum ada template shift"
          description="Tambahkan template shift untuk mengatur jadwal kerja"
          icon={<Clock className="h-12 w-12" />}
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Tambah Template
            </Button>
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
                      Nama Shift
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Jam Masuk
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Jam Pulang
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Istirahat
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Fleksibel
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift, index) => (
                    <tr
                      key={shift.id}
                      className={cn(
                        "border-b border-(--border) last:border-b-0",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-4">
                        <span className="font-medium text-(--foreground)">
                          {shift.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-(--muted-foreground)">
                          <Clock size={14} className="text-(--primary)" />
                          {formatTimeWindow(
                            shift.clock_in_start,
                            shift.clock_in_end,
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-(--muted-foreground)">
                          <Clock size={14} className="text-orange-500" />
                          {formatTimeWindow(
                            shift.clock_out_start,
                            shift.clock_out_end,
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-(--muted-foreground)">
                          <Coffee size={14} />
                          {shift.break_duration_minutes} menit
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            shift.is_flexible
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                          )}
                        >
                          {shift.is_flexible && <Zap size={12} />}
                          {shift.is_flexible ? "Ya" : "Tidak"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditShift(shift)}
                            className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(shift)}
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
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="rounded-xl border border-(--border) bg-(--card) p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-(--foreground)">
                        {shift.name}
                      </p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          shift.is_flexible
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                        )}
                      >
                        {shift.is_flexible && <Zap size={12} />}
                        {shift.is_flexible ? "Fleksibel" : "Tetap"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-(--muted-foreground)">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-(--primary)" />
                        Masuk:{" "}
                        {formatTimeWindow(
                          shift.clock_in_start,
                          shift.clock_in_end,
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-orange-500" />
                        Pulang:{" "}
                        {formatTimeWindow(
                          shift.clock_out_start,
                          shift.clock_out_end,
                        )}
                      </div>
                      <div className="flex items-center gap-1 col-span-2">
                        <Coffee size={12} />
                        Istirahat: {shift.break_duration_minutes} menit
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditShift(shift)}
                      className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(shift)}
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

      {/* Create Modal */}
      <Modal
        open={showForm}
        title="Tambah Template Shift"
        onClose={() => setShowForm(false)}
      >
        <ShiftForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editShift}
        title="Edit Template Shift"
        onClose={() => setEditShift(null)}
      >
        {editShift && (
          <ShiftForm
            onClose={() => setEditShift(null)}
            onSubmit={handleUpdate}
            editShift={editShift}
            isLoading={mutationLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Template Shift"
        message={`Apakah Anda yakin ingin menghapus template "${deleteTarget?.name}"? Jadwal pegawai yang menggunakan template ini akan terpengaruh.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={mutationLoading}
      />
    </>
  );
}

// ════════════════════════════════════════════
// JADWAL PEGAWAI TAB
// ════════════════════════════════════════════

function ScheduleTab() {
  const { data: employees } = useEmployeeList({ is_active: true });
  const { data: shifts } = useShiftList();

  // Filter state
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      shift_template_id: filterShift ? parseInt(filterShift) : undefined,
    }),
    [filterEmployee, filterShift],
  );

  const { data: schedules, loading, refetch } = useScheduleList(params);
  const {
    loading: mutationLoading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useScheduleMutations(refetch);

  const [showForm, setShowForm] = useState(false);
  const [editSchedule, setEditSchedule] = useState<EmployeeSchedule | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<EmployeeSchedule | null>(
    null,
  );

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!schedules) return [];
    if (!searchQuery) return schedules;
    const q = searchQuery.toLowerCase();
    return schedules.filter(
      (s) =>
        s.employee_name?.toLowerCase().includes(q) ||
        s.employee_number?.toLowerCase().includes(q) ||
        s.shift_name?.toLowerCase().includes(q),
    );
  }, [schedules, searchQuery]);

  const handleCreate = async (
    payload: CreateSchedulePayload | UpdateSchedulePayload,
  ) => {
    const result = await createSchedule(payload as CreateSchedulePayload);
    if (result) setShowForm(false);
  };

  const handleUpdate = async (
    payload: CreateSchedulePayload | UpdateSchedulePayload,
  ) => {
    if (!editSchedule) return;
    const result = await updateSchedule(
      editSchedule.id,
      payload as UpdateSchedulePayload,
    );
    if (result) setEditSchedule(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteSchedule(deleteTarget.id);
    if (result) setDeleteTarget(null);
  };

  const employeeOptions =
    employees?.map((e) => ({
      id: e.id,
      name: e.full_name,
      number: e.employee_number,
    })) || [];

  const shiftOptions = shifts?.map((s) => ({ id: s.id, name: s.name })) || [];

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-(--muted-foreground)">
          Assign template shift ke pegawai dengan periode berlaku
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(true)}
          className="self-start sm:self-auto"
        >
          <Plus size={16} />
          Assign Shift
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
            placeholder="Cari nama atau nomor pegawai..."
            className={cn(
              "w-full rounded-lg border bg-(--input) pl-9 pr-4 py-2 text-sm text-(--foreground)",
              "border-(--border) placeholder:text-(--muted-foreground)",
              "transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
            )}
          />
        </div>

        <select
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
          className={cn(
            "rounded-lg border bg-(--input) px-4 py-2 text-sm text-(--foreground)",
            "border-(--border) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          )}
        >
          <option value="">Semua Pegawai</option>
          {employees?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.full_name}
            </option>
          ))}
        </select>

        <select
          value={filterShift}
          onChange={(e) => setFilterShift(e.target.value)}
          className={cn(
            "rounded-lg border bg-(--input) px-4 py-2 text-sm text-(--foreground)",
            "border-(--border) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          )}
        >
          <option value="">Semua Shift</option>
          {shifts?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonScheduleTable />
      ) : !filtered || filtered.length === 0 ? (
        <EmptyState
          title={
            searchQuery || filterEmployee || filterShift
              ? "Jadwal tidak ditemukan"
              : "Belum ada jadwal pegawai"
          }
          description={
            searchQuery || filterEmployee || filterShift
              ? "Coba ubah filter pencarian"
              : "Assign shift ke pegawai untuk memulai"
          }
          icon={<Users className="h-12 w-12" />}
          action={
            !searchQuery &&
            !filterEmployee &&
            !filterShift && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Assign Shift
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
                      Pegawai
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Shift
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Tanggal Berlaku
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Tanggal Berakhir
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
                  {filtered.map((schedule, index) => (
                    <tr
                      key={schedule.id}
                      className={cn(
                        "border-b border-(--border) last:border-b-0",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-(--foreground)">
                            {schedule.employee_name}
                          </p>
                          <p className="text-xs text-(--muted-foreground)">
                            {schedule.employee_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md bg-(--primary)/10 px-2 py-0.5 text-xs font-medium text-(--primary)">
                          {schedule.shift_name}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-(--muted-foreground)">
                        {formatDate(schedule.effective_date)}
                      </td>
                      <td className="px-5 py-4 text-sm text-(--muted-foreground)">
                        {schedule.end_date ? (
                          formatDate(schedule.end_date)
                        ) : (
                          <span className="italic">Seterusnya</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            schedule.is_active
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                          )}
                        >
                          {schedule.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditSchedule(schedule)}
                            className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(schedule)}
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
            {filtered.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-xl border border-(--border) bg-(--card) p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded-md bg-(--primary)/10 px-2 py-0.5 text-xs font-medium text-(--primary)">
                        {schedule.shift_name}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          schedule.is_active
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                        )}
                      >
                        {schedule.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className="font-semibold text-(--foreground)">
                      {schedule.employee_name}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {schedule.employee_number}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-(--muted-foreground)">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Mulai: {formatDate(schedule.effective_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Akhir:{" "}
                        {schedule.end_date
                          ? formatDate(schedule.end_date)
                          : "Seterusnya"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditSchedule(schedule)}
                      className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(schedule)}
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

      {/* Create Modal */}
      <Modal
        open={showForm}
        title="Assign Shift ke Pegawai"
        onClose={() => setShowForm(false)}
      >
        <ScheduleForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          employees={employeeOptions}
          shifts={shiftOptions}
          isLoading={mutationLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editSchedule}
        title="Edit Jadwal Pegawai"
        onClose={() => setEditSchedule(null)}
      >
        {editSchedule && (
          <ScheduleForm
            onClose={() => setEditSchedule(null)}
            onSubmit={handleUpdate}
            editSchedule={editSchedule}
            employees={employeeOptions}
            shifts={shiftOptions}
            isLoading={mutationLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Jadwal Pegawai"
        message={`Apakah Anda yakin ingin menghapus jadwal shift "${deleteTarget?.shift_name}" untuk "${deleteTarget?.employee_name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={mutationLoading}
      />
    </>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function ShiftPage() {
  const [activeTab, setActiveTab] = useState<TabType>("templates");

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-(--foreground) md:text-2xl">
              Shift & Jadwal Kerja
            </h1>
            <p className="text-sm text-(--muted-foreground)">
              Kelola template shift dan jadwal kerja pegawai
            </p>
          </div>
          <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === "templates" ? <TemplateShiftTab /> : <ScheduleTab />}
      </div>
    </MainLayout>
  );
}
