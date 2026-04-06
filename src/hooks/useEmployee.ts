import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import type {
  Employee,
  EmployeeContact,
  EmployeeListParams,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  CreateContactPayload,
  UpdateContactPayload,
} from "@/types/employee";
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee as createEmployeeApi,
  updateEmployee as updateEmployeeApi,
  deleteEmployee as deleteEmployeeApi,
  fetchEmployeeContacts,
  createEmployeeContact as createContactApi,
  updateEmployeeContact as updateContactApi,
  deleteEmployeeContact as deleteContactApi,
} from "@/lib/employee-api";
import {
  getDummyEmployees,
  getDummyEmployeeById,
  getDummyEmployeeContacts,
} from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useEmployeeList — Fetch all employees with filters
// ════════════════════════════════════════════

export function useEmployeeList(params?: EmployeeListParams) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Employee[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data with client-side filtering
    if (isDemo) {
      setState({
        data: getDummyEmployees(params),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchEmployees(token, params)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch employees";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [token, isDemo, params?.branch_id, params?.is_active, params?.search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useEmployeeById — Fetch single employee
// ════════════════════════════════════════════

export function useEmployeeById(id: number | null) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Employee>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    // Demo mode: use dummy data
    if (isDemo) {
      const employee = getDummyEmployeeById(id);
      setState({
        data: employee || null,
        loading: false,
        error: employee ? null : "Pegawai tidak ditemukan",
      });
      return;
    }

    // Live mode: fetch from API
    if (!token) return;

    const reqId = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchEmployeeById(token, id)
      .then((res) => {
        if (reqId === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (reqId === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch employee";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [token, isDemo, id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useEmployeeContacts — Fetch contacts for an employee
// ════════════════════════════════════════════

export function useEmployeeContacts(employeeId: number | null) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<EmployeeContact[]>>({
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
        data: getDummyEmployeeContacts(employeeId),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchEmployeeContacts(token, employeeId)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch contacts";
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
// useEmployeeMutations — CRUD operations
// ════════════════════════════════════════════

export function useEmployeeMutations(onSuccess?: () => void) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createEmployee = useCallback(
    async (payload: CreateEmployeePayload) => {
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
        const res = await createEmployeeApi(token, payload);
        toast.success("Pegawai berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menambahkan pegawai";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const updateEmployee = useCallback(
    async (id: number, payload: UpdateEmployeePayload) => {
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
        const res = await updateEmployeeApi(token, id, payload);
        toast.success("Pegawai berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui pegawai";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const deleteEmployee = useCallback(
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
        await deleteEmployeeApi(token, id);
        toast.success("Pegawai berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus pegawai";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  return { loading, createEmployee, updateEmployee, deleteEmployee };
}

// ════════════════════════════════════════════
// useEmployeeContactMutations — Contact CRUD operations
// ════════════════════════════════════════════

export function useEmployeeContactMutations(onSuccess?: () => void) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createContact = useCallback(
    async (employeeId: number, payload: CreateContactPayload) => {
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
        const res = await createContactApi(token, employeeId, payload);
        toast.success("Kontak berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menambahkan kontak";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const updateContact = useCallback(
    async (contactId: number, payload: UpdateContactPayload) => {
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
        const res = await updateContactApi(token, contactId, payload);
        toast.success("Kontak berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui kontak";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const deleteContact = useCallback(
    async (contactId: number) => {
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
        await deleteContactApi(token, contactId);
        toast.success("Kontak berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus kontak";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  return { loading, createContact, updateContact, deleteContact };
}
