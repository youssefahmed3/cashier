import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import {
  createNewInventory,
  createNewInventoryWithIntegration,
  getAllInventory,
  getInventoryById,
  getLowStock,
  getInventoryProductsByProductId,
  updateInventoryQuantity,
  updateInventory,
  deleteInventoryById,
} from '@/lib/api/inventory';
import { CreateInventoryDto, UpdateInventoryDto } from '@/types/dtos';

interface ApiResponse {
  success: boolean;
  message?: string;
}

export const useInventory = () => {
  const queryClient = useQueryClient();

  const getToken = (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") ?? "";
  };

  const token = getToken();

  // Inventory Queries
  const inventoryQuery = useQuery({
    queryKey: ['inventory'],
    queryFn: () => getAllInventory(token),
    enabled: !!token,
    staleTime: 60000,
  });

  const inventoryByIdQuery = (id?: string) =>
    useQuery({
      queryKey: ['inventory', id],
      queryFn: () => getInventoryById(id!, token),
      enabled: !!id && !!token,
      staleTime: 60000,
    });

  const lowStockQuery = (threshold: number) =>
    useQuery({
      queryKey: ['inventory', 'low-stock', threshold],
      queryFn: () => getLowStock(token, threshold),
      enabled: !!token,
      staleTime: 60000,
    });

  const inventoryByProductIdQuery = (productId?: number) =>
    useQuery({
      queryKey: ['inventory', 'product', productId],
      queryFn: () => getInventoryProductsByProductId(token, productId!),
      enabled: !!productId && !!token,
      staleTime: 60000,
    });

  // Inventory Mutations
  const createInventoryMutation = useMutation<ApiResponse, Error, CreateInventoryDto>({
    mutationFn: (data) => createNewInventory(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      console.error('Error creating inventory:', error.message);
    },
  });

  const createInventoryWithIntegrationMutation = useMutation<ApiResponse, Error, CreateInventoryDto>({
    mutationFn: (data) => createNewInventoryWithIntegration(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      console.error('Error creating inventory with integration:', error.message);
    },
  });

  const updateInventoryQuantityMutation = useMutation<ApiResponse, Error, { id: number; quantity: number }>({
    mutationFn: ({ id, quantity }) => updateInventoryQuantity(token, id, quantity),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', id.toString()] });
    },
    onError: (error) => {
      console.error('Error updating inventory quantity:', error.message);
    },
  });

  const updateInventoryMutation = useMutation<ApiResponse, Error, { id: number; data: UpdateInventoryDto }>({
    mutationFn: ({ id, data }) => updateInventory(token, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', id.toString()] });
    },
    onError: (error) => {
      console.error('Error updating inventory:', error.message);
    },
  });

  const deleteInventoryMutation = useMutation<ApiResponse, Error, string>({
    mutationFn: (id) => deleteInventoryById(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      console.error('Error deleting inventory:', error.message);
    },
  });

  return {
    // Inventory Queries
    inventory: inventoryQuery.data,
    inventoryLoading: inventoryQuery.isLoading,
    inventoryError: inventoryQuery.error,
    inventoryById: inventoryByIdQuery,
    lowStock: lowStockQuery,
    inventoryByProductId: inventoryByProductIdQuery,

    // Inventory Mutations
    createInventory: createInventoryMutation.mutate,
    createInventoryStatus: createInventoryMutation.status,
    createInventoryError: createInventoryMutation.error,

    createInventoryWithIntegration: createInventoryWithIntegrationMutation.mutate,
    createInventoryWithIntegrationStatus: createInventoryWithIntegrationMutation.status,
    createInventoryWithIntegrationError: createInventoryWithIntegrationMutation.error,

    updateInventoryQuantity: updateInventoryQuantityMutation.mutate,
    updateInventoryQuantityStatus: updateInventoryQuantityMutation.status,
    updateInventoryQuantityError: updateInventoryQuantityMutation.error,

    updateInventory: updateInventoryMutation.mutate,
    updateInventoryStatus: updateInventoryMutation.status,
    updateInventoryError: updateInventoryMutation.error,

    deleteInventory: deleteInventoryMutation.mutate,
    deleteInventoryStatus: deleteInventoryMutation.status,
    deleteInventoryError: deleteInventoryMutation.error,
  };
};
