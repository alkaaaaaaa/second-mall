'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCartStore();
  const { user } = useAuthStore();
  const [isClearing, setIsClearing] = useState(false);

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 500));
    clearCart();
    setIsClearing(false);
  };

  const handleCheckout = () => {
    if (!user) {
      alert('请先登录');
      // TODO: 重定向到登录页面
      return;
    }
    
    if (items.length === 0) {
      alert('购物车为空');
      return;
    }
    
    // TODO: 重定向到结算页面
    alert('即将跳转到结算页面');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">购物车是空的</h1>
            <p className="text-gray-600 mb-8">快去挑选您喜欢的商品吧！</p>
            <Link href="/products">
              <Button size="lg">开始购物</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页头 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">购物车</h1>
          <p className="text-gray-600">共 {items.length} 件商品</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 购物车商品列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 表头 */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700">
                  <div className="col-span-6">商品</div>
                  <div className="col-span-2 text-center">单价</div>
                  <div className="col-span-2 text-center">数量</div>
                  <div className="col-span-2 text-center">小计</div>
                </div>
              </div>

              {/* 商品列表 */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* 商品信息 */}
                      <div className="col-span-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-20 h-20 relative">
                            {item.product.images && item.product.images.length > 0 ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-400 text-xs">无图</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/products/${item.product.id}`}
                              className="font-medium text-gray-900 hover:text-blue-600"
                            >
                              {item.product.name}
                            </Link>
                            {item.product.brand && (
                              <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
                            )}
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-red-500 hover:text-red-700 text-sm mt-2"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 单价 */}
                      <div className="col-span-2 text-center">
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <div className="text-sm text-gray-400 line-through">
                            {formatPrice(item.product.originalPrice)}
                          </div>
                        )}
                      </div>

                      {/* 数量调整 */}
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-gray-100 text-sm"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-gray-100 text-sm"
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          库存 {item.product.stock}
                        </div>
                      </div>

                      {/* 小计 */}
                      <div className="col-span-2 text-center">
                        <span className="font-bold text-red-500">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 底部操作 */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    {isClearing ? '清空中...' : '清空购物车'}
                  </Button>
                  
                  <Link href="/products">
                    <Button variant="outline">
                      继续购物
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">订单摘要</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品总额</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">运费</span>
                  <span className="text-green-600">免费</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">总计</span>
                    <span className="text-xl font-bold text-red-500">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                size="lg" 
                className="w-full mb-4"
              >
                立即结算
              </Button>
              
              <div className="text-center text-sm text-gray-500">
                <p>✓ 7天无理由退换货</p>
                <p>✓ 正品保障</p>
                <p>✓ 全国包邮</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 