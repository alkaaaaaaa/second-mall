'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import productService from '@/lib/services/productService';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id as string;

  // 获取商品详情
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productInfo = await productService.getProductById(Number(productId));
        setProduct(productInfo);
        
        // 获取相关商品（同分类的其他商品）
        if (productInfo.categoryId) {
          const query = {
            page: 1,
            size: 4,
            categoryId: productInfo.categoryId
          };
          const relatedData = await productService.getProducts(query);
          // 过滤掉当前商品
          const filteredRelated = relatedData.list.filter(p => p.id !== productInfo.id);
          setRelatedProducts(filteredRelated);
        }
      } catch (err) {
        console.error('获取商品详情失败', err);
        setError('获取商品信息失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // 显示成功提示
      alert('商品已添加到购物车');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      // 重定向到登录页面
      alert('请先登录');
      router.push('/auth/login');
      return;
    }
    
    if (product) {
      addItem(product, quantity);
      // 导航到购物车页面
      router.push('/cart');
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString('zh-CN')}`;
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">正在加载商品信息...</p>
          </div>
        </div>
      </div>
    );
  }

  // 显示错误状态
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4 text-center">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              {error || '找不到该商品'}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {error ? '请稍后重试' : '该商品可能已下架或不存在'}
            </p>
            <div className="flex justify-center">
              <Button onClick={() => router.push('/products')}>返回商品列表</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-blue-600">
            首页
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href="/products" className="text-gray-500 hover:text-blue-600">
            全部商品
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* 商品详情 */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 图片展示区 */}
            <div className="lg:w-1/2">
              <div className="mb-4 relative aspect-square">
                <Image
                  src={product.images[selectedImage] || 'https://picsum.photos/600/600?random=1'}
                  alt={product.name}
                  fill
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
              {/* 缩略图列表 */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square border-2 rounded ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="rounded object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 商品信息区 */}
            <div className="lg:w-1/2 space-y-6">
              {/* 商品标题 */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* 品牌信息 */}
              {product.brand && (
                <div className="flex items-center">
                  <span className="text-gray-600">品牌:</span>
                  <span className="ml-2 text-gray-900 font-medium">{product.brand}</span>
                </div>
              )}

              {/* 价格区域 */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-3xl font-bold text-red-500">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                      省 {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* 库存状态 */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">库存:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} 件` : '缺货'}
                </span>
              </div>

              {/* 商品描述 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">商品描述</h3>
                <div className="text-gray-600 whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* 购买操作 */}
              {product.stock > 0 && (
                <div className="space-y-4">
                  {/* 数量选择 */}
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">数量:</span>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      (最多 {product.stock} 件)
                    </span>
                  </div>

                  {/* 购买按钮 */}
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      加入购物车
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      size="lg"
                      className="flex-1"
                    >
                      立即购买
                    </Button>
                  </div>
                </div>
              )}

              {product.stock === 0 && (
                <div className="text-center py-4">
                  <Button disabled size="lg" className="w-full">
                    暂时缺货
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 相关商品推荐 */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关商品推荐</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
