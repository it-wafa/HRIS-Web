import { useState, useEffect, useCallback } from "react";
import { useDemo } from "@/contexts/DemoContext";

import type { EmployeeProfile, EmployeeProfileContact } from "@/types/profile";
import { getDummyEmployeeProfile, getDummyProfileContacts } from "@/lib/dummy";

// ════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// HOOK: useEmployeeProfile
// Fetches employee profile data for the logged-in user
// ════════════════════════════════════════════

export function useEmployeeProfile() {
  const { isDemo } = useDemo();

  const [state, setState] = useState<AsyncState<EmployeeProfile>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    if (isDemo) {
      // Demo mode: return dummy data
      setState({
        data: getDummyEmployeeProfile(),
        loading: false,
        error: null,
      });
      return;
    }



    // TODO: Implement actual API call when backend is ready
    // For now, simulate loading state then show demo data
    setState((s) => ({ ...s, loading: true, error: null }));

    // Simulated API call - replace with actual fetch when ready
    setTimeout(() => {
      setState({
        data: getDummyEmployeeProfile(),
        loading: false,
        error: null,
      });
    }, 500);
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    ...state,
    refetch,
  };
}

// ════════════════════════════════════════════
// HOOK: useEmployeeProfileContacts
// Fetches contact information for the logged-in user
// ════════════════════════════════════════════

export function useEmployeeProfileContacts() {
  const { isDemo } = useDemo();

  const [state, setState] = useState<AsyncState<EmployeeProfileContact[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    if (isDemo) {
      // Demo mode: return dummy data
      setState({
        data: getDummyProfileContacts(),
        loading: false,
        error: null,
      });
      return;
    }



    // TODO: Implement actual API call when backend is ready
    // For now, simulate loading state then show demo data
    setState((s) => ({ ...s, loading: true, error: null }));

    // Simulated API call - replace with actual fetch when ready
    setTimeout(() => {
      setState({
        data: getDummyProfileContacts(),
        loading: false,
        error: null,
      });
    }, 500);
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    ...state,
    refetch,
  };
}
