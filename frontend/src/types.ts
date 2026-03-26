export type VaultItem = {
  id: string;
  service: string;
  username: string;
  password: string;
  note?: string;
  createdAt: string;
};

export type CreateVaultItemInput = Omit<VaultItem, 'id' | 'createdAt'>;

export type AuthUser = {
  id: string;
  vaultId: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type LoginInput = {
  vaultId: string;
  password: string;
};

export type RegisterInput = {
  password: string;
};
