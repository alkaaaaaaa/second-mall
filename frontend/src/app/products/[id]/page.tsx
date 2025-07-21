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
import { Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

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
          const filteredRelated = relatedData.records.filter(p => p.id !== productInfo.id);
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

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddToCartLoading(true);
    try {
      addItem(product, quantity);
      // 显示成功提示（将来可以替换为 Toast 组件）
      alert(`已将 ${quantity} 件商品添加到购物车`);
    } catch (error) {
      console.error('添加到购物车失败:', error);
      alert('添加到购物车失败，请稍后重试');
    } finally {
      setAddToCartLoading(false);
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

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // 这里将来可以调用API保存收藏状态
    alert(isFavorite ? '已取消收藏' : '已添加到收藏');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      // 降级处理：复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('商品链接已复制到剪贴板');
    }
  };

  const getDiscountPercentage = () => {
    if (!product?.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
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
                  src={(product.images && product.images[selectedImage]) || product.mainImage || 'https://picsum.photos/600/600?random=1'}
                  alt={product.name}
                  fill
                  className="rounded-lg object-cover"
                  priority
                />
                {/* 折扣标签 */}
                {getDiscountPercentage() > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{getDiscountPercentage()}%
                  </div>
                )}
                {/* 库存状态 */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white text-xl font-semibold">已售罄</span>
                  </div>
                )}
              </div>
              {/* 缩略图列表 */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square border-2 rounded transition-colors ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
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
              {/* 商品标题和操作 */}
              <div className="flex justify-between items-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1 mr-4">
                  {product.name}
                </h1>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className={`p-2 ${isFavorite ? 'text-red-500 border-red-500' : 'text-gray-500'}`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="p-2 text-gray-500"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* 商品评分和销量 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">4.8 (128条评价)</span>
                </div>
                {product.salesCount && (
                  <span className="text-sm text-gray-600">
                    已售 {product.salesCount} 件
                  </span>
                )}
              </div>

              {/* 商品分类和品牌 */}
              <div className="flex items-center space-x-4 text-sm">
                {product.categoryName && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.categoryName}
                  </span>
                )}
                {product.brand && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* 价格区域 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center flex-wrap gap-3 mb-2">
                  <span className="text-3xl font-bold text-red-500">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        省 {formatPrice(product.originalPrice - product.price)}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    库存: {product.stock > 0 ? `${product.stock} 件` : '缺货'}
                  </span>
                  {product.salesCount && (
                    <span>月销: {product.salesCount} 件</span>
                  )}
                </div>
              </div>

              {/* 商品描述 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  商品描述
                </h3>
                <div className="text-gray-600 leading-relaxed">
                  <p className={`${!showFullDescription && product.description && product.description.length > 200 ? 'line-clamp-3' : ''}`}>
                    {product.description || '暂无商品描述'}
                  </p>
                  {product.description && product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 font-medium"
                    >
                      {showFullDescription ? '收起' : '展开全部'}
                    </button>
                  )}
                </div>
              </div>

              {/* 服务保障 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">服务保障</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Truck className="h-4 w-4 mr-2 text-blue-600" />
                    免费配送
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    正品保证
                  </div>
                  <div className="flex items-center text-gray-600">
                    <RotateCcw className="h-4 w-4 mr-2 text-orange-600" />
                    7天无理由退货
                  </div>
                </div>
              </div>

              {/* 购买操作 */}
              {product.stock > 0 ? (
                <div className="space-y-6 border-t pt-6">
                  {/* 数量选择 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">选择数量</span>
                      <span className="text-sm text-gray-500">库存 {product.stock} 件</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <div className="px-6 py-2 bg-gray-50 border-x-2 border-gray-200 min-w-[60px] text-center font-medium">
                          {quantity}
                        </div>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        小计: <span className="font-semibold text-red-500">{formatPrice(product.price * quantity)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 购买按钮 */}
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        size="lg"
                        className="flex-1 h-12 text-base font-medium border-2 hover:border-blue-500 hover:text-blue-600"
                        disabled={addToCartLoading}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {addToCartLoading ? '正在添加...' : '加入购物车'}
                      </Button>
                      <Button
                        onClick={handleBuyNow}
                        size="lg"
                        className="flex-1 h-12 text-base font-medium bg-red-500 hover:bg-red-600"
                        disabled={addToCartLoading}
                      >
                        立即购买
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      支持微信、支付宝、信用卡等多种支付方式
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-6">
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">😞</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">商品已售罄</h3>
                    <p className="text-gray-600 mb-4">该商品暂时缺货，请选择其他商品</p>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/products')}
                      className="px-6"
                    >
                      浏览其他商品
                    </Button>
                  </div>
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
