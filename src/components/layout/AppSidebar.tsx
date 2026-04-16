import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
  Users,
  Building2,
  Network,
  Shield,
  Calendar,
  Clock,
  ClipboardCheck,
  CalendarOff,
  Send,
  FileText,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

// LocalStorage key untuk menyimpan status collapse sidebar
const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const MAIN_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
];

const MASTER_DATA_NAV: NavItem[] = [
  { icon: Users, label: "Pegawai", path: "/employees" },
  { icon: Building2, label: "Cabang", path: "/branches" },
  { icon: Network, label: "Departemen", path: "/departments" },
  { icon: Shield, label: "Role", path: "/roles" },
  { icon: CalendarOff, label: "Jenis Cuti", path: "/leave-types" },
];

const JADWAL_NAV: NavItem[] = [
  { icon: Clock, label: "Shift", path: "/shifts" },
  { icon: Calendar, label: "Hari Libur", path: "/holidays" },
];

const KEHADIRAN_NAV: NavItem[] = [
  { icon: ClipboardCheck, label: "Presensi", path: "/attendance" },
  { icon: CalendarOff, label: "Cuti", path: "/leave" },
];

const PENGAJUAN_NAV: NavItem[] = [
  { icon: Send, label: "Pengajuan", path: "/requests" },
  { icon: FileText, label: "Laporan Harian", path: "/daily-reports" },
  { icon: BookOpen, label: "Mutaba'ah", path: "/mutabaah" },
];

export function AppSidebar() {
  const { user, logout, cachedProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Inisialisasi state collapsed dari localStorage
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  // Simpan status collapsed ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

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
      if (e.key === "Escape") {
        setMobileOpen(false);
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderNavItem = (item: NavItem, isActive: boolean) => {
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
  };

  const renderSection = (
    label: string,
    items: NavItem[],
    pathPrefix?: string,
  ) => (
    <>
      <div
        className={cn(
          "mt-3 mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-(--muted-foreground)",
          collapsed && "hidden",
        )}
      >
        {label}
      </div>
      {collapsed && <div className="my-1 mx-2 h-px bg-(--border)" />}
      {items.map((item) => {
        const isActive = pathPrefix
          ? location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/")
          : location.pathname === item.path;
        return renderNavItem(item, isActive);
      })}
    </>
  );

  const AvatarButton = ({
    onClick,
    size = "md",
  }: {
    onClick: () => void;
    size?: "sm" | "md";
  }) => {
    const dim = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-[12px]";
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white transition hover:ring-2 hover:ring-(--primary)/50",
          dim,
        )}
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
    );
  };

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
            <div className="text-[10px] text-(--muted-foreground) line-clamp-1">
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

      {/* Nav */}
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
          return renderNavItem(item, isActive);
        })}
        {renderSection("Master Data", MASTER_DATA_NAV, "prefix")}
        {renderSection("Jadwal", JADWAL_NAV)}
        {renderSection("Kehadiran", KEHADIRAN_NAV)}
        {renderSection("Pengajuan", PENGAJUAN_NAV)}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1 border-t border-(--border) p-2">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <AvatarButton onClick={() => navigate("/profile")} />
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
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
              <AvatarButton onClick={() => navigate("/profile")} />
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
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-[11px] font-medium text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
              >
                {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
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
        <div className="relative">
          <button
            onClick={() => setMobileProfileOpen((prev) => !prev)}
            className={cn(
              "flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-[10px] font-bold text-white transition hover:ring-2 hover:ring-(--primary)/50",
            )}
            style={
              !photoUrl
                ? {
                    background:
                      "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
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

          {/* Mobile Profile Popup */}
          {mobileProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMobileProfileOpen(false)}
              />
              <div
                className="absolute right-0 top-full mt-2 z-50 w-64 overflow-hidden rounded-xl border"
                style={{
                  borderColor: "rgba(209,0,113,0.25)",
                  background: "var(--card)",
                  boxShadow:
                    "0 10px 40px -10px rgba(0,0,0,0.35), 0 0 20px 0 rgba(209,0,113,0.15)",
                }}
              >
                <div
                  className="overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(209,0,113,0.08) 0%, rgba(221,13,137,0.04) 50%, rgba(209,0,113,0.06) 100%)",
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px] font-bold text-white"
                      style={
                        !photoUrl
                          ? {
                              background:
                                "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
                              boxShadow: "0 0 10px 2px rgba(209,0,113,0.45)",
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
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold leading-tight text-primary-gradient">
                        {cachedProfile?.fullname ||
                          user?.email?.split("@")[0] ||
                          "User"}
                      </div>
                      <div className="truncate text-xs text-(--muted-foreground)">
                        {user?.email ?? ""}
                      </div>
                    </div>
                  </div>

                  <div
                    className="mx-3"
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, rgba(209,0,113,0.25), transparent)",
                    }}
                  />

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setMobileProfileOpen(false);
                        navigate("/profile");
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-(--foreground) transition hover:bg-(--muted)"
                    >
                      <User size={16} className="text-(--primary)" />
                      <span>Profil Saya</span>
                    </button>

                    {/* Dark mode toggle in mobile popup */}
                    <button
                      onClick={toggleTheme}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-(--foreground) transition hover:bg-(--muted)"
                    >
                      {theme === "dark" ? (
                        <Sun size={16} className="text-amber-500" />
                      ) : (
                        <Moon size={16} className="text-indigo-500" />
                      )}
                      <span>
                        {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
                      </span>
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
                    onClick={() => {
                      setMobileProfileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-500/90 transition hover:bg-rose-500/10 hover:text-rose-500"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
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
