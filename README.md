# 🛡️ Secure Vault Platform

**Secure Vault** là một hệ thống mã nguồn mở được thiết kế theo kiến trúc **Microservices tối tân**, giúp người dùng lưu trữ mật khẩu, tài khoản và các thông tin nhạy cảm một cách an toàn tuyệt đối thông qua chuẩn mã hóa **AES-256-GCM**.

---

## 🚀 Tính năng nổi bật

- **Đăng nhập không cần Email/Username**: Tự động sinh `Vault ID` kết hợp mật khẩu mạnh để bảo vệ tuyệt đối danh tính người dùng.
- **Mã hóa chuỗi kép**: Mật khẩu đăng nhập được băm bằng `Argon2`. Mật khẩu lưu trữ trong Vault được mã hóa bằng thuật toán `AES-256-GCM` đi kèm Initialization Vector (IV) và AuthTag động.
- **Trải nghiệm mượt mà**: Giao diện UI/UX Darkmode hiện đại với các hiệu ứng Animation tinh tế.
- **Kiến trúc Microservices**: Tách biệt luồng xử lý `Auth` và `Vault` đằng sau một `API Gateway`, tăng tính sẵn sàng và dễ dàng mở rộng (Scale).
- **Auto CI/CD**: Hoàn thiện luồng triển khai tự động tới GitHub Container Registry, AWS EC2 và Vercel thông qua GitHub Actions.

---

## 🛠️ Tech Stack

**Frontend (Client-side):**
- React 18, TypeScript, Vite
- Tailwind CSS, Zustand (State Management), React-Toastify
- Phosphor Icons

**Backend (Server-side):**
- NestJS (Framework), TypeORM
- Microservices Transport Layer: **TCP**
- CSDL: MariaDB

**DevOps & Deployment:**
- Docker & Docker Compose
- GitHub Actions (CI/CD Pipeline)
- NGINX Reverse Proxy (HTTPS & CORS)
- Vercel (Frontend Hosting) & AWS EC2 (Backend Hosting)

---

## 💻 Cấu trúc thư mục

```text
├── frontend/               # Mã nguồn giao diện Web React
│   ├── src/                # Logic UI, Zustand Stores, API Clients
│   └── vercel.json         # Cấu hình Routing (Rewrite) cho Vercel
├── backend/                # Mã nguồn NestJS Monorepo API backend
│   ├── apps/api-gateway/   # Cổng giao tiếp REST đón nhận Request từ Frontend
│   ├── apps/auth-service/  # Microservice TCP chuyên xử lý Xác thực & User
│   └── apps/vault-service/ # Microservice TCP chuyên xử lý Mã Hóa Secret
├── docs/                   # Tài liệu kiến trúc chuyên sâu
├── docker-compose.yml      # Cấu hình chạy Local Development
└── docker-compose.prod.yml # Cấu hình chạy Production Pipeline
```

---

## ⚙️ Hướng dẫn cài đặt (Local Development)

Yêu cầu: `Node.js >= 18`, `Docker` & `Docker Compose`.

### 1. Khởi động Backend & Database
```bash
# Tạo file biến môi trường
cp backend/.env.example backend/.env

# Chạy cụm Microservices và MariaDB
docker-compose up -d

# Log theo dõi trạng thái
docker-compose logs -f
```

### 2. Khởi động Frontend
```bash
cd frontend
npm install
npm run dev
```
Trang web sẽ chạy tại `http://localhost:5173`. API Gateway sẽ lắng nghe tại `http://localhost:3000`.

---

## 🌍 Triển khai Production (CI/CD)

Dự án đã được thiết lập sẵn **CI/CD Pipeline** tự động với GitHub Actions (`.github/workflows/deploy.yml`). 
Mỗi khi có code mới được Push lên nhánh `main`:

1. **GitHub Actions** sẽ build 3 hình ảnh Docker (Gateway, Auth, Vault) và đẩy lên GHCR (GitHub Container Registry).
2. Hệ thống SSH vào máy chủ VPS (AWS EC2), tự động kéo Image mới nhất về và chạy `docker-compose.prod.yml`.
3. Phía **Frontend** (Vercel) sẽ tự động trigger vòng build mới nếu phát hiện thay đổi trong thư mục `frontend/`.

> Cấu hình HTTPS và CORS: NGINX được sử dụng như một Reverse Proxy đứng ra nhận chứng chỉ Let's Encrypt và trung chuyển dữ liệu chéo miền an toàn tới Docker Port 3005.

---

📝 **Tài liệu tham khảo chuyên sâu**: Tham khảo file [`docs/architecture.md`](./docs/architecture.md) để xem biểu đồ kiến trúc hệ thống và cơ chế mã hóa.
