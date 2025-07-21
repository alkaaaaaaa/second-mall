'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import type { Product, Category } from '@/types';
import productService from '@/lib/services/productService';

// 排序选项
const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'name', label: '按名称排序' },
];

// 默认品牌列表 - 将根据实际数据动态生成
const defaultBrands = ['全部', 'Apple', 'Samsung', 'Dell', 'Sony', 'Microsoft'];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  
  // 状态管理
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>(defaultBrands);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 从URL参数中获取搜索条件
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ? parseInt(searchParams.get('category') || '0') : 0);
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '全部');
  
  // 筛选和排序
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('default');
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);

  // 获取商品和分类数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 构建查询参数
        const query: any = {
          page: currentPage,
          size: itemsPerPage
        };
        
        if (selectedCategory > 0) {
          query.categoryId = selectedCategory;
        }
        
        if (searchTerm) {
          query.name = searchTerm;
        }
        
        if (sortBy === 'price-asc') {
          query.sortBy = 'price';
          query.sortOrder = 'asc';
        } else if (sortBy === 'price-desc') {
          query.sortBy = 'price';
          query.sortOrder = 'desc';
        } else if (sortBy === 'name') {
          query.sortBy = 'name';
          query.sortOrder = 'asc';
        }

        // 获取商品数据
        const productsData = await productService.getProducts(query);
        setProducts(productsData.list);
        setFilteredProducts(productsData.list);
        setTotalItems(productsData.total);
        
        // 获取分类数据
        const categoriesData = await productService.getCategories();
        // 添加"全部"选项到分类列表
        setCategories([{ id: 0, name: '全部', description: '所有商品', createdAt: '', updatedAt: '' }, ...categoriesData]);
        
        // 从商品数据中提取唯一的品牌列表
        const uniqueBrands = ['全部', ...new Set(productsData.list.map((p: Product) => p.brand).filter(Boolean))];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error('获取数据失败', err);
        setError('获取数据失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, selectedCategory, searchTerm, sortBy]);
  
  // 根据其他筛选条件进一步过滤商品（品牌和价格）
  useEffect(() => {
    // 品牌和价格筛选在前端进行，其他筛选在API调用时处理
    let result = [...products];
    
    // 按品牌筛选
    if (selectedBrand !== '全部') {
      result = result.filter(p => p.brand === selectedBrand);
    }
    
    // 按价格范围筛选
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    setFilteredProducts(result);
  }, [products, selectedBrand, priceRange]);
  
  // 计算总页数
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 搜索表单提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 重置为第一页
    setCurrentPage(1);
  };

  // 处理错误显示
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4 text-center">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">数据加载失败</h3>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <div className="flex justify-center">
            <Button onClick={() => window.location.reload()}>重试</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">浏览商品</h1>
          <p className="text-gray-600">发现最新的科技产品和热门好物</p>
        </div>
        
        {/* 搜索栏 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索商品名称、描述..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Button type="submit" className="w-full sm:w-auto">
              搜索
            </Button>
          </form>
        </div>
        
        {/* 主体内容 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧过滤栏 */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">分类</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`w-full text-left px-2 py-1.5 rounded ${
                        selectedCategory === category.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCurrentPage(1);
                      }}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">品牌</h3>
              <ul className="space-y-2">
                {brands.map((brand) => (
                  <li key={brand}>
                    <button
                      className={`w-full text-left px-2 py-1.5 rounded ${
                        selectedBrand === brand ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setCurrentPage(1);
                      }}
                    >
                      {brand}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">价格范围</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>￥{priceRange[0]}</span>
                  <span>￥{priceRange[1]}</span>
                </div>
                <div className="flex gap-4 flex-col">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">最低价格</label>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">最高价格</label>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1">
            {/* 顶部操作栏 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  共找到 <span className="font-semibold">{totalItems}</span> 件商品
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-600">排序:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 商品网格 */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">正在加载商品信息...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到商品</h3>
                <p className="text-gray-600">请尝试调整筛选条件</p>
              </div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // 显示当前页附近的页码
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageToShow}
                        variant={pageToShow === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载商品信息...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
