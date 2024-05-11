import { Company } from 'src/app/company/entities/company.entity';
import { UserJob } from 'src/app/user/entities/userJob.entity';
import { Base } from 'src/baseEntity';
import { Industry } from 'src/utils/enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
export enum jobType {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Contract = 'Contract',
  Internship = 'Internship',
  Temporary = 'Temporary',
}
@Entity('job')
export class Job extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  jobDescription: string;

  @Column({ type: 'enum', enum: jobType, default: jobType.FullTime })
  jobType: jobType;

  @Column()
  jobLocation: string;

  @Column({ type: 'enum', enum: Industry, default: 'IT' })
  jobCategory: Industry;

  @Column()
  jobQualification: string;

  @Column()
  jobExperience: string;

  @Column()
  jobSalary: string;

  @ManyToOne(() => Company, (company) => company.jobs)
  company: Company;

  @Column({ type: 'jsonb', nullable: true })
  requirements: any;

  @Column({ type: 'jsonb', nullable: true })
  benefits: any;

  @OneToMany(() => UserJob, (UserJob) => UserJob.job)
  users: UserJob[];
}
