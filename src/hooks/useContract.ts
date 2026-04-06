import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import type {
  EmploymentContract,
  CreateContractPayload,
  UpdateContractPayload,
} from "@/types/contract";
import {
  fetchContracts,
  createContract as createContractApi,
  updateContract as updateContractApi,
  deleteContract as deleteContractApi,
} from "@/lib/contract-api";
import { getDummyContracts } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useContractList — Fetch contracts for an employee
// ════════════════════════════════════════════

export function useContractList(employeeId: number | null) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<EmploymentContract[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (!employeeId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyContracts(employeeId),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchContracts(token, employeeId)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch contracts";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [token, isDemo, employeeId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useContractMutations — CRUD operations
// ════════════════════════════════════════════

export function useContractMutations(onSuccess?: () => void) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createContract = useCallback(
    async (employeeId: number, payload: CreateContractPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      setLoading(true);
      try {
        const res = await createContractApi(token, employeeId, payload);
        toast.success("Kontrak berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menambahkan kontrak";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const updateContract = useCallback(
    async (id: number, payload: UpdateContractPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      setLoading(true);
      try {
        const res = await updateContractApi(token, id, payload);
        toast.success("Kontrak berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui kontrak";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const deleteContract = useCallback(
    async (id: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }
      if (!token) {
        toast.error("Authentication required");
        return false;
      }

      setLoading(true);
      try {
        await deleteContractApi(token, id);
        toast.success("Kontrak berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus kontrak";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  return { loading, createContract, updateContract, deleteContract };
}
