import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, PartialGraphHost } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './application/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap().catch((err) => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});
