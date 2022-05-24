import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Temperature {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  @Generated('uuid')
  @Index()
  externalId: string;

  @Column({ type: 'float' })
  @Index()
  temperature: number;

  @Column({ type: 'float' })
  @Index()
  humidity: number;

  @Column()
  @Index()
  clientId: string;

  @Column({ type: 'timestamp without time zone' })
  measuredAt: string;

  @CreateDateColumn()
  createdAt: string;
}
