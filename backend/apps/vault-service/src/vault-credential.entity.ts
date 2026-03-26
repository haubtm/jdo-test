import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vault_credentials')
export class VaultCredential {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  service!: string;

  @Column()
  username!: string;

  @Column('text')
  encryptedPassword!: string;

  @Column()
  iv!: string;

  @Column()
  authTag!: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
