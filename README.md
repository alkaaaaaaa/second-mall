# 电商项目 (E-Commerce Platform)

一个现代化的全栈电商平台，采用前后端分离架构。

## 技术栈

### 前端
- **Next.js 14** - React 全栈框架，支持SSR/SSG
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 原子化CSS框架
- **Zustand** - 轻量级状态管理
- **React Query** - 数据获取和缓存

### 后端
- **Spring Boot 3** - Java后端框架
- **MyBatis Plus** - 增强版MyBatis ORM
- **Spring Security + JWT** - 认证和授权
- **MySQL 8** - 关系型数据库
- **Redis** - 缓存和会话存储
- **Maven** - 依赖管理

### 部署
- **前端**: Vercel
- **后端**: 阿里云/腾讯云
- **数据库**: 云数据库MySQL

## 项目结构

```
second-mall/
├── frontend/          # Next.js前端项目
├── backend/           # Spring Boot后端项目
├── docs/             # 项目文档
└── README.md         # 项目说明
```

## 快速开始

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

### 后端启动
```bash
cd backend
mvn spring-boot:run
```

## 功能特性

- 🛍️ 商品浏览和搜索
- 🛒 购物车管理
- 👤 用户注册和登录
- 📦 订单管理
- 💳 在线支付
- 📱 响应式设计
- 🔐 安全认证

## 开发指南

详细的开发指南请参考 `docs/` 目录下的文档。 