import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CreateVaultPayload, DeleteVaultPayload, UpdateVaultPayload } from '../../../libs/common/src/dto';
import { VaultService } from './vault.service';

@Controller()
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @MessagePattern({ cmd: 'vault.create' })
  create(@Payload() payload: CreateVaultPayload) {
    return this.vaultService.create(payload);
  }

  @MessagePattern({ cmd: 'vault.list' })
  list(@Payload() userId: string) {
    return this.vaultService.findAll(userId);
  }

  @MessagePattern({ cmd: 'vault.update' })
  update(@Payload() payload: UpdateVaultPayload) {
    return this.vaultService.update(payload);
  }

  @MessagePattern({ cmd: 'vault.delete' })
  delete(@Payload() payload: DeleteVaultPayload) {
    return this.vaultService.delete(payload);
  }
}
