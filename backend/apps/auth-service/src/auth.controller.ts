import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { LoginPayload, RegisterPayload } from '../../../libs/common/src/dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.register' })
  register(@Payload() payload: RegisterPayload) {
    return this.authService.register(payload);
  }

  @MessagePattern({ cmd: 'auth.login' })
  login(@Payload() payload: LoginPayload) {
    return this.authService.login(payload);
  }
}
