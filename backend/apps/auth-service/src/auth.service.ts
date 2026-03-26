import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomBytes, randomUUID } from 'crypto';
import type { LoginPayload, RegisterPayload, UserRecord } from '../../../libs/common/src/dto';

function generateVaultId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(6);
  const code = Array.from(bytes, (b) => chars[b % chars.length]).join('');
  return `VLT-${code}`;
}

@Injectable()
export class AuthService {
  private readonly users = new Map<string, UserRecord>();

  constructor(private readonly jwtService: JwtService) {}

  async register(payload: RegisterPayload) {
    let vaultId: string;
    do {
      vaultId = generateVaultId();
    } while (this.users.has(vaultId));

    const passwordHash = await argon2.hash(payload.password);
    const user: UserRecord = { id: randomUUID(), vaultId, passwordHash };
    this.users.set(vaultId, user);

    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id, vaultId: user.vaultId }),
      user: { id: user.id, vaultId: user.vaultId },
    };
  }

  async login(payload: LoginPayload) {
    const user = this.users.get(payload.vaultId);
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
