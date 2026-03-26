import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import type { LoginPayload, RegisterPayload } from '../../../libs/common/src/dto';
import { User } from './user.entity';

function generateVaultId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(6);
  const code = Array.from(bytes, (b) => chars[b % chars.length]).join('');
  return `VLT-${code}`;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(payload: RegisterPayload) {
    let vaultId: string;
    let isUnique = false;
    do {
      vaultId = generateVaultId();
      const existing = await this.userRepository.findOne({ where: { vaultId } });
      if (!existing) {
        isUnique = true;
      }
    } while (!isUnique);

    const passwordHash = await argon2.hash(payload.password);
    const user = this.userRepository.create({ vaultId, passwordHash });
    await this.userRepository.save(user);

    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id, vaultId: user.vaultId }),
      user: { id: user.id, vaultId: user.vaultId },
    };
  }

  async login(payload: LoginPayload) {
    const user = await this.userRepository.findOne({ where: { vaultId: payload.vaultId } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.passwordHash, payload.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id, vaultId: user.vaultId }),
      user: { id: user.id, vaultId: user.vaultId },
    };
  }
}
