import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedVaultId, setGeneratedVaultId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      const user = await register({ password });
      setGeneratedVaultId(user.vaultId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyId() {
    if (!generatedVaultId) return;
    try {
      await navigator.clipboard.writeText(generatedVaultId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  // Sau register: hiển thị Vault ID
  if (generatedVaultId) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo auth-logo-success">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1>Tài khoản đã tạo!</h1>
            <p className="auth-subtitle">Hãy ghi nhớ Vault ID của bạn. Đây là cách duy nhất để đăng nhập.</p>
          </div>

          <div className="vault-id-display">
            <span className="vault-id-label">Vault ID của bạn</span>
            <div className="vault-id-value">
              <code>{generatedVaultId}</code>
              <button className="btn-icon" onClick={handleCopyId} title="Copy Vault ID">
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#72ffb5" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="vault-id-warning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Nếu mất Vault ID, bạn sẽ không thể truy cập dữ liệu!</span>
          </div>

          <button className="auth-btn" onClick={() => navigate('/', { replace: true })}>
            Đã ghi nhớ, vào Vault →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1>Tạo tài khoản mới</h1>
          <p className="auth-subtitle">Hệ thống sẽ tạo một Vault ID cho bạn</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="reg-password">Mật khẩu</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              required
              minLength={6}
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="reg-confirm">Xác nhận mật khẩu</label>
            <input
              id="reg-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Đang tạo...' : 'Tạo Vault ID'}
          </button>
        </form>

        <p className="auth-footer">
          Đã có Vault ID? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </main>
  );
}
