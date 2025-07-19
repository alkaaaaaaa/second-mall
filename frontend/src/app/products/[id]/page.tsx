'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import type { Product } from '@/types';

// 模拟数据
const productData: Record<string, Product> = {
  '1': {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: '强悍的 A17 Pro 芯片。超长电池续航。采用钛金属设计。\n\n主要特性：\n• A17 Pro 芯片，性能提升显著\n• ProRes 视频录制\n• 专业级相机系统\n• 钛金属材质，更轻更坚固\n• 支持 Action Button',
    price: 9999,
    originalPrice: 10999,
    stock: 50,
    images: [
      'https://picsum.photos/600/600?random=1',
      'https://picsum.photos/600/600?random=11',
      'https://picsum.photos/600/600?random=21',
      'https://picsum.photos/600/600?random=31',
    ],
    categoryId: 1,
    brand: 'Apple',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  '2': {
    id: 2,
    name: 'MacBook Pro 14英寸',
    description: '搭载 M3 芯片的 MacBook Pro，性能提升显著。\n\n主要特性：\n• M3 芯片，8核CPU，10核GPU\n• 14英寸 Liquid Retina XDR 显示屏\n• 最长18小时电池续航\n• 雷雳4端口\n• 1080p FaceTime高清摄像头',
    price: 14999,
    originalPrice: 15999,
    stock: 30,
    images: [
      'https://picsum.photos/600/600?random=2',
      'https://picsum.photos/600/600?random=12',
      'https://picsum.photos/600/600?random=22',
    ],
    categoryId: 2,
    brand: 'Apple',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
};

const relatedProducts: Product[] = [
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
    name: 'Apple Watch Series 9',
    description: '健康监测，智能便携。',
    price: 2999,
    stock: 40,
    images: ['https://picsum.photos/400/400?random=5'],
    categoryId: 5,
    brand: 'Apple',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const productId = params.id as string;

  useEffect(() => {
    // 模拟获取商品详情
    const fetchProduct = async () => {
      setLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const productInfo = productData[productId];
      if (productInfo) {
        setProduct(productInfo);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // TODO: 显示成功提示
      alert('商品已添加到购物车');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      // TODO: 重定向到登录页面
      alert('请先登录');
      return;
    }
    
    if (product) {
      addItem(product, quantity);
      // TODO: 重定向到结算页面
      alert('即将跳转到结算页面');
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载商品信息...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">商品未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，您访问的商品不存在或已下架。</p>
          <Link href="/products">
            <Button>返回商品列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">首页</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-gray-700">商品</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        {/* 商品详情 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* 商品图片 */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">暂无图片</span>
                  </div>
                )}
              </div>
              
              {/* 缩略图 */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 relative rounded border-2 ${
                        index === selectedImage ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover rounded"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 商品信息 */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                {product.brand && (
                  <p className="text-gray-600">品牌: <span className="font-medium">{product.brand}</span></p>
                )}
              </div>

              {/* 价格 */}
              <div className="flex items-center space-x-4">
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
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">相关商品推荐</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 