'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import productService from '@/lib/services/productService';
import type { Product, Category } from '@/types';
// 轮播图数据（可以保留为静态数据，或将来从API获取）

// 轮播图数据（保留为静态数据）

const banners = [
  { id: 1, image: 'https://picsum.photos/1200/400?random=10', title: '新品上市', subtitle: '限时优惠' },
  { id: 2, image: 'https://picsum.photos/1200/400?random=11', title: '品质保证', subtitle: '正品行货' },
  { id: 3, image: 'https://picsum.photos/1200/400?random=12', title: '快速配送', subtitle: '当日达' },
];

export default function Home() {
  // 状态定义
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    // 自动轮播定时器
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    // 获取首页数据
    const fetchHomePageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 获取热销商品
        const featuredData = await productService.getFeaturedProducts();
        console.log('获取到的热销商品数据:', featuredData);
        setFeaturedProducts(featuredData?.records || []);
        
        // 获取分类列表
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('获取首页数据失败', err);
        setError('无法加载首页数据，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomePageData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 轮播图 */}
      <section className="relative h-96 overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner, _index) => (
            <div 
              key={banner.id}
              className="w-full h-full flex-shrink-0 relative"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-xl mb-6">{banner.subtitle}</p>
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    立即购买
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 轮播指示器 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentBanner ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* 分类导航 */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">商品分类</h2>
          
          {loading && categories.length === 0 ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                重新加载
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group"
                >
                  <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors">
                    <div className="text-4xl mb-2">📱</div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 特色商品 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">热销商品</h2>
            <Link href="/products">
              <Button variant="outline">
                查看更多 →
              </Button>
            </Link>
          </div>
          
          {loading && featuredProducts.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                重新加载
              </Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>暂无热销商品</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 优势特色 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">快速配送</h3>
              <p className="text-gray-600">全国包邮，次日达服务</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">品质保证</h3>
              <p className="text-gray-600">正品行货，品质保障</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="text-xl font-semibold mb-2">贴心服务</h3>
              <p className="text-gray-600">7天无理由退换货</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
