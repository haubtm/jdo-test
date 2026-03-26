import type { AuthResponse, CreateVaultItemInput, LoginInput, RegisterInput, VaultItem } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export async function loginUser(payload: LoginInput): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  return response.json();
}

export async function registerUser(payload: RegisterInput): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Đăng ký thất bại');
  }

  return response.json();
}

export async function getVaultItems(token: string): Promise<VaultItem[]> {
  const response = await fetch(`${API_BASE_URL}/vault`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load vault items');
  }

  return response.json();
}

export async function createVaultItem(
  token: string,
  payload: CreateVaultItemInput,
): Promise<VaultItem> {
  const response = await fetch(`${API_BASE_URL}/vault`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create vault item');
  }

  return response.json();
}

export async function deleteVaultItem(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/vault/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete vault item');
  }
}

export async function updateVaultItem(
  token: string,
  id: string,
  payload: Partial<CreateVaultItemInput>,
): Promise<VaultItem> {
  const response = await fetch(`${API_BASE_URL}/vault/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update vault item');
  }

  return response.json();
}
