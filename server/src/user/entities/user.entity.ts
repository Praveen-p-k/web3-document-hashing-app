import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class User {
  @Index('user-index')
  @PrimaryColumn({ name: 'address', type: 'varchar', length: 60 })
  address: string;

  @Column({ name: 'signature', type: 'varchar', length: 150, nullable: true })
  signature: string;

  @Column({ name: 'cid', type: 'varchar', length: 60 })
  cid: string;

  @Column({ name: 'file_hash', type: 'varchar', length: 100 })
  file_hash: string;

  @Column({ name: 'url', type: 'varchar', length: 100 })
  url: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  created_at: number;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updated_at: number;
}
