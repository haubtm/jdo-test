import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultController } from './vault.controller';
import { VaultCredential } from './vault-credential.entity';
import { VaultService } from './vault.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'secure_vault',
      entities: [VaultCredential],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([VaultCredential]),
  ],
  controllers: [VaultController],
  providers: [VaultService],
})
export class VaultModule {}
