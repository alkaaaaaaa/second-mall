// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 商品相关类型
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  categoryId: number;
  category?: Category;
  brand?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 商品分类类型
export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

// 购物车项目类型
export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  selectedSku?: string;
}

// 订单相关类型
export interface Order {
  id: number;
  userId: number;
  orderNo: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  selectedSku?: string;
}

// 地址类型
export interface Address {
  id: number;
  userId: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页响应类型
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求类型
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// JWT token响应类型
export interface AuthResponse {
  token: string;
  user: User;
} 