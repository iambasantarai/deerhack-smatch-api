import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Industry } from 'src/app/company/entities/company.entity';
import { jobType } from '../entities/job.entity';

export class CreateJobDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  jobDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(jobType)
  jobType: jobType;

  @ApiProperty()
  @IsNotEmpty()
  jobLocation: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Industry)
  jobCategory: Industry;

  @ApiProperty()
  @IsNotEmpty()
  jobQualification: string;

  @ApiProperty()
  @IsNotEmpty()
  jobExperience: string;

  @ApiProperty()
  @IsNotEmpty()
  jobSalary: string;

  @ApiProperty()
  @IsNotEmpty()
  requirements: any;

  @ApiProperty()
  @IsNotEmpty()
  benefits: any;
}
