import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  CalendarOff,
  Clock,
  FileCheck,
  AlertTriangle,
  Send,
  Plane,
  Edit2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard, StatCardSkeleton } from "@/components/ui/StatCard";
import { ClockWidget, ClockWidgetSkeleton } from "@/components/ui/ClockWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MutabaahWidgetSkeleton,
} from "@/components/ui/MutabaahWidget";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import {
  useEmployeeDashboard,
  useHRDDashboard,
  useClockWidget,
} from "@/hooks/useDashboard";
import { useMutabaahActions } from "@/hooks/useMutabaah";
import type {
  LeaveBalanceSummary,
  PendingRequest,
  ApprovalQueueItem,
  NotClockedInEmployee,
  ExpiringContract,
} from "@/types/dashboard";

const REQUEST_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  leave: { label: "Cuti", icon: CalendarOff, color: "#3b82f6" },
  permission: { label: "Izin", icon: Clock, color: "#8b5cf6" },
  overtime: { label: "Lembur", icon: Clock, color: "#f59e0b" },
  business_trip: { label: "Dinas", icon: Plane, color: "#10b981" },
  override: { label: "Koreksi", icon: Edit2, color: "#ef4444" },
};

function ViewToggle({
  view,
  setView,
}: {
  view: "employee" | "hrd";
  setView: (v: "employee" | "hrd") => void;
}) {
  return (
    <div className="flex rounded-lg border border-(--border) bg-(--muted)/30 p-1">
      <button
        onClick={() => setView("employee")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          view === "employee"
            ? "bg-(--card) text-(--foreground) shadow-sm"
            : "text-(--muted-foreground) hover:text-(--foreground)",
        )}
      >
        Pegawai
      </button>
      <button
        onClick={() => setView("hrd")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          view === "hrd"
            ? "bg-(--card) text-(--foreground) shadow-sm"
            : "text-(--muted-foreground) hover:text-(--foreground)",
        )}
      >
        HRD
      </button>
    </div>
  );
}

function LeaveBalanceCard({ balance }: { balance: LeaveBalanceSummary }) {
  const percentage =
    balance.total_quota && balance.remaining !== null
      ? ((balance.total_quota - balance.used) / balance.total_quota) * 100
      : 100;

  return (
    <div className="rounded-lg border border-(--border) bg-(--card) p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-(--foreground)">
          {balance.leave_type_name}
        </span>
        <span className="text-xs text-(--muted-foreground)">
          {balance.remaining !== null
            ? `${balance.remaining} tersisa`
            : "Unlimited"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-(--muted) overflow-hidden">
          <div
            className="h-full bg-(--primary) rounded-full transition-all"
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
        <span className="text-xs font-medium text-(--muted-foreground)">
          {balance.used}/{balance.total_quota ?? "∞"}
        </span>
      </div>
    </div>
  );
}

function PendingRequestCard({ request }: { request: PendingRequest }) {
  const config = REQUEST_TYPE_CONFIG[request.type];
  const Icon = config?.icon || Send;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--card) p-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${config?.color || "#6b7280"}20` }}
      >
        <Icon size={16} style={{ color: config?.color || "#6b7280" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-(--foreground) truncate">
          {request.label}
        </div>
        <div className="text-xs text-(--muted-foreground)">
          {new Date(request.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600">
        Pending
      </span>
    </div>
  );
}

function ApprovalQueueRow({ item }: { item: ApprovalQueueItem }) {
  const config = REQUEST_TYPE_CONFIG[item.type];
  return (
    <tr className="border-b border-(--border) last:border-0">
      <td className="py-3 px-4">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background: `${config?.color || "#6b7280"}15`,
            color: config?.color || "#6b7280",
          }}
        >
          {config?.label || item.type}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-(--foreground)">
        {item.employee_name}
      </td>
      <td className="py-3 px-4 text-sm text-(--muted-foreground) max-w-50 truncate">
        {item.label}
      </td>
      <td className="py-3 px-4 text-xs text-(--muted-foreground)">
        {new Date(item.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })}
      </td>
    </tr>
  );
}

function NotClockedInRow({ employee }: { employee: NotClockedInEmployee }) {
  return (
    <tr className="border-b border-(--border) last:border-0">
      <td className="py-2.5 px-4 text-sm font-medium text-(--foreground)">
        {employee.employee_name}
      </td>
      <td className="py-2.5 px-4 text-xs text-(--muted-foreground)">
        {employee.employee_number}
      </td>
      <td className="py-2.5 px-4 text-xs text-(--muted-foreground)">
        {employee.department_name || "-"}
      </td>
      <td className="py-2.5 px-4 text-xs text-(--muted-foreground)">
        {employee.shift_start || "-"}
      </td>
    </tr>
  );
}

function ExpiringContractCard({ contract }: { contract: ExpiringContract }) {
  const isUrgent = contract.days_remaining <= 14;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        isUrgent
          ? "border-red-500/30 bg-red-500/5"
          : "border-(--border) bg-(--card)",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          isUrgent ? "bg-red-500/10" : "bg-amber-500/10",
        )}
      >
        <FileCheck
          size={16}
          className={isUrgent ? "text-red-500" : "text-amber-500"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-(--foreground)">
          {contract.employee_name}
        </div>
        <div className="text-xs text-(--muted-foreground)">
          {contract.contract_type} • Berakhir{" "}
          {new Date(contract.end_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
          isUrgent
            ? "bg-red-500/10 text-red-600"
            : "bg-amber-500/10 text-amber-600",
        )}
      >
        {contract.days_remaining} hari
      </span>
    </div>
  );
}

// ════════════════════════════════════════════
// COMBINED ATTENDANCE + MUTABAAH PANEL
// ════════════════════════════════════════════

interface AttendanceMutabaahPanelProps {
  clockWidget: ReturnType<typeof useClockWidget>;
  empDashData: ReturnType<typeof useEmployeeDashboard>["data"];
  empDashLoading: boolean;
  isIntern: boolean;
  onMutabaahSubmit: () => void;
  onMutabaahCancel: () => void;
  mutabaahLoading: boolean;
}

function AttendanceMutabaahPanel({
  clockWidget,
  empDashData,
  empDashLoading,
  isIntern,
  onMutabaahSubmit,
  onMutabaahCancel,
  mutabaahLoading,
}: AttendanceMutabaahPanelProps) {
  const showMutabaah =
    !isIntern && !empDashLoading && empDashData?.mutabaah_today?.has_record;

  return (
    <div
      className={cn(
        "grid gap-4",
        showMutabaah
          ? "lg:grid-cols-2"
          : "lg:grid-cols-1 max-w-md mx-auto w-full",
      )}
    >
      {/* Clock Widget */}
      <div>
        {clockWidget.loading ? (
          <ClockWidgetSkeleton />
        ) : (
          <ClockWidget
            status={clockWidget.status}
            isMobile={clockWidget.isMobile}
            onClockIn={() => clockWidget.clockIn()}
            onClockOut={() => clockWidget.clockOut()}
            disabled={false}
            loading={clockWidget.loading}
          />
        )}
      </div>

      {/* Mutaba'ah Widget — only if not intern and has record */}
      {showMutabaah && (
        <div className="flex flex-col justify-center">
          <MutabaahCard
            status={empDashData!.mutabaah_today}
            onSubmit={onMutabaahSubmit}
            onCancel={onMutabaahCancel}
            loading={mutabaahLoading}
          />
        </div>
      )}

      {/* Skeleton for mutabaah loading */}
      {!isIntern && empDashLoading && (
        <div className="flex flex-col justify-center">
          <MutabaahWidgetSkeleton />
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// MUTABAAH CARD (expanded, matches clock widget height)
// ════════════════════════════════════════════

function MutabaahCard({
  status,
  onSubmit,
  onCancel,
  loading,
}: {
  status: NonNullable<
    ReturnType<typeof useEmployeeDashboard>["data"]
  >["mutabaah_today"];
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const canCancel = status.is_submitted && status.mutabaah_log_id != null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border shadow-xl h-full flex flex-col transition-all duration-300",
        status.is_submitted ? "border-emerald-500/30" : "border-(--border)",
      )}
    >
      {/* Gradient header */}
      <div
        className={cn(
          "relative px-5 pt-5 pb-8",
          status.is_submitted
            ? "bg-linear-to-br from-emerald-500 via-teal-500 to-emerald-600"
            : "bg-linear-to-br from-wafa-700 via-wafa-500 to-wafa-400",
        )}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-2 top-8 h-16 w-16 rounded-full bg-white/10" />

        {/* Header badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <BookOpen size={11} />
            Mutaba'ah
          </span>
          {status.is_submitted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              ✓ Selesai
            </span>
          )}
        </div>

        {/* Main display */}
        <div className="text-center">
          <div className="text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl">
            {status.target_pages}
          </div>
          <div className="mt-1.5 text-sm font-medium text-white/80">
            halaman Al-Quran per hari
          </div>
        </div>
      </div>

      {/* Curved connector */}
      <div
        className={cn(
          "h-6",
          status.is_submitted
            ? "bg-linear-to-br from-emerald-500 via-teal-500 to-emerald-600"
            : "bg-linear-to-br from-wafa-700 via-wafa-500 to-wafa-400",
        )}
        style={{ clipPath: "ellipse(100% 100% at 50% 0%)" }}
      />

      {/* Bottom section */}
      <div className="flex flex-1 flex-col bg-(--card) px-5 pb-5 mt-4">
        {/* Status indicator */}
        <div className="mb-4 flex justify-center">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium",
              status.is_submitted
                ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                status.is_submitted
                  ? "bg-emerald-500"
                  : "animate-pulse bg-amber-500",
              )}
            />
            {status.is_submitted
              ? `Dibaca pukul ${
                  status.submitted_at
                    ? new Date(status.submitted_at).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )
                    : "--:--"
                }`
              : "Belum membaca hari ini"}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action button */}
        <div className="flex gap-3">
          {!status.is_submitted ? (
            <button
              onClick={onSubmit}
              disabled={loading}
              className={cn(
                "group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl px-4 py-3.5 font-semibold text-white transition-all",
                "bg-linear-to-r from-wafa-700 to-wafa-500 shadow-lg",
                "hover:shadow-xl hover:-translate-y-0.5",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none",
              )}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>✓ Sudah Baca {status.target_pages} Halaman</>
              )}
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-(--muted)/50 px-4 py-3.5 text-(--muted-foreground)">
              <span className="text-emerald-500">✓</span>
              <span className="font-medium">Tilawah Selesai</span>
            </div>
          )}
        </div>

        {/* Cancel link */}
        {canCancel && (
          <div className="mt-2 text-center">
            <button
              onClick={onCancel}
              disabled={loading}
              className="text-xs text-(--muted-foreground) hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Batalkan pencatatan
            </button>
          </div>
        )}

        {/* Info when not submitted */}
        {!status.is_submitted && (
          <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2">
            <p className="text-center text-xs text-amber-600">
              📖 Jangan lupa catat tilawah setelah membaca
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// EMPLOYEE DASHBOARD VIEW
// ════════════════════════════════════════════

function EmployeeDashboardView() {
  const { data, loading } = useEmployeeDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Data dashboard tidak tersedia"
        description="Tidak dapat memuat data dashboard"
        icon={<ClipboardCheck className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-(--foreground)">
          Ringkasan Kehadiran Bulan Ini
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ClipboardCheck}
            label="Hadir"
            value={data.monthly_summary.total_present}
            color="#10b981"
            onClick={() => navigate("/attendance")}
          />
          <StatCard
            icon={Clock}
            label="Terlambat"
            value={data.monthly_summary.total_late}
            color="#f59e0b"
            onClick={() => navigate("/attendance")}
          />
          <StatCard
            icon={AlertTriangle}
            label="Absen"
            value={data.monthly_summary.total_absent}
            color="#ef4444"
          />
          <StatCard
            icon={CalendarOff}
            label="Cuti"
            value={data.monthly_summary.total_leave}
            color="#3b82f6"
            onClick={() => navigate("/leave")}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <h3 className="mb-4 font-semibold text-(--foreground)">Saldo Cuti</h3>
          {(data?.leave_balances?.length || 0) === 0 ? (
            <p className="text-sm text-(--muted-foreground)">
              Tidak ada data saldo cuti
            </p>
          ) : (
            <div className="space-y-3">
              {data.leave_balances.map((balance) => (
                <LeaveBalanceCard
                  key={balance.leave_type_id}
                  balance={balance}
                />
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <h3 className="mb-4 font-semibold text-(--foreground)">
            Pengajuan Pending
          </h3>
          {(data?.pending_requests?.length || 0) === 0 ? (
            <p className="text-sm text-(--muted-foreground)">
              Tidak ada pengajuan yang pending
            </p>
          ) : (
            <div className="space-y-3">
              {data.pending_requests.map((request) => (
                <PendingRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// HRD DASHBOARD VIEW
// ════════════════════════════════════════════

function HRDDashboardView() {
  const { data, loading } = useHRDDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Data dashboard tidak tersedia"
        description="Tidak dapat memuat data dashboard HRD"
        icon={<Users className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-(--foreground)">
          Pengajuan Menunggu Persetujuan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={CalendarOff}
            label="Cuti"
            value={data.approval_counts.leave}
            color="#3b82f6"
            onClick={() => navigate("/leave")}
          />
          <StatCard
            icon={Clock}
            label="Izin"
            value={data.approval_counts.permission}
            color="#8b5cf6"
            onClick={() => navigate("/requests")}
          />
          <StatCard
            icon={Clock}
            label="Lembur"
            value={data.approval_counts.overtime}
            color="#f59e0b"
            onClick={() => navigate("/requests")}
          />
          <StatCard
            icon={Plane}
            label="Dinas"
            value={data.approval_counts.business_trip}
            color="#10b981"
            onClick={() => navigate("/requests")}
          />
          <StatCard
            icon={Edit2}
            label="Koreksi"
            value={data.approval_counts.override}
            color="#ef4444"
            onClick={() => navigate("/attendance")}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-(--foreground)">
          Ringkasan Tim Hari Ini
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Pegawai"
            value={data.team_attendance.total_employees}
            color="#6b7280"
          />
          <StatCard
            icon={ClipboardCheck}
            label="Hadir"
            value={data.team_attendance.present_today}
            color="#10b981"
            subtitle={`dari ${data.team_attendance.total_employees} pegawai`}
          />
          <StatCard
            icon={Clock}
            label="Terlambat"
            value={data.team_attendance.late_today}
            color="#f59e0b"
          />
          <StatCard
            icon={AlertTriangle}
            label="Belum Absen"
            value={data.team_attendance.not_clocked_in}
            color="#ef4444"
          />
        </div>
      </div>

      {/* Ringkasan Mutaba'ah Tim */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-(--foreground)">
          Tilawah Tim Hari Ini
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            icon={BookOpen}
            label="Sudah Tilawah"
            value={data.team_mutabaah.submitted_count}
            color="#10b981"
            subtitle={`dari ${data.team_mutabaah.total_employees} pegawai`}
            onClick={() => navigate("/mutabaah")}
          />
          <StatCard
            icon={BookOpen}
            label="Belum Tilawah"
            value={data.team_mutabaah.not_submitted_count}
            color="#f59e0b"
            onClick={() => navigate("/mutabaah")}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-(--border) bg-(--card) overflow-hidden">
          <div className="border-b border-(--border) px-5 py-3">
            <h3 className="font-semibold text-(--foreground)">
              Belum Clock In Hari Ini
            </h3>
          </div>
          {data.not_clocked_in.length === 0 ? (
            <div className="p-5">
              <p className="text-sm text-(--muted-foreground)">
                Semua pegawai sudah clock in
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/30">
                    <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                      Nama
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                      NIP
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                      Departemen
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                      Shift
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.not_clocked_in.slice(0, 5).map((emp) => (
                    <NotClockedInRow key={emp.employee_id} employee={emp} />
                  ))}
                </tbody>
              </table>
              {data.not_clocked_in.length > 5 && (
                <div className="border-t border-(--border) px-5 py-2 text-center">
                  <button
                    onClick={() => navigate("/attendance")}
                    className="text-xs font-medium text-(--primary) hover:underline"
                  >
                    Lihat semua ({data.not_clocked_in.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <h3 className="mb-4 font-semibold text-(--foreground)">
            Kontrak Akan Habis
          </h3>
          {data.expiring_contracts.length === 0 ? (
            <p className="text-sm text-(--muted-foreground)">
              Tidak ada kontrak yang akan habis dalam waktu dekat
            </p>
          ) : (
            <div className="space-y-3">
              {data.expiring_contracts.map((contract) => (
                <ExpiringContractCard
                  key={contract.employee_id}
                  contract={contract}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {data.approval_queue.length > 0 && (
        <div className="rounded-xl border border-(--border) bg-(--card) overflow-hidden">
          <div className="border-b border-(--border) px-5 py-3">
            <h3 className="font-semibold text-(--foreground)">
              Antrian Persetujuan
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--muted)/30">
                  <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                    Tipe
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                    Pegawai
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                    Keterangan
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.approval_queue.map((item) => (
                  <ApprovalQueueRow key={item.id} item={item} />
                ))}
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

export function DashboardPage() {
  const { cachedProfile } = useAuth();
  const { data: profile } = useEmployeeProfile();
  const clockWidget = useClockWidget();
  const { data: empDashData, loading: empDashLoading } = useEmployeeDashboard();

  const roleName = profile?.role_name || "";
  const isHRD =
    roleName === "HRD Admin" ||
    roleName === "Super Admin" ||
    roleName === "Supervisor";

  // Intern check — do not show mutabaah card for interns
  // Check by contract type stored in profile or role name
  const contractType = (profile as unknown as { contract_type?: string })
    ?.contract_type;
  const isIntern =
    contractType === "intern" ||
    roleName?.toLowerCase().includes("intern") ||
    profile?.job_position_title?.toLowerCase().includes("intern") ||
    false;

  const [view, setView] = useState<"employee" | "hrd">(
    isHRD ? "hrd" : "employee",
  );

  // Mutabaah actions
  const {
    actionLoading: mutabaahLoading,
    submitToday,
    cancelToday,
  } = useMutabaahActions();

  const handleMutabaahSubmit = async () => {
    const attendanceLogId = empDashData?.mutabaah_today?.attendance_log_id;
    if (!attendanceLogId) return;
    await submitToday(attendanceLogId);
  };

  const handleMutabaahCancel = async () => {
    const logId = empDashData?.mutabaah_today?.mutabaah_log_id;
    if (!logId) return;
    await cancelToday(logId);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const formatDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-(--foreground)">
              {greeting()},{" "}
              <span className="text-primary-gradient">
                {profile?.full_name || cachedProfile?.fullname || "User"}
              </span>
            </h1>
            <p className="text-sm text-(--muted-foreground)">{formatDate()}</p>
          </div>
          {isHRD && <ViewToggle view={view} setView={setView} />}
        </div>

        {/* Clock + Mutabaah side-by-side panel */}
        <AttendanceMutabaahPanel
          clockWidget={clockWidget}
          empDashData={empDashData}
          empDashLoading={empDashLoading}
          isIntern={isIntern}
          onMutabaahSubmit={handleMutabaahSubmit}
          onMutabaahCancel={handleMutabaahCancel}
          mutabaahLoading={mutabaahLoading}
        />

        {/* Dashboard Content */}
        {view === "employee" ? <EmployeeDashboardView /> : <HRDDashboardView />}
      </div>
    </MainLayout>
  );
}
