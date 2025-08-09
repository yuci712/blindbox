@echo off
chcp 65001
cls
echo.
echo ===============================================
echo   🎮 盲盒抽盒机 - 演示启动器
echo   快速启动系统演示环境
echo ===============================================
echo.

echo 🔧 检查环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未安装 Node.js
    echo 请先安装 Node.js (https://nodejs.org/)
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js 环境正常
echo.

echo 🏗️ 准备启动开发环境...
echo.

echo [1/3] 🔧 启动后端服务...
cd backend
start "后端服务" cmd /c "npm run dev"
timeout /t 3 >nul
echo       ✅ 后端服务已启动 (http://localhost:7001)
echo.

echo [2/3] 🌐 启动前端服务...
cd ..\frontend  
start "前端应用" cmd /c "npm run dev"
timeout /t 3 >nul
echo       ✅ 前端应用已启动 (http://localhost:5173)
echo.

echo [3/3] 🚀 打开浏览器...
timeout /t 5 >nul
start "系统演示" "http://localhost:5173"
echo       ✅ 浏览器已打开
echo.

echo ===============================================
echo   🎉 系统演示环境启动完成！
echo ===============================================
echo.
echo 🌐 前端地址: http://localhost:5173
echo 🔧 后端API: http://localhost:7001  
echo.
echo 👤 测试账号:
echo     管理员: admin / admin123
echo     普通用户: testuser / password123
echo.
echo 📋 演示功能清单:
echo     ✅ 1. 用户注册登录 (含角色选择)
echo     ✅ 2. 盲盒列表浏览
echo     ✅ 3. 盲盒详情查看 (概率透明化)
echo     ✅ 4. 盲盒抽取功能
echo     ✅ 5. 订单管理
echo     ✅ 6. 盲盒搜索
echo     ✅ 7. 我的盲盒 (玩家秀)
echo     ✅ 8. 管理员后台
echo.
echo 💡 演示建议流程:
echo     1. 用新用户身份注册 (选择"用户"角色)
echo     2. 浏览盲盒列表，查看详情
echo     3. 抽取几个盲盒，查看订单
echo     4. 查看"我的盲盒"页面
echo     5. 退出登录，用管理员身份登录
echo     6. 体验管理员后台功能
echo.
echo 🎬 录屏提示:
echo     建议全程录制以上操作流程
echo     展示系统的完整功能和用户体验
echo.
echo ⚠️  注意: 服务启动需要几秒钟时间
echo     如果页面无法访问，请稍等片刻再刷新
echo.

pause
