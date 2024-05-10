import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer-config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    MulterModule.register(multerConfig),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
