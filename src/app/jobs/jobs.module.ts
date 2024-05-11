import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/entities/company.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { UserJob } from '../user/entities/userJob.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Company, User, UserJob])],
  controllers: [JobsController],
  providers: [JobsService, CompanyService, JwtService, UserService],
})
export class JobsModule {}
