'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import type { Product, Category } from '@/types';

// 模拟数据
const featuredProducts: Product[] = [
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
];

const categories: Category[] = [
  { id: 1, name: '手机', description: '智能手机', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 2, name: '电脑', description: '笔记本电脑', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 3, name: '耳机', description: '音频设备', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 4, name: '平板', description: '平板电脑', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 5, name: '智能手表', description: '可穿戴设备', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 6, name: '家电', description: '智能家电', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

const banners = [
  { id: 1, image: 'https://picsum.photos/1200/400?random=10', title: '新品上市', subtitle: '限时优惠' },
  { id: 2, image: 'https://picsum.photos/1200/400?random=11', title: '品质保证', subtitle: '正品行货' },
  { id: 3, image: 'https://picsum.photos/1200/400?random=12', title: '快速配送', subtitle: '当日达' },
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
