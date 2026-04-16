import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDemo } from "@/contexts/DemoContext";
import { fetchProfile } from "@/lib/profile-api";
import { refreshTokenApi, logoutApi } from "@/lib/api";
import type { LoginAccount, LoginResponse } from "@/types/auth";

// ============================================
// TYPES
// ============================================

/** Cached profile data stored in localStorage */
interface CachedProfile {
  fullname: string;
  photo_url: string;
}

interface AuthContextType {
  user: LoginAccount | null;
  permissions: string[];
  token: string | null;
  refreshTokenStr: string | null;
  isLoading: boolean;
  cachedProfile: CachedProfile | null;
  setAuthData: (data: LoginResponse) => void;
  logout: () => void;
  refreshCachedProfile: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";
const REFRESH_KEY = "refresh_token";
const ACCOUNT_KEY = "account";
const PERMISSIONS_KEY = "permissions";
const PROFILE_KEY = "profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginAccount | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [token, setTokenState] = useState<string | null>(null);
  const [refreshTokenStr, setRefreshTokenStr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedProfile, setCachedProfile] = useState<CachedProfile | null>(
    null,
  );
  const { isDemo, stopDemo } = useDemo();

  /** Fetch profile from API and cache to localStorage */
  const fetchAndCacheProfile = useCallback(async () => {
    try {
      const res = await fetchProfile();
      const profile: CachedProfile = {
        fullname: res.data.full_name, // Assumes fetchProfile updated to new API models
        photo_url: res.data.photo_url || "",
      };
      setCachedProfile(profile);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      setCachedProfile(null);
      localStorage.removeItem(PROFILE_KEY);
    }
  }, []);

  /** Refresh cached profile */
  const refreshCachedProfile = useCallback(async () => {
    const jwt = localStorage.getItem(TOKEN_KEY);
    if (jwt) {
      await fetchAndCacheProfile();
    }
  }, [fetchAndCacheProfile]);

  const processToken = useCallback(
    (
      jwt: string | null,
      refresh: string | null,
      accountObj: LoginAccount | null,
      perms: string[] | null,
      shouldFetchProfile = false,
    ) => {
      if (!jwt) {
        setUser(null);
        setPermissions([]);
        setTokenState(null);
        setRefreshTokenStr(null);
        setCachedProfile(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(ACCOUNT_KEY);
        localStorage.removeItem(PERMISSIONS_KEY);
        localStorage.removeItem(PROFILE_KEY);
        return;
      }

      setUser(accountObj);
      setPermissions(perms || []);
      setTokenState(jwt);
      setRefreshTokenStr(refresh);
      localStorage.setItem(TOKEN_KEY, jwt);
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
      if (accountObj) localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accountObj));
      if (perms) localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(perms));

      // Fetch profile if this is a fresh login
      if (shouldFetchProfile) {
        fetchAndCacheProfile();
      }
    },
    [fetchAndCacheProfile],
  );

  // On mount, restore token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedRefresh = localStorage.getItem(REFRESH_KEY);
    const storedAccountRaw = localStorage.getItem(ACCOUNT_KEY);
    const storedPermsRaw = localStorage.getItem(PERMISSIONS_KEY);
    const storedProfile = localStorage.getItem(PROFILE_KEY);

    let storedAccount = null;
    let storedPerms = null;

    if (storedAccountRaw) {
      try {
        storedAccount = JSON.parse(storedAccountRaw);
      } catch (e) {
        /* empty */
      }
    }
    
    if (storedPermsRaw) {
      try {
        storedPerms = JSON.parse(storedPermsRaw);
      } catch (e) {
        /* empty */
      }
    }

    if (storedProfile) {
      try {
        setCachedProfile(JSON.parse(storedProfile));
      } catch {
        localStorage.removeItem(PROFILE_KEY);
      }
    }

    processToken(storedToken, storedRefresh, storedAccount, storedPerms, false);
    setIsLoading(false);
  }, [processToken]);

  const setAuthData = useCallback(
    (data: LoginResponse) => {
      processToken(data.token, data.refresh, data.account, data.permissions, true);
    },
    [processToken],
  );

  const logout = useCallback(() => {
    // Call backend logout to invalidate tokens (fire-and-forget)
    if (!isDemo) {
      logoutApi().catch(() => {
        // Ignore errors — we're clearing local state regardless
      });
    }
    processToken(null, null, null, null, false);
    if (isDemo) stopDemo();
  }, [processToken, isDemo, stopDemo]);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const currentRefresh = localStorage.getItem(REFRESH_KEY);
    if (!currentRefresh) return false;
    try {
      const res = await refreshTokenApi(currentRefresh);
      if (res.status) {
        setTokenState(res.data.token);
        setRefreshTokenStr(res.data.refresh);
        localStorage.setItem(TOKEN_KEY, res.data.token);
        localStorage.setItem(REFRESH_KEY, res.data.refresh);
        return true;
      }
      return false;
    } catch {
      logout();
      return false;
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        token,
        refreshTokenStr,
        isLoading,
        cachedProfile,
        setAuthData,
        logout,
        refreshCachedProfile,
        refreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

