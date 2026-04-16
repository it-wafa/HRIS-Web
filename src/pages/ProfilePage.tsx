import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Network,
  Briefcase,
  Building2,
  IdCard,
  ClipboardCheck,
  Clock,
  FileCheck,
  Camera,
  Lock,
  CalendarOff,
  AlertTriangle,
  Timer,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  useEmployeeProfile,
  useEmployeeProfileContacts,
} from "@/hooks/useEmployeeProfile";
import { useAttendanceList } from "@/hooks/useAttendance";
import { useLeaveBalanceList } from "@/hooks/useLeave";
import { useShiftList, useScheduleList } from "@/hooks/useShift";
import { useContractList } from "@/hooks/useContract";
import { useDemo } from "@/contexts/DemoContext";
import {
  CONTACT_TYPE_LABELS,
} from "@/types/employee";
import { useEmployeeMetadata } from "@/hooks/useMetadata";
import { DAY_OF_WEEK_OPTIONS } from "@/types/shift";
import { CONTRACT_TYPE_LABELS, CONTRACT_TYPE_COLORS } from "@/types/contract";
import { MUTABAAH_TARGET } from "@/types/mutabaah";
import type { ShiftTemplate, EmployeeSchedule } from "@/types/shift";
import type { EmploymentContract } from "@/types/contract";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/FormElements";

// ════════════════════════════════════════════
// TAB NAV
// ════════════════════════════════════════════

function TabNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}) {
  const tabs = [
    { label: "Info Pribadi", icon: User },
    { label: "Data Pekerjaan", icon: Briefcase },
    { label: "Kontak", icon: Phone },
    { label: "Kehadiran & Cuti", icon: ClipboardCheck },
    { label: "Shift & Jadwal", icon: Clock },
    { label: "Kontrak", icon: FileCheck },
  ];

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-(--border) scrollbar-hide">
      {tabs.map((tab, index) => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(index)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
            activeTab === index
              ? "border-(--primary) text-(--primary)"
              : "border-transparent text-(--muted-foreground) hover:text-(--foreground)",
          )}
        >
          <tab.icon size={16} />
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-(--muted-foreground)">{label}</div>
      <div className="text-sm font-medium text-(--foreground)">
        {value || "-"}
      </div>
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--card) p-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${color}20` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold text-(--foreground)">{value}</div>
        <div className="text-xs text-(--muted-foreground)">{label}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB 4: KEHADIRAN & CUTI
// ════════════════════════════════════════════

function TabAttendanceLeave({ employeeId }: { employeeId: number | null }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startDate = new Date(currentYear, currentMonth, 1)
    .toISOString()
    .split("T")[0];
  const endDate = new Date(currentYear, currentMonth + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data: attendances, loading: attLoading } = useAttendanceList({
    employee_id: employeeId || undefined,
    start_date: startDate,
    end_date: endDate,
  });

  const { data: balances, loading: balLoading } = useLeaveBalanceList({
    employee_id: employeeId || undefined,
    year: currentYear,
  });

  if (attLoading || balLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const totalPresent =
    attendances?.filter((a) => a.status === "present" || a.status === "late")
      .length || 0;
  const totalLate = attendances?.filter((a) => a.status === "late").length || 0;
  const totalAbsent =
    attendances?.filter((a) => a.status === "absent").length || 0;
  const totalLeave =
    attendances?.filter((a) => a.status === "leave" || a.status === "half_day")
      .length || 0;

  const clockInTimes =
    attendances
      ?.filter((a) => a.clock_in_at)
      .map((a) => {
        const t =
          a.clock_in_at!.split("T")[1]?.split(":") || a.clock_in_at!.split(":");
        return parseInt(t[0], 10) * 60 + parseInt(t[1], 10);
      }) || [];
  const avgClockInMinutes =
    clockInTimes.length > 0
      ? Math.round(
          clockInTimes.reduce((a, b) => a + b, 0) / clockInTimes.length,
        )
      : null;
  const avgClockIn = avgClockInMinutes
    ? `${Math.floor(avgClockInMinutes / 60)
        .toString()
        .padStart(2, "0")}:${(avgClockInMinutes % 60).toString().padStart(2, "0")}`
    : "-";

  const totalLateMinutes =
    attendances?.reduce((sum, a) => sum + (a.late_minutes || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-(--border) bg-(--card) p-5">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck size={18} className="text-(--primary)" />
          <h3 className="font-semibold text-(--foreground)">
            Ringkasan Kehadiran Bulan Ini
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatItem
            icon={ClipboardCheck}
            label="Total Hadir"
            value={totalPresent}
            color="#10b981"
          />
          <StatItem
            icon={AlertTriangle}
            label="Terlambat"
            value={totalLate}
            color="#f59e0b"
          />
          <StatItem
            icon={CalendarOff}
            label="Absen"
            value={totalAbsent}
            color="#ef4444"
          />
          <StatItem
            icon={CalendarOff}
            label="Cuti/Izin"
            value={totalLeave}
            color="#3b82f6"
          />
        </div>
        <div className="mt-4 pt-4 border-t border-(--border) grid grid-cols-2 gap-4">
          <InfoItem label="Rata-rata Jam Masuk" value={avgClockIn} />
          <InfoItem
            label="Total Keterlambatan"
            value={`${totalLateMinutes} menit`}
          />
        </div>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--card) p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarOff size={18} className="text-(--primary)" />
          <h3 className="font-semibold text-(--foreground)">
            Saldo Cuti Tahun {currentYear}
          </h3>
        </div>
        {!balances || balances.length === 0 ? (
          <p className="text-sm text-(--muted-foreground)">
            Belum ada data saldo cuti
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border)">
                  <th className="py-2 px-3 text-left text-xs font-medium text-(--muted-foreground)">
                    Jenis Cuti
                  </th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-(--muted-foreground)">
                    Kuota
                  </th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-(--muted-foreground)">
                    Terpakai
                  </th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-(--muted-foreground)">
                    Sisa
                  </th>
                </tr>
              </thead>
              <tbody>
                {balances.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-(--border) last:border-0"
                  >
                    <td className="py-2.5 px-3 text-sm font-medium text-(--foreground)">
                      {b.leave_type_name}
                    </td>
                    <td className="py-2.5 px-3 text-center text-sm text-(--muted-foreground)">
                      {b.max_duration ?? "∞"}
                    </td>
                    <td className="py-2.5 px-3 text-center text-sm text-(--muted-foreground)">
                      {b.used_duration}
                    </td>
                    <td className="py-2.5 px-3 text-center text-sm font-medium text-(--primary)">
                      {b.remaining_duration ?? "∞"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB 5: SHIFT & JADWAL
// ════════════════════════════════════════════

function TabShiftSchedule({ employeeId }: { employeeId: number | null }) {
  const { data: shifts, loading: shiftLoading } = useShiftList();
  const { data: schedules, loading: schedLoading } = useScheduleList({
    employee_id: employeeId || undefined,
  });

  if (shiftLoading || schedLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const activeSchedule = schedules?.find(
    (s: EmployeeSchedule) =>
      s.is_active &&
      s.effective_date <= today &&
      (!s.end_date || s.end_date >= today),
  );
  const activeShift = activeSchedule
    ? shifts?.find(
        (s: ShiftTemplate) => s.id === activeSchedule.shift_template_id,
      )
    : null;

  if (!activeSchedule || !activeShift) {
    return (
      <EmptyState
        title="Tidak ada shift aktif"
        description="Jadwal shift belum diatur untuk Anda"
        icon={<Clock className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-(--border) bg-(--card) p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-(--primary)" />
            <h3 className="font-semibold text-(--foreground)">Shift Aktif</h3>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              activeShift.is_flexible
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            )}
          >
            {activeShift.is_flexible ? "Fleksibel" : "Tetap"}
          </span>
        </div>
        <p className="text-lg font-semibold text-(--foreground) mb-4">
          {activeShift.name}
        </p>
        <div className="space-y-2">
          {DAY_OF_WEEK_OPTIONS.map((day) => {
            const detail = activeShift.details?.find(
              (d) => d.day_of_week === day.value,
            );
            const isWorkDay = detail?.is_working_day ?? false;
            return (
              <div
                key={day.value}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2",
                  isWorkDay
                    ? "bg-(--muted)/50"
                    : "bg-red-50 dark:bg-red-900/10",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    isWorkDay
                      ? "text-(--foreground)"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {day.label}
                </span>
                {isWorkDay && detail ? (
                  <div className="flex items-center gap-4 text-xs text-(--muted-foreground)">
                    <span>
                      <Timer size={12} className="inline mr-1" />
                      {detail.clock_in_start || "-"} -{" "}
                      {detail.clock_out_end || "-"}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Libur
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--card) p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck size={18} className="text-(--primary)" />
          <h3 className="font-semibold text-(--foreground)">Jadwal Berlaku</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Mulai Berlaku"
            value={new Date(activeSchedule.effective_date).toLocaleDateString(
              "id-ID",
              { day: "numeric", month: "long", year: "numeric" },
            )}
          />
          <InfoItem
            label="Berakhir"
            value={
              activeSchedule.end_date
                ? new Date(activeSchedule.end_date).toLocaleDateString(
                    "id-ID",
                    { day: "numeric", month: "long", year: "numeric" },
                  )
                : "Berlaku seterusnya"
            }
          />
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// TAB 6: KONTRAK
// ════════════════════════════════════════════

function TabContract({ employeeId }: { employeeId: number | null }) {
  const { data: contracts, loading } = useContractList(employeeId);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <EmptyState
        title="Tidak ada data kontrak"
        description="Data kontrak kerja belum tersedia"
        icon={<FileCheck className="h-12 w-12" />}
      />
    );
  }

  const sorted = [...contracts].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  );
  const today = new Date().toISOString().split("T")[0];
  const activeContract = sorted.find(
    (c: EmploymentContract) =>
      c.start_date <= today && (!c.end_date || c.end_date >= today),
  );
  const pastContracts = sorted.filter((c) => c !== activeContract);

  const getRemainingDays = (endDate: string | null) => {
    if (!endDate) return null;
    const diff = Math.ceil(
      (new Date(endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return Math.max(0, diff);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {activeContract && (
        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck size={18} className="text-(--primary)" />
              <h3 className="font-semibold text-(--foreground)">
                Kontrak Aktif
              </h3>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                CONTRACT_TYPE_COLORS[activeContract.contract_type],
              )}
            >
              {CONTRACT_TYPE_LABELS[activeContract.contract_type]}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoItem
              label="Nomor Kontrak"
              value={activeContract.contract_number}
            />
            <InfoItem
              label="Tanggal Mulai"
              value={formatDate(activeContract.start_date)}
            />
            <InfoItem
              label="Tanggal Selesai"
              value={
                activeContract.end_date
                  ? formatDate(activeContract.end_date)
                  : "Tidak terbatas"
              }
            />
            {activeContract.end_date &&
              (() => {
                const remaining = getRemainingDays(activeContract.end_date);
                const isWarning = remaining !== null && remaining <= 30;
                return (
                  <div className="space-y-1">
                    <div className="text-xs text-(--muted-foreground)">
                      Sisa Waktu
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isWarning
                          ? "text-red-600 dark:text-red-400"
                          : "text-(--foreground)",
                      )}
                    >
                      {remaining} hari
                      {isWarning && (
                        <AlertTriangle
                          size={14}
                          className="inline ml-1 text-red-600"
                        />
                      )}
                    </div>
                  </div>
                );
              })()}
          </div>
          {activeContract.notes && (
            <div className="mt-4 pt-4 border-t border-(--border)">
              <InfoItem label="Catatan" value={activeContract.notes} />
            </div>
          )}
        </div>
      )}

      {pastContracts.length > 0 && (
        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck size={18} className="text-(--muted-foreground)" />
            <h3 className="font-semibold text-(--foreground)">
              Riwayat Kontrak
            </h3>
          </div>
          <div className="space-y-3">
            {pastContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between rounded-lg bg-(--muted)/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      CONTRACT_TYPE_COLORS[contract.contract_type],
                    )}
                  >
                    {CONTRACT_TYPE_LABELS[contract.contract_type]}
                  </span>
                  <span className="text-sm font-medium text-(--foreground)">
                    {contract.contract_number}
                  </span>
                </div>
                <span className="text-xs text-(--muted-foreground)">
                  {formatDate(contract.start_date)} -{" "}
                  {contract.end_date ? formatDate(contract.end_date) : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function ProfilePage() {
  const navigate = useNavigate();
  const { isDemo } = useDemo();
  const { data: profile, loading: profileLoading } = useEmployeeProfile();
  const { data: contacts, loading: contactsLoading } =
    useEmployeeProfileContacts();
  const { data: metadata } = useEmployeeMetadata();

  const [activeTab, setActiveTab] = useState(0);
  const loading = profileLoading || contactsLoading;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const handleUploadPhoto = () => {
    if (isDemo) {
      toast("Demo mode — foto tidak diubah", { icon: "🔒" });
      return;
    }
    toast.success("Foto berhasil diupload");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center p-6 pt-16 min-h-[50vh] md:pt-6">
          <EmptyState
            title="Profil tidak ditemukan"
            description="Data profil Anda tidak tersedia saat ini"
            icon={<User className="h-12 w-12" />}
          />
        </div>
      </MainLayout>
    );
  }

  // Trainer target info
  const isTrainer = (profile as unknown as { is_trainer?: boolean })?.is_trainer ?? false;
  const tilawahTarget = isTrainer
    ? MUTABAAH_TARGET.TRAINER
    : MUTABAAH_TARGET.NON_TRAINER;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Avatar */}
            <div className="relative group">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
                }}
              >
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <button
                onClick={handleUploadPhoto}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-(--primary) text-white shadow-md transition hover:bg-(--primary)/90"
              >
                <Camera size={12} />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-(--foreground)">
                  {profile.full_name}
                </h1>
                {/* Trainer badge in header */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                    isTrainer
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
                  )}
                >
                  <BookOpen size={10} />
                  {isTrainer ? "Trainer" : "Non-Trainer"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <p className="text-sm text-(--muted-foreground)">
                  {profile.employee_number}
                  {profile.job_position_title
                    ? ` · ${profile.job_position_title}`
                    : ""}
                </p>
                {profile.department_name && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--secondary)/50 px-2 py-0.5 text-xs font-medium text-(--muted-foreground)">
                    <Network size={10} />
                    {profile.department_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Change Password CTA */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/change-password")}
            className="self-start sm:self-auto"
          >
            <Lock size={14} />
            Ubah Password
          </Button>
        </div>

        {/* Tabs */}
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="min-h-75">
          {/* Tab 0: Info Pribadi */}
          {activeTab === 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <div className="flex items-center gap-2 mb-4">
                  <IdCard size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Data Dasar
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    label="Nomor Pegawai"
                    value={profile.employee_number}
                  />
                  <InfoItem label="Nama Lengkap" value={profile.full_name} />
                  <InfoItem
                    label="Tanggal Lahir"
                    value={formatDate(profile.birth_date)}
                  />
                  <InfoItem label="Tempat Lahir" value={profile.birth_place} />
                  <InfoItem
                    label="Jenis Kelamin"
                    value={
                      profile.gender ? metadata?.gender_meta.find((g) => g.id === profile.gender)?.name : undefined
                    }
                  />
                  <InfoItem label="Agama" value={profile.religion} />
                </div>
              </div>

              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Data Kependudukan
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="NIK" value={profile.nik} />
                  <InfoItem label="NPWP" value={profile.npwp} />
                  <InfoItem label="Nomor KK" value={profile.kk_number} />
                  <InfoItem
                    label="Status Pernikahan"
                    value={
                      profile.marital_status
                        ? metadata?.marital_status_meta.find((m) => m.id === profile.marital_status)?.name
                        : undefined
                    }
                  />
                  <InfoItem label="Golongan Darah" value={profile.blood_type} />
                  <InfoItem
                    label="Kewarganegaraan"
                    value={profile.nationality}
                  />

                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Data Pekerjaan */}
          {activeTab === 1 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Penempatan
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem label="Cabang" value={profile.branch_name} />
                  <InfoItem
                    label="Departemen"
                    value={profile.department_name}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Jabatan & Role
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Jabatan"
                    value={profile.job_position_title}
                  />
                  <InfoItem label="Role" value={profile.role_name} />
                </div>
              </div>

              {/* Trainer Status Card */}
              <div
                className={cn(
                  "rounded-xl border p-5 lg:col-span-2",
                  isTrainer
                    ? "border-blue-500/30 bg-blue-500/5"
                    : "border-(--border) bg-(--card)",
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen
                      size={18}
                      className={isTrainer ? "text-blue-500" : "text-(--muted-foreground)"}
                    />
                    <h3 className="font-semibold text-(--foreground)">
                      Status Tilawah (Mutaba'ah)
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      isTrainer
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
                    )}
                  >
                    {isTrainer ? "Trainer Wafa" : "Non-Trainer"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-(--muted)/40 p-4 text-center">
                    <div
                      className={cn(
                        "text-3xl font-bold mb-1",
                        isTrainer ? "text-blue-600" : "text-(--primary)",
                      )}
                    >
                      {tilawahTarget}
                    </div>
                    <div className="text-xs text-(--muted-foreground)">
                      halaman / hari
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex flex-col justify-center">
                    <p className="text-sm text-(--foreground) font-medium mb-1">
                      {isTrainer
                        ? "Anda adalah Trainer Wafa"
                        : "Anda adalah pegawai non-trainer"}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {isTrainer
                        ? `Sebagai trainer, Anda diwajibkan membaca ${MUTABAAH_TARGET.TRAINER} halaman Al-Quran setiap hari kerja. Target ini lebih tinggi dari pegawai reguler (${MUTABAAH_TARGET.NON_TRAINER} halaman).`
                        : `Anda diwajibkan membaca ${MUTABAAH_TARGET.NON_TRAINER} halaman Al-Quran setiap hari kerja sebagai bagian dari program Mutaba'ah perusahaan.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-(--border) bg-(--card) p-5 lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <IdCard size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Informasi Tambahan
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <InfoItem
                    label="Bergabung Sejak"
                    value={formatDate(profile.created_at)}
                  />
                  <InfoItem
                    label="Terakhir Diperbarui"
                    value={formatDate(profile.updated_at)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Kontak */}
          {activeTab === 2 && (
            <div className="space-y-4">
              {!contacts || contacts.length === 0 ? (
                <EmptyState
                  title="Belum ada data kontak"
                  description="Data kontak Anda belum tersedia"
                  icon={<Phone className="h-10 w-10" />}
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-start gap-3 rounded-xl border border-(--border) bg-(--card) p-4"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          contact.contact_type === "phone" &&
                            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                          contact.contact_type === "email" &&
                            "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                          contact.contact_type === "address" &&
                            "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                        )}
                      >
                        {contact.contact_type === "phone" && (
                          <Phone size={18} />
                        )}
                        {contact.contact_type === "email" && <Mail size={18} />}
                        {contact.contact_type === "address" && (
                          <MapPin size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-(--muted-foreground)">
                            {CONTACT_TYPE_LABELS[contact.contact_type]}
                            {contact.contact_label &&
                              ` · ${contact.contact_label}`}
                          </span>
                          {contact.is_primary && (
                            <span className="rounded-full bg-(--primary)/10 px-2 py-0.5 text-xs font-medium text-(--primary)">
                              Utama
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm font-medium text-(--foreground) break-all">
                          {contact.contact_value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 3 && <TabAttendanceLeave employeeId={profile.id} />}
          {activeTab === 4 && <TabShiftSchedule employeeId={profile.id} />}
          {activeTab === 5 && <TabContract employeeId={profile.id} />}
        </div>
      </div>
    </MainLayout>
  );
}