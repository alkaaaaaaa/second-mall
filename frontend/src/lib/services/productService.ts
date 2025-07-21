import { apiClient } from '../api';
import type { Product, PageResponse, Category } from '@/types';

export interface ProductQuery {
  page?: number;
  size?: number;
  categoryId?: number;
  name?: string;
  sortBy?: string;
  sortOrder?: string;
}

const productService = {
  /**
   * 获取商品列表
   */
  getProducts: async (query: ProductQuery) => {
    // 将查询参数转换为符合Record<string, unknown>的对象
    const params: Record<string, unknown> = {};
    if (query.page !== undefined) params.page = query.page;
    if (query.size !== undefined) params.size = query.size;
    if (query.categoryId !== undefined) params.categoryId = query.categoryId;
    if (query.name !== undefined) params.name = query.name;
    if (query.sortBy !== undefined) params.sortBy = query.sortBy;
    if (query.sortOrder !== undefined) params.sortOrder = query.sortOrder;
    
    const response = await apiClient.get<PageResponse<Product>>('/api/products', params);
    return response.data.data;
  },

  /**
   * 获取商品详情
   */
  getProductById: async (id: number) => {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data.data;
  },

  /**
   * 获取热销商品
   */
  getFeaturedProducts: async (limit: number = 8) => {
    const response = await apiClient.get<PageResponse<Product>>('/api/products/featured', { limit });
    return response.data.data;
  },

  /**
   * 获取所有分类（获取顶级分类）
   */
  getCategories: async () => {
    const response = await apiClient.get<Category[]>('/api/categories/top');
    return response.data.data;
  },
};

export default productService;
