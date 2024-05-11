import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Company])],
  controllers: [JobsController],
  providers: [JobsService, CompanyService, JwtService],
})
export class JobsModule {}
