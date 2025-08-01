"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAllBranchesPaginated,
  getAllTenantBranches,
  getAllTenantBranchesCount,
  getBranchById,
  getTenantBranchById,
  createNewBranch,
  updateBranch,
  updateBranchById,
  deleteBranchById,
  deleteBranch,
} from "@/lib/api/branch";

import { CreateBranchDto } from "@/types/dtos";
import { toast } from "sonner";

// Local token retriever
const getToken = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
};

export const useBranch = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  // Queries

  const allBranchesPaginatedQuery = useQuery({
    queryKey: ["branches", "paginated"],
    queryFn: () => getAllBranchesPaginated(token),
  });

  const tenantBranchesQuery = (tenantId: string) =>
    useQuery({
      queryKey: ["tenant", tenantId, "branches"],
      queryFn: () => getAllTenantBranches(tenantId, token),
      enabled: !!tenantId,
    });

  const tenantBranchesCountQuery = (tenantId: string) =>
    useQuery({
      queryKey: ["tenant", tenantId, "branches-count"],
      queryFn: () => getAllTenantBranchesCount(tenantId, token),
      enabled: !!tenantId,
    });

  const branchByIdQuery = (branchId: string) =>
    useQuery({
      queryKey: ["branch", branchId],
      queryFn: () => getBranchById(branchId, token),
      enabled: !!branchId,
    });

  const tenantBranchByIdQuery = (tenantId: string, branchId: string) =>
    useQuery({
      queryKey: ["tenant", tenantId, "branch", branchId],
      queryFn: () => getTenantBranchById(tenantId, branchId, token),
      enabled: !!tenantId && !!branchId,
    });

  // Mutations

  const createBranchMutation = useMutation({
    mutationFn: ({
      tenantId,
      data,
    }: {
      tenantId: string;
      data: CreateBranchDto;
    }) => createNewBranch(tenantId, token, data),
    onSuccess: (_, { tenantId }) => {
      toast.success("Branch created");
      queryClient.invalidateQueries({
        queryKey: ["tenant", tenantId, "branches"],
      });
    },
    onError: () => toast.error("Failed to create branch"),
  });

  const updateBranchMutation = useMutation({
    mutationFn: ({
      tenantId,
      branchId,
      data,
    }: {
      tenantId: string;
      branchId: string;
      data: CreateBranchDto;
    }) => updateBranch(data, tenantId, branchId, token),
    onSuccess: (_, { tenantId, branchId }) => {
      toast.success("Branch updated");
      queryClient.invalidateQueries({
        queryKey: ["tenant", tenantId, "branch", branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tenant", tenantId, "branches"],
      });
    },
    onError: () => toast.error("Failed to update branch"),
  });

  const updateBranchByIdMutation = useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: string;
      data: CreateBranchDto;
    }) => updateBranchById(branchId, token, data),
    onSuccess: (_, { branchId }) => {
      toast.success("Branch updated");
      queryClient.invalidateQueries({ queryKey: ["branch", branchId] });
    },
    onError: () => toast.error("Failed to update branch"),
  });

  const deleteBranchMutation = useMutation({
    mutationFn: ({
      tenantId,
      branchId,
    }: {
      tenantId: string;
      branchId: string;
    }) => deleteBranch(tenantId, branchId, token),
    onSuccess: (_, { tenantId }) => {
      toast.success("Branch deleted");
      queryClient.invalidateQueries({
        queryKey: ["tenant", tenantId, "branches"],
      });
    },
    onError: () => toast.error("Failed to delete branch"),
  });

  const deleteBranchByIdMutation = useMutation({
    mutationFn: (branchId: string) => deleteBranchById(branchId, token),
    onSuccess: () => {
      toast.success("Branch deleted");
      queryClient.invalidateQueries({ queryKey: ["branches", "paginated"] });
    },
    onError: () => toast.error("Failed to delete branch"),
  });

  return {
    // Queries
    allBranchesPaginatedQuery,
    tenantBranchesQuery,
    tenantBranchesCountQuery,
    branchByIdQuery,
    tenantBranchByIdQuery,

    // Mutations
    createBranchMutation,
    updateBranchMutation,
    updateBranchByIdMutation,
    deleteBranchMutation,
    deleteBranchByIdMutation,
  };
};
