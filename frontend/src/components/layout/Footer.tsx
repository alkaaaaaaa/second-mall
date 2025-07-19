import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 公司信息 */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">第二商城</h3>
            <p className="text-gray-400 text-sm mb-4">
              专业的在线购物平台，为您提供优质的商品和服务。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                📧
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                📱
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                🌐
              </a>
            </div>
          </div>

          {/* 购物指南 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">购物指南</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help/how-to-order" className="hover:text-white">
                  如何购买
                </Link>
              </li>
              <li>
                <Link href="/help/payment" className="hover:text-white">
                  支付方式
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="hover:text-white">
                  配送说明
                </Link>
              </li>
              <li>
                <Link href="/help/return" className="hover:text-white">
                  退换货政策
                </Link>
              </li>
            </ul>
          </div>

          {/* 客户服务 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">客户服务</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help/contact" className="hover:text-white">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="hover:text-white">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/help/feedback" className="hover:text-white">
                  意见反馈
                </Link>
              </li>
              <li>
                <Link href="/help/complaint" className="hover:text-white">
                  投诉建议
                </Link>
              </li>
            </ul>
          </div>

          {/* 关于我们 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">关于我们</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  公司介绍
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  招聘信息
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white">
                  新闻中心
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-white">
                  服务条款
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 第二商城. 保留所有权利.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <Link href="/legal/privacy" className="hover:text-white">
                隐私政策
              </Link>
              <Link href="/legal/terms" className="hover:text-white">
                服务条款
              </Link>
              <Link href="/legal/cookies" className="hover:text-white">
                Cookie政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 