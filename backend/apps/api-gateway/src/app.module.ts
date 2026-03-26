import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtGuard } from './jwt.guard';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'replace-this' }),
    ClientsModule.register([
      { name: 'AUTH_SERVICE', transport: Transport.TCP, options: { host: '127.0.0.1', port: 4001 } },
      { name: 'VAULT_SERVICE', transport: Transport.TCP, options: { host: '127.0.0.1', port: 4002 } },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtGuard],
})
export class AppModule {}
