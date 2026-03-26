# Secure Vault Platform

Ung dung luu tru tai khoan/username/password theo mo hinh:

- Frontend: ReactJS + Vite + TypeScript
- Backend: NestJS microservices
- Bao mat: JWT, ma hoa AES-256-GCM, hash Argon2 cho master password

## Cau truc

- `frontend/`: giao dien quan ly credential vault
- `backend/`: NestJS monorepo gom API Gateway, Auth Service, Vault Service
- `docs/architecture.md`: kien truc tong the, flow du lieu va bao mat

## Chuc nang chinh

- Dang ky / dang nhap
- Tao vault credential gom `service`, `username`, `password`, `note`
- Password duoc ma hoa truoc khi luu database
- Gateway giao tiep voi cac microservice Auth va Vault
- Co the mo rong them audit log, folder, chia se secret, KMS

## Chay frontend

```bash
cd frontend
npm install
npm run dev
```

## Chay backend

```bash
cd backend
npm install
npm run start:dev:all
```

Mac dinh trong skeleton nay:

- API Gateway: `http://localhost:3000`
- Auth Service TCP: `localhost:4001`
- Vault Service TCP: `localhost:4002`

## Bien moi truong quan trong

```env
JWT_SECRET=replace-this
ENCRYPTION_MASTER_KEY=base64-encoded-32-byte-key
```

`ENCRYPTION_MASTER_KEY` can dung cho AES-256-GCM. Trong production nen dua khoa nay vao AWS KMS, HashiCorp Vault, Azure Key Vault hoac GCP KMS thay vi dat thang trong `.env`.
