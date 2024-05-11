import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { UserJob } from './userJob.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false })
  cv: string;

  @Column({ nullable: true, type: 'simple-array' })
  skills: string[];

  @OneToMany(() => UserJob, (UserJob) => UserJob.user)
  jobsApplied: UserJob[];
}
