import { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTimeLong, formatDateLong, formatDateWeekdayShortYear, formatTime } from "@/utils/date";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useDailyReportList,
  useDailyReportMutations,
} from "@/hooks/useDailyReport";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { useEmployeeList } from "@/hooks/useEmployee";
import { PermissionGate } from "@/components/ui/PermissionGate";
import { PERMISSIONS } from "@/constants/permission";
import type {
  DailyReport,
  CreateDailyReportPayload,
} from "@/types/daily-report";

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
// REPORT FORM
// ════════════════════════════════════════════

function ReportForm({
  onClose,
  onSubmit,
  initialDate,
  editReport,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateDailyReportPayload) => void;
  initialDate?: string;
  editReport?: DailyReport;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    report_date:
      editReport?.report_date ||
      initialDate ||
      new Date().toISOString().split("T")[0],
    activities: editReport?.activities || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.report_date) newErrors.report_date = "Tanggal wajib diisi";
    if (!formData.activities.trim())
      newErrors.activities = "Aktivitas wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      report_date: formData.report_date,
      activities: formData.activities.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="report_date"
          className="block text-sm font-medium text-(--foreground) opacity-80"
        >
          Tanggal Laporan *
        </label>
        <input
          id="report_date"
          type="date"
          value={formData.report_date}
          onChange={(e) => handleChange("report_date", e.target.value)}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
            errors.report_date && "border-(--destructive)",
          )}
        />
        {errors.report_date && (
          <p className="text-xs text-(--destructive)">{errors.report_date}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Aktivitas Hari Ini *
        </label>
        <textarea
          value={formData.activities}
          onChange={(e) => handleChange("activities", e.target.value)}
          placeholder={`Tuliskan aktivitas yang dikerjakan hari ini...\n\nContoh:\n1. Mengerjakan laporan keuangan Q1\n2. Meeting koordinasi dengan tim marketing\n3. Review dan approval pengajuan pegawai`}
          rows={8}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
            errors.activities && "border-(--destructive)",
          )}
        />
        {errors.activities && (
          <p className="text-xs text-(--destructive)">{errors.activities}</p>
        )}
        <p className="text-xs text-(--muted-foreground)">
          {formData.activities.length} karakter
        </p>
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
          {editReport ? "Simpan" : "Kirim Laporan"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// DETAIL MODAL
// ════════════════════════════════════════════

function ReportDetailModal({
  report,
  onClose,
}: {
  report: DailyReport;
  onClose: () => void;
}) {


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
              Laporan Harian
            </h3>
            <p className="text-xs text-(--muted-foreground)">
              {formatDateLong(report.report_date)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) transition hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {report.employee_name && (
            <div>
              <p className="text-xs text-(--muted-foreground) mb-1">Pegawai</p>
              <p className="text-sm font-medium text-(--foreground)">
                {report.employee_name}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-(--muted-foreground) mb-2">Aktivitas</p>
            <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-4 text-sm text-(--foreground) whitespace-pre-wrap leading-relaxed">
              {report.activities || "—"}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-(--muted-foreground)">
            <span>Dikirim: {formatDateTimeLong(report.submitted_at)}</span>
            {report.is_submitted ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <CheckCircle2 size={12} />
                Terkirim
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-red-500">
                <AlertCircle size={12} />
                Belum Diisi
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end border-t border-(--border) px-5 py-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

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
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-5 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-(--border)">
                {Array.from({ length: 5 }).map((_, j) => (
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
// EXPANDABLE ROW
// ════════════════════════════════════════════

function ExpandableRow({
  report,
  index,
  onFill,
  onViewDetail,
}: {
  report: DailyReport;
  index: number;
  onFill: (report: DailyReport) => void;
  onViewDetail: (report: DailyReport) => void;
}) {
  const [expanded, setExpanded] = useState(false);



  return (
    <>
      <tr
        className={cn(
          "border-b border-(--border) cursor-pointer hover:bg-(--muted)/30 transition-colors",
          index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-5 py-3 text-sm text-(--foreground) whitespace-nowrap">
          {formatDateWeekdayShortYear(report.report_date)}
        </td>
        <td className="px-5 py-3 text-sm font-medium text-(--foreground)">
          {report.employee_name || "—"}
        </td>
        <td className="px-5 py-3">
          {report.is_submitted ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 text-xs font-medium">
              <CheckCircle2 size={12} />
              Terkirim
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 text-xs font-medium">
              <AlertCircle size={12} />
              Belum Diisi
            </span>
          )}
        </td>
        <td className="px-5 py-3 text-sm text-(--muted-foreground)">
          {formatTime(report.submitted_at)}
        </td>
        <td className="px-5 py-3">
          <div className="flex items-center justify-end gap-2">
            {!report.is_submitted && (
              <PermissionGate permission={PERMISSIONS.DAILY_REPORT_CREATE}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFill(report);
                  }}
                >
                  Isi Laporan
                </Button>
              </PermissionGate>
            )}
            {report.is_submitted && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetail(report);
                  }}
                  className="text-xs text-(--primary) hover:underline"
                >
                  Lihat Detail
                </button>
                <button className="text-(--muted-foreground)">
                  {expanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      {expanded && report.is_submitted && (
        <tr className={index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20"}>
          <td colSpan={5} className="px-5 pb-4 border-b border-(--border)">
            <div className="rounded-lg bg-(--muted)/30 border border-(--border) p-3 text-sm text-(--foreground) whitespace-pre-wrap leading-relaxed mt-1">
              {report.activities || "Belum diisi"}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function DailyReportPage() {
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editReport, setEditReport] = useState<DailyReport | null>(null);
  const [detailReport, setDetailReport] = useState<DailyReport | null>(null);

  const params = useMemo(
    () => ({
      employee_id: filterEmployee ? parseInt(filterEmployee) : undefined,
      is_submitted: filterStatus === "submitted" ? true : filterStatus === "not_submitted" ? false : undefined,
      start_date: filterStartDate || undefined,
      end_date: filterEndDate || undefined,
    }),
    [filterEmployee, filterStatus, filterStartDate, filterEndDate],
  );

  const { data: reports, loading, refetch } = useDailyReportList(params);
  const { data: employees } = useEmployeeList({ is_active: true });
  const {
    loading: mutLoading,
    createReport,
    updateReport,
  } = useDailyReportMutations(refetch);

  // Client-side search
  const filtered = useMemo(() => {
    if (!reports) return [];
    if (!searchQuery) return reports;
    const q = searchQuery.toLowerCase();
    return reports.filter(
      (r) =>
        r.employee_name?.toLowerCase().includes(q) ||
        r.activities?.toLowerCase().includes(q) ||
        r.report_date.includes(q),
    );
  }, [reports, searchQuery]);

  // Summary
  const summary = useMemo(() => {
    if (!filtered) return { submitted: 0, missing: 0 };
    return {
      submitted: filtered.filter((r) => r.is_submitted).length,
      missing: filtered.filter((r) => !r.is_submitted).length,
    };
  }, [filtered]);

  const handleCreate = async (payload: CreateDailyReportPayload) => {
    const result = await createReport(payload);
    if (result) {
      setShowForm(false);
      setEditReport(null);
    }
  };

  const handleUpdate = async (payload: CreateDailyReportPayload) => {
    if (!editReport) return;
    const result = await updateReport(editReport.id, {
      activities: payload.activities,
    });
    if (result) setEditReport(null);
  };

  return (
    <MainLayout>
      {/* Sticky Header */}
      <PageHeader
        title="Laporan Harian"
        description="Pantau dan kelola laporan aktivitas harian pegawai (RKH)"
        actions={
          <PermissionGate permission={PERMISSIONS.DAILY_REPORT_CREATE}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            className="self-start sm:self-auto"
          >
            <Plus size={16} />
            <span className="hidden md:block">Isi Laporan</span>
          </Button>
        </PermissionGate>
        }
      />

      <div className="mx-auto max-w-350 p-3 sm:p-5 space-y-4">
        {/* Summary */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <SummaryCard
              title="Terkirim"
              value={summary.submitted}
              subtitle="laporan"
              colorBg="bg-green-50 dark:bg-green-900/20"
              colorText="text-green-600"
            />
            <SummaryCard
              title="Belum Diisi"
              value={summary.missing}
              subtitle="laporan"
              colorBg="bg-red-50 dark:bg-red-900/20"
              colorText="text-red-600"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 min-w-45 max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pegawai atau aktivitas..."
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
              { value: "submitted", label: "Sudah Diisi" },
              { value: "not_submitted", label: "Belum Diisi" },
            ]}
            placeholder="Filter status..."
          />
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
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonTable />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Belum ada laporan harian"
            description="Mulai isi laporan aktivitas harian Anda"
            icon={<FileText className="h-12 w-12" />}
            action={
              <PermissionGate permission={PERMISSIONS.DAILY_REPORT_CREATE}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} />
                  Isi Laporan
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <>
            {/* Desktop Table with expandable rows */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-(--border)">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-(--border) bg-(--muted)/50">
                      {[
                        "Tanggal",
                        "Pegawai",
                        "Status",
                        "Waktu Submit",
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
                    {filtered.map((report, index) => (
                      <ExpandableRow
                        key={report.id}
                        report={report}
                        index={index}
                        onFill={(r) => setEditReport(r)}
                        onViewDetail={(r) => setDetailReport(r)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {filtered.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-(--border) bg-(--card) p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-(--foreground)">
                        {report.employee_name || "—"}
                      </p>
                      <p className="text-xs text-(--muted-foreground)">
                        {new Date(report.report_date).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </p>
                    </div>
                    {report.is_submitted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 text-xs font-medium">
                        <CheckCircle2 size={12} />
                        Terkirim
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 text-xs font-medium">
                        <AlertCircle size={12} />
                        Belum Diisi
                      </span>
                    )}
                  </div>

                  {report.is_submitted ? (
                    <>
                      <p className="text-xs text-(--foreground) line-clamp-2 mb-2">
                        {report.activities}
                      </p>
                      <button
                        onClick={() => setDetailReport(report)}
                        className="text-xs text-(--primary) hover:underline"
                      >
                        Lihat detail →
                      </button>
                    </>
                  ) : (
                    <PermissionGate permission={PERMISSIONS.DAILY_REPORT_CREATE}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setEditReport(report)}
                      >
                        Isi Laporan
                      </Button>
                    </PermissionGate>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Form Modal */}
      <Modal
        open={showForm}
        title="Isi Laporan Harian"
        onClose={() => setShowForm(false)}
      >
        <ReportForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          isLoading={mutLoading}
        />
      </Modal>

      {/* Edit / Fill Missing Report Modal */}
      <Modal
        open={!!editReport}
        title={
          editReport?.is_submitted === false
            ? "Isi Laporan Harian"
            : "Edit Laporan Harian"
        }
        onClose={() => setEditReport(null)}
      >
        {editReport && (
          <ReportForm
            onClose={() => setEditReport(null)}
            onSubmit={
              editReport.is_submitted === false ? handleCreate : handleUpdate
            }
            initialDate={editReport.report_date}
            editReport={
              editReport.is_submitted === false ? undefined : editReport
            }
            isLoading={mutLoading}
          />
        )}
      </Modal>

      {/* Detail Modal */}
      {detailReport && (
        <ReportDetailModal
          report={detailReport}
          onClose={() => setDetailReport(null)}
        />
      )}
    </MainLayout>
  );
}
