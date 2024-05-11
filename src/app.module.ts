import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigs } from './config/db-config';
import { CompanyModule } from './app/company/company.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PageTransferResponseInterceptor } from './interceptor/response.interceptor';
import { JwtAuthGuard } from './app/auth/jwt-auth.guard';
import { env } from './utils/env.util';
import { JobsModule } from './app/jobs/jobs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfigs()),
    ChatModule,
    AuthModule,
    UserModule,
    CompanyModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    JobsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: PageTransferResponseInterceptor },
  ],
})
export class AppModule {}
