import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DatabaseExceptionFilter } from './database/database-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  /* Global pipes are used across the whole application, for every controller
  and every route handler. Pipes have two typical use cases: transformation and
  validation */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /*Interceptors have a set of useful capabilities:
    - Bind extra logic before / after method execution
    - Transform the result returned from a function
    - Transform the exception thrown from a function
  */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /*When an exception is not handled by your application code, it is caught by this layer, which then automatically sends an appropriate user-friendly response.
   */
  app.useGlobalFilters(new DatabaseExceptionFilter());

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RealWorld API')
    .setDescription(
      'Medium.com clone (called Conduit) more info https://github.com/gothinkster/realworld',
    )
    .setVersion('1.0')
    .addTag('Conduit')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();
