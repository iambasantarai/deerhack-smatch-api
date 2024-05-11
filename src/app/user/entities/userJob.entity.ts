import {
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Job } from 'src/app/jobs/entities/job.entity';
import { Base } from 'src/baseEntity';

export enum JobStatus {
  APPLIED = 'applied',
  INREVIEW = 'inreview',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}
@Entity('user_jobs_applied')
export class UserJob extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.jobsApplied)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Job, (job) => job.users)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.APPLIED })
  status: JobStatus;

  @Column({ type: 'float', nullable: true })
  matchingPercentage: number;
}
