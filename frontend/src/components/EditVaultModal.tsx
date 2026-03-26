import { useState } from 'react';
import type { VaultItem } from '../types';

type EditVaultModalProps = {
  item: VaultItem;
  onSave: (id: string, data: { service: string; username: string; password: string; note?: string }) => Promise<void>;
  onClose: () => void;
};

export function EditVaultModal({ item, onSave, onClose }: EditVaultModalProps) {
  const [service, setService] = useState(item.service);
  const [username, setUsername] = useState(item.username);
  const [password, setPassword] = useState(item.password);
  const [note, setNote] = useState(item.note ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(item.id, { service, username, password, note });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sửa credential</h2>
          <button className="btn-icon" onClick={onClose} title="Đóng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="vault-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="edit-service">Dịch vụ</label>
            <input id="edit-service" value={service} onChange={(e) => setService(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="edit-username">Tên đăng nhập</label>
            <input id="edit-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="edit-password">Mật khẩu</label>
            <div className="password-input-row">
              <input
                id="edit-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="btn-icon" onClick={() => setShowPassword(!showPassword)}>
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
            </div>
          </div>

          <div className="field">
            <label htmlFor="edit-note">Ghi chú</label>
            <textarea id="edit-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Hủy</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
