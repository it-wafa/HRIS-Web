import { useState, useMemo } from "react";
import { BookOpen, Search, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/date";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useMutabaahDailyReport,
  useMutabaahMonthlyReport,
} from "@/hooks/useMutabaah";
import { SummaryCard } from "@/components/ui/SummaryCard";

// ════════════════════════════════════════════
// SKELETON
// ════════════════════════════════════════════

function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border)">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--border) bg-(--muted)/50">
              {Array.from({ length: 7 }).map((_, i) => (
                <th key={i} className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-(--border)">
                {Array.from({ length: 7 }).map((_, j) => (
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
// DAILY TAB
// ════════════════════════════════════════════

function DailyTab() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading } = useMutabaahDailyReport(date);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(
      (r) =>
        r.employee_name.toLowerCase().includes(q) ||
        r.employee_number.toLowerCase().includes(q) ||
        (r.department_name?.toLowerCase().includes(q) ?? false),
    );
  }, [data, searchQuery]);

  const summary = useMemo(() => {
    if (!data) return { total: 0, submitted: 0, not_submitted: 0 };
    return {
      total: data.length,
      submitted: data.filter((r) => r.is_submitted).length,
      not_submitted: data.filter((r) => !r.is_submitted).length,
    };
  }, [data]);



  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      {!loading && data && data.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          <SummaryCard title="Total" value={summary.total} />
          <SummaryCard
            title="Sudah Membaca"
            value={summary.submitted}
            colorBg="bg-green-50 dark:bg-green-900/20"
            colorText="text-green-600"
            className="border-(--border)"
          />
          <SummaryCard
            title="Belum Membaca"
            value={summary.not_submitted}
            colorBg="bg-yellow-50 dark:bg-yellow-900/20"
            colorText="text-yellow-600"
            className="border-(--border)"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={cn(
            "rounded-lg border bg-(--input) px-3 py-2 text-sm text-(--foreground)",
            "border-(--border) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          )}
        />
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada data tilawah"
          description="Belum ada data Mutaba'ah untuk tanggal ini"
          icon={<BookOpen className="h-12 w-12" />}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    {[
                      "Nama",
                      "NIP",
                      "Departemen",
                      "Kategori",
                      "Target",
                      "Status",
                      "Waktu",
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
                  {filtered.map((report, index) => (
                    <tr
                      key={report.employee_id}
                      className={cn(
                        "border-b border-(--border)",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
                        {report.employee_name}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                        {report.employee_number}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                        {report.department_name || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                            report.is_trainer
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
                          )}
                        >
                          {report.is_trainer ? "Trainer" : "Non-Trainer"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {report.target_pages} hlm
                      </td>
                      <td className="px-5 py-3">
                        {report.is_submitted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 text-xs font-medium">
                            <CheckCircle2 size={12} />
                            Sudah
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 text-xs font-medium">
                            <Clock size={12} />
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--muted-foreground)">
                        {formatTime(report.submitted_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((report) => (
              <div
                key={report.employee_id}
                className="rounded-xl border border-(--border) bg-(--card) p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-(--foreground)">
                      {report.employee_name}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {report.employee_number} • {report.department_name || "—"}
                    </p>
                  </div>
                  {report.is_submitted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 text-xs font-medium">
                      <CheckCircle2 size={12} />
                      Sudah
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 text-xs font-medium">
                      <Clock size={12} />
                      Belum
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium",
                      report.is_trainer
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
                    )}
                  >
                    {report.is_trainer ? "Trainer" : "Non-Trainer"}
                  </span>
                  <span>Target: {report.target_pages} hlm</span>
                  {report.is_submitted && (
                    <span>· {formatTime(report.submitted_at)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// MONTHLY TAB
// ════════════════════════════════════════════

function MonthlyTab() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, loading } = useMutabaahMonthlyReport(month, year);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className={cn(
            "rounded-lg border bg-(--input) px-3 py-2 text-sm text-(--foreground)",
            "border-(--border) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          )}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2026, i).toLocaleString("id-ID", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className={cn(
            "rounded-lg border bg-(--input) px-3 py-2 text-sm text-(--foreground)",
            "border-(--border) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          )}
        >
          {[2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Tidak ada data rekap"
          description="Belum ada data Mutaba'ah untuk bulan ini"
          icon={<BookOpen className="h-12 w-12" />}
        />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    {[
                      "Nama",
                      "Kategori",
                      "Hari Wajib",
                      "Hari Submit",
                      "% Kepatuhan",
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
                  {data.map((row, index) => (
                    <tr
                      key={row.employee_id}
                      className={cn(
                        "border-b border-(--border)",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                      )}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
                        {row.employee_name}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            row.is_trainer
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
                          )}
                        >
                          {row.is_trainer ? "Trainer" : "Non-Trainer"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {row.total_working_days}
                      </td>
                      <td className="px-5 py-3 text-sm text-(--foreground)">
                        {row.total_submitted}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-(--muted) overflow-hidden max-w-20">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                row.compliance_percentage >= 90
                                  ? "bg-green-500"
                                  : row.compliance_percentage >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500",
                              )}
                              style={{
                                width: `${row.compliance_percentage}%`,
                              }}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              row.compliance_percentage >= 90
                                ? "text-green-600"
                                : row.compliance_percentage >= 70
                                  ? "text-yellow-600"
                                  : "text-red-600",
                            )}
                          >
                            {row.compliance_percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {data.map((row) => (
              <div
                key={row.employee_id}
                className="rounded-xl border border-(--border) bg-(--card) p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-(--foreground)">
                    {row.employee_name}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      row.compliance_percentage >= 90
                        ? "text-green-600"
                        : row.compliance_percentage >= 70
                          ? "text-yellow-600"
                          : "text-red-600",
                    )}
                  >
                    {row.compliance_percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium",
                      row.is_trainer
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
                    )}
                  >
                    {row.is_trainer ? "Trainer" : "Non-Trainer"}
                  </span>
                  <span>
                    {row.total_submitted}/{row.total_working_days} hari
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-(--muted) overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      row.compliance_percentage >= 90
                        ? "bg-green-500"
                        : row.compliance_percentage >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500",
                    )}
                    style={{ width: `${row.compliance_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

type TabKey = "daily" | "monthly";

export function MutabaahPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("daily");

  const TABS: { key: TabKey; label: string }[] = [
    { key: "daily", label: "Harian" },
    { key: "monthly", label: "Bulanan" },
  ];

  return (
    <MainLayout>
      {/* Sticky Header */}
      <PageHeader
        title="Mutaba'ah — Tilawah Al-Quran"
        description="Pantau dan kelola tilawah harian pegawai"
        actions={
          <div className="flex rounded-lg border border-(--border) bg-(--muted)/30 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "bg-(--card) text-(--foreground) shadow-sm"
                    : "text-(--muted-foreground) hover:text-(--foreground)",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="mx-auto max-w-350 p-3 sm:p-5">
        {activeTab === "daily" && <DailyTab />}
        {activeTab === "monthly" && <MonthlyTab />}
      </div>
    </MainLayout>
  );
}
