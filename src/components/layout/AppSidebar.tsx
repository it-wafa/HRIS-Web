import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowLeftRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
  PieChart,
  Target,
  CalendarClock,
  Users,
  Building2,
  Briefcase,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const MAIN_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: TrendingUp, label: "Investment", path: "/investment" },
  { icon: ArrowLeftRight, label: "Transaction", path: "/transaction" },
];

const MONEY_FLOW_NAV: NavItem[] = [
  { icon: PieChart, label: "Categories", path: "/categories" },
  { icon: Target, label: "Budget", path: "/budget" },
  { icon: CalendarClock, label: "Scheduled", path: "/scheduled" },
];

const MASTER_DATA_NAV: NavItem[] = [
  { icon: Users, label: "Pegawai", path: "/employees" },
  { icon: Building2, label: "Cabang", path: "/branches" },
  { icon: Briefcase, label: "Jabatan", path: "/positions" },
  { icon: Shield, label: "Role", path: "/roles" },
];

export function AppSidebar() {
  const { user, logout, cachedProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = cachedProfile?.fullname
    ? cachedProfile.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "AU";

  const photoUrl = cachedProfile?.photo_url || "";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2.5 border-b border-(--border) px-4 py-4",
          collapsed && "justify-center px-2",
        )}
      >
        <img
          className="h-10 w-10 object-contain"
          src="/images/icons/logo.png"
          alt="Wafa Logo"
        />
        {!collapsed && (
          <div>
            <div className="font-heading font-bold tracking-wide text-primary-gradient">
              Wafa Indonesia
            </div>
            <div className="text-[10px] text-(--muted-foreground)">
              Human Resource Information System
            </div>
          </div>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-(--muted-foreground) transition hover:text-(--foreground) md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <div
          className={cn(
            "mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-(--muted-foreground)",
            collapsed && "hidden",
          )}
        >
          Main Menu
        </div>
        {MAIN_NAV.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                isActive
                  ? "nav-active shadow-sm"
                  : "text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon
                size={16}
                className={cn("shrink-0", isActive && "text-(--primary)")}
              />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-(--primary)" />
              )}
            </button>
          );
        })}

        {/* Money Flow Section */}
        <div
          className={cn(
            "mt-3 mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-(--muted-foreground)",
            collapsed && "hidden",
          )}
        >
          Money Flow
        </div>
        {collapsed && <div className="my-1 mx-2 h-px bg-(--border)" />}
        {MONEY_FLOW_NAV.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                isActive
                  ? "nav-active shadow-sm"
                  : "text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon
                size={16}
                className={cn("shrink-0", isActive && "text-(--primary)")}
              />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-(--primary)" />
              )}
            </button>
          );
        })}

        {/* Master Data Section */}
        <div
          className={cn(
            "mt-3 mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-(--muted-foreground)",
            collapsed && "hidden",
          )}
        >
          Master Data
        </div>
        {collapsed && <div className="my-1 mx-2 h-px bg-(--border)" />}
        {MASTER_DATA_NAV.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                isActive
                  ? "nav-active shadow-sm"
                  : "text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon
                size={16}
                className={cn("shrink-0", isActive && "text-(--primary)")}
              />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-(--primary)" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1 border-t border-(--border) p-2">
        {collapsed ? (
          <div className="flex justify-center py-1">
            <button
              onClick={() => navigate("/profile")}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-[12px] font-bold text-white transition hover:ring-2 hover:ring-(--primary)/50"
              style={
                !photoUrl
                  ? {
                      background:
                        "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
                      boxShadow: "0 0 10px 2px rgba(209,0,113,0.35)",
                    }
                  : undefined
              }
              title={user?.email ?? "Profile"}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </button>
          </div>
        ) : (
          <div
            className="mt-1 overflow-hidden rounded-xl border"
            style={{
              borderColor: "rgba(209,0,113,0.25)",
              background:
                "linear-gradient(135deg, rgba(209,0,113,0.06) 0%, rgba(221,13,137,0.03) 50%, rgba(209,0,113,0.05) 100%)",
              boxShadow:
                "0 0 16px 0 rgba(209,0,113,0.08), inset 0 1px 0 rgba(255,0,146,0.08)",
            }}
          >
            <div className="flex items-center gap-3 px-3 py-2.5">
              <button
                onClick={() => navigate("/profile")}
                className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[12px] font-bold text-white transition hover:ring-2 hover:ring-(--primary)/50"
                style={
                  !photoUrl
                    ? {
                        background:
                          "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
                        boxShadow: "0 0 8px 1px rgba(209,0,113,0.45)",
                      }
                    : undefined
                }
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-bold leading-tight text-primary-gradient">
                  {cachedProfile?.fullname ||
                    user?.email?.split("@")[0] ||
                    "User"}
                </div>
                <div className="truncate text-[10px] text-(--muted-foreground)">
                  {user?.email ?? ""}
                </div>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="shrink-0 rounded-md p-1 text-(--muted-foreground) transition hover:text-(--primary)"
                title="Profile"
              >
                <User size={13} />
              </button>
            </div>

            <div
              className="mx-3"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(209,0,113,0.25), transparent)",
              }}
            />

            <button
              onClick={logout}
              className="flex w-full items-center gap-2 px-3 py-2 text-[11px] font-medium text-rose-500/80 transition hover:bg-rose-500/10 hover:text-rose-500"
            >
              <LogOut size={12} />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-5 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--muted-foreground) transition hover:text-(--foreground) md:flex"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-(--border) bg-(--card) px-4 py-3 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-(--muted-foreground) transition hover:text-(--foreground)"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <img
            className="h-7 w-7 object-contain"
            src="/images/icons/logo.png"
            alt="Wafa Logo"
          />
          <span className="font-heading text-sm font-bold text-primary-gradient">
            Wafa Indonesia
          </span>
        </div>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{
            background:
              "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
          }}
        >
          {initials}
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-(--border) bg-(--card) transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "relative hidden h-screen flex-col border-r border-(--border) bg-(--card) transition-all duration-300 md:flex",
          collapsed ? "w-16" : "w-56",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
