# Kiến trúc hệ thống: Secure Vault

Tài liệu này mô tả chi tiết kiến trúc của nền tảng **Secure Vault**, bao gồm thiết kế Microservices, sơ đồ luồng dữ liệu, và phương pháp mã hóa bảo mật.

---

## 1. Sơ đồ Kiến trúc Tổng thể (High-level Architecture)

Hệ thống được thiết kế theo mô hình Client-Server với Backend phân mảnh (Microservices Architecture) nhằm tách bạch rõ ràng Domain Logic.

```mermaid
graph TD
    Client[Web Browser - React/Vite] -->|HTTPS Requests| Nginx[NGINX Reverse Proxy]
    
    subgraph VPS - AWS EC2
        Nginx -->|Proxy Pass 3005| APIGateway(API Gateway - NestJS)
        
        subgraph Docker Network
            APIGateway <-->|TCP Port 4001| AuthService(Auth Service)
            APIGateway <-->|TCP Port 4002| VaultService(Vault Service)
            
            AuthService <-->|TypeORM| DB[(MariaDB)]
            VaultService <-->|TypeORM| DB
        end
    end
```

### Chức năng của từng thành phần:
- **Client (Frontend)**: Giao diện người dùng SPA host trên `Vercel`. Giao tiếp với API qua phương thức REST/JSON kèm JWT token.
- **NGINX**: Tiếp nhận Request từ ngoài Internet, cấp phát chứng chỉ HTTPS Let's Encrypt và xử lý CORS preflight.
- **API Gateway**: Đầu mối RESTful API duy nhất. Chịu trách nhiệm Validate JWT Guards và Forward dữ liệu đến các dịch vụ vi mô qua chuẩn giao tiếp TCP nội bộ.
- **Auth Service**: Đứng độc lập quản lý logic định danh. Phát sinh `Vault ID` duy nhất, mã hóa nén mật khẩu người dùng và xác thực JWT.
- **Vault Service**: Đứng độc lập xử lý logic nghiệp vụ. Chứa Engine giải mã và mã hóa đối xứng (AES) cho từng Credential riêng lẻ của người dùng trước khi ghi vào Database.

---

## 2. Thiết kế Database Schema

Hệ thống sử dụng hệ quản trị CSDL quan hệ MariaDB với thiết kế khóa ngoại (Foreign Key) chặt chẽ:

```mermaid
erDiagram
    USERS ||--o{ VAULT_CREDENTIALS : "owns"
    
    USERS {
        uuid id PK
        string vaultId UK "Mã đăng nhập sinh ngẫu nhiên"
        string password "Đã băm bằng thuật toán Argon2"
        timestamp createdAt
    }
    
    VAULT_CREDENTIALS {
        uuid id PK
        string service "Tên ứng dụng/website"
        string username "Tên đăng nhập"
        string encryptedPassword "Mật khẩu đã bị mã hóa dữ liệu"
        string iv "Initialization Vector (16 byte)"
        string authTag "Xác thực gói tin AES-GCM (16 byte)"
        string note "Ghi chú tùy chọn"
        uuid userId FK
    }
```

---

## 3. Kiến trúc Bảo mật / Mã hóa (Security Flow)

Secure Vault áp dụng tiêu chuẩn bảo mật ngân hàng để đảm bảo **Không một ai (Kể cả Database Admin) có thể đọc được mật khẩu gốc của người dùng**.

1. **Bảo mật danh tính (Auth/Argon2)**
   - Không lưu trữ `Email` hay thông tin cá nhân.
   - Khi người dùng đăng ký, hệ thống băm mật khẩu bằng **Argon2** (Thuật toán kháng Brute-force mạnh nhất hiện nay) cùng với một muối (Salt) động.
   
2. **Mã hóa Dữ liệu Nhạy cảm (Vault/AES-256-GCM)**
   - Mọi mật khẩu người dùng lưu vào kho (Credential Password) đều bị mã hóa 2 chiều ngay khi chạm tới `Vault Service` bằng thuật toán **AES-256-GCM**.
   - **GCM (Galois/Counter Mode)**: Ngoài mã hóa, thuật toán này còn sinh ra một `authTag`. Lúc giải mã, nếu dữ liệu bị tin tặc chỉnh sửa trái phép dù chỉ 1 byte, `authTag` sẽ không khớp và quá trình giải mã lập tức báo lỗi.
   - **IV rải rác**: Mỗi một password được lưu sẽ sinh ra một Initialization Vector (IV) ngẫu nhiên, giúp cùng một mật khẩu nhưng mã hóa ra các chuỗi hoàn toàn khác nhau.

---

## 4. Kiến trúc Triển khai (CI/CD Pipeline)

Để đảm bảo hiệu suất vận hành cao trên cấu hình VPS giới hạn, mô hình Deployment được ứng dụng để dời tác vụ nặng đứt gãy lên Server trung gian (GitHub Actions).

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GitHub as GitHub Actions
    participant GHCR as GH Container Registry
    participant EC2 as AWS EC2 Server
    
    Dev->>GitHub: Git Push (Backend files modified)
    activate GitHub
    GitHub->>GitHub: Build API Gateway Image
    GitHub->>GitHub: Build Auth Service Image
    GitHub->>GitHub: Build Vault Service Image
    GitHub->>GHCR: Push 3 Docker Images
    GitHub->>EC2: SSH Trigger Deployment Script
    deactivate GitHub
    
    activate EC2
    EC2->>GHCR: Docker Pull Latest Images
    EC2->>EC2: Docker Compose Up (Restart Services)
    deactivate EC2
```
