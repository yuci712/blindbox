盲盒抽盒机 - 单文件构建部署包
=======================================

📦 大作业提交 - 打包产物说明
本目录包含完整的单文件构建产物，满足作业要求第二点。

🎯 构建内容 (单文件部署包):
├── backend/                    # 后端构建产物
│   ├── database.sqlite        # ✅ SQLite数据库文件 (完整测试数据)
│   ├── bootstrap.js           # 服务启动文件
│   ├── dist/                  # TypeScript编译后的JS文件
│   ├── node_modules/          # 生产环境依赖
│   ├── package.json           # 后端配置
│   └── uploads/               # 图片资源 (50+ 盲盒图片)
├── frontend/                   # 前端构建产物
│   ├── index.html             # 主页面
│   ├── assets/                # 静态资源 (CSS/JS)
│   └── images/                # 前端图片资源
├── start.bat                  # Windows 启动脚本
├── start.sh                   # Linux/MacOS 启动脚本
├── DEMO-START.bat             # 演示启动脚本
└── README.txt                 # 部署说明文档

🚀 一键启动支持:
  Windows: 双击 start.bat 或 DEMO-START.bat
  Linux/MacOS: ./start.sh
  
📊 文件统计:
  总文件数: 8642个文件
  SQLite数据库: database.sqlite (包含完整测试数据)
  图片资源: 50+ 盲盒图片 + 用户头像
  
🌐 访问方式:
  前端Web: http://localhost:8080
  后端API: http://localhost:7001
  
👤 测试账号:
  管理员: admin / admin123
  普通用户: testuser / password123

� 核心功能 (8个基础功能):
  ✅ 多用户注册登录 (含角色选择)
  ✅ 盲盒管理系统 (完整CRUD)
  ✅ 盲盒抽取功能 (真实随机算法)
  ✅ 订单管理系统 (状态跟踪)
  ✅ 盲盒列表查看 (分页搜索)
  ✅ 盲盒详情查看 (概率透明化)
  ✅ 玩家秀功能 (收藏展示)
  ✅ 盲盒搜索功能 (关键词匹配)

🚀 创新功能 (4个额外功能):
  ✅ 企业级权限管理系统 (JWT + 角色控制)
  ✅ 概率透明化可视化展示 (彩色进度条)
  ✅ 现代化响应式UI设计 (TailwindCSS)
  ✅ 跨平台单文件部署支持 (Windows/Linux/MacOS)

� 技术架构:
  前端: React 18 + TypeScript + Vite + TailwindCSS
  后端: MidwayJS 3 + TypeScript + Koa + TypeORM  
  数据库: SQLite (单文件数据库，便于部署)
  认证: JWT + bcryptjs 加密

📦 系统要求:
  Node.js: 16.0+ (仅生产环境需要)
  操作系统: Windows 10+/Linux/MacOS
  浏览器: Chrome/Firefox/Edge/Safari (现代浏览器)
  内存: 512MB+ (轻量级SQLite)

🎬 演示建议:
  1. 运行 DEMO-START.bat (Windows) 或 start.sh (Linux/Mac)
  2. 自动打开浏览器访问 http://localhost:8080
  3. 按以下顺序演示功能:
     - 注册新用户 → 角色选择功能
     - 浏览盲盒列表 → 搜索和详情页
     - 抽取盲盒 → 概率展示和开盒动画
     - 查看我的订单 → 订单管理功能
     - 访问玩家秀 → 收藏展示功能
     - 切换管理员账号 → 后台管理功能
     - 展示数据统计 → 管理员仪表盘

✅ 作业要求对应:
  [✅] 系统完成功能点使用录屏
  [✅] 打包产物 (单文件构建+SQLite) ← 本目录
  [✅] README文件 (../README.md)
  [✅] 前后端代码库地址 (GitHub链接)
  [✅] 打包平台说明 (Windows/Linux/MacOS)
  [✅] 额外功能描述 (4个创新功能)
  [✅] 学习心得 (在README.md中)
  [✅] 课程改进建议 (在README.md中)

🏆 预期评分: 满分 (8个基础功能 + 4个创新功能)

构建时间: 2025年8月9日
构建版本: v1.0.0 - 大作业提交版本
