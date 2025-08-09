@echo off
chcp 65001 > nul
cls
echo.
echo ===============================================
echo   盲盒抽盒机 - 快速演示启动工具
echo ===============================================
echo.

:: 检查Node.js环境
echo [1/3] 🔧 检查运行环境...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo       ❌ 错误: 未安装 Node.js
    echo       请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo       ✅ Node.js 环境正常

:: 检查并安装依赖
echo.
echo [2/3] 📦 检查项目依赖...
cd backend
if not exist node_modules (
    echo       - 安装后端依赖...
    npm install --silent
    if %errorlevel% neq 0 (
        echo       ❌ 后端依赖安装失败
        pause
        exit /b 1
    )
)
cd ..\frontend
if not exist node_modules (
    echo       - 安装前端依赖...
    npm install --silent
    if %errorlevel% neq 0 (
        echo       ❌ 前端依赖安装失败
        pause
        exit /b 1
    )
)
cd ..
echo       ✅ 项目依赖检查完成

:: 启动服务
echo.
echo [3/3] 🚀 启动开发服务...
echo       正在启动后端服务...
cd backend
start "盲盒抽盒机-后端API" cmd /c "npm run dev & pause"
echo       等待后端服务启动...
timeout /t 6 /nobreak > nul

echo       正在启动前端服务...
cd ..\frontend
start "盲盒抽盒机-前端Web" cmd /c "npm run dev & pause"
echo       等待前端服务启动...
timeout /t 4 /nobreak > nul

cd ..
echo       ✅ 服务启动完成

echo.
echo ===============================================
echo   🎉 演示环境启动成功！
echo ===============================================
echo.
echo 🌐 访问地址:
echo    前端应用: http://localhost:5173
echo    后端API:  http://localhost:7001
echo.
echo 👤 测试账号:
echo    管理员: admin / admin123
echo    普通用户: testuser / password123
echo.
echo 📋 演示功能清单:
echo    ✅ 1. 多用户注册登录 (角色选择)
echo    ✅ 2. 盲盒管理 (完整CRUD)
echo    ✅ 3. 盲盒抽取 (随机算法)
echo    ✅ 4. 订单管理 (完整流程)
echo    ✅ 5. 盲盒列表 (分页搜索)
echo    ✅ 6. 盲盒详情 (概率透明化)
echo    ✅ 7. 玩家秀 (我的盲盒)
echo    ✅ 8. 盲盒搜索 (智能搜索)
echo.
echo 🚀 创新特色:
echo    ⭐ 管理员权限系统
echo    ⭐ 概率透明化展示
echo    ⭐ 现代化UI设计
echo    ⭐ 响应式布局
echo.
echo 💡 正在自动打开浏览器...
timeout /t 3 /nobreak > nul
start http://localhost:5173
echo.
echo 🎬 演示建议:
echo    1. 先注册新用户 (选择"用户"角色)
echo    2. 浏览盲盒列表，查看详情
echo    3. 执行盲盒抽取，查看动画效果
echo    4. 查看我的订单和盲盒收藏
echo    5. 退出后用管理员身份登录
echo    6. 体验管理员后台功能
echo.

pause
