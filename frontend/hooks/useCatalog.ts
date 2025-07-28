import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import {
  getCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductById,
  getCategoryByProductId,
  createProduct,
  updateProduct,
  activateProduct,
  disableProduct,
  assignCategoryToProduct,
  deleteProduct,
} from '@/lib/api/catalog';
import { CreateCategoryDto, CreateProductDto } from '@/types/dtos';
import { Category, Product } from '@/types/types';


interface ApiResponse {
  success: boolean;
  message?: string;
}

export const useCatalog = () => {
  const queryClient = useQueryClient();

  // Category Queries
  const categoriesQuery = useQuery<Category[], Error, Category[], QueryKey>({
    queryKey: ['categories'] as const,
    queryFn: getCategories,
    staleTime: 60000, // 1 minute cache
  });

  const categoryByIdQuery = (categoryId?: number) =>
    useQuery<Category, Error, Category, QueryKey>({
      queryKey: ['category', categoryId] as const,
      queryFn: () => getCategoryById(categoryId!),
      enabled: !!categoryId,
      staleTime: 60000,
    });

  const productsByCategoryQuery = (categoryId?: number) =>
    useQuery<Product[], Error, Product[], QueryKey>({
      queryKey: ['category', categoryId, 'products'] as const,
      queryFn: () => getProductsByCategory(categoryId!),
      enabled: !!categoryId,
      staleTime: 60000,
    });

  // Category Mutations
  const createCategoryMutation = useMutation<ApiResponse, Error, CreateCategoryDto>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error creating category:', error.message);
    },
  });

  const updateCategoryMutation = useMutation<
    ApiResponse,
    Error,
    { id: number; data: CreateCategoryDto }
  >({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
    },
    onError: (error) => {
      console.error('Error updating category:', error.message);
    },
  });

  const deleteCategoryMutation = useMutation<ApiResponse, Error, number>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error.message);
    },
  });

  // Product Queries
  const productsQuery = useQuery<Product[], Error, Product[], QueryKey>({
    queryKey: ['products'] as const,
    queryFn: getProducts,
    staleTime: 60000,
  });

  const productByIdQuery = (productId?: number) =>
    useQuery<Product, Error, Product, QueryKey>({
      queryKey: ['product', productId] as const,
      queryFn: () => getProductById(productId!),
      enabled: !!productId,
      staleTime: 60000,
    });

  const categoryByProductIdQuery = (productId?: number) =>
    useQuery<Category, Error, Category, QueryKey>({
      queryKey: ['product', productId, 'category'] as const,
      queryFn: () => getCategoryByProductId(productId!),
      enabled: !!productId,
      staleTime: 60000,
    });

  // Product Mutations
  const createProductMutation = useMutation<ApiResponse, Error, CreateProductDto>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error creating product:', error.message);
    },
  });

  const updateProductMutation = useMutation<
    ApiResponse,
    Error,
    { id: number; data: CreateProductDto }
  >({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
    onError: (error) => {
      console.error('Error updating product:', error.message);
    },
  });

  const activateProductMutation = useMutation<ApiResponse, Error, number>({
    mutationFn: activateProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
    onError: (error) => {
      console.error('Error activating product:', error.message);
    },
  });

  const disableProductMutation = useMutation<ApiResponse, Error, number>({
    mutationFn: disableProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
    onError: (error) => {
      console.error('Error disabling product:', error.message);
    },
  });

  const assignCategoryToProductMutation = useMutation<
    ApiResponse,
    Error,
    { productId: number; categoryId: number }
  >({
    mutationFn: ({ productId, categoryId }) => assignCategoryToProduct(productId, categoryId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId, 'category'] });
    },
    onError: (error) => {
      console.error('Error assigning category to product:', error.message);
    },
  });

  const deleteProductMutation = useMutation<ApiResponse, Error, number>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error deleting product:', error.message);
    },
  });

  return {
    // Category Queries
    categories: categoriesQuery.data,
    categoriesLoading: categoriesQuery.isLoading,
    categoriesError: categoriesQuery.error,
    categoryById: categoryByIdQuery,
    productsByCategory: productsByCategoryQuery,

    // Category Mutations
    createCategory: createCategoryMutation.mutate,
    createCategoryStatus: createCategoryMutation.status,
    createCategoryError: createCategoryMutation.error,

    updateCategory: updateCategoryMutation.mutate,
    updateCategoryStatus: updateCategoryMutation.status,
    updateCategoryError: updateCategoryMutation.error,

    deleteCategory: deleteCategoryMutation.mutate,
    deleteCategoryStatus: deleteCategoryMutation.status,
    deleteCategoryError: deleteCategoryMutation.error,

    // Product Queries
    products: productsQuery.data,
    productsLoading: productsQuery.isLoading,
    productsError: productsQuery.error,

    productById: productByIdQuery,
    categoryByProductId: categoryByProductIdQuery,

    // Product Mutations
    createProduct: createProductMutation.mutate,
    createProductStatus: createProductMutation.status,
    createProductError: createProductMutation.error,

    updateProduct: updateProductMutation.mutate,
    updateProductStatus: updateProductMutation.status,
    updateProductError: updateProductMutation.error,
    
    activateProduct: activateProductMutation.mutate,
    activateProductStatus: activateProductMutation.status,
    activateProductError: activateProductMutation.error,

    disableProduct: disableProductMutation.mutate,
    disableProductStatus: disableProductMutation.status,
    disableProductError: disableProductMutation.error,

    assignCategoryToProduct: assignCategoryToProductMutation.mutate,
    assignCategoryToProductStatus: assignCategoryToProductMutation.status,
    assignCategoryToProductError: assignCategoryToProductMutation.error,
    
    deleteProduct: deleteProductMutation.mutate,
    deleteProductStatus: deleteProductMutation.status,
    deleteProductError: deleteProductMutation.error,
  };
};