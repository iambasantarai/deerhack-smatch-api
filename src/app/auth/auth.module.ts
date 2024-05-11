import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer-config';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'src/utils/env.util';
import { JwtStartegy } from './jwt.strategy';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/entities/company.entity';
import { UserJob } from '../user/entities/userJob.entity';
import { Job } from '../jobs/entities/job.entity';

@Module({
  imports: [
    MulterModule.register(multerConfig),
    TypeOrmModule.forFeature([User, Company, UserJob, Job]),
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStartegy, CompanyService],
})
export class AuthModule {}
