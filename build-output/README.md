# 盲盒抽盒机 - 单文件部署包

> 🎁 生产环境一键部署包，支持Windows/Linux/MacOS跨平台运行

## 🚀 快速启动

### Windows 用户
```bash
# 双击运行或命令行执行
start.bat
```

### Linux/MacOS 用户  
```bash
# 添加执行权限并运行
chmod +x start.bat
./start.bat
```

## ✅ 启动后访问

- **前端Web界面**: http://localhost:8080
- **后端API接口**: http://localhost:7001
- **管理员账号**: admin / admin123
- **测试用户**: testuser / password123

## 📦 包含内容

- ✅ **前端构建产物**: React 18 + TypeScript + TailwindCSS
- ✅ **后端运行环境**: MidwayJS 3 + SQLite数据库  
- ✅ **完整测试数据**: 50+ 盲盒 + 用户数据
- ✅ **图片资源**: 所有盲盒图片和用户头像
- ✅ **智能代理**: 自动处理API和静态资源请求

## 🎯 核心功能

1. **多用户注册登录** - 支持管理员/普通用户角色
2. **盲盒管理系统** - 完整CRUD + 图片上传
3. **概率抽取算法** - 真实随机 + 开盒动画
4. **订单管理** - 完整订单流程跟踪  
5. **商品展示** - 分页列表 + 搜索过滤
6. **详情查看** - 概率透明化展示
7. **玩家收藏** - 个人收藏管理
8. **实时搜索** - 关键词快速搜索

## 🛠️ 系统要求

- **Node.js**: 版本 16.0 及以上
- **操作系统**: Windows 10/11, Linux, macOS 10.15+
- **内存**: 建议 2GB 以上
- **磁盘**: 需要 100MB 可用空间

## 🔧 故障排除

如果启动失败，请检查：
1. Node.js 是否正确安装：`node --version`
2. 端口 7001/8080 是否被占用
3. 是否有防火墙阻止访问

---

**技术栈**: React 18 + MidwayJS 3 + TypeScript + SQLite + TailwindCSS
