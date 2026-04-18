import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--background) p-6">
      <div className="relative w-full max-w-md text-center">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)" }}
        />

        {/* Icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/10">
          <SearchX size={48} className="text-indigo-500" />
          <div className="absolute inset-0 animate-pulse rounded-2xl border border-indigo-500/10" />
        </div>

        {/* Title */}
        <h1 className="mb-2 text-6xl font-extrabold tracking-tight text-(--foreground)">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            404
          </span>
        </h1>

        <h2 className="mb-3 text-xl font-bold text-(--foreground)">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mb-8 text-(--muted-foreground) leading-relaxed">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
          <br />
          Periksa kembali URL atau kembali ke halaman utama.
        </p>

        {/* Action */}
        <button
          onClick={() => navigate("/")}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #d10071 0%, #dd0d89 50%, #9d167c 100%)",
            boxShadow: "0 4px 16px rgba(209,0,113,0.35)",
          }}
        >
          <span className="relative">Kembali ke Dashboard</span>
        </button>
      </div>
    </div>
  );
}
