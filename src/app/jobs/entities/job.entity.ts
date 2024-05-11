import { Company } from 'src/app/company/entities/company.entity';
import { Industry } from 'src/utils/enum';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
export enum jobType {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Contract = 'Contract',
  Internship = 'Internship',
  Temporary = 'Temporary',
}
@Entity('job')
export class Job {
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
}
