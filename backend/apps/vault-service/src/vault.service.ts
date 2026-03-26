import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decryptSecret, encryptSecret } from '../../../libs/common/src/crypto.util';
import type { CreateVaultPayload, DeleteVaultPayload, UpdateVaultPayload } from '../../../libs/common/src/dto';
import { VaultCredential } from './vault-credential.entity';

@Injectable()
export class VaultService {
  constructor(
    @InjectRepository(VaultCredential)
    private readonly credentialRepository: Repository<VaultCredential>,
  ) {}

  async create(payload: CreateVaultPayload) {
    const encrypted = encryptSecret(payload.password);

    const record = this.credentialRepository.create({
      userId: payload.userId,
      service: payload.service,
      username: payload.username,
      encryptedPassword: encrypted.encryptedPassword,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      note: payload.note,
    });

    await this.credentialRepository.save(record);

    return {
      id: record.id,
      service: record.service,
      username: record.username,
      password: decryptSecret({
        encryptedPassword: record.encryptedPassword,
        iv: record.iv,
        authTag: record.authTag,
      }),
      note: record.note,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async findAll(userId: string) {
    const records = await this.credentialRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return records.map((record) => ({
      id: record.id,
      service: record.service,
      username: record.username,
      password: decryptSecret({
        encryptedPassword: record.encryptedPassword,
        iv: record.iv,
        authTag: record.authTag,
      }),
      note: record.note,
      createdAt: record.createdAt.toISOString(),
    }));
  }

  async findOne(userId: string, credentialId: string) {
    const record = await this.credentialRepository.findOne({
      where: { id: credentialId, userId },
    });

    if (!record) {
      throw new NotFoundException('Credential not found');
    }

    return {
      id: record.id,
      service: record.service,
      username: record.username,
      password: decryptSecret({
        encryptedPassword: record.encryptedPassword,
        iv: record.iv,
        authTag: record.authTag,
      }),
      note: record.note,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async update(payload: UpdateVaultPayload) {
    const record = await this.credentialRepository.findOne({
      where: { id: payload.credentialId, userId: payload.userId },
    });

    if (!record) {
      throw new NotFoundException('Credential not found');
    }

    if (payload.service !== undefined) record.service = payload.service;
    if (payload.username !== undefined) record.username = payload.username;
    if (payload.note !== undefined) record.note = payload.note;

    if (payload.password !== undefined) {
      const encrypted = encryptSecret(payload.password);
      record.encryptedPassword = encrypted.encryptedPassword;
      record.iv = encrypted.iv;
      record.authTag = encrypted.authTag;
    }

    await this.credentialRepository.save(record);

    return {
      id: record.id,
      service: record.service,
      username: record.username,
      password: decryptSecret({
        encryptedPassword: record.encryptedPassword,
        iv: record.iv,
        authTag: record.authTag,
      }),
      note: record.note,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async delete(payload: DeleteVaultPayload) {
    const result = await this.credentialRepository.delete({
      id: payload.credentialId,
      userId: payload.userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Credential not found');
    }

    return { deleted: true };
  }
}
