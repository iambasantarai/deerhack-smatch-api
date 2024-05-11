import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port } from './utils/env.util';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Smatch api')
    .setDescription('The api for smatch')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('smatch')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use('/uploads', express.static('uploads'));
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // transformOptions: { enableImplicitConversion: true }
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: '*',
  });

  await app.listen(port ?? 3000);
  console.log(`Application is running on port: ${port ?? 3000}`);
}
bootstrap();
