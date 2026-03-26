export type UserRecord = {
  id: string;
  vaultId: string;
  passwordHash: string;
};

export type VaultRecord = {
  id: string;
  userId: string;
  service: string;
  username: string;
  encryptedPassword: string;
  iv: string;
  authTag: string;
  note?: string;
  createdAt: string;
};

export type LoginPayload = {
  vaultId: string;
  password: string;
};

export type RegisterPayload = {
  password: string;
};

export type CreateVaultPayload = {
  userId: string;
  service: string;
  username: string;
  password: string;
  note?: string;
};

export type UpdateVaultPayload = {
  userId: string;
  credentialId: string;
  service?: string;
  username?: string;
  password?: string;
  note?: string;
};

export type DeleteVaultPayload = {
  userId: string;
  credentialId: string;
};
