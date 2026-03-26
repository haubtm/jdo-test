FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Build Vite app
RUN npm run build

FROM nginx:alpine
# Copy build output to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Thêm cấu hình Nginx để hỗ trợ React Router (fallback về index.html)
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
