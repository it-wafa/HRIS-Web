import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  FileText,
  Edit2,
  Trash2,
  Plus,
  X,
  Mail,
  MapPin,
  AlertTriangle,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import {
  useEmployeeById,
  useEmployeeContacts,
  useEmployeeMutations,
  useEmployeeContactMutations,
} from "@/hooks/useEmployee";
import { useContractList, useContractMutations } from "@/hooks/useContract";
import {
  GENDER_LABELS,
  MARITAL_STATUS_LABELS,
  CONTACT_TYPE_LABELS,
} from "@/types/employee";
import { CONTRACT_TYPE_LABELS, CONTRACT_TYPE_COLORS } from "@/types/contract";
import type {
  EmployeeContact,
  CreateContactPayload,
  ContactType,
} from "@/types/employee";
import type {
  EmploymentContract,
  CreateContractPayload,
  ContractType,
} from "@/types/contract";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

// ════════════════════════════════════════════
// CONFIRM DIALOG
// ════════════════════════════════════════════

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  variant = "danger",
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning";
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-(--border) bg-(--card) p-5"
        style={{
          boxShadow:
            "0 0 40px rgba(212,21,140,0.1), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              variant === "danger" && "bg-rose-100 text-rose-600",
              variant === "warning" && "bg-amber-100 text-amber-600",
            )}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-(--foreground)">{title}</h3>
            <p className="mt-1 text-sm text-(--muted-foreground)">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Batal
          </Button>
          <button
            onClick={onConfirm}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",
              variant === "danger" && "bg-rose-600 hover:bg-rose-700",
              variant === "warning" && "bg-amber-600 hover:bg-amber-700",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
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
  maxWidth = "max-w-lg",
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
          "w-full overflow-hidden rounded-2xl border border-(--border) bg-(--card)",
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
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

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
    { label: "Kontak", icon: Phone },
    { label: "Kontrak Kerja", icon: FileText },
  ];

  return (
    <div className="flex gap-1 border-b border-(--border) overflow-x-auto">
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
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// INFO ITEM
// ════════════════════════════════════════════

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

// ════════════════════════════════════════════
// CONTACT FORM
// ════════════════════════════════════════════

function ContactForm({
  initialData,
  onClose,
  onSubmit,
  isLoading,
}: {
  initialData?: EmployeeContact;
  onClose: () => void;
  onSubmit: (payload: CreateContactPayload) => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    contact_type: initialData?.contact_type || ("phone" as ContactType),
    contact_value: initialData?.contact_value || "",
    contact_label: initialData?.contact_label || "",
    is_primary: initialData?.is_primary ?? false,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contact_value.trim()) {
      setError("Nilai kontak wajib diisi");
      return;
    }
    onSubmit({
      contact_type: formData.contact_type,
      contact_value: formData.contact_value.trim(),
      contact_label: formData.contact_label.trim() || undefined,
      is_primary: formData.is_primary,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <SearchableSelect
          label="Tipe Kontak *"
          value={formData.contact_type}
          onChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              contact_type: val as ContactType,
            }))
          }
          options={Object.entries(CONTACT_TYPE_LABELS).map(
            ([value, label]) => ({
              value,
              label,
            }),
          )}
          placeholder="Pilih tipe kontak"
          searchPlaceholder="Cari tipe kontak..."
        />
      </div>

      <Input
        id="contact_value"
        label={`${CONTACT_TYPE_LABELS[formData.contact_type]} *`}
        value={formData.contact_value}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, contact_value: e.target.value }));
          setError("");
        }}
        placeholder={
          formData.contact_type === "phone"
            ? "08xx xxxx xxxx"
            : formData.contact_type === "email"
              ? "email@example.com"
              : "Alamat lengkap"
        }
        error={error}
      />

      <Input
        id="contact_label"
        label="Label (Opsional)"
        value={formData.contact_label}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, contact_label: e.target.value }))
        }
        placeholder="Contoh: Rumah, Kantor, Pribadi"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_primary"
          checked={formData.is_primary}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, is_primary: e.target.checked }))
          }
          className="h-4 w-4 rounded border-(--border)"
        />
        <label htmlFor="is_primary" className="text-sm text-(--foreground)">
          Jadikan kontak utama
        </label>
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
          {initialData ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// CONTRACT FORM
// ════════════════════════════════════════════

function ContractForm({
  initialData,
  onClose,
  onSubmit,
  isLoading,
}: {
  initialData?: EmploymentContract;
  onClose: () => void;
  onSubmit: (payload: CreateContractPayload) => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    contract_number: initialData?.contract_number || "",
    contract_type: initialData?.contract_type || ("pkwt" as ContractType),
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    notes: initialData?.notes || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.contract_number.trim())
      newErrors.contract_number = "Nomor kontrak wajib diisi";
    if (!formData.start_date)
      newErrors.start_date = "Tanggal mulai wajib diisi";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      contract_number: formData.contract_number.trim(),
      contract_type: formData.contract_type,
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      notes: formData.notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="contract_number"
        label="Nomor Kontrak *"
        value={formData.contract_number}
        onChange={(e) => handleChange("contract_number", e.target.value)}
        placeholder="Contoh: CTR/2024/001"
        error={errors.contract_number}
      />

      <div className="space-y-1.5">
        <SearchableSelect
          label="Tipe Kontrak *"
          value={formData.contract_type}
          onChange={(val) => handleChange("contract_type", val)}
          options={Object.entries(CONTRACT_TYPE_LABELS).map(
            ([value, label]) => ({
              value,
              label,
            }),
          )}
          placeholder="Pilih tipe kontrak"
          searchPlaceholder="Cari tipe kontrak..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="start_date"
          label="Tanggal Mulai *"
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
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          Catatan
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Catatan tambahan (opsional)"
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
            "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
            "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
          )}
        />
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
          {initialData ? "Simpan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const employeeId = Number.parseInt(id || "0");

  const {
    data: employee,
    loading,
    refetch: refetchEmployee,
  } = useEmployeeById(employeeId);
  const { data: contacts, refetch: refetchContacts } =
    useEmployeeContacts(employeeId);
  const { data: contracts, refetch: refetchContracts } =
    useContractList(employeeId);

  const { deleteEmployee } = useEmployeeMutations(refetchEmployee);
  const {
    loading: contactMutLoading,
    createContact,
    updateContact,
    deleteContact,
  } = useEmployeeContactMutations(refetchContacts);
  const {
    loading: contractMutLoading,
    createContract,
    updateContract,
    deleteContract,
  } = useContractMutations(refetchContracts);

  const [activeTab, setActiveTab] = useState(0);

  // Contact state
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<EmployeeContact | null>(
    null,
  );
  const [deletingContact, setDeletingContact] =
    useState<EmployeeContact | null>(null);

  // Contract state
  const [showContractForm, setShowContractForm] = useState(false);
  const [editingContract, setEditingContract] =
    useState<EmploymentContract | null>(null);
  const [deletingContract, setDeletingContract] =
    useState<EmploymentContract | null>(null);

  // Delete employee state
  const [showDeleteEmployee, setShowDeleteEmployee] = useState(false);

  // Handlers: Contacts
  const handleCreateContact = async (payload: CreateContactPayload) => {
    const result = await createContact(employeeId, payload);
    if (result) setShowContactForm(false);
  };

  const handleUpdateContact = async (payload: CreateContactPayload) => {
    if (!editingContact) return;
    const result = await updateContact(editingContact.id, payload);
    if (result) setEditingContact(null);
  };

  const handleDeleteContact = async () => {
    if (!deletingContact) return;
    await deleteContact(deletingContact.id);
    setDeletingContact(null);
  };

  // Handlers: Contracts
  const handleCreateContract = async (payload: CreateContractPayload) => {
    const result = await createContract(employeeId, payload);
    if (result) setShowContractForm(false);
  };

  const handleUpdateContract = async (payload: CreateContractPayload) => {
    if (!editingContract) return;
    const result = await updateContract(editingContract.id, payload);
    if (result) setEditingContract(null);
  };

  const handleDeleteContract = async () => {
    if (!deletingContract) return;
    await deleteContract(deletingContract.id);
    setDeletingContract(null);
  };

  // Handlers: Employee
  const handleDeleteEmployee = async () => {
    await deleteEmployee(employeeId);
    navigate("/employees");
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  if (!employee) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center p-6 pt-16 md:pt-6 min-h-[50vh]">
          <EmptyState
            title="Pegawai tidak ditemukan"
            description="Data pegawai yang Anda cari tidak tersedia"
            icon={<User className="h-12 w-12" />}
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/employees")}
              >
                Kembali ke Daftar
              </Button>
            }
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employees")}
              className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
            >
              <ArrowLeft size={20} />
            </button>
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
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
              <h1 className="text-xl font-bold text-(--foreground)">
                {employee.full_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <p className="text-sm text-(--muted-foreground)">
                  {employee.employee_number}
                  {employee.job_position_title
                    ? ` · ${employee.job_position_title}`
                    : ""}
                </p>
                {employee.department_name && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--secondary)/50 px-2 py-0.5 text-xs font-medium text-(--muted-foreground)">
                    <Network size={10} />
                    {employee.department_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteEmployee(true)}
              className="text-(--destructive)"
            >
              <Trash2 size={14} />
              Hapus
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="min-h-75">
          {/* Tab: Info Pribadi */}
          {activeTab === 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Data Dasar */}
              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <h3 className="mb-4 font-semibold text-(--foreground)">
                  Data Dasar
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    label="Nomor Pegawai"
                    value={employee.employee_number}
                  />
                  <InfoItem label="Nama Lengkap" value={employee.full_name} />
                  <InfoItem
                    label="Tanggal Lahir"
                    value={formatDate(employee.birth_date)}
                  />
                  <InfoItem label="Tempat Lahir" value={employee.birth_place} />
                  <InfoItem
                    label="Jenis Kelamin"
                    value={
                      employee.gender
                        ? GENDER_LABELS[employee.gender]
                        : undefined
                    }
                  />
                  <InfoItem label="Cabang" value={employee.branch_name} />
                  <InfoItem
                    label="Departemen"
                    value={employee.department_name}
                  />
                  <InfoItem
                    label="Jabatan"
                    value={employee.job_position_title}
                  />
                  <InfoItem label="Role" value={employee.role_name} />
                </div>
              </div>

              {/* Data Pribadi */}
              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <h3 className="mb-4 font-semibold text-(--foreground)">
                  Data Pribadi
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="NIK" value={employee.nik} />
                  <InfoItem label="NPWP" value={employee.npwp} />
                  <InfoItem label="Nomor KK" value={employee.kk_number} />
                  <InfoItem label="Agama" value={employee.religion} />
                  <InfoItem
                    label="Status Pernikahan"
                    value={
                      employee.marital_status
                        ? MARITAL_STATUS_LABELS[employee.marital_status]
                        : undefined
                    }
                  />
                  <InfoItem
                    label="Golongan Darah"
                    value={employee.blood_type}
                  />
                  <InfoItem
                    label="Kewarganegaraan"
                    value={employee.nationality}
                  />
                  <InfoItem
                    label="Tinggi/Berat Badan"
                    value={
                      employee.height || employee.weight
                        ? `${employee.height || "-"} cm / ${employee.weight || "-"} kg`
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Kontak */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowContactForm(true)}
                >
                  <Plus size={16} />
                  Tambah Kontak
                </Button>
              </div>

              {!contacts || contacts.length === 0 ? (
                <EmptyState
                  title="Belum ada data kontak"
                  description="Tambahkan kontak untuk pegawai ini"
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
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingContact(contact)}
                          className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingContact(contact)}
                          className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:bg-(--destructive)/10 hover:text-(--destructive)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Kontrak Kerja */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowContractForm(true)}
                >
                  <Plus size={16} />
                  Tambah Kontrak
                </Button>
              </div>

              {!contracts || contracts.length === 0 ? (
                <EmptyState
                  title="Belum ada data kontrak"
                  description="Tambahkan kontrak kerja untuk pegawai ini"
                  icon={<FileText className="h-10 w-10" />}
                />
              ) : (
                <div className="overflow-hidden rounded-xl border border-(--border)">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-(--border) bg-(--muted)/50">
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                            No. Kontrak
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                            Tipe
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                            Periode
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted-foreground)">
                            Catatan
                          </th>
                          <th className="px-5 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.map((contract, index) => (
                          <tr
                            key={contract.id}
                            className={cn(
                              "border-b border-(--border) last:border-b-0",
                              index % 2 === 0
                                ? "bg-(--card)"
                                : "bg-(--muted)/20",
                            )}
                          >
                            <td className="px-5 py-4">
                              <span className="font-medium text-(--foreground)">
                                {contract.contract_number}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={cn(
                                  "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                  CONTRACT_TYPE_COLORS[contract.contract_type],
                                )}
                              >
                                {CONTRACT_TYPE_LABELS[contract.contract_type]}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-(--foreground)">
                              {formatDate(contract.start_date)}
                              {contract.end_date &&
                                ` — ${formatDate(contract.end_date)}`}
                            </td>
                            <td className="px-5 py-4 text-sm text-(--muted-foreground) max-w-xs truncate">
                              {contract.notes || "-"}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => setEditingContract(contract)}
                                  className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => setDeletingContract(contract)}
                                  className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:bg-(--destructive)/10 hover:text-(--destructive)"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Modals */}
      <Modal
        open={showContactForm}
        title="Tambah Kontak"
        onClose={() => setShowContactForm(false)}
      >
        <ContactForm
          onClose={() => setShowContactForm(false)}
          onSubmit={handleCreateContact}
          isLoading={contactMutLoading}
        />
      </Modal>

      <Modal
        open={!!editingContact}
        title="Edit Kontak"
        onClose={() => setEditingContact(null)}
      >
        {editingContact && (
          <ContactForm
            initialData={editingContact}
            onClose={() => setEditingContact(null)}
            onSubmit={handleUpdateContact}
            isLoading={contactMutLoading}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deletingContact}
        title="Hapus Kontak"
        description={`Anda yakin ingin menghapus kontak "${deletingContact?.contact_value}"?`}
        confirmLabel="Hapus"
        onConfirm={handleDeleteContact}
        onCancel={() => setDeletingContact(null)}
        variant="danger"
      />

      {/* Contract Modals */}
      <Modal
        open={showContractForm}
        title="Tambah Kontrak"
        onClose={() => setShowContractForm(false)}
      >
        <ContractForm
          onClose={() => setShowContractForm(false)}
          onSubmit={handleCreateContract}
          isLoading={contractMutLoading}
        />
      </Modal>

      <Modal
        open={!!editingContract}
        title="Edit Kontrak"
        onClose={() => setEditingContract(null)}
      >
        {editingContract && (
          <ContractForm
            initialData={editingContract}
            onClose={() => setEditingContract(null)}
            onSubmit={handleUpdateContract}
            isLoading={contractMutLoading}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deletingContract}
        title="Hapus Kontrak"
        description={`Anda yakin ingin menghapus kontrak "${deletingContract?.contract_number}"?`}
        confirmLabel="Hapus"
        onConfirm={handleDeleteContract}
        onCancel={() => setDeletingContract(null)}
        variant="danger"
      />

      {/* Delete Employee */}
      <ConfirmDialog
        open={showDeleteEmployee}
        title="Hapus Pegawai"
        description={`Anda yakin ingin menghapus pegawai "${employee.full_name}"? Semua data terkait (kontak, kontrak) juga akan dihapus.`}
        confirmLabel="Hapus"
        onConfirm={handleDeleteEmployee}
        onCancel={() => setShowDeleteEmployee(false)}
        variant="danger"
      />
    </MainLayout>
  );
}
