# 后端 Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S blindbox -u 1001

# 更改文件所有权
RUN chown -R blindbox:nodejs /app
USER blindbox

# 暴露端口
EXPOSE 7001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:7001/api/health || exit 1

# 启动应用
CMD ["npm", "start"]
