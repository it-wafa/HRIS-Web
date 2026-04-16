import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Network,
  Building2,
  Search,
  Briefcase,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useDepartmentList,
  useDepartmentMutations,
} from "@/hooks/useDepartment";
import { useBranchList } from "@/hooks/useBranch";
import { usePositionList, usePositionMutations } from "@/hooks/usePosition";
import { useEmployeeList } from "@/hooks/useEmployee";
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/types/department";
import type { JobPosition, CreatePositionPayload } from "@/types/job-position";

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
// DEPARTMENT FORM
// ════════════════════════════════════════════

function DepartmentForm({
  onClose,
  onSubmit,
  editDepartment,
  branches,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (
    payload: CreateDepartmentPayload | UpdateDepartmentPayload,
  ) => void;
  editDepartment?: Department;
  branches: { id: number; name: string }[];
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    code: editDepartment?.code || "",
    name: editDepartment?.name || "",
    branch_id: editDepartment?.branch_id
      ? String(editDepartment.branch_id)
      : "",
    description: editDepartment?.description || "",
    is_active: editDepartment?.is_active ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = "Kode departemen wajib diisi";
    if (!formData.name.trim()) newErrors.name = "Nama departemen wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      branch_id: formData.branch_id ? Number(formData.branch_id) : null,
      description: formData.description.trim() || undefined,
      ...(editDepartment && { is_active: formData.is_active }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="code"
          label="Kode Departemen"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
          placeholder="Contoh: HRGA"
          error={errors.code}
          maxLength={20}
        />
        <Input
          id="name"
          label="Nama Departemen"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Contoh: Human Resource & General Affair"
          error={errors.name}
        />
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
          Deskripsi
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Deskripsi singkat departemen (opsional)"
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
          )}
        />
      </div>

      {editDepartment && (
        <div className="pt-2">
          <Toggle
            checked={formData.is_active}
            onChange={(checked) => handleChange("is_active", checked)}
            label="Departemen Aktif"
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
          {editDepartment ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// POSITION FORM
// ════════════════════════════════════════════

function PositionForm({
  onClose,
  onSubmit,
  editPosition,
  departments,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (payload: CreatePositionPayload) => void;
  editPosition?: JobPosition;
  departments: { id: number; name: string }[];
  isLoading?: boolean;
}) {
  const [title, setTitle] = useState(editPosition?.title || "");
  const [departmentId, setDepartmentId] = useState(
    editPosition?.department_id ? String(editPosition.department_id) : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Nama jabatan wajib diisi";
    if (!departmentId) newErrors.department_id = "Departemen wajib dipilih";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      title: title.trim(),
      department_id: departmentId ? parseInt(departmentId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Nama Jabatan"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setErrors((prev) => ({ ...prev, title: "" }));
        }}
        placeholder="Contoh: Manager HRD"
        error={errors.title}
        autoFocus
      />

      <div className="space-y-1.5">
        <SearchableSelect
          label="Departemen"
          value={departmentId}
          onChange={(val) => {
            setDepartmentId(val);
            setErrors((prev) => ({ ...prev, department_id: "" }));
          }}
          options={departments.map((d) => ({
            value: String(d.id),
            label: d.name,
          }))}
          placeholder="Pilih departemen..."
          searchPlaceholder="Cari departemen..."
          required
        />
        {errors.department_id && (
          <p className="text-xs text-(--destructive)">{errors.department_id}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {editPosition ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// SKELETON TABLE
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
                    <Skeleton className="h-4 w-24" />
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
// UNIFIED DEPARTMENT ACCORDION
// ════════════════════════════════════════════

import { ChevronDown, ChevronRight, User } from "lucide-react";

function DepartmentAccordion() {
  const { data: branches } = useBranchList();
  const { data: departments, loading: deptLoading, refetch: refetchDept } = useDepartmentList({ is_active: true });
  const { data: positions, loading: posLoading, refetch: refetchPos } = usePositionList();
  const { data: employees, loading: empLoading } = useEmployeeList({ is_active: true });

  const { createDepartment, updateDepartment, deleteDepartment, loading: deptMutLoading } = useDepartmentMutations(refetchDept);
  const { createPosition, updatePosition, deletePosition, loading: posMutLoading } = usePositionMutations(refetchPos);

  const [expandedDepts, setExpandedDepts] = useState<Set<number>>(new Set());
  const [expandedPos, setExpandedPos] = useState<Set<number>>(new Set());

  // Forms states
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [deleteDept, setDeleteDept] = useState<Department | null>(null);

  const [showPosForm, setShowPosForm] = useState<{deptId?: number} | false>(false);
  const [editPos, setEditPos] = useState<JobPosition | null>(null);
  const [deletePosTarget, setDeletePosTarget] = useState<JobPosition | null>(null);

  const toggleDept = (id: number) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePos = (id: number) => {
    setExpandedPos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const positionsByDept = useMemo(() => {
    const map = new Map<number, JobPosition[]>();
    positions?.forEach((p) => {
      if (p.department_id) {
        const list = map.get(p.department_id) || [];
        list.push(p);
        map.set(p.department_id, list);
      }
    });
    return map;
  }, [positions]);

  const employeesByPos = useMemo(() => {
    const map = new Map<number, any[]>();
    employees?.forEach((e) => {
      if (e.job_positions_id) {
        const list = map.get(e.job_positions_id) || [];
        list.push(e);
        map.set(e.job_positions_id, list);
      }
    });
    return map;
  }, [employees]);

  // Submit Handlers
  const handleDeptSubmit = async (payload: any) => {
    if (editDept) {
      await updateDepartment(editDept.id, payload);
      setEditDept(null);
    } else {
      await createDepartment(payload);
      setShowDeptForm(false);
    }
  };

  const handlePosSubmit = async (payload: any) => {
    if (editPos) {
      await updatePosition(editPos.id, payload);
      setEditPos(null);
    } else {
      await createPosition(payload);
      setShowPosForm(false);
    }
  };

  if (deptLoading || posLoading || empLoading) return <SkeletonTable cols={3} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => setShowPosForm({})}>
          <Plus size={16} /> Jabatan
        </Button>
        <Button variant="primary" size="sm" onClick={() => setShowDeptForm(true)}>
          <Plus size={16} /> Departemen
        </Button>
      </div>

      {(!departments || departments.length === 0) && (
        <EmptyState title="Belum ada data" description="Tambahkan departemen pertama Anda" icon={<Network className="h-12 w-12" />} />
      )}

      {departments?.map((dept) => {
        const isDeptExpanded = expandedDepts.has(dept.id);
        const deptPositions = positionsByDept.get(dept.id) || [];

        return (
          <div key={dept.id} className="rounded-xl border border-(--border) bg-(--card) overflow-hidden transition-all">
            <div className="flex items-center justify-between p-4 bg-(--muted)/20 hover:bg-(--muted)/40 transition cursor-pointer" onClick={() => toggleDept(dept.id)}>
              <div className="flex items-center gap-3">
                {isDeptExpanded ? <ChevronDown size={18} className="text-(--muted-foreground)" /> : <ChevronRight size={18} className="text-(--muted-foreground)" />}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-(--foreground)">{dept.name}</h3>
                    <span className="inline-flex items-center rounded-md bg-(--primary)/10 px-2 py-0.5 text-xs font-bold text-(--primary)">
                      {dept.code}
                    </span>
                  </div>
                  <p className="text-xs text-(--muted-foreground) mt-0.5">
                    {dept.branch_name || "Semua Cabang"} • {deptPositions.length} Jabatan
                  </p>
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setEditDept(dept)} className="rounded-lg p-2 text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)" title="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteDept(dept)} className="rounded-lg p-2 text-(--muted-foreground) hover:bg-red-500/10 hover:text-red-500" title="Hapus">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {isDeptExpanded && (
              <div className="border-t border-(--border) p-4 bg-(--card) space-y-3">
                {deptPositions.length === 0 ? (
                  <p className="text-sm text-(--muted-foreground) italic ml-7">Tidak ada jabatan dalam departemen ini.</p>
                ) : (
                  deptPositions.map((pos) => {
                    const isPosExpanded = expandedPos.has(pos.id);
                    const posEmployees = employeesByPos.get(pos.id) || [];

                    return (
                      <div key={pos.id} className="ml-7 rounded-lg border border-(--border) overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-(--muted)/10 hover:bg-(--muted)/30 cursor-pointer" onClick={() => togglePos(pos.id)}>
                           <div className="flex items-center gap-2">
                             {isPosExpanded ? <ChevronDown size={16} className="text-(--muted-foreground)" /> : <ChevronRight size={16} className="text-(--muted-foreground)" />}
                             <Briefcase size={16} className="text-(--primary)" />
                             <span className="font-medium text-sm text-(--foreground)">{pos.title}</span>
                             <span className="text-xs text-(--muted-foreground) ml-2">({posEmployees.length} Pegawai)</span>
                           </div>
                           <div className="flex gap-1 mt-2 sm:mt-0" onClick={(e) => e.stopPropagation()}>
                             <button onClick={() => setEditPos(pos)} className="rounded-lg p-1.5 text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)" title="Edit">
                               <Pencil size={14} />
                             </button>
                             <button onClick={() => setDeletePosTarget(pos)} className="rounded-lg p-1.5 text-(--muted-foreground) hover:bg-red-500/10 hover:text-red-500" title="Hapus">
                               <Trash2 size={14} />
                             </button>
                           </div>
                        </div>

                        {isPosExpanded && (
                          <div className="border-t border-(--border) p-3 bg-(--card)">
                            {posEmployees.length === 0 ? (
                              <p className="text-xs text-(--muted-foreground) italic ml-7">Belum ada pegawai di jabatan ini.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-7">
                                {posEmployees.map(emp => (
                                  <div key={emp.id} className="flex items-center gap-3 p-2 rounded border border-(--border) bg-(--muted)/5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary)/20 text-xs font-bold text-(--primary)">
                                      {emp.full_name.substring(0,2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-(--foreground) truncate">{emp.full_name}</p>
                                      <p className="text-xs text-(--muted-foreground) font-mono">{emp.employee_number}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                
                <div className="ml-7 pt-2">
                   <Button variant="ghost" size="sm" onClick={() => setShowPosForm({ deptId: dept.id })} className="text-xs text-(--primary) hover:text-(--primary)/80 hover:bg-(--primary)/10">
                     <Plus size={14} className="mr-1" /> Tambah Jabatan ke {dept.name}
                   </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Forms */}
      <Modal open={showDeptForm || !!editDept} title={editDept ? "Edit Departemen" : "Tambah Departemen"} onClose={() => { setShowDeptForm(false); setEditDept(null); }}>
        <DepartmentForm onClose={() => { setShowDeptForm(false); setEditDept(null); }} onSubmit={handleDeptSubmit} editDepartment={editDept || undefined} branches={branches?.map(b=>({id:b.id,name:b.name})) || []} isLoading={deptMutLoading} />
      </Modal>

      <Modal open={!!showPosForm || !!editPos} title={editPos ? "Edit Jabatan" : "Tambah Jabatan"} onClose={() => { setShowPosForm(false); setEditPos(null); }}>
        <PositionForm onClose={() => { setShowPosForm(false); setEditPos(null); }} onSubmit={handlePosSubmit} editPosition={editPos || undefined} departments={departments?.map(d=>({id:d.id,name:d.name})) || []} isLoading={posMutLoading} />
      </Modal>

      {/* Confirms */}
      <ConfirmDialog open={!!deleteDept} title="Hapus Departemen" message="Yakin ingin menghapus departemen ini?" onConfirm={async () => { if (deleteDept) await deleteDepartment(deleteDept.id); setDeleteDept(null); }} onCancel={() => setDeleteDept(null)} isLoading={deptMutLoading} />
      <ConfirmDialog open={!!deletePosTarget} title="Hapus Jabatan" message="Yakin ingin menghapus jabatan ini?" onConfirm={async () => { if (deletePosTarget) await deletePosition(deletePosTarget.id); setDeletePosTarget(null); }} onCancel={() => setDeletePosTarget(null)} isLoading={posMutLoading} />

    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function DepartmentPage() {
  return (
    <MainLayout>
      <header className="sticky top-0 z-40 border-b border-(--border) bg-(--card) px-4 py-3 sm:px-6 sm:py-3.5">
        <div>
          <h1 className="text-sm font-bold tracking-wide text-(--foreground) md:text-lg">
            Departemen & Jabatan
          </h1>
          <p className="text-[10px] text-(--muted-foreground) md:text-xs">
            Kelola unit organisasi, jabatan, dan daftar pegawai secara terpadu
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-350 p-3 sm:p-5">
        <DepartmentAccordion />
      </div>
    </MainLayout>
  );
}
