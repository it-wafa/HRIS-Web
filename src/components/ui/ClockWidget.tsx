import { useState, useEffect, useRef, useCallback } from "react";
import {
  LogIn,
  LogOut,
  Smartphone,
  Monitor,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeFull, formatDateLong, formatTime } from "@/utils/date";
import { presignClockPhoto, uploadPhotoToPresigned } from "@/lib/dashboard-api";
import type {
  TodayAttendanceStatus,
  ClockInPayload,
  ClockOutPayload,
} from "@/types/dashboard";
import toast from "react-hot-toast";

export interface ClockWidgetProps {
  status: TodayAttendanceStatus | null;
  isMobile: boolean;
  onClockIn: (payload: ClockInPayload) => void;
  onClockOut: (payload: ClockOutPayload) => void;
  disabled?: boolean;
  loading?: boolean;
}



/** Get current GPS position */
function getGeolocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation tidak didukung browser ini"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error("Izin akses lokasi ditolak. Aktifkan GPS Anda."));
            break;
          case err.POSITION_UNAVAILABLE:
            reject(new Error("Lokasi tidak tersedia."));
            break;
          case err.TIMEOUT:
            reject(new Error("Timeout saat mendapatkan lokasi."));
            break;
          default:
            reject(new Error("Gagal mendapatkan lokasi."));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });
}

export function ClockWidget({
  status,
  isMobile,
  onClockIn,
  onClockOut,
  disabled = false,
  loading = false,
}: ClockWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [processingAction, setProcessingAction] = useState<
    "clock_in" | "clock_out" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const canClockIn = !status?.has_clocked_in;
  const canClockOut = status?.has_clocked_in && !status?.has_clocked_out;
  const isComplete = status?.has_clocked_in && status?.has_clocked_out;

  const hours = currentTime.getHours();
  const isNight = hours >= 20 || hours < 6;
  const isMorning = hours >= 6 && hours < 12;
  const isAfternoon = hours >= 12 && hours < 17;

  const gradientBg = isNight
    ? "from-slate-900 via-purple-950 to-slate-900"
    : isMorning
      ? "from-orange-400 via-rose-400 to-pink-500"
      : isAfternoon
        ? "from-sky-400 via-blue-500 to-indigo-500"
        : "from-purple-500 via-rose-500 to-pink-500";

  /** Handle camera trigger */
  const triggerCamera = useCallback((action: "clock_in" | "clock_out") => {
    setProcessingAction(action);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, []);

  /** Handle file selected from camera */
  const handleFileSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !processingAction) {
        setProcessingAction(null);
        return;
      }

      try {
        // 1. Get presigned URL
        toast.loading("Memproses foto...", { id: "clock-process" });
        const presignRes = await presignClockPhoto(processingAction);
        const { upload_url, object_key } = presignRes.data;

        // 2. Upload photo
        await uploadPhotoToPresigned(upload_url, file);

        // 3. Get GPS location
        toast.loading("Mendapatkan lokasi GPS...", { id: "clock-process" });
        const { latitude, longitude } = await getGeolocation();

        toast.dismiss("clock-process");

        // 4. Call clock in/out with payload
        const payload = {
          photo_key: object_key,
          latitude,
          longitude,
        };

        if (processingAction === "clock_in") {
          onClockIn(payload);
        } else {
          onClockOut(payload);
        }
      } catch (err: unknown) {
        toast.dismiss("clock-process");
        const message =
          err instanceof Error ? err.message : "Gagal memproses presensi";
        toast.error(message);
      } finally {
        setProcessingAction(null);
      }
    },
    [processingAction, onClockIn, onClockOut],
  );

  const isProcessing = loading || processingAction !== null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--border) shadow-xl">
      {/* Hidden camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Gradient header background */}
      <div
        className={cn("relative bg-linear-to-br", gradientBg, "px-5 pt-5 pb-8")}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-2 top-8 h-16 w-16 rounded-full bg-white/10" />

        {/* Device badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {isMobile ? <Smartphone size={11} /> : <Monitor size={11} />}
            {isMobile ? "Mobile" : "Desktop"}
          </span>
          {status && status.late_minutes > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-semibold text-white">
              Terlambat {status.late_minutes} mnt
            </span>
          )}
        </div>

        {/* Time display */}
        <div className="text-center">
          <div className="font-mono text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl">
            {formatTimeFull(currentTime)}
          </div>
          <div className="mt-1.5 text-sm font-medium text-white/80">
            {formatDateLong(currentTime)}
          </div>
        </div>
      </div>

      {/* Curved connector */}
      <div
        className={cn("bg-linear-to-br", gradientBg, "h-6")}
        style={{ clipPath: "ellipse(100% 100% at 50% 0%)" }}
      />

      {/* Bottom section */}
      <div className="mt-4 bg-(--card) px-5 pb-5">
        {/* Status indicator */}
        <div className="mb-4 flex justify-center">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium",
              isComplete
                ? "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20"
                : status?.has_clocked_in
                  ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/20"
                  : "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isComplete && "bg-blue-500",
                status?.has_clocked_in && !isComplete && "bg-green-500",
                !status?.has_clocked_in && "animate-pulse bg-amber-500",
              )}
            />
            {isComplete
              ? `Presensi Lengkap`
              : status?.has_clocked_in
                ? `Masuk pukul ${formatTime(status?.clock_in_at)}`
                : "Belum Clock In"}
          </div>
        </div>

        {/* Punch records - shown when has data */}
        {(status?.has_clocked_in || status?.has_clocked_out) && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-(--muted)/50 px-3 py-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-(--muted-foreground) mb-1">
                <LogIn size={12} className="text-green-500" />
                Jam Masuk
              </div>
              <div className="font-mono text-lg font-bold text-(--foreground)">
                {formatTime(status?.clock_in_at ?? null)}
              </div>
            </div>
            <div className="rounded-xl bg-(--muted)/50 px-3 py-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-(--muted-foreground) mb-1">
                <LogOut size={12} className="text-red-500" />
                Jam Keluar
              </div>
              <div className="font-mono text-lg font-bold text-(--foreground)">
                {formatTime(status?.clock_out_at ?? null)}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {canClockIn && (
            <button
              onClick={() => triggerCamera("clock_in")}
              disabled={disabled || isProcessing}
              className={cn(
                "group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl px-4 py-3.5 font-semibold text-white transition-all",
                "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25",
                "hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:shadow-none",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">
                {isProcessing && processingAction === "clock_in" ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Camera size={18} />
                )}
                Clock In
              </span>
            </button>
          )}

          {canClockOut && (
            <button
              onClick={() => triggerCamera("clock_out")}
              disabled={disabled || isProcessing}
              className={cn(
                "group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl px-4 py-3.5 font-semibold text-white transition-all",
                "bg-gradient-to-r from-rose-500 to-red-600 shadow-lg shadow-rose-500/25",
                "hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:shadow-none",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-red-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">
                {isProcessing && processingAction === "clock_out" ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Camera size={18} />
                )}
                Clock Out
              </span>
            </button>
          )}

          {isComplete && (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-(--muted)/50 px-4 py-3.5 text-(--muted-foreground)">
              <CheckCircle2 size={18} className="text-blue-500" />
              <span className="font-medium">Selesai Hari Ini</span>
            </div>
          )}
        </div>

        {/* Camera instruction */}
        {!isComplete && (
          <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2">
            <p className="text-center text-xs text-amber-600">
              📸 Foto wajah akan diambil saat presensi untuk verifikasi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ClockWidgetSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--border)">
      <div className="h-40 animate-pulse bg-(--muted)" />
      <div className="bg-(--card) p-5 space-y-4">
        <div className="flex justify-center">
          <div className="h-8 w-48 animate-pulse rounded-full bg-(--muted)" />
        </div>
        <div className="h-14 w-full animate-pulse rounded-xl bg-(--muted)" />
      </div>
    </div>
  );
}
