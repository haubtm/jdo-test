# Kien truc de xuat

## 1. Muc tieu

Ung dung cho phep user luu cac tai khoan nhay cam nhu ten dich vu, username/email, password, ghi chu.

He thong can dam bao:

- User chi xem duoc du lieu cua chinh ho
- Password luu duoi dang ma hoa, khong luu plain text
- Co the mo rong thanh san pham nhieu service

## 2. Kien truc tong the

- Frontend: ReactJS + Vite + TypeScript
- `api-gateway`: REST API, xac thuc JWT, goi message sang service
- `auth-service`: dang ky, dang nhap, hash password bang Argon2, phat JWT
- `vault-service`: CRUD credential, ma hoa/decrypt secret bang AES-256-GCM, kiem soat theo `userId`

## 3. Luong bao mat

1. User dang nhap qua `auth-service`, password dang nhap duoc hash bang Argon2.
2. Frontend gui JWT va du lieu credential den `api-gateway`.
3. Gateway xac dinh `userId` va goi `vault-service`.
4. `vault-service` ma hoa field `password` bang AES-256-GCM.
5. Database luu `encryptedPassword`, `iv`, `authTag`, `keyVersion`.

## 4. Mo rong production

- PostgreSQL cho Auth va Vault
- Redis/RabbitMQ/NATS thay TCP neu can scale
- KMS de quan ly khoa ma hoa
- Refresh token, MFA, audit log, rate limiting

## 5. Hash va encrypt

Neu user can xem lai password da luu, he thong khong the chi hash.

- Password dang nhap cua user: `hash`
- Password cua tai khoan luu trong vault: `encrypt`
