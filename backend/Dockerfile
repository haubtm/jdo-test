FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Argument để build app tương ứng (api-gateway, auth-service, vault-service)
ARG APP_NAME
RUN npx nest build ${APP_NAME}

FROM node:18-alpine
WORKDIR /app
ARG APP_NAME

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Biến môi trường cho lúc run container
ENV APP_NAME=${APP_NAME}

# Command chạy app từ thư mục dist tương ứng
CMD sh -c "node dist/apps/${APP_NAME}/src/main.js"
