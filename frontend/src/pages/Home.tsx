import { Link } from 'react-router-dom';
import { Box, Star, Zap } from 'lucide-react';

const ModernHomePage = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-white overflow-hidden">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            探索无限可能，开启你的盲盒之旅
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            从热门 IP 到限量版珍藏，每一次开启都充满未知与惊喜。立即加入我们，发现属于你的那份独特宝藏。
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/dashboard"
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-indigo-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              进入商城
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300"
            >
              立即注册
            </Link>
          </div>
        </div>
        <div className="absolute -bottom-1/2 left-0 right-0 h-1/2 bg-transparent transform skew-y-[-3deg]"></div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800">为什么选择我们？</h2>
            <p className="text-gray-600 mt-2">我们为您提供最优质的盲盒购物体验</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="inline-block bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                <Box size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">海量款式</h3>
              <p className="text-gray-600">
                与全球顶尖品牌合作，汇集上千种潮流盲盒，每周上新，满足你的收藏欲。
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="inline-block bg-pink-100 text-pink-600 p-4 rounded-full mb-4">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">正品保障</h3>
              <p className="text-gray-600">
                官方授权，100%正品保证。每个盲盒都拥有唯一的身份认证，放心购买。
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="inline-block bg-green-100 text-green-600 p-4 rounded-full mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">闪电发货</h3>
              <p className="text-gray-600">
                专业的仓储物流体系，订单在24小时内发出，让你的期待无需等待。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-8 text-center">
          <p>&copy; 2025 盲盒星球. All Rights Reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            一个充满惊喜与乐趣的宇宙
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ModernHomePage;
