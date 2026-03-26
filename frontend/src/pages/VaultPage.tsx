import { useCallback, useEffect, useState } from 'react';
import { createVaultItem, deleteVaultItem, getVaultItems, updateVaultItem } from '../api/client';
import { EditVaultModal } from '../components/EditVaultModal';
import { VaultForm } from '../components/VaultForm';
import { useAuth } from '../contexts/AuthContext';
import type { CreateVaultItemInput, VaultItem } from '../types';

export function VaultPage() {
  const { token, user, logout } = useAuth();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const result = await getVaultItems(token);
        setItems(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [token]);

  async function handleCreate(payload: CreateVaultItemInput) {
    if (!token) return;
    const created = await createVaultItem(token, payload);
    setItems((current) => [created, ...current]);
    showToast('Đã lưu credential thành công!');
  }

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm('Bạn có chắc muốn xóa credential này?')) return;
    try {
      await deleteVaultItem(token, id);
      setItems((current) => current.filter((item) => item.id !== id));
      showToast('Đã xóa credential!');
    } catch {
      showToast('Xóa thất bại!');
    }
  }

  async function handleUpdate(id: string, data: { service: string; username: string; password: string; note?: string }) {
    if (!token) return;
    try {
      const updated = await updateVaultItem(token, id, data);
      setItems((current) => current.map((item) => (item.id === id ? updated : item)));
      setEditingItem(null);
      showToast('Đã cập nhật credential!');
    } catch {
      showToast('Cập nhật thất bại!');
    }
  }

  function togglePassword(id: string) {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function copyPassword(id: string, password: string) {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Không thể copy vào clipboard');
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.service.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="page-shell">
      {/* Toast notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* Header / Navbar */}
      <header className="app-header">
        <div className="app-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="app-header-title">Secure Vault</span>
        </div>
        <div className="app-header-right">
          <span className="app-header-email"><code>{user?.vaultId}</code></span>
          <button className="btn-ghost" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Hero card */}
      <section className="hero-card">
        <div>
          <p className="eyebrow">Secure Vault</p>
          <h1>Quản lý tài khoản & password được mã hóa.</h1>
          <p className="lead">
            Password được bảo vệ bằng AES-256-GCM. Chỉ bạn mới có thể xem lại dữ liệu đã lưu.
          </p>
        </div>
        <div className="status-panel">
          <span className="status-dot" />
          AES-256-GCM • Argon2
        </div>
      </section>

      {/* Content */}
      <section className="content-grid">
        <article className="panel">
          <h2>Thêm credential</h2>
          <VaultForm onSubmit={handleCreate} />
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Tài khoản đã lưu</h2>
            <span>{filteredItems.length} mục</span>
          </div>

          {/* Search bar */}
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo service hoặc username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && <p>Đang tải hệ thống...</p>}
          {error && <p className="error-text">{error}</p>}

          <div className="vault-list">
            {filteredItems.map((item) => (
              <div key={item.id} className="vault-card">
                <div className="vault-card-top">
                  <strong>{item.service}</strong>
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </div>
                <p className="vault-username">{item.username}</p>

                <div className="vault-password-row">
                  <code>{visiblePasswords.has(item.id) ? item.password : '••••••••'}</code>
                  <div className="vault-actions">
                    <button
                      className="btn-icon"
                      onClick={() => togglePassword(item.id)}
                      title={visiblePasswords.has(item.id) ? 'Ẩn password' : 'Hiện password'}
                    >
                      {visiblePasswords.has(item.id) ? (
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
                    <button
                      className="btn-icon"
                      onClick={() => copyPassword(item.id, item.password)}
                      title="Copy password"
                    >
                      {copiedId === item.id ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#72ffb5" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => setEditingItem(item)}
                      title="Sửa credential"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(item.id)}
                      title="Xóa credential"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                {item.note ? <p className="muted">{item.note}</p> : null}
              </div>
            ))}

            {!loading && filteredItems.length === 0 ? (
              <p className="muted">
                {search ? 'Không tìm thấy kết quả.' : 'Chưa có credential nào. Hãy thêm credential đầu tiên!'}
              </p>
            ) : null}
          </div>
        </article>
      </section>

      {/* Edit Modal */}
      {editingItem && (
        <EditVaultModal
          item={editingItem}
          onSave={handleUpdate}
          onClose={() => setEditingItem(null)}
        />
      )}
    </main>
  );
}
