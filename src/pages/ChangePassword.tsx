import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDemo } from "@/contexts/DemoContext";
import { changePassword } from "@/lib/profile-api";

function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-(--foreground)">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)">
          <Lock size={16} />
        </div>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-(--border) bg-(--input) px-4 py-3 pl-10 pr-10 text-sm text-(--foreground) placeholder:text-(--muted-foreground) focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground) hover:text-(--foreground) transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <p className="text-xs text-(--muted-foreground)">{hint}</p>}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Minimal 8 karakter", ok: password.length >= 8 },
    { label: "Huruf kapital", ok: /[A-Z]/.test(password) },
    { label: "Huruf kecil", ok: /[a-z]/.test(password) },
    { label: "Angka", ok: /[0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.ok).length;
  const strengthLabel = ["", "Lemah", "Cukup", "Baik", "Kuat"][score];
  const strengthColor =
    score <= 1 ? "bg-red-500" : score === 2 ? "bg-amber-500" : score === 3 ? "bg-blue-500" : "bg-green-500";

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-(--muted) overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${(score / 4) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${score <= 1 ? "text-red-500" : score === 2 ? "text-amber-500" : score === 3 ? "text-blue-500" : "text-green-500"}`}>
          {strengthLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${check.ok ? "bg-green-500" : "bg-(--muted)"}`} />
            <span className={`text-xs ${check.ok ? "text-green-600 dark:text-green-400" : "text-(--muted-foreground)"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { isDemo } = useDemo();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!oldPassword) newErrors.oldPassword = "Password lama wajib diisi";
    if (!newPassword) newErrors.newPassword = "Password baru wajib diisi";
    else if (newPassword.length < 8) newErrors.newPassword = "Password minimal 8 karakter";
    if (!confirmPassword) newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = "Password baru tidak cocok";
    if (oldPassword && newPassword && oldPassword === newPassword) {
      newErrors.newPassword = "Password baru tidak boleh sama dengan password lama";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isDemo) {
      toast("Demo mode — password tidak diubah", { icon: "🔒" });
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success("Password berhasil diubah");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/profile");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-xl p-4 pt-16 md:p-6 md:pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-(--foreground)">Ubah Password</h1>
            <p className="text-sm text-(--muted-foreground)">Perbarui kata sandi akun Anda</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-(--border) bg-(--card) p-6 shadow-sm">
          {/* Icon header */}
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary)/10">
              <ShieldCheck size={28} className="text-(--primary)" />
            </div>
            <div>
              <h2 className="font-semibold text-(--foreground)">Keamanan Akun</h2>
              <p className="text-sm text-(--muted-foreground) mt-0.5">
                Gunakan password yang kuat dan unik untuk melindungi akun Anda
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              id="old-password"
              label="Password Lama"
              value={oldPassword}
              onChange={(v) => { setOldPassword(v); setErrors((e) => ({ ...e, oldPassword: "" })); }}
              placeholder="Masukkan password lama"
            />
            {errors.oldPassword && <p className="text-xs text-red-500 -mt-2">{errors.oldPassword}</p>}

            <div className="pt-2 border-t border-(--border)" />

            <PasswordInput
              id="new-password"
              label="Password Baru"
              value={newPassword}
              onChange={(v) => { setNewPassword(v); setErrors((e) => ({ ...e, newPassword: "" })); }}
              placeholder="Minimal 8 karakter"
              hint=""
            />
            {errors.newPassword && <p className="text-xs text-red-500 -mt-2">{errors.newPassword}</p>}

            <PasswordStrength password={newPassword} />

            <PasswordInput
              id="confirm-password"
              label="Konfirmasi Password Baru"
              value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); setErrors((e) => ({ ...e, confirmPassword: "" })); }}
              placeholder="Ulangi password baru"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 -mt-2">{errors.confirmPassword}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={loading}
                className="flex-1 rounded-xl border border-(--border) bg-(--card) px-4 py-2.5 text-sm font-medium text-(--foreground) transition hover:bg-(--muted) disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-primary-btn px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menyimpan...
                  </span>
                ) : "Ubah Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}