import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { decryptSecret, encryptSecret } from '../../../libs/common/src/crypto.util';
import type { CreateVaultPayload, DeleteVaultPayload, UpdateVaultPayload, VaultRecord } from '../../../libs/common/src/dto';

@Injectable()
export class VaultService {
  private readonly records = new Map<string, VaultRecord[]>();

  create(payload: CreateVaultPayload) {
    const encrypted = encryptSecret(payload.password);

    const record: VaultRecord = {
      id: randomUUID(),
      userId: payload.userId,
      service: payload.service,
      username: payload.username,
      encryptedPassword: encrypted.encryptedPassword,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      note: payload.note,
      createdAt: new Date().toISOString(),
    };

    const existing = this.records.get(payload.userId) ?? [];
    this.records.set(payload.userId, [record, ...existing]);

    return {
      id: record.id,
      service: record.service,
      username: record.username,
      password: decryptSecret(record),
      note: record.note,
      createdAt: record.createdAt,
    };
  }

  findAll(userId: string) {
    const existing = this.records.get(userId) ?? [];
    return existing.map((record) => ({
      id: record.id,
      service: record.service,
      username: record.username,
      password: decryptSecret(record),
      note: record.note,
      createdAt: record.createdAt,
    }));
  }

  findOne(userId: string, credentialId: string) {
    const record = (this.records.get(userId) ?? []).find((item) => item.id === credentialId);
    if (!record) {
      throw new NotFoundException('Credential not found');
    }

    return {
      id: record.id,
      service: record.service,
      username: record.username,
      password: decryptSecret(record),
      note: record.note,
      createdAt: record.createdAt,
    };
  }

  update(payload: UpdateVaultPayload) {
    const userRecords = this.records.get(payload.userId) ?? [];
    const index = userRecords.findIndex((item) => item.id === payload.credentialId);
    if (index === -1) {
      throw new NotFoundException('Credential not found');
    }

    const existing = userRecords[index];

    if (payload.service !== undefined) existing.service = payload.service;
    if (payload.username !== undefined) existing.username = payload.username;
    if (payload.note !== undefined) existing.note = payload.note;

    if (payload.password !== undefined) {
      const encrypted = encryptSecret(payload.password);
      existing.encryptedPassword = encrypted.encryptedPassword;
      existing.iv = encrypted.iv;
      existing.authTag = encrypted.authTag;
    }

    userRecords[index] = existing;
    this.records.set(payload.userId, userRecords);

    return {
      id: existing.id,
      service: existing.service,
      username: existing.username,
      password: decryptSecret(existing),
      note: existing.note,
      createdAt: existing.createdAt,
    };
  }

  delete(payload: DeleteVaultPayload) {
    const userRecords = this.records.get(payload.userId) ?? [];
    const index = userRecords.findIndex((item) => item.id === payload.credentialId);
    if (index === -1) {
      throw new NotFoundException('Credential not found');
    }

    userRecords.splice(index, 1);
    this.records.set(payload.userId, userRecords);

    return { deleted: true };
  }
}
