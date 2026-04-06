import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useEmployeeList, useEmployeeMutations } from "@/hooks/useEmployee";
import { useBranchList } from "@/hooks/useBranch";
import { usePositionList } from "@/hooks/usePosition";
import { useRoleList } from "@/hooks/useRole";
import {
  GENDER_LABELS,
  MARITAL_STATUS_LABELS,
  RELIGION_OPTIONS,
  BLOOD_TYPE_OPTIONS,
} from "@/types/employee";
import type {
  CreateEmployeePayload,
  Gender,
  MaritalStatus,
} from "@/types/employee";

// ════════════════════════════════════════════
// MODAL WRAPPER
// ════════════════════════════════════════════

function Modal({
  open,
  title,
  onClose,
  children,
  maxWidth = "max-w-2xl",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full overflow-hidden rounded-2xl border border-(--border) bg-(--card) my-8",
          maxWidth,
        )}
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
// EMPLOYEE FORM
// ════════════════════════════════════════════

function EmployeeForm({
  onClose,
  onSubmit,
  branches,
  positions,
  roles,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateEmployeePayload) => void;
  branches: { id: number; name: string }[];
  positions: { id: number; title: string }[];
  roles: { id: number; name: string }[];
  isLoading?: boolean;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    employee_number: "",
    full_name: "",
    birth_date: "",
    birth_place: "",
    gender: "male" as Gender,
    branch_id: "",
    job_positions_id: "",
    role_id: "",
    nik: "",
    npwp: "",
    kk_number: "",
    religion: "",
    marital_status: "" as MaritalStatus | "",
    blood_type: "",
    nationality: "Indonesia",
    height: "",
    weight: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateTab1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.employee_number.trim())
      newErrors.employee_number = "Nomor pegawai wajib diisi";
    if (!formData.full_name.trim())
      newErrors.full_name = "Nama lengkap wajib diisi";
    if (!formData.birth_date)
      newErrors.birth_date = "Tanggal lahir wajib diisi";
    if (!formData.gender) newErrors.gender = "Jenis kelamin wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTab1()) {
      setActiveTab(0);
      return;
    }

    const payload: CreateEmployeePayload = {
      employee_number: formData.employee_number.trim(),
      full_name: formData.full_name.trim(),
      birth_date: formData.birth_date,
      gender: formData.gender,
      birth_place: formData.birth_place.trim() || undefined,
      branch_id: formData.branch_id ? parseInt(formData.branch_id) : undefined,
      job_positions_id: formData.job_positions_id
        ? parseInt(formData.job_positions_id)
        : undefined,
      role_id: formData.role_id ? parseInt(formData.role_id) : undefined,
      nik: formData.nik.trim() || undefined,
      npwp: formData.npwp.trim() || undefined,
      kk_number: formData.kk_number.trim() || undefined,
      religion: formData.religion || undefined,
      marital_status: (formData.marital_status as MaritalStatus) || undefined,
      blood_type: formData.blood_type || undefined,
      nationality: formData.nationality.trim() || undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
    };

    onSubmit(payload);
  };

  const tabs = ["Data Dasar", "Data Pribadi"];

  return (
    <form onSubmit={handleSubmit}>
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-(--border) mb-4">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === index
                ? "border-(--primary) text-(--primary)"
                : "border-transparent text-(--muted-foreground) hover:text-(--foreground)",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Data Dasar */}
      {activeTab === 0 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="employee_number"
              label="Nomor Pegawai *"
              value={formData.employee_number}
              onChange={(e) => handleChange("employee_number", e.target.value)}
              placeholder="Contoh: EMP-001"
              error={errors.employee_number}
            />
            <Input
              id="full_name"
              label="Nama Lengkap *"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Nama lengkap pegawai"
              error={errors.full_name}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="birth_date"
              label="Tanggal Lahir *"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleChange("birth_date", e.target.value)}
              error={errors.birth_date}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-(--foreground) opacity-80">
                Jenis Kelamin *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className={cn(
                  "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
                  "border-(--border) transition-colors duration-200",
                  "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
                )}
              >
                {Object.entries(GENDER_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-xs text-(--destructive)">{errors.gender}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SearchableSelect
              label="Cabang"
              value={formData.branch_id}
              onChange={(val) => handleChange("branch_id", val)}
              options={branches.map((b) => ({
                value: String(b.id),
                label: b.name,
              }))}
              placeholder="Pilih cabang"
            />
            <SearchableSelect
              label="Jabatan"
              value={formData.job_positions_id}
              onChange={(val) => handleChange("job_positions_id", val)}
              options={positions.map((p) => ({
                value: String(p.id),
                label: p.title,
              }))}
              placeholder="Pilih jabatan"
            />
            <SearchableSelect
              label="Role"
              value={formData.role_id}
              onChange={(val) => handleChange("role_id", val)}
              options={roles.map((r) => ({
                value: String(r.id),
                label: r.name,
              }))}
              placeholder="Pilih role"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Data Pribadi */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="nik"
              label="NIK"
              value={formData.nik}
              onChange={(e) => handleChange("nik", e.target.value)}
              placeholder="16 digit NIK"
              maxLength={16}
            />
            <Input
              id="npwp"
              label="NPWP"
              value={formData.npwp}
              onChange={(e) => handleChange("npwp", e.target.value)}
              placeholder="Nomor NPWP"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="kk_number"
              label="Nomor KK"
              value={formData.kk_number}
              onChange={(e) => handleChange("kk_number", e.target.value)}
              placeholder="16 digit Nomor KK"
              maxLength={16}
            />
            <Input
              id="birth_place"
              label="Tempat Lahir"
              value={formData.birth_place}
              onChange={(e) => handleChange("birth_place", e.target.value)}
              placeholder="Kota kelahiran"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SearchableSelect
              label="Agama"
              value={formData.religion}
              onChange={(val) => handleChange("religion", val)}
              options={RELIGION_OPTIONS.map((r) => ({
                value: r,
                label: r,
              }))}
              placeholder="Pilih agama"
            />
            <SearchableSelect
              label="Status Pernikahan"
              value={formData.marital_status}
              onChange={(val) => handleChange("marital_status", val)}
              options={Object.entries(MARITAL_STATUS_LABELS).map(
                ([value, label]) => ({
                  value,
                  label,
                }),
              )}
              placeholder="Pilih status"
            />
            <SearchableSelect
              label="Golongan Darah"
              value={formData.blood_type}
              onChange={(val) => handleChange("blood_type", val)}
              options={BLOOD_TYPE_OPTIONS.map((bt) => ({
                value: bt,
                label: bt,
              }))}
              placeholder="Pilih gol. darah"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              id="nationality"
              label="Kewarganegaraan"
              value={formData.nationality}
              onChange={(e) => handleChange("nationality", e.target.value)}
            />
            <Input
              id="height"
              label="Tinggi Badan (cm)"
              type="number"
              value={formData.height}
              onChange={(e) => handleChange("height", e.target.value)}
              placeholder="170"
            />
            <Input
              id="weight"
              label="Berat Badan (kg)"
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="65"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-6 border-t border-(--border) mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Tambah Pegawai
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// STATUS BADGE
// ════════════════════════════════════════════

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      )}
    >
      {isActive ? "Aktif" : "Nonaktif"}
    </span>
  );
}

// ════════════════════════════════════════════
// SKELETON TABLE
// ════════════════════════════════════════════

function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-(--border) bg-(--card) px-5 py-4"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-5 w-5" />
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function EmployeePage() {
  const navigate = useNavigate();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "active" | "inactive">(
    "",
  );

  // Build params for hook
  const params = useMemo(
    () => ({
      search: searchQuery || undefined,
      branch_id: filterBranch ? parseInt(filterBranch) : undefined,
      is_active:
        filterStatus === "active"
          ? true
          : filterStatus === "inactive"
            ? false
            : undefined,
    }),
    [searchQuery, filterBranch, filterStatus],
  );

  const { data: employees, loading, refetch } = useEmployeeList(params);
  const { data: branches } = useBranchList();
  const { data: positions } = usePositionList();
  const { data: roles } = useRoleList();
  const { loading: mutationLoading, createEmployee } =
    useEmployeeMutations(refetch);

  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (payload: CreateEmployeePayload) => {
    const result = await createEmployee(payload);
    if (result) {
      setShowForm(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-(--foreground) md:text-2xl">
              Pegawai
            </h1>
            <p className="text-sm text-(--muted-foreground)">
              Kelola data pegawai beserta kontak & kontrak kerja
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            className="self-start sm:self-auto"
          >
            <Plus size={16} />
            Tambah Pegawai
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
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className={cn(
              "rounded-lg border bg-(--input) px-4 py-2 text-sm text-(--foreground)",
              "border-(--border) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
            )}
          >
            <option value="">Semua Cabang</option>
            {branches?.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "" | "active" | "inactive")
            }
            className={cn(
              "rounded-lg border bg-(--input) px-4 py-2 text-sm text-(--foreground)",
              "border-(--border) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
            )}
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonTable />
        ) : !employees || employees.length === 0 ? (
          <EmptyState
            title={
              searchQuery ? "Pegawai tidak ditemukan" : "Belum ada data pegawai"
            }
            description={
              searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Tambahkan pegawai baru untuk memulai"
            }
            icon={<Users className="h-12 w-12" />}
            action={
              !searchQuery && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} />
                  Tambah Pegawai
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-(--border)">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Pegawai
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Jabatan
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Cabang
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Status
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      onClick={() => navigate(`/employees/${employee.id}`)}
                      className={cn(
                        "border-b border-(--border) last:border-b-0 cursor-pointer transition-colors",
                        index % 2 === 0 ? "bg-(--card)" : "bg-(--muted)/20",
                        "hover:bg-(--muted)/40",
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
                            }}
                          >
                            {employee.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-(--foreground)">
                              {employee.full_name}
                            </div>
                            <div className="text-xs text-(--muted-foreground)">
                              {employee.employee_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-(--foreground)">
                        {employee.job_position_title || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-(--muted-foreground)">
                        {employee.branch_name || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge isActive={employee.is_active} />
                      </td>
                      <td className="px-5 py-4">
                        <ChevronRight
                          size={16}
                          className="text-(--muted-foreground)"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-(--border)">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => navigate(`/employees/${employee.id}`)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-(--muted)/30"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
                    }}
                  >
                    {employee.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-(--foreground) truncate">
                      {employee.full_name}
                    </div>
                    <div className="text-xs text-(--muted-foreground)">
                      {employee.job_position_title || employee.employee_number}
                    </div>
                  </div>
                  <StatusBadge isActive={employee.is_active} />
                  <ChevronRight
                    size={16}
                    className="text-(--muted-foreground)"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={showForm}
        title="Tambah Pegawai"
        onClose={() => setShowForm(false)}
        maxWidth="max-w-3xl"
      >
        <EmployeeForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          branches={branches?.map((b) => ({ id: b.id, name: b.name })) || []}
          positions={
            positions?.map((p) => ({ id: p.id, title: p.title })) || []
          }
          roles={roles?.map((r) => ({ id: r.id, name: r.name })) || []}
          isLoading={mutationLoading}
        />
      </Modal>
    </MainLayout>
  );
}
