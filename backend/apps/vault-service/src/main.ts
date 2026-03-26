import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { VaultModule } from './vault.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(VaultModule, {
    transport: Transport.TCP,
    options: { host: process.env.TCP_HOST || '127.0.0.1', port: 4002 },
  });

  await app.listen();
}

void bootstrap();
