# 盲盒抽盒机 - Web开发大作业 README
> 🎁 基于 React 18 + TypeScript + Vite 前端，MidwayJS 3 + TypeScript + SQLite 后端的现代化盲盒商城系统
---
## 📦 前后端代码库地址（GitHub链接）
- **GitHub仓库地址**：https://github.com/yuci712/blindbox.git
- **主分支**：main
- **开发分支**：developing
- **前端目录**：`/frontend`
- **后端目录**：`/backend`
---
## 🏗️ 打包平台说明
本项目支持三大主流平台一键部署：
### 🪟 Windows
- 支持 `.bat` 脚本一键启动（如 `start.bat`、`DEMO-START.bat`）
- 推荐环境：Windows 10/11，内置Node.js运行时

### 🐧 Linux
- 支持 `.sh` 脚本一键启动（如 `start.sh`）
- 兼容 Ubuntu、CentOS、Debian 等主流发行版
- 需预装 Node.js 16+

### 🍎 MacOS
- 支持 `.sh` 脚本一键启动
- 推荐 macOS 10.15+，Node.js 16+

### 📦 单文件构建产物
- `build-output/` 目录下包含：
  - 后端Node.js服务（含SQLite数据库）
  - 前端静态文件
  - 跨平台启动脚本
  - 完整部署说明

---

## 🚀 额外实现的功能描述（创新功能）

1. **管理员权限系统**
   - 支持双角色（管理员/普通用户）
   - 后端JWT中间件+前端路由双重权限控制
   - 管理员专属仪表盘、盲盒/订单/用户管理

2. **我的收藏展示**
   - 新增我的收藏页面，按稀有度分类已抽到的盲盒物品

3. **网站首页设计**
   - 模仿主流设计平台设计了首页
   - TailwindCSS+动画，极致视觉体验

4. **个人信息页面设计**
   - 支持编辑个人信息和头像
   - 使得网站更加个性化

5. **新增管理员统计数据功能**
   - 对于盲盒的销售数据有着单独的页面展示

6. **新增开盒动画**
   - 在开启盲盒期间有抽取动画，更具吸引力
---


