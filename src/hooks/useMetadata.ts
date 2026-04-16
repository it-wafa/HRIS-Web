import { useState, useEffect, useCallback } from "react";
import { useDemo } from "@/contexts/DemoContext";
import { fetchEmployeeMetadata } from "@/lib/employee-api";
import { fetchRoleMetadata } from "@/lib/role-api";
import { getDummyEmployeeMetadata } from "@/lib/dummy/employee.dummy";
import { getDummyRoleMetadata } from "@/lib/dummy/role.dummy";
import type { EmployeeMetadata } from "@/types/employee";
import type { RoleMetadata } from "@/types/role";

export function useEmployeeMetadata() {
  const { isDemo } = useDemo();
  const [data, setData] = useState<EmployeeMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (isDemo) {
      setData(getDummyEmployeeMetadata());
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchEmployeeMetadata()
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load metadata");
      })
      .finally(() => setLoading(false));
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useRoleMetadata() {
  const { isDemo } = useDemo();
  const [data, setData] = useState<RoleMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (isDemo) {
      setData(getDummyRoleMetadata());
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchRoleMetadata()
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load metadata");
      })
      .finally(() => setLoading(false));
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
