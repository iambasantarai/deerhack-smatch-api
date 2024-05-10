import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port } from './utils/env.util';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Smatch api')
    .setDescription('The api for smatch')
    .setVersion('1.0')
    .addTag('smatch')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // transformOptions: { enableImplicitConversion: true }
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(port ?? 3000);
  console.log(`Application is running on port: ${port ?? 3000}`);
}
bootstrap();
