import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/date";
import { Clock, CheckCircle2, XCircle, Circle } from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// ApprovalTimeline Component — Reusable timeline for approvals (§7.5)
// ══════════════════════════════════════════════════════════════════════════════

export interface TimelineStep {
  level: number; // 1, 2, ...
  label: string; // "Leader Departemen", "Leader HRGA"
  approver_name: string | null;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
  decided_at: string | null;
}

export interface ApprovalTimelineProps {
  steps: TimelineStep[];
  current_status: string; // status keseluruhan pengajuan
  className?: string;
}



/**
 * Get icon based on status
 */
function getStatusIcon(status: "pending" | "approved" | "rejected") {
  switch (status) {
    case "approved":
      return CheckCircle2;
    case "rejected":
      return XCircle;
    default:
      return Circle;
  }
}

/**
 * Get status color classes
 */
function getStatusColors(status: "pending" | "approved" | "rejected") {
  switch (status) {
    case "approved":
      return {
        icon: "text-green-600",
        bg: "bg-green-500/10",
        border: "border-green-500",
        line: "bg-green-500",
      };
    case "rejected":
      return {
        icon: "text-red-600",
        bg: "bg-red-500/10",
        border: "border-red-500",
        line: "bg-red-500",
      };
    default:
      return {
        icon: "text-yellow-600",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500",
        line: "bg-(--border)",
      };
  }
}

/**
 * Get status label
 */
function getStatusLabel(status: "pending" | "approved" | "rejected") {
  switch (status) {
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    default:
      return "Menunggu";
  }
}

export function ApprovalTimeline({
  steps,
  current_status,
  className,
}: ApprovalTimelineProps) {
  if (!steps || steps.length === 0) {
    return (
      <div
        className={cn(
          "text-center text-sm text-(--muted-foreground)",
          className,
        )}
      >
        Tidak ada data timeline approval
      </div>
    );
  }

  // Sort steps by level
  const sortedSteps = [...steps].sort((a, b) => a.level - b.level);

  return (
    <div className={cn("relative", className)}>
      {/* Overall status badge */}
      <div className="mb-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            current_status === "approved_hr" &&
              "bg-green-500/10 text-green-600",
            current_status === "approved_leader" &&
              "bg-blue-500/10 text-blue-600",
            current_status === "rejected" && "bg-red-500/10 text-red-600",
            current_status === "pending" && "bg-yellow-500/10 text-yellow-600",
          )}
        >
          Status:{" "}
          {current_status === "approved_hr"
            ? "Disetujui HR"
            : current_status === "approved_leader"
              ? "Disetujui Leader"
              : current_status === "rejected"
                ? "Ditolak"
                : "Menunggu"}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {sortedSteps.map((step, index) => {
          const colors = getStatusColors(step.status);
          const Icon = getStatusIcon(step.status);
          const isLast = index === sortedSteps.length - 1;

          return (
            <div key={step.level} className="relative flex gap-4">
              {/* Line connector */}
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                    colors.bg,
                    colors.border,
                  )}
                >
                  {step.status === "pending" ? (
                    <Clock size={16} className={colors.icon} />
                  ) : (
                    <Icon size={16} className={colors.icon} />
                  )}
                </div>

                {/* Vertical line */}
                {!isLast && (
                  <div
                    className={cn("h-full w-0.5 flex-1", colors.line)}
                    style={{ minHeight: "60px" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-(--foreground)">
                    Level {step.level}: {step.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      step.status === "approved" &&
                        "bg-green-500/10 text-green-600",
                      step.status === "rejected" &&
                        "bg-red-500/10 text-red-600",
                      step.status === "pending" &&
                        "bg-yellow-500/10 text-yellow-600",
                    )}
                  >
                    {getStatusLabel(step.status)}
                  </span>
                </div>

                {/* Approver name */}
                {step.approver_name && (
                  <div className="mt-1 text-sm text-(--muted-foreground)">
                    Oleh:{" "}
                    <span className="text-(--foreground)">
                      {step.approver_name}
                    </span>
                  </div>
                )}

                {/* Decided at */}
                {step.decided_at && (
                  <div className="mt-0.5 text-xs text-(--muted-foreground)">
                    {formatDateTime(step.decided_at)}
                  </div>
                )}

                {/* Notes */}
                {step.notes && (
                  <div className="mt-2 rounded-lg border border-(--border) bg-(--muted)/30 px-3 py-2">
                    <p className="text-sm text-(--muted-foreground) italic">
                      "{step.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ApprovalTimelineSkeleton — Loading state for ApprovalTimeline
// ══════════════════════════════════════════════════════════════════════════════

export function ApprovalTimelineSkeleton({ steps = 2 }: { steps?: number }) {
  return (
    <div className="space-y-0">
      <div className="mb-4">
        <div className="h-6 w-32 animate-pulse rounded-full bg-(--muted)" />
      </div>
      {Array.from({ length: steps }).map((_, index) => (
        <div key={index} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-pulse rounded-full bg-(--muted)" />
            {index < steps - 1 && (
              <div
                className="w-0.5 flex-1 bg-(--muted)"
                style={{ minHeight: "60px" }}
              />
            )}
          </div>
          <div className={cn("flex-1", index < steps - 1 ? "pb-6" : "pb-0")}>
            <div className="h-5 w-48 animate-pulse rounded bg-(--muted)" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-(--muted)" />
            <div className="mt-1 h-3 w-40 animate-pulse rounded bg-(--muted)" />
          </div>
        </div>
      ))}
    </div>
  );
}
