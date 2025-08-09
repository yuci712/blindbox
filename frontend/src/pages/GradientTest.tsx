const GradientTest = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">React TailwindCSS 渐变测试</h1>
        
        {/* 内联样式渐变测试 - 这个应该总是有效 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">内联样式渐变 (应该可见)</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              className="px-6 py-3 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
              }}
            >
              内联渐变按钮 1
            </button>
            <button 
              className="px-6 py-3 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #3b82f6)'
              }}
            >
              内联渐变按钮 2
            </button>
            <button 
              className="px-6 py-3 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ef4444)'
              }}
            >
              内联渐变按钮 3
            </button>
          </div>
        </div>

        {/* TailwindCSS 渐变按钮测试 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">TailwindCSS 渐变按钮 (如果不可见，说明TW渐变有问题)</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              基本渐变按钮
            </button>
            <button className="px-6 py-3 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              三色渐变按钮
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              绿蓝渐变按钮
            </button>
          </div>
        </div>

        {/* 测试结果 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">测试结果分析</h2>
          <div className="p-6 bg-gray-100 rounded-lg">
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 如果内联样式渐变按钮可见，但TailwindCSS渐变按钮不可见，说明TailwindCSS的渐变类没有正确生成或加载</li>
              <li>• 如果两者都不可见，说明是浏览器兼容性问题</li>
              <li>• 如果两者都可见，说明配置正常，问题在于具体页面的背景遮挡</li>
            </ul>
          </div>
        </div>

        {/* 背景测试 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibent mb-4">背景渐变测试</h2>
          <div 
            className="p-6 text-white rounded-lg mb-4"
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)'
            }}
          >
            <p>内联样式背景渐变</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6 text-white rounded-lg">
            <p>TailwindCSS背景渐变</p>
          </div>
        </div>

        {/* 文字渐变测试 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">文字渐变测试</h2>
          <h3 
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            内联样式文字渐变效果
          </h3>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            TailwindCSS文字渐变效果
          </h3>
        </div>
      </div>
    </div>
  );
};

export default GradientTest;
