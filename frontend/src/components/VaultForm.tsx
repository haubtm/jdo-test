import { useState } from 'react';
import type { CreateVaultItemInput } from '../types';

type VaultFormProps = {
  onSubmit: (payload: CreateVaultItemInput) => Promise<void>;
};

const initialState: CreateVaultItemInput = {
  service: '',
  username: '',
  password: '',
  note: '',
};

function generatePassword(length = 20): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

export function VaultForm({ onSubmit }: VaultFormProps) {
  const [form, setForm] = useState<CreateVaultItemInput>(initialState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField<K extends keyof CreateVaultItemInput>(key: K, value: CreateVaultItemInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleGenerate() {
    const pwd = generatePassword();
    updateField('password', pwd);
    setShowPassword(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setForm(initialState);
      setShowPassword(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="vault-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="service">Dịch vụ</label>
        <input id="service" value={form.service} onChange={(event) => updateField('service', event.target.value)} placeholder="Github, Gmail, AWS..." required />
      </div>

      <div className="field">
        <label htmlFor="username">Tên đăng nhập</label>
        <input id="username" value={form.username} onChange={(event) => updateField('username', event.target.value)} placeholder="user@example.com" required />
      </div>

      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <div className="password-input-row">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="Nhập hoặc tạo tự động"
            required
          />
          <button type="button" className="btn-icon" onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'Ẩn' : 'Hiện'}>
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          <button type="button" className="btn-generate" onClick={handleGenerate} title="Tạo password ngẫu nhiên">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            Tạo
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="note">Ghi chú</label>
        <textarea id="note" value={form.note} onChange={(event) => updateField('note', event.target.value)} placeholder="Mã khôi phục, gợi ý, chủ sở hữu..." rows={3} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Lưu credential'}
      </button>
    </form>
  );
}
