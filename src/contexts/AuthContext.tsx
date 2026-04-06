import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { parseJwt } from "@/lib/utils";
import { useDemo } from "@/contexts/DemoContext";
import { fetchProfile } from "@/lib/profile-api";
import type { JwtPayload } from "@/types/auth";

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  email: string;
}

/** Cached profile data stored in localStorage */
interface CachedProfile {
  fullname: string;
  photo_url: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  cachedProfile: CachedProfile | null;
  setToken: (token: string) => void;
  logout: () => void;
  refreshCachedProfile: () => Promise<void>;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";
const PROFILE_KEY = "profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedProfile, setCachedProfile] = useState<CachedProfile | null>(
    null,
  );
  const { isDemo, stopDemo } = useDemo();

  /** Fetch profile from API and cache to localStorage */
  const fetchAndCacheProfile = useCallback(async (jwt: string) => {
    try {
      const res = await fetchProfile(jwt);
      const profile: CachedProfile = {
        fullname: res.data.fullname,
        photo_url: res.data.photo_url,
      };
      setCachedProfile(profile);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Profile fetch failed — user may not have a profile yet
      // Clear cached profile
      setCachedProfile(null);
      localStorage.removeItem(PROFILE_KEY);
    }
  }, []);

  /** Refresh cached profile (callable from outside, e.g., after profile update) */
  const refreshCachedProfile = useCallback(async () => {
    const jwt = localStorage.getItem(TOKEN_KEY);
    if (jwt) {
      await fetchAndCacheProfile(jwt);
    }
  }, [fetchAndCacheProfile]);

  const processToken = useCallback(
    (jwt: string | null, shouldFetchProfile = false) => {
      if (!jwt) {
        setUser(null);
        setTokenState(null);
        setCachedProfile(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PROFILE_KEY);
        return;
      }

      const payload = parseJwt<JwtPayload>(jwt);
      if (!payload) {
        setUser(null);
        setTokenState(null);
        setCachedProfile(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PROFILE_KEY);
        return;
      }

      // Check expiry
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        setUser(null);
        setTokenState(null);
        setCachedProfile(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PROFILE_KEY);
        return;
      }

      setUser({
        id: payload.id,
        email: payload.email,
      });
      setTokenState(jwt);
      localStorage.setItem(TOKEN_KEY, jwt);

      // Fetch profile if this is a fresh login
      if (shouldFetchProfile) {
        fetchAndCacheProfile(jwt);
      }
    },
    [fetchAndCacheProfile],
  );

  // On mount, restore token from localStorage
  useEffect(() => {
    // Restore from localStorage
    const stored = localStorage.getItem(TOKEN_KEY);
    const storedProfile = localStorage.getItem(PROFILE_KEY);

    // Restore cached profile from localStorage
    if (storedProfile) {
      try {
        setCachedProfile(JSON.parse(storedProfile));
      } catch {
        localStorage.removeItem(PROFILE_KEY);
      }
    }

    processToken(stored, false);
    setIsLoading(false);
  }, [processToken]);

  const setToken = useCallback(
    (jwt: string) => {
      // Fresh login — fetch profile
      processToken(jwt, true);
    },
    [processToken],
  );

  const logout = useCallback(() => {
    processToken(null, false);
    if (isDemo) stopDemo();
  }, [processToken, isDemo, stopDemo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        cachedProfile,
        setToken,
        logout,
        refreshCachedProfile,
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
