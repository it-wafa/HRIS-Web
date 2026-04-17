import { useState, useEffect } from "react";
import { LogIn, LogOut, Smartphone, Monitor, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodayAttendanceStatus } from "@/types/dashboard";

export interface ClockWidgetProps {
  status: TodayAttendanceStatus;
  isMobile: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  disabled?: boolean;
  loading?: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatClockTime(isoString: string | null): string {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
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
  // isEvening: hours >= 17 && hours < 20

  const gradientBg = isNight
    ? "from-slate-900 via-purple-950 to-slate-900"
    : isMorning
      ? "from-orange-400 via-rose-400 to-pink-500"
      : isAfternoon
        ? "from-sky-400 via-blue-500 to-indigo-500"
        : "from-purple-500 via-rose-500 to-pink-500";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--border) shadow-xl">
      {/* Gradient header background */}
      <div
        className={cn(
          "relative bg-gradient-to-br",
          gradientBg,
          "px-5 pt-5 pb-8",
        )}
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
          {status?.late_minutes > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-semibold text-white">
              Terlambat {status?.late_minutes} mnt
            </span>
          )}
        </div>

        {/* Time display */}
        <div className="text-center">
          <div className="font-mono text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl">
            {formatTime(currentTime)}
          </div>
          <div className="mt-1.5 text-sm font-medium text-white/80">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

      {/* Curved connector */}
      <div
        className={cn("bg-gradient-to-br", gradientBg, "h-6")}
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
                ? `Masuk pukul ${formatClockTime(status?.clock_in_at)}`
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
                {formatClockTime(status?.clock_in_at)}
              </div>
            </div>
            <div className="rounded-xl bg-(--muted)/50 px-3 py-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-(--muted-foreground) mb-1">
                <LogOut size={12} className="text-red-500" />
                Jam Keluar
              </div>
              <div className="font-mono text-lg font-bold text-(--foreground)">
                {formatClockTime(status?.clock_out_at)}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {canClockIn && (
            <button
              onClick={onClockIn}
              disabled={disabled || loading}
              className={cn(
                "group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl px-4 py-3.5 font-semibold text-white transition-all",
                "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25",
                "hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:shadow-none",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <LogIn size={18} />
                )}
                Clock In
              </span>
            </button>
          )}

          {canClockOut && (
            <button
              onClick={onClockOut}
              disabled={disabled || loading}
              className={cn(
                "group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl px-4 py-3.5 font-semibold text-white transition-all",
                "bg-gradient-to-r from-rose-500 to-red-600 shadow-lg shadow-rose-500/25",
                "hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:shadow-none",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-red-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <LogOut size={18} />
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

        {/* Desktop warning */}
        {!isMobile && !isComplete && (
          <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2">
            <p className="text-center text-xs text-amber-600">
              📱 Presensi lebih akurat dari perangkat mobile dengan GPS
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
