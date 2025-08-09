#!/bin/bash

echo "========================================="
echo "  盲盒抽盒机 - 生产环境启动"  
echo "========================================="
echo ""

# 检查Node.js是否可用
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 需要安装 Node.js"
    echo "请安装 Node.js: https://nodejs.org/"
    echo "或者使用开发环境启动脚本"
    echo ""
    exit 1
fi

echo "🚀 启动后端服务..."
cd backend && nohup node bootstrap.js > ../backend.log 2>&1 &
sleep 3
echo "   ✅ 后端API: http://localhost:7001"
echo ""

echo "🌐 启动前端服务..."  
cd ../frontend

# 检查http-server是否可用
if ! command -v http-server &> /dev/null; then
    echo "   正在安装 http-server..."
    npm install -g http-server > /dev/null 2>&1
fi

# 使用http-server启动，支持SPA路由  
nohup npx http-server -p 8080 --cors -a localhost --proxy http://localhost:8080? > ../frontend.log 2>&1 &
sleep 2
echo "   ✅ 前端Web: http://localhost:8080"
echo ""

echo "🎉 启动完成！"
echo "   Web访问: http://localhost:8080"
echo "   后端API: http://localhost:7001" 
echo "   管理员: admin / admin123"
echo "   用户: testuser / password123"
echo ""
echo "💡 服务已在后台运行"
echo "   查看后端日志: tail -f backend.log"
echo "   查看前端日志: tail -f frontend.log" 
echo ""
