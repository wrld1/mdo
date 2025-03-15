import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './application/app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as winston from 'winston';
import { loggerOptions } from './logger.config';
import { WinstonModule } from 'nest-winston';
import { HttpLoggingMiddleware } from './common/middlewares/http-logging.middleware';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const MODE = process.env.DEV_MODE || 'development';

  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });

  const loggerInstance = winston.createLogger(loggerOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('OSBB management system')
    .setDescription('System for managing OSBB')
    .setVersion('1.0')
    .addTag('oms')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(new HttpLoggingMiddleware().use.bind(new HttpLoggingMiddleware()));
  app.useLogger(WinstonModule.createLogger(loggerOptions));

  await app.listen(port);

  loggerInstance.info(`===> OSBB API started on port ${PORT} in ${MODE} mode`);
}
bootstrap();
