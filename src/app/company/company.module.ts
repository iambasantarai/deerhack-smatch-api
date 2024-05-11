import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer-config';
import { env } from 'src/utils/env.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    MulterModule.register(multerConfig),
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
