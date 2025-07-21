'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import type { Product, Category } from '@/types';

// 模拟数据
const allProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: '强悍的 A17 Pro 芯片。超长电池续航。采用钛金属设计。',
    price: 9999,
    originalPrice: 10999,
    stock: 50,
    images: ['https://picsum.photos/400/400?random=1'],
    categoryId: 1,
    brand: 'Apple',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'MacBook Pro 14英寸',
    description: '搭载 M3 芯片的 MacBook Pro，性能提升显著。',
    price: 14999,
    originalPrice: 15999,
    stock: 30,
    images: ['https://picsum.photos/400/400?random=2'],
    categoryId: 2,
    brand: 'Apple',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 3,
    name: 'AirPods Pro',
    description: '主动降噪，沉浸式音效体验。',
    price: 1999,
    stock: 100,
    images: ['https://picsum.photos/400/400?random=3'],
    categoryId: 3,
    brand: 'Apple',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 4,
    name: 'iPad Air',
    description: '轻薄设计，强大性能，适合创作和娱乐。',
    price: 4399,
    originalPrice: 4799,
    stock: 25,
    images: ['https://picsum.photos/400/400?random=4'],
    categoryId: 4,
    brand: 'Apple',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 5,
    name: 'Samsung Galaxy S24',
    description: '旗舰级拍照体验，AI智能助手。',
    price: 7999,
    stock: 40,
    images: ['https://picsum.photos/400/400?random=5'],
    categoryId: 1,
    brand: 'Samsung',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 6,
    name: 'Dell XPS 13',
    description: '轻薄便携，商务办公首选。',
    price: 8999,
    originalPrice: 9999,
    stock: 20,
    images: ['https://picsum.photos/400/400?random=6'],
    categoryId: 2,
    brand: 'Dell',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 7,
    name: 'Sony WH-1000XM5',
    description: '业界领先的降噪技术，高品质音效。',
    price: 2399,
    stock: 60,
    images: ['https://picsum.photos/400/400?random=7'],
    categoryId: 3,
    brand: 'Sony',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 8,
    name: 'Surface Pro 9',
    description: '二合一设计，工作娱乐两不误。',
    price: 7599,
    stock: 35,
    images: ['https://picsum.photos/400/400?random=8'],
    categoryId: 4,
    brand: 'Microsoft',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const categories: Category[] = [
  { id: 0, name: '全部', description: '所有商品', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 1, name: '手机', description: '智能手机', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 2, name: '电脑', description: '笔记本电脑', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 3, name: '耳机', description: '音频设备', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 4, name: '平板', description: '平板电脑', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

const brands = ['全部', 'Apple', 'Samsung', 'Dell', 'Sony', 'Microsoft'];
const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'name', label: '按名称排序' },
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<string>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const productsPerPage = 8;

  // 从URL参数中获取分类
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(parseInt(category));
    }
  }, [searchParams]);

  // 筛选和排序产品
  useEffect(() => {
    let filtered = [...allProducts];

    // 按分类筛选
    if (selectedCategory !== 0) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // 按品牌筛选
    if (selectedBrand !== '全部') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // 按价格筛选
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // 按搜索词筛选
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 排序
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // 默认排序保持原有顺序
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // 重置到第一页
  }, [selectedCategory, selectedBrand, sortBy, priceRange, searchQuery]);

  // 分页计算
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏筛选 */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* 搜索 */}
              <div>
                <h3 className="font-semibold mb-3">搜索商品</h3>
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入商品名称..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </form>
              </div>

              {/* 商品分类 */}
              <div>
                <h3 className="font-semibold mb-3">商品分类</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 品牌筛选 */}
              <div>
                <h3 className="font-semibold mb-3">品牌</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 价格区间 */}
              <div>
                <h3 className="font-semibold mb-3">价格区间</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      placeholder="最低价"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 20000])}
                      placeholder="最高价"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
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
                  共找到 <span className="font-semibold">{filteredProducts.length}</span> 件商品
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
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentProducts.map((product) => (
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
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
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