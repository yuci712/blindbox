#!/bin/bash

echo "========================================="
echo "  盲盒抽盒机 - 停止服务"  
echo "========================================="
echo ""

# 读取保存的PID
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    if kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID"
        echo "✅ 后端服务已停止 (PID: $BACKEND_PID)"
    else
        echo "⚠️  后端服务不在运行"
    fi
    rm backend.pid
else
    echo "⚠️  未找到后端PID文件"
fi

if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if kill -0 "$FRONTEND_PID" 2>/dev/null; then
        kill "$FRONTEND_PID"
        echo "✅ 前端服务已停止 (PID: $FRONTEND_PID)"
    else
        echo "⚠️  前端服务不在运行"
    fi
    rm frontend.pid
else
    echo "⚠️  未找到前端PID文件"
fi

# 清理日志文件
if [ -f "backend.log" ]; then
    rm backend.log
    echo "🧹 后端日志已清理"
fi

if [ -f "frontend.log" ]; then
    rm frontend.log
    echo "🧹 前端日志已清理"
fi

# 清理临时SPA服务器文件
if [ -f "frontend/spa-server.js" ]; then
    rm frontend/spa-server.js
    echo "🧹 临时SPA服务器文件已清理"
fi

echo ""
echo "🎉 所有服务已停止并清理完毕！"
