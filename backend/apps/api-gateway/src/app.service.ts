import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('VAULT_SERVICE') private readonly vaultClient: ClientProxy,
  ) {}

  register(payload: { password: string }) {
    return firstValueFrom(this.authClient.send({ cmd: 'auth.register' }, payload));
  }

  login(payload: { vaultId: string; password: string }) {
    return firstValueFrom(this.authClient.send({ cmd: 'auth.login' }, payload));
  }

  listVault(userId: string) {
    return firstValueFrom(this.vaultClient.send({ cmd: 'vault.list' }, userId));
  }

  createVault(payload: { userId: string; service: string; username: string; password: string; note?: string }) {
    return firstValueFrom(this.vaultClient.send({ cmd: 'vault.create' }, payload));
  }

  updateVault(payload: { userId: string; credentialId: string; service?: string; username?: string; password?: string; note?: string }) {
    return firstValueFrom(this.vaultClient.send({ cmd: 'vault.update' }, payload));
  }

  deleteVault(payload: { userId: string; credentialId: string }) {
    return firstValueFrom(this.vaultClient.send({ cmd: 'vault.delete' }, payload));
  }
}
