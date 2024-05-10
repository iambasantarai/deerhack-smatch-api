import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigs } from './config/db-config';
import { multerConfig } from './config/multer-config';
import { MulterModule } from '@nestjs/platform-express';
import { CompanyModule } from './app/company/company.module';

@Module({
  imports: [
    MulterModule.register(multerConfig),
    TypeOrmModule.forRoot(typeOrmConfigs()),
    ChatModule,
    AuthModule,
    UserModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
