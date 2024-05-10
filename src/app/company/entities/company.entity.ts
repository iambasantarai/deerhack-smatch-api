import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Industry {
  IT = 'IT',
  Education = 'Education',
  Finance = 'Finance',
  Health = 'Health',
  Marketing = 'Marketing',
  Retail = 'Retail',
  Manufacturing = 'Manufacturing',
  Hospitality = 'Hospitality',
  Construction = 'Construction',
  Consulting = 'Consulting',
  Telecommunications = 'Telecommunications',
  MediaAndEntertainment = 'Media and Entertainment',
  TransportationAndLogistics = 'Transportation and Logistics',
  Nonprofit = 'Nonprofit',
  Government = 'Government',
  LegalServices = 'Legal Services',
}
@Entity('Company')
export class Company {
  @PrimaryGeneratedColumn()
  CompanyId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'jsonb', nullable: true })
  socials: any;

  @Column({ nullable: true })
  logo: string;

  @Column()
  founded: string;

  @Column()
  employeeNumber: string;
  @Column()
  phone: string;

  @Column()
  hrName: string;

  @Column()
  hrEmail: string;

  @Column()
  industry: string;
}
