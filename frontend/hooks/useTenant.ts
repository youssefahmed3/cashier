"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getTenantById,
  getSubscriptionStatus,
  getActiveTenants,
  getTenantWithBranches,
  createNewTenant,
  updateTenant,
  deleteTenant,
  getAllUserTenantMappings,
  getUserTenant,
  assignUserToTenant,
  updateUserTenant,
  getAllTenantWithPagination,
} from "@/lib/api/tenant";
import {
  CreateTenantDto,
  UpdateTenantDto,
} from "@/types/dtos";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { Tenant } from "@/types/types";

const getToken = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
};

export const useTenant = () => {
  const queryClient = useQueryClient();
  const token = getToken();
  const { user } = useAuth();

  // Queries

  const tenantByIdQuery = (tenantId: string) =>
    useQuery({
      queryKey: ["tenant", tenantId],
      queryFn: () => getTenantById(tenantId, token),
      enabled: !!tenantId,
      staleTime: 60000, // 1 minute cache
    });

  const tenantSubscriptionStatusQuery = (id: string) =>
    useQuery({
      queryKey: ["tenant", id, "subscription"],
      queryFn: () => getSubscriptionStatus(id, token),
      enabled: !!id,
      staleTime: 60000, // 1 minute cache
    });

  const tenantWithBranchesQuery = (tenantId: string) =>
    useQuery({
      queryKey: ["tenant", tenantId, "with-branches"],
      queryFn: () => getTenantWithBranches(tenantId, token),
      enabled: !!tenantId,
      staleTime: 60000, // 1 minute cache
    });

  const activeTenantsQuery = useQuery<Tenant[]>({
    queryKey: ["tenants", "active"],
    queryFn: async () => await getActiveTenants(token),
    staleTime: 60000, // 1 minute cache

  });

  const allUserTenantMappingsQuery = useQuery({
    queryKey: ["user-tenant-mappings"],
    queryFn: async () => await getAllUserTenantMappings(token),
    staleTime: 60000, // 1 minute cache

  });

  const getAllTenantWithPaginationQuery = useQuery({
    queryKey: ["tenants", "paginated"],
    queryFn: async () => await getAllTenantWithPagination(token),
        staleTime: 60000, // 1 minute cache

  })

  const userTenantQuery = (userId: number) =>
    useQuery({
      queryKey: ["user", userId, "tenant"],
      queryFn: () => getUserTenant(userId, token),
      enabled: !!userId,
          staleTime: 60000, // 1 minute cache

    });

  // Mutations

  const createTenantMutation = useMutation({
    mutationFn: (data: CreateTenantDto) => createNewTenant(token, data),
    onSuccess: () => {
      toast.success("Tenant created successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants", "active"] });
    },
    onError: () => toast.error("Failed to create tenant"),

  });

  const updateTenantMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantDto }) =>
      updateTenant(data, id, token),
    onSuccess: (_, { id }) => {
      toast.success("Tenant updated");
      queryClient.invalidateQueries({ queryKey: ["tenant", id] });
      queryClient.invalidateQueries({ queryKey: ["tenants", "active"] });
    },
    onError: () => toast.error("Failed to update tenant"),
  });

  const deleteTenantMutation = useMutation({
    mutationFn: (id: string) => deleteTenant(id, token),
    onSuccess: () => {
      toast.success("Tenant deleted");
      queryClient.invalidateQueries({ queryKey: ["tenants", "active"] });
    },
    onError: () => toast.error("Failed to delete tenant"),
  });

  const assignUserToTenantMutation = useMutation({
    mutationFn: ({ userId, tenantId }: { userId: number; tenantId: string }) =>
      assignUserToTenant(userId, tenantId, token),
    onSuccess: () => {
      toast.success("User assigned to tenant");
      queryClient.invalidateQueries({ queryKey: ["user-tenant-mappings"] });
    },
    onError: () => toast.error("Failed to assign user to tenant"),
  });

  const updateUserTenantMutation = useMutation({
    mutationFn: ({ userId, tenantId }: { userId: string; tenantId: string }) =>
      updateUserTenant(userId, tenantId, token),
    onSuccess: () => {
      toast.success("User tenant updated");
      queryClient.invalidateQueries({ queryKey: ["user-tenant-mappings"] });
    },
    onError: () => toast.error("Failed to update user tenant"),
  });


  return {
    // Queries
    tenantByIdQuery,
    tenantSubscriptionStatusQuery,
    tenantWithBranchesQuery,
    activeTenantsQuery,
    allUserTenantMappingsQuery,
    userTenantQuery,
    getAllTenantWithPagination: getAllTenantWithPaginationQuery.data,
    getAllTenantWithPaginationLoading: getAllTenantWithPaginationQuery.isLoading,

    // Mutations
    createTenantMutation,
    updateTenantMutation,
    deleteTenantMutation,
    assignUserToTenantMutation,
    updateUserTenantMutation,
  };
};
