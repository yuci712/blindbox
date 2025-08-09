<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 盲盒抽盒机项目 - Copilot 指令

这是一个盲盒抽盒机 Web 应用项目，包含前端和后端两个主要部分。

## 技术栈
- **前端**: Vite + React + TypeScript + TailwindCSS
- **后端**: MidwayJS + TypeScript + SQLite
- **架构**: 前后端分离，RESTful API 通信
- **部署**: GitHub Actions CI/CD

## 项目结构
- `frontend/` - React 前端应用
- `backend/` - MidwayJS 后端 API

## 核心功能
1. 多用户注册、登录
2. 盲盒管理
3. 盲盒抽取
4. 盲盒订单管理
5. 盲盒列表查看
6. 盲盒详情查看
7. 玩家秀
8. 盲盒搜索

## 开发规范
- 使用 TypeScript 进行类型安全开发
- 遵循 RESTful API 设计原则
- 组件化、模块化开发
- 良好的代码命名规范
- 编写清晰的注释和文档

## 数据库设计
使用 SQLite 作为数据库，主要表结构：
- users (用户表)
- blindboxes (盲盒表)
- orders (订单表)
- user_blindboxes (用户盲盒关联表)
- comments (评论表)

请在生成代码时遵循以上规范和项目架构。
