import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product, 1);
  };

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          {(product.images && product.images.length > 0) || product.mainImage ? (
            <Image
              src={(product.images && product.images[0]) || product.mainImage || 'https://picsum.photos/400/400?random=default'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">暂无图片</span>
            </div>
          )}
          
          {/* 库存状态 */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">已售罄</span>
            </div>
          )}
          
          {/* 折扣标签 */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-red-500">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {product.brand && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.brand}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              库存: {product.stock}
            </span>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="disabled:opacity-50"
            >
              {product.stock === 0 ? '已售罄' : '加入购物车'}
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
} 